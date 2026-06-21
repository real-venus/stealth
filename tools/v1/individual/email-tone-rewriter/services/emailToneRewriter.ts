/**
 * Email Tone Rewriter — core feature engine.
 *
 * Pure, deterministic logic that rewrites a single normalized email body into a
 * requested tone. No network calls, no mailbox mutations, and no external AI
 * providers: every transformation is a local, rule-based rewrite of text the
 * user already wrote, so the tool stays isolated and safe to review.
 */

export interface NormalizedEmail {
  subject: string;
  sender: string;
  receivedAt: string;
  body: string;
}

export type ToneId = "professional" | "friendly" | "concise" | "direct";

export interface ToneRewriterOptions {
  /** Target tone for the rewrite. Defaults to "professional". */
  tone?: ToneId;
  /** Rewrite each paragraph separately instead of reflowing into one block. */
  preserveParagraphs?: boolean;
}

export interface RewriteSource {
  subject: string;
  sender: string;
  receivedAt: string;
}

export interface ToneRewrite {
  tone: ToneId;
  body: string;
  changed: boolean;
  sentenceCount: number;
  source: RewriteSource;
}

export type RewriterErrorCode = "empty-body" | "unsupported-input" | "unsupported-tone";

export type RewriterResult =
  | { status: "ok"; rewrite: ToneRewrite }
  | { status: "error"; code: RewriterErrorCode; message: string };

/** Lifecycle states a UI can render for an async rewrite call. */
export type RewriterState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; rewrite: ToneRewrite }
  | { status: "error"; code: RewriterErrorCode; message: string };

export const SUPPORTED_TONES: ToneId[] = ["professional", "friendly", "concise", "direct"];

export const DEFAULT_REWRITER_OPTIONS: Required<ToneRewriterOptions> = {
  tone: "professional",
  preserveParagraphs: false,
};

type ReplacementRule = [RegExp, string];

