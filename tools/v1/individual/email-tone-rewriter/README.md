# Email Tone Rewriter

Isolated workspace for the Email Tone Rewriter tool. Core feature engine only — no main-app wiring.

## Ownership Boundary

All work for this tool stays inside `tools/v1/individual/email-tone-rewriter/`. Do not wire it into the main app, routing, inbox architecture, wallet core, Stellar core, database schema, or design system until a future integration issue explicitly allows it.

## Intended Usage

Rewrite the body of a single email into a chosen tone — professional, friendly, concise, or direct — without changing the underlying facts. Import only from the folder-local entry point `index.ts`.

## Public API

- `rewriteEmailTone(input, options?)` — main entry point.
- `splitSentences`, `capitalizeSentences`, `tidy` — deterministic text helpers.
- `toReadyState(result)` — map a result into a UI-friendly state.
- `SUPPORTED_TONES`, `DEFAULT_REWRITER_OPTIONS` — tone list and defaults.
- `SAMPLE_EMAILS`, `EMPTY_BODY_EMAIL` — deterministic fixtures.

## Inputs

`NormalizedEmail`: `subject`, `sender`, `receivedAt` (ISO string), `body` (plain text).

`ToneRewriterOptions` (optional): `tone` (professional | friendly | concise | direct, default professional), `preserveParagraphs` (default false).

## Outputs

On success: `{ status: "ok", rewrite }` where `rewrite` has `tone`, `body` (rewritten), `changed`, `sentenceCount`, and `source` (preserved subject, sender, receivedAt).

## Loading states

The engine is synchronous and pure. `RewriterState` models async UI usage: `idle`, `loading`, `ready`, `error`. `toReadyState` converts a result into `ready`/`error`.

## Error states

`rewriteEmailTone` never throws. It returns `{ status: "error", code, message }`:

- `empty-body` — body is empty or whitespace only.
- `unsupported-input` — input is not a valid normalized email.
- `unsupported-tone` — requested tone is not supported.

## Guarantees

- No network calls, secrets, or production data.
- No mailbox mutation or persistence outside this folder.
- Deterministic: the same input always produces the same output.
- Rewrites transform existing wording and never invent facts.
