# Hall of Fame easter egg — design

## Goal

Add a small "hall of fame" easter egg to the portfolio's Terminal component: the last Pokémon game the user became champion in, shown as a trainer card screenshot. Mirrors a pattern seen on another dev's profile, adapted to fit this site's existing Pokémon-nerd easter egg (`pokedex --trainer` line already in `Terminal.tsx`).

## Data (`content.ts`)

Add a single object (not a list — only one title exists today, and there's no concrete plan for more):

```ts
export type HallOfFame = {
  game: string;
  trainerCardImage: string;
};

export const hallOfFame: HallOfFame = {
  game: "Pokemon Yellow Legacy",
  trainerCardImage: "/trainer-card.png",
};
```

`trainer-card.png` already exists in `/public`.

## Component change (`components/Terminal.tsx`)

Append a new command block after the existing `$ pokedex --trainer` block, following the same visual pattern as the other blocks in the file (`$ whoami`, `$ cat achievements.log`):

```
$ cat trainer-card.png
[trainer card image, ~160px wide, rounded corners, border]
Pokemon Yellow Legacy
```

- Import `hallOfFame` from `@/content`.
- Render the image with a plain `<img>` tag (matches the existing choice for the achievements images in this same file — local asset, no need to introduce `next/image` for one file), with an `eslint-disable-next-line @next/next/no-img-element` comment matching the existing pattern.
- `alt` text: `` `Trainer card from ${hallOfFame.game}` ``.
- Caption below the image: the game name (`hallOfFame.game`), styled like the other `text-foreground/70` caption lines in the file.
- No new section, no changes to `app/page.tsx`.

## Out of scope

- No support for multiple hall-of-fame entries.
- No interactive reveal/trigger — it renders inline in the existing always-visible Terminal block, same as the rest of that component.