const CONTRACTIONS: ReplacementRule[] = [
  [/\bdon't\b/gi, "do not"],
  [/\bdoesn't\b/gi, "does not"],
  [/\bdidn't\b/gi, "did not"],
  [/\bcan't\b/gi, "cannot"],
  [/\bwon't\b/gi, "will not"],
  [/\bisn't\b/gi, "is not"],
  [/\baren't\b/gi, "are not"],
  [/\bwasn't\b/gi, "was not"],
  [/\bweren't\b/gi, "were not"],
  [/\bwouldn't\b/gi, "would not"],
  [/\bcouldn't\b/gi, "could not"],
  [/\bshouldn't\b/gi, "should not"],
  [/\bi'm\b/gi, "I am"],
  [/\bit's\b/gi, "it is"],
  [/\bthat's\b/gi, "that is"],
  [/\bwe're\b/gi, "we are"],
  [/\byou're\b/gi, "you are"],
  [/\bthey're\b/gi, "they are"],
  [/\bi'll\b/gi, "I will"],
  [/\bwe'll\b/gi, "we will"],
  [/\bi've\b/gi, "I have"],
  [/\bwe've\b/gi, "we have"],
  [/\bi'd\b/gi, "I would"],
  [/\bgonna\b/gi, "going to"],
  [/\bwanna\b/gi, "want to"],
];

const CASUAL_TO_FORMAL: ReplacementRule[] = [
  [/\bhey\b/gi, "Hello"],
  [/\byeah\b/gi, "yes"],
  [/\byep\b/gi, "yes"],
  [/\bnope\b/gi, "no"],
  [/\bthanks\b/gi, "thank you"],
  [/\bthx\b/gi, "thank you"],
  [/\bkinda\b/gi, "somewhat"],
  [/\bguys\b/gi, "team"],
  [/\basap\b/gi, "as soon as possible"],
];

const FRIENDLY_REPLACEMENTS: ReplacementRule[] = [
  [/\bplease be advised that\b/gi, "just so you know,"],
  [/\bregards\b/gi, "thanks so much"],
  [/\bas soon as possible\b/gi, "whenever you get a chance"],
];

const CONCISE_REPLACEMENTS: ReplacementRule[] = [
  [/\bin order to\b/gi, "to"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bat this point in time\b/gi, "now"],
  [/\bin the event that\b/gi, "if"],
  [/\ba large number of\b/gi, "many"],
];

const FILLERS: RegExp[] = [
  /\bjust\b/gi,
  /\breally\b/gi,
  /\bbasically\b/gi,
  /\bactually\b/gi,
  /\bvery\b/gi,
  /\bi think\b/gi,
  /\bi guess\b/gi,
  /\bsort of\b/gi,
  /\bkind of\b/gi,
];

const HEDGES: ReplacementRule[] = [
  [/\bi was wondering if you could\b/gi, "please"],
  [/\bit would be great if you could\b/gi, "please"],
  [/\bwhen you get a chance,?\b/gi, "please"],
  [/\bif possible,?\b/gi, ""],
  [/\bmaybe\b/gi, ""],
  [/\bperhaps\b/gi, ""],
];

function isNormalizedEmail(value: unknown): value is NormalizedEmail {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.subject === "string" &&
    typeof candidate.sender === "string" &&
    typeof candidate.receivedAt === "string" &&
    typeof candidate.body === "string"
  );
}

/** Deterministic sentence splitter. */
export function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function applyReplacements(text: string, rules: ReplacementRule[]): string {
  return rules.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
}

function removeFillers(text: string): string {
  return FILLERS.reduce((acc, pattern) => acc.replace(pattern, ""), text);
}

/** Collapses whitespace and removes spaces left before punctuation. */
export function tidy(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
}

/** Capitalizes the first letter of every sentence. */
export function capitalizeSentences(text: string): string {
  return splitSentences(text)
    .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
    .join(" ");
}

function toProfessional(body: string): string {
  let text = applyReplacements(body, CONTRACTIONS);
  text = applyReplacements(text, CASUAL_TO_FORMAL);
  return capitalizeSentences(tidy(text));
}

function toFriendly(body: string): string {
  const text = applyReplacements(body, FRIENDLY_REPLACEMENTS);
  return capitalizeSentences(tidy(text));
}

function toConcise(body: string): string {
  let text = removeFillers(body);
  text = applyReplacements(text, CONCISE_REPLACEMENTS);
  return capitalizeSentences(tidy(text));
}

function toDirect(body: string): string {
  let text = applyReplacements(body, HEDGES);
  text = removeFillers(text);
  return capitalizeSentences(tidy(text));
}

const TONE_TRANSFORMS: Record<ToneId, (body: string) => string> = {
  professional: toProfessional,
  friendly: toFriendly,
  concise: toConcise,
  direct: toDirect,
};

function rewriteBody(body: string, tone: ToneId, preserveParagraphs: boolean): string {
  const transform = TONE_TRANSFORMS[tone];
  if (!preserveParagraphs) {
    return transform(body);
  }
  return body
    .split(/\n{2,}/)
    .map((paragraph) => transform(paragraph))
    .filter((paragraph) => paragraph.length > 0)
    .join("\n\n");
}

function resolveOptions(options: ToneRewriterOptions): Required<ToneRewriterOptions> {
  return {
    tone: options.tone ?? DEFAULT_REWRITER_OPTIONS.tone,
    preserveParagraphs: options.preserveParagraphs ?? DEFAULT_REWRITER_OPTIONS.preserveParagraphs,
  };
}

/**
 * Rewrites a single normalized email into the requested tone. Never throws:
 * invalid input is reported through a typed error result instead.
 */
export function rewriteEmailTone(
  input: NormalizedEmail,
  options: ToneRewriterOptions = {},
): RewriterResult {
  if (!isNormalizedEmail(input)) {
    return {
      status: "error",
      code: "unsupported-input",
      message: "Expected a normalized email with subject, sender, receivedAt, and body.",
    };
  }

  const resolved = resolveOptions(options);
  if (!SUPPORTED_TONES.includes(resolved.tone)) {
    return {
      status: "error",
      code: "unsupported-tone",
      message: `Unsupported tone: ${String(resolved.tone)}.`,
    };
  }

  const body = input.body.trim();
  if (body.length === 0) {
    return {
      status: "error",
      code: "empty-body",
      message: "Cannot rewrite an email with an empty body.",
    };
  }

  const rewritten = rewriteBody(body, resolved.tone, resolved.preserveParagraphs);

  return {
    status: "ok",
    rewrite: {
      tone: resolved.tone,
      body: rewritten,
      changed: rewritten !== body,
      sentenceCount: splitSentences(rewritten).length,
      source: {
        subject: input.subject,
        sender: input.sender,
        receivedAt: input.receivedAt,
      },
    },
  };
}

/** Maps a rewriter result into a UI-friendly ready/error state. */
export function toReadyState(result: RewriterResult): RewriterState {
  if (result.status === "error") {
    return { status: "error", code: result.code, message: result.message };
  }
  return { status: "ready", rewrite: result.rewrite };
}
