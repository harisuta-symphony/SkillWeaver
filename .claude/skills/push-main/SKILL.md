---
description: Stages all changes, creates a conventional commit message based on the diff, and pushes to the main branch.
disable-model-invocation: true
allowed-tools: Bash(git *)
---

## Current changes

!`git diff HEAD`
!`git status --short`

## Instructions

1. Run `git status` to see all changes since the last commit.
2. Run `git diff` to understand what changed so you can write an accurate commit message.
3. Stage all changes: `git add .`
4. Write a concise conventional commit message that accurately describes the changes (e.g. `feat: add employee domain entities`, `chore: configure Tailwind CSS`, `fix: resolve EF Core migration error`). Do NOT mention Claude, AI, or any assistant in the message.
5. Commit: `git commit -m "<message>"`
6. Push to main: `git push origin main`
7. Confirm success by showing the final git status and the commit hash.
