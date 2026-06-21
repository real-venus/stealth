# Email Tone Rewriter Specs

## Purpose

Rewrite the body of a single email into a requested tone for an individual user, without inventing facts that are not already in the email.

## Scope

- Release tier: V1
- Audience: individual
- Folder ownership: `tools/v1/individual/email-tone-rewriter/`

Self-contained tooling workspace. Do not import from the main inbox, routing, wallet, Stellar, database, or design-system layers until a later integration issue explicitly allows it.

## Core Behavior Contract

The implementation:

- accepts a normalized email with `subject`, `sender`, `receivedAt`, and a plain-text `body`;
- rewrites the body into one of the supported tones: `professional`, `friendly`, `concise`, `direct`;
- is deterministic — the same input and options always produce the same output;
- preserves source email metadata for review and traceability;
- only transforms phrasing of existing text and never invents new facts;
- returns a typed validation error for empty bodies, unsupported input, or an unsupported tone.

## Out of Scope

- mutating mailbox state;
- adding routes, dashboard widgets, or navigation links;
- calling external AI providers from this folder;
- persisting rewrite history outside this folder.
