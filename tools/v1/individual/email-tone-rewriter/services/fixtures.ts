import type { NormalizedEmail } from "./emailToneRewriter";

export interface RewriterFixture {
  id: string;
  description: string;
  email: NormalizedEmail;
}

/**
 * Deterministic, synthetic emails used for tests, docs, and future UI previews.
 * None of these contain real personal data.
 */
export const SAMPLE_EMAILS: RewriterFixture[] = [
  {
    id: "casual-followup",
    description: "Casual follow-up full of contractions and filler words.",
    email: {
      subject: "quick follow up",
      sender: "sam@example.com",
      receivedAt: "2026-01-02T10:00:00.000Z",
      body: "Hey, I just wanted to check if you got my last email. I don't think we're blocked, but I can't really tell. Thanks!",
    },
  },
  {
    id: "wordy-request",
    description: "Wordy, hedged request suited to the concise and direct tones.",
    email: {
      subject: "report",
      sender: "lee@example.com",
      receivedAt: "2026-01-05T08:30:00.000Z",
      body: "I was wondering if you could maybe send the report. In order to finish, I really just need the latest numbers. Thanks so much!",
    },
  },
];

export const EMPTY_BODY_EMAIL: NormalizedEmail = {
  subject: "No content",
  sender: "noreply@example.com",
  receivedAt: "2026-01-06T12:00:00.000Z",
  body: "   ",
};
