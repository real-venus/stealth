import { describe, expect, it } from "vitest";

import {
  DEFAULT_REWRITER_OPTIONS,
  SUPPORTED_TONES,
  capitalizeSentences,
  rewriteEmailTone,
  splitSentences,
  toReadyState,
  type NormalizedEmail,
} from "../services/emailToneRewriter";
import { EMPTY_BODY_EMAIL, SAMPLE_EMAILS } from "../services/fixtures";

const casualEmail: NormalizedEmail = SAMPLE_EMAILS[0].email;
const wordyEmail: NormalizedEmail = SAMPLE_EMAILS[1].email;

describe("rewriteEmailTone", () => {
  it("defaults to the professional tone and expands contractions", () => {
    const result = rewriteEmailTone(casualEmail);

    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.rewrite.tone).toBe(DEFAULT_REWRITER_OPTIONS.tone);
    expect(result.rewrite.body).toContain("do not");
    expect(result.rewrite.body).not.toContain("don't");
    expect(result.rewrite.body).not.toContain("Hey");
    expect(result.rewrite.source.sender).toBe("sam@example.com");
  });

  it("removes filler words in the concise tone", () => {
    const result = rewriteEmailTone(wordyEmail, { tone: "concise" });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.rewrite.body).not.toContain("really");
    expect(result.rewrite.body).not.toContain("just");
    expect(result.rewrite.body.toLowerCase()).not.toContain("in order to");
  });

  it("strips hedging in the direct tone", () => {
    const result = rewriteEmailTone(wordyEmail, { tone: "direct" });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.rewrite.body).toContain("Please send the report.");
    expect(result.rewrite.body.toLowerCase()).not.toContain("maybe");
    expect(result.rewrite.body.toLowerCase()).not.toContain("wondering");
  });

  it("rewrites sign-offs in the friendly tone", () => {
    const email: NormalizedEmail = {
      subject: "s",
      sender: "a@example.com",
      receivedAt: "2026-01-01T00:00:00.000Z",
      body: "The numbers are ready. Regards.",
    };
    const result = rewriteEmailTone(email, { tone: "friendly" });

    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.rewrite.body.toLowerCase()).toContain("thanks so much");
  });

  it("is deterministic for the same input", () => {
    expect(rewriteEmailTone(casualEmail)).toEqual(rewriteEmailTone(casualEmail));
  });

  it("returns an error for an empty body", () => {
    const result = rewriteEmailTone(EMPTY_BODY_EMAIL);

    expect(result.status).toBe("error");
    if (result.status !== "error") return;
    expect(result.code).toBe("empty-body");
  });

  it("returns an error for unsupported input", () => {
    const result = rewriteEmailTone({
      subject: "x",
    } as unknown as NormalizedEmail);

    expect(result.status).toBe("error");
    if (result.status !== "error") return;
    expect(result.code).toBe("unsupported-input");
  });

  it("returns an error for an unsupported tone", () => {
    const result = rewriteEmailTone(casualEmail, {
      tone: "shouty" as unknown as (typeof SUPPORTED_TONES)[number],
    });

    expect(result.status).toBe("error");
    if (result.status !== "error") return;
    expect(result.code).toBe("unsupported-tone");
  });

  it("rewrites every fixture in every supported tone", () => {
    for (const tone of SUPPORTED_TONES) {
      for (const fixture of SAMPLE_EMAILS) {
        expect(rewriteEmailTone(fixture.email, { tone }).status).toBe("ok");
      }
    }
  });
});

describe("helpers", () => {
  it("splits text into sentences", () => {
    expect(splitSentences("Hello world. Second one!")).toEqual(["Hello world.", "Second one!"]);
  });

  it("capitalizes the first letter of each sentence", () => {
    expect(capitalizeSentences("hello there. how are you?")).toBe("Hello there. How are you?");
  });

  it("maps results into UI states", () => {
    expect(toReadyState(rewriteEmailTone(casualEmail)).status).toBe("ready");
    expect(toReadyState(rewriteEmailTone(EMPTY_BODY_EMAIL)).status).toBe("error");
  });
});
