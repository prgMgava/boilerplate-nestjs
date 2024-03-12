# Commits

## Table of Contents <!-- omit in toc -->

- [General info](#general-info)
  - [Estruture](#estruture)
  - [Branch Protection](#branch-protection)
  - [Examples](#examples)

---

## General info

We are using the conventional commits. The [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history; which makes it easier to write automated tools on top of.

### Estruture

The commit contains the following structural elements:

```mermaid
   . build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)

   . ci: Changes to CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)

   . chore: Changes which doesn't change source code or tests, e.g. changes to the build process, auxiliary tools, and libraries

   . docs: Documentation only changes

   . feat: A new feature

   . fix: A bug fix

   . perf: A code change that improves performance

   . refactor: A code change that neither fixes a bug nor adds a feature

   . revert: Revert something

   . style: Changes that do not affect the meaning of the code (white
   space, formatting, missing semi-colons, etc)

   . test: Adding missing tests or correcting existing tests
```

### Branch protection

Commits not are available in main branch.

**_Pay attention_**: this rule can be skiped using '--no-verify' in the end of your commit. To grants more efficient and stronger rule to protect branch use [Git Hub protect branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule) rules instead.

### Examples

```mermaid
feat: add a new feature
```

## Log Tail Transport

Previous: [Logs](logs.md)
