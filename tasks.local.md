# lofi.md v0.0.1 Release Tasks

> Pre-release checklist for npm packages, VS Code extension, and GitHub repo.

---

## Phase 1: Foundations

### License & Legal
- [x] Create `/LICENSE` (MIT)
- [x] Add `"license": "MIT"` to all package.json files

### Package Scope Rename (@lofi → @lofi.md)
- [x] `packages/language/package.json`: `@lofi/language` → `@lofi.md/language`
- [x] `packages/html/package.json`: `@lofi/html` → `@lofi.md/html`
- [x] `packages/cli/package.json`: `@lofi/cli` → `@lofi.md/cli`
- [x] Update workspace dependencies in `packages/html` to `@lofi.md/language`
- [x] Update workspace dependencies in `packages/cli` to `@lofi.md/*`
- [x] Update workspace dependencies in `packages/vscode` to `@lofi.md/*`
- [x] Update workspace dependencies in `apps/storybook` to `@lofi.md/*`

### Version Alignment
- [x] `packages/vscode/package.json`: version `0.1.0` → `0.0.1`

### NPM Publish Config
- [x] Create `packages/language/.npmignore`
- [x] Create `packages/html/.npmignore`
- [x] Create `packages/cli/.npmignore`

---

## Phase 2: Verification

### Build
- [ ] Run `bun install` (refresh lockfile after renames)
- [ ] Run `bun run build` (all packages)
- [ ] Verify `packages/language/dist/` exists
- [ ] Verify `packages/html/dist/` exists with lofi.css
- [ ] Verify `packages/vscode/dist/` exists

### Tests
- [ ] Run `bun run test`
- [ ] All tests pass

### Lint
- [ ] Run `bun run lint`
- [ ] No errors

---

## Phase 3: Documentation Audit

### Core Docs
- [ ] `README.md` — Quick start accurate, installation commands use `@lofi.md/*`
- [ ] `SYNTAX.md` — Element reference complete
- [ ] `PHILOSOPHY.md` — Design axioms documented
- [ ] `ROADMAP.md` — Milestones up to date

### Package READMEs (optional for v0.0.1)
- [ ] `packages/language/README.md` — Basic usage
- [ ] `packages/html/README.md` — Basic usage
- [ ] `packages/cli/README.md` — CLI commands

### Changelog
- [ ] Create `CHANGELOG.md` with v0.0.1 entry

---

## Phase 4: Accounts & Credentials

### npm Registry
- [ ] Verify npm login: `npm whoami`
- [ ] Verify @lofi.md org access: `npm org ls lofi.md`
- [ ] If org doesn't exist: `npm org create lofi.md`

### VS Code Marketplace
- [ ] Create Microsoft account (if needed)
- [ ] Go to https://marketplace.visualstudio.com/manage
- [ ] Create publisher: `lofi-md` (or your chosen name)
- [ ] Generate Personal Access Token (PAT) with Marketplace scope
- [ ] Login vsce: `npx vsce login <publisher-name>`
- [ ] Update `packages/vscode/package.json` publisher field to match

### GitHub
- [ ] Verify repo secrets (optional for manual release):
  - `NPM_TOKEN` — npm automation token
  - `VSCE_PAT` — VS Code Marketplace PAT

---

## Phase 5: Publishing

### Make Repo Public
- [ ] Go to GitHub repo settings → General → Danger Zone
- [ ] Click "Change visibility" → Public
- [ ] Confirm visibility change

### npm Publish (in dependency order)
```bash
# From repo root
cd packages/language && npm publish --access public
cd ../html && npm publish --access public
cd ../cli && npm publish --access public
```
- [ ] `@lofi.md/language` published
- [ ] `@lofi.md/html` published
- [ ] `@lofi.md/cli` published

### VS Code Extension
```bash
cd packages/vscode
npx vsce package
npx vsce publish
```
- [ ] VSIX package created
- [ ] Extension published to marketplace

### Git Tag
```bash
git tag v0.0.1
git push origin v0.0.1
```
- [ ] v0.0.1 tag created and pushed

---

## Phase 6: Post-Release Verification

### npm
- [ ] `npm info @lofi.md/language` shows v0.0.1
- [ ] `npm info @lofi.md/html` shows v0.0.1
- [ ] `npm info @lofi.md/cli` shows v0.0.1
- [ ] Fresh install works: `npm install @lofi.md/cli`

### VS Code
- [ ] Extension visible in marketplace
- [ ] Install from marketplace works
- [ ] Preview command works

### GitHub
- [ ] Repo is public
- [ ] README renders correctly
- [ ] Create GitHub Release from v0.0.1 tag

---

## Quick Reference

### File Changes Summary

| File | Change |
|------|--------|
| `/LICENSE` | Create (MIT) |
| `/CHANGELOG.md` | Create |
| `packages/language/package.json` | Rename scope, add license |
| `packages/html/package.json` | Rename scope + deps, add license |
| `packages/cli/package.json` | Rename scope + deps, add license |
| `packages/vscode/package.json` | Version 0.0.1, update deps, update publisher |
| `apps/storybook/package.json` | Update deps to @lofi.md |
| `packages/language/.npmignore` | Create |
| `packages/html/.npmignore` | Create |
| `packages/cli/.npmignore` | Create |

### Commands Cheatsheet

```bash
# Build & Test
bun install
bun run build
bun run test
bun run lint

# npm
npm whoami
npm org ls lofi.md
npm publish --access public

# VS Code
npx vsce login <publisher>
npx vsce package
npx vsce publish

# Git
git tag v0.0.1
git push origin v0.0.1
```
