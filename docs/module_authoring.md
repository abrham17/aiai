# Module Authoring Guide

This is the current contributor-facing guide for adding or updating modules in AI Playground.

If any older planning doc disagrees with this guide, trust this file and the runtime code in `src/core/registry.ts` and `src/core/curriculum.ts`.

## Canonical sources

- `src/core/registry.ts`
  Module registration and the lightweight `MODULE_META` records used by the dashboard, tier pages, and sitemap.
- `src/core/curriculum.ts`
  Tier metadata, unlock thresholds, and tier summaries.
- `src/core/types.ts`
  Shared lesson, module, and visualization contracts.
- `src/modules/*`
  The actual lesson implementations and runtime visualization code.

## Module folder contract

Each module should live in `src/modules/<module-id>/` and normally include:

```text
src/modules/<module-id>/
├── module.ts
├── Visualization.tsx
├── ChallengeCanvas.tsx      # optional
└── index.ts
```

### `module.ts`

`module.ts` exports the static lesson content:

- metadata like `id`, `tierId`, `clusterId`, `title`, and `estimatedMinutes`
- guided `steps`
- `playground` configuration
- `challenges`

This file should stay data-first. Keep interaction logic in the runtime components.

### `Visualization.tsx`

This is the primary interactive renderer used by guided steps and playground mode.

- It receives step or playground props through `visualizationProps`.
- It should remain client-only.
- If a module needs multiple visualization modes, prefer one exported component that switches on a `component` prop instead of splitting the routing contract.

### `ChallengeCanvas.tsx`

Add this only when challenge mode needs behavior that differs from the main visualization.

- It receives `{ challenge, onComplete }`.
- It can wrap or reuse the main visualization.
- If the normal visualization already covers the challenge interaction cleanly, a separate challenge canvas is optional.

### `index.ts`

`index.ts` is the module's runtime entry point.

- export `moduleData`
- export `Visualization`
- export `ChallengeCanvas` if the module has one
- use `next/dynamic` with `ssr: false` for client visualizations

## Registration checklist

After adding or updating a module folder:

1. Add the module import entry to `src/core/registry.ts`.
2. Add or update the corresponding `MODULE_META` record in `src/core/registry.ts`.
3. Confirm the target tier exists in `src/core/curriculum.ts`.
4. Verify prerequisites point to real module IDs already present in the registry.

The public routes, tier summaries, and sitemap are generated from the registered module metadata, so registration is what makes a module discoverable.

## Content workflow

Use `docs/content_template.md` as the design worksheet before or while building a module.

Do not treat these files as current source of truth:

- `docs/implementation_plan.md`
- `docs/brainstorm.md`
- `docs/content_spec.md`

Those documents are historical planning references and still describe older ideas, including the retired `src/content/*` architecture.

## Verification checklist

Before considering a module update done:

1. Run `npm run lint -- --quiet`.
2. Open the dashboard and confirm the module appears in the expected tier.
3. Open the module hub, guided route, playground route, and challenge route.
4. Confirm the sitemap still builds the module routes through the registered metadata.

## Current architectural defaults

- Keep `src/modules/*` as the active runtime architecture.
- Keep `src/core/registry.ts` as the canonical module registry.
- Keep `src/core/curriculum.ts` as the canonical tier metadata source.
- Prefer reusing or re-exporting shared runtime logic over duplicating large visualization files.
