# CI/CD Patterns

## GitHub Actions Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `test.yml` | push, PR | Vitest + Langium grammar validation |
| `lint.yml` | push, PR | Biome checks |
| `build.yml` | push, PR | tsup build verification |
| `visual.yml` | PR | Storybook Chromatic visual regression |
| `release.yml` | tag | semantic-release, npm publish |

## test.yml

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test
```

## Grammar Validation

Every `.langium` grammar change must validate against all test cases:

```yaml
# In test.yml
- name: Validate grammar against test cases
  run: |
    for file in test-cases/*.lofi; do
      bun run lofi --validate "$file" || exit 1
    done
```

## Bundle Size Check

Before npm publish, verify bundle size:

```json
// package.json
{
  "size-limit": [
    { "path": "packages/language/dist/index.js", "limit": "250 KB" },
    { "path": "packages/cli/dist/lofi.js", "limit": "500 KB" }
  ]
}
```

```yaml
# In release.yml
- name: Check bundle size
  run: bunx size-limit
```

## Conventional Commits

Required for changelog generation:

```
feat(grammar): add `stepper` element
fix(parser): handle trailing whitespace in md blocks
docs(syntax): clarify `grid cols` attribute
BREAKING CHANGE: remove `row` element (use `grid flow=row`)
```

## Visual Regression (Chromatic)

```yaml
# visual.yml
name: Visual
on: pull_request
jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bunx chromatic --project-token=${{ secrets.CHROMATIC_TOKEN }}
```

## Release Flow

1. Merge to main with conventional commits
2. semantic-release generates changelog
3. npm publish on tag
4. GitHub release created

```yaml
# release.yml
name: Release
on:
  push:
    tags: ['v*']
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - run: bunx size-limit
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```
