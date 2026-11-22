# HANDOFF — Neon-App-Builder

**Last updated: 2026-11-22 (America/New_York).**
**Repo:** `mhvnsnt/Neon-App-Builder` (PUBLIC), default branch `main`.
**Purpose of this file:** any agent that picks up work here reads this FIRST, then the linked docs. It states what we've done, where we're at, and what we're working toward — so the owner can say "go to this repo, pick up the work" and you just know. Update this file in the same PR whenever the state changes (add, don't delete).

## 1. What this repo is

The Neon App Builder — "best app builder out there." A Vite/TypeScript app builder with a server (`server.ts`, `server/`), `src/`, `docs/`, `index.html`, `metadata.json`, and `package.json`. Created 2026-10-08. Public.

**Plainly:** the repo's own description is one line and the README was not verified in detail while writing this file, so the exact builder workflow (prompt-to-app, templates, deploy targets) is not stated here. Whoever picks this up should read `docs/` and `README.md` first and write the workflow down here before building more.

## 2. Where we're at

### DONE
- **Anti-clobber laws (2026-10-17, PR #3 merged):** the owner's anti-clobber laws landed after the DXMMII 54k-file wipe.
- **Working method statement (2026-10-27):** `WORKING-METHOD.md` landed.

### IN PROGRESS
- Nothing is actively in progress in this repo that the repo itself records. Last push was the 2026-10-27 sweep commit. No open PRs, no releases.

### BLOCKED
- Nothing recorded as blocked. The gap is a documentation gap, not a code block: the builder workflow is unstated (see §1).

## 3. What we're working toward

First: establish the builder workflow from `docs/` and the README, and write it into this file. Then: the builder builds a real app end to end — prompt in, working app out, deployed — verified live, not described. The bar: a claimed build is proven by opening the built app, not by a log line.

## 4. Standing rules that apply here

- **Branch → PR → merge, always.** Never push to main directly. Add-only, zero-conflict PRs, no force pushes.
- **Checkpoint-and-save law:** CHECKPOINT.md first, update after every step; the repo is the save; resume, never restart.
- **No-temp-storage law:** nothing in /tmp or any wipeable location, ever.
- **Real-source-only:** build from the real sources, wired up fully — no hand-tooled lookalikes.
- **Never kill in-progress work.**

## 5. Key files and paths

| What | Where |
|---|---|
| App source / server | `src/`, `server.ts`, `server/` |
| Entry / metadata | `index.html`, `metadata.json` |
| Docs | `docs/` |
| Agent rules | `AGENTS.md` |
| Method doc | `WORKING-METHOD.md` |
| Related builder | `mhvnsnt/bolt.diy-M` (the bolt.diy fork — check which builder is live before duplicating work) |

## 6. Open decisions needing the owner

- **Neon vs bolt.diy-M:** two app builders in this batch. Which one is the live builder is his call — lanes do not pick it or merge the two.
- No other decisions are recorded in this repo.

## 7. How to pick up

1. Read this HANDOFF.md first, then `README.md` and `docs/`.
2. Check `bolt.diy-M` too — do not duplicate builder work across the two repos.
3. Check what other agents are already doing before starting anything.
4. Resume from the stated next step — never restart, never re-derive finished work.
5. Land work branch → PR → merge, add-only. Stage finished work to the repo as it lands.
6. Update this HANDOFF.md in the same PR when the state changes. Verify with your own eyes before claiming anything built.
