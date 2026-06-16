---
description: Creates a new branch, stages all changes, commits with a conventional message, pushes, opens a PR to main, waits for all checks to pass, then merges.
allowed-tools: Bash(git *), Bash(gh *)
---

## Current changes

!`git diff HEAD`
!`git status --short`
!`git log --oneline -5`

## Instructions

1. Run `git status` and `git diff HEAD` to understand what has changed since the last commit.
2. Derive a short kebab-case branch name that describes the changes (e.g. `phase-9-e2e-tests`, `feat-employee-api`). Do NOT use generic names like `new-branch` or `changes`.
3. Create and switch to the new branch: `git checkout -b <branch-name>`
4. Stage all relevant changed and untracked files. Prefer staging specific files by name over `git add .` to avoid accidentally including `.env` files or large binaries. If no sensitive files are present, `git add .` from the repo root is acceptable.
5. Write a concise conventional commit message that accurately describes the changes. Do NOT mention Claude, AI, or any assistant in the message.
6. Commit: `git commit -m "<message>"`
7. Push the branch and set the upstream: `git push -u origin <branch-name>`
8. Open a PR to main using `gh pr create` with:
   - A short, descriptive title (under 70 characters)
   - A body using a HEREDOC that includes a `## Summary` section (2–4 bullet points) and a `## Test plan` section (checklist of how to verify the changes)
9. Print the PR URL so the user can see it.
10. Poll for checks: run `gh pr checks <pr-number>` every 30 seconds until all checks either pass or fail. Print the status after each poll.
11. Once all checks pass and the PR is mergeable, merge with: `gh pr merge <pr-number> --squash --delete-branch`
12. Confirm the merge by running `git status` and printing the final result.

## Notes

- If any check fails, stop and report which check failed and why — do NOT merge.
- Do NOT force-push, amend published commits, or bypass hooks.
- Do NOT mention yourself (Claude) or any AI assistant anywhere in branch names, commit messages, or PR descriptions.
