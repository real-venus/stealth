# Stealth

> **Mail on your terms.**

**Stealth is a private, programmable mail protocol built on Stellar. You decide
who can reach you, what unknown senders must pay, and which delivery claims
deserve trust.**

Email was built to let anyone enter your inbox. That openness became spam,
phishing, impersonation, and a security model held together by domain
reputation. Stealth starts with a different rule:

## Find a good one and add.

Trusted people should reach you immediately. Everyone else must satisfy the
policy you choose: verified identity, minimum postage, explicit approval, or
no access at all.

## Why Stealth

- **You control access.** Allow, block, or price unknown senders before they
  enter your inbox.
- **Identity is verifiable.** Stellar accounts and federation addresses give
  senders cryptographic identities instead of display-name trust.
- **Spam has a cost.** Optional micro-postage changes bulk abuse from free to
  economically measurable.
- **Delivery has proof.** Message hashes, postage proofs, and receipts create
  an auditable delivery trail without putting private message bodies on-chain.
- **Messages stay private.** Encrypted payloads remain off-chain; Stellar
  anchors identity, policy, payment references, and proof.
- **Safety stays fast.** Stellar's low-cost settlement keeps verification and
  anti-spam controls practical for everyday mail.

## The Protocol

1. **Resolve identity** - a human-readable Stealth address resolves to a
   Stellar account and encryption keys.
2. **Check mailbox policy** - the sender learns whether they are trusted,
   blocked, required to verify, or required to attach postage.
3. **Encrypt and send** - the client encrypts the message body and submits it
   to a relay or recipient-controlled storage.
4. **Anchor the proof** - the message hash and payment reference are recorded
   without exposing message content.
5. **Verify before rendering** - the client checks sender identity, payload
   integrity, postage, and delivery state.

## What Is Here

This repository contains the Stealth reference client and the first Soroban
contract foundations:

- **Policies contract** - mailbox defaults plus per-sender allow and block
  rules.
- **Postage contract** - authenticated, non-custodial postage proofs with
  settle and refund states.
- **Receipts contract** - sender-authorized delivery records and
  recipient-authorized read receipts.
- **Reference mail client** - inbox controls, sender requests, proof status,
  encrypted compose options, postage, scheduling, OTP detection, and calendar
  mail.

```text
contracts/soroban/   Soroban contracts and unit tests
protocol/            Message, relay, schema, and federation specifications
src/                 React and TanStack Start reference client
docs/                Product, architecture, security, and deployment notes
tests/               Contract, unit, and end-to-end test workspaces
```

## Run The Client

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

## Work On The Contracts

The contracts use `soroban-sdk` v26 and live in a Rust workspace.

```bash
cd contracts/soroban
cargo test --workspace
```

Building and deploying Wasm additionally requires the Stellar CLI and the
standard Rust/Wasm toolchain described in the
[Stellar smart contract documentation](https://developers.stellar.org/docs/build/smart-contracts/getting-started/hello-world).

## Current Status

**Pre-alpha. Not audited. Not ready for production funds or sensitive mail.**

The contract layer currently records authenticated protocol state. Postage is
non-custodial: relays must verify the referenced Stellar payment. Token
escrow, expiry, disputes, key recovery, relay federation, and a complete
security audit remain roadmap work.

## Principles

- Message content never belongs on a public ledger.
- Mailbox owners define their own access policy.
- Security claims must be independently verifiable.
- Protocol economics must not punish legitimate conversation.
- Interoperability matters; migration from ordinary email should be gradual.

## Contributing

Use the GitHub issue tracker for scoped work. Contract changes should include
authorization tests and documented state transitions. Client changes should
preserve keyboard access, responsive behavior, and clear proof states.

## License

A project license has not yet been selected. Do not assume production or
redistribution rights until one is added.
