# Hall of Fame Easter Egg Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "hall of fame" block to the existing `Terminal` component showing the last Pokémon game the user became champion in, with a trainer card screenshot.

**Architecture:** Single new data entry in `content.ts` consumed by a new command block appended to `components/Terminal.tsx`, following the file's existing `$ command` / output pattern. No new components, sections, or pages.

**Tech Stack:** Next.js 16 / React 19 / TypeScript, Tailwind CSS v4. No test runner in this repo (`package.json` only defines `dev`, `build`, `start`, `lint`) — verification for this plan is `npm run lint`, `npm run build`, and a manual visual check via `npm run dev`, not automated tests.

## Global Constraints

- Image asset `public/trainer-card.png` already exists — do not recreate it.
- Game name to display verbatim: `Pokemon Yellow Legacy`.
- Use a plain `<img>` tag for the trainer card image (matches the existing `achievements` image rendering in `Terminal.tsx`), not `next/image`.
- No new section in `app/page.tsx` — this only touches `content.ts` and `components/Terminal.tsx`.
- No list/array structure for hall-of-fame data — single object only (YAGNI, per spec).

---

### Task 1: Add hall-of-fame data and render it in the Terminal

**Files:**
- Modify: `content.ts` (append type + const, after the existing `Achievement`/`achievements` block at content.ts:26-68)
- Modify: `components/Terminal.tsx` (add import and new command block after the `pokedex --trainer` block at components/Terminal.tsx:46-51)

**Interfaces:**
- Produces: `HallOfFame` type (`{ game: string; trainerCardImage: string }`) and `hallOfFame: HallOfFame` constant, exported from `content.ts`, imported into `Terminal.tsx` as `import { achievements, hallOfFame, profile } from "@/content";`

- [ ] **Step 1: Add the `HallOfFame` type and `hallOfFame` constant to `content.ts`**

Insert after the `Achievement` type block (content.ts:26-29), before `export const profile`:

```ts
export type HallOfFame = {
  game: string;
  trainerCardImage: string;
};
```

Insert after the `achievements` array (content.ts:52-68), before `export const projects`:

```ts
export const hallOfFame: HallOfFame = {
  game: "Pokemon Yellow Legacy",
  trainerCardImage: "/trainer-card.png",
};
```

- [ ] **Step 2: Update the `Terminal.tsx` import**

Change:

```tsx
import { achievements, profile } from "@/content";
```

to:

```tsx
import { achievements, hallOfFame, profile } from "@/content";
```

- [ ] **Step 3: Add the new command block after `$ pokedex --trainer`**

In `components/Terminal.tsx`, the current block (lines 46-51) reads:

```tsx
          <div>
            <p className="text-accent">$ pokedex --trainer</p>
            <p className="text-foreground/70">
              Type: Backend/DevOps ⚡ · Region: {profile.location} 🇧🇷
            </p>
          </div>
```

Add a new `<div>` immediately after it (still before the closing blinking-cursor `<p>`):

```tsx
          <div>
            <p className="text-accent">$ cat trainer-card.png</p>
            <div className="mt-2 flex flex-col items-start gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hallOfFame.trainerCardImage}
                alt={`Trainer card from ${hallOfFame.game}`}
                width={160}
                className="rounded border border-border"
              />
              <p className="text-foreground/70">{hallOfFame.game}</p>
            </div>
          </div>
```

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors (no `no-img-element` warning, since the disable comment covers it — matches the existing pattern for the achievements images two blocks above).

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 6: Manual visual check**

Run: `npm run dev`, open the site, scroll to the Terminal section. Confirm:
- A new line `$ cat trainer-card.png` appears right after `$ pokedex --trainer`.
- The trainer card PNG renders at ~160px wide with rounded corners and a border.
- The caption `Pokemon Yellow Legacy` appears directly under the image.
- The blinking cursor prompt still renders as the last line in the terminal.

Stop the dev server after confirming.

- [ ] **Step 7: Commit**

```bash
git add content.ts components/Terminal.tsx
git commit -m "feat: add hall of fame trainer card easter egg to terminal"
```
