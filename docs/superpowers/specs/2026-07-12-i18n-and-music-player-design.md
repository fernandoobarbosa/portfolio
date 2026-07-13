# EN/PT toggle and floating music player — design

## Goal

Add two independent improvements inspired by https://www.ericktakeshi.com.br/, adapted to this site's existing terminal/Pokémon aesthetic:

1. A client-side English/Portuguese language toggle.
2. A floating, persistent music player widget.

Both ship together but are functionally unrelated — a component could be built/reviewed without the other.

## Part 1 — EN/PT language toggle

### Approach

The site is a static export (`output: "export"` in `next.config.ts`) with no server, so this is a **client-side toggle**, not route-based i18n (no `/en`, `/pt` routes, no locale-based redirects). The toggle swaps displayed text instantly via React state; the URL never changes.

### State (`LocaleProvider`)

- New `components/LocaleProvider.tsx`: a React Context exposing `{ locale: "en" | "pt", setLocale }`.
- Wraps `{children}` in `app/layout.tsx`.
- Default locale: **`"en"`**.
- Persists the user's choice to `localStorage` (key: `locale`) and reads it back on mount so the choice survives reloads. If nothing is stored, falls back to the `"en"` default (no browser-language detection).
- A `useLocale()` hook returns the context value for use in components.

### Translation dictionary (`translations.ts`)

New file, sibling to `content.ts`, holding all fixed UI copy in both languages:

```ts
export const translations = {
  en: {
    nav: { about: "About", skills: "Skills", projects: "Projects", contact: "Contact" },
    hero: { openToRemote: "Open to remote roles", emailMe: "Email me" },
    about: { heading: "01. About" },
    skills: { heading: "02. Skills" },
    projects: { heading: "03. Projects & Contributions" },
    contact: {
      heading: "04. Contact",
      intro: "Feel free to reach out through any of the channels below.",
    },
    footer: { text: "Built with Next.js, deployed on Vercel." },
  },
  pt: {
    nav: { about: "Sobre", skills: "Habilidades", projects: "Projetos", contact: "Contato" },
    hero: { openToRemote: "Aberto a vagas remotas", emailMe: "Enviar email" },
    about: { heading: "01. Sobre" },
    skills: { heading: "02. Habilidades" },
    projects: { heading: "03. Projetos & Contribuições" },
    contact: {
      heading: "04. Contato",
      intro: "Fique à vontade para entrar em contato por qualquer um dos canais abaixo.",
    },
    footer: { text: "Feito com Next.js, publicado na Vercel." },
  },
} as const;
```

Star/PR label pluralization in `Hero.tsx` (`"4 stars"`, `"2 PRs merged"`) is also translated inline (`"4 estrelas"`, `"2 PRs mesclados"`) using the same locale-branching approach as the rest of the copy, not a separate i18n pluralization library (YAGNI for two languages and simple English/Portuguese plural rules).

**Out of scope for translation** (stay English-only, unchanged from `content.ts`):
- Project `description` and contribution `title` fields — real GitHub data, translating them would misrepresent the actual PR/project text.
- `Terminal.tsx` command lines (`$ whoami`, `$ cat achievements.log`, `$ pokedex --trainer`, etc.) — these are presented as literal shell input, not prose.

### `profile.bio` translation

`content.ts`'s `Profile.bio` becomes a locale-keyed object instead of a plain string:

```ts
export type Profile = {
  // ...
  bio: { en: string; pt: string };
};
```

Both `Hero.tsx` and `About.tsx` currently render `profile.bio` directly — they switch to `profile.bio[locale]` using `useLocale()`.

### Nav toggle UI

`components/Nav.tsx` gets a plain-text `EN · PT` control (matching the reference site's minimal style, consistent with the existing `hover:text-accent` link styling already used for the section links in that header). Clicking the inactive language calls `setLocale`; the active language is visually distinguished (e.g. `text-accent`, no underline).

### Components touched

`Nav`, `Hero`, `About`, `Skills`, `Projects`, `Contact`, `Footer` all switch their fixed strings to `t.<section>.<key>` via `useLocale()`. `content.ts`'s `Profile.bio` type changes as above.

## Part 2 — Floating music player

### Data (`content.ts`)

```ts
export type Track = {
  file: string;   // filename under /public/music
  title: string;
  artist: string;
};

export const tracks: Track[] = [
  { file: "track-1.mp3", title: "Track 1", artist: "Unknown Artist" },
  { file: "track-2.mp3", title: "Track 2", artist: "Unknown Artist" },
];
```

The user will replace these placeholder entries with real titles/artists and drop matching `.mp3` files into `/public/music/` themselves — no code changes needed for future track swaps, matching the existing "all content lives in `content.ts`" convention.

### Component (`components/MusicPlayer.tsx`)

Rendered once from `app/layout.tsx` (outside `<main>`), so it's present and fixed across the whole page regardless of scroll position.

**Layout:** `fixed bottom-6 right-6` card, styled to match the existing terminal aesthetic (monospace, `border-border`, `bg-background/80` + `backdrop-blur-sm`, same visual language as `Nav`). Current-track line styled like a terminal prompt, e.g. `$ now_playing` followed by `{title} — {artist}`.

**Controls** (via `lucide-react`, already a project dependency):
- Previous / Play-Pause / Next buttons, wrapping around the playlist (`tracks`) in both directions.
- Thin clickable progress bar showing playback position; click seeks.
- Mute/unmute toggle. No volume slider (YAGNI — mute is sufficient).

**Playback logic:**
- Native `<audio>` element controlled via `useRef`, with `currentTrackIndex`, `isPlaying`, `isMuted` React state.
- No autoplay: loads paused; playback starts only on explicit user click (also avoids browser autoplay-with-sound restrictions).
- On a track's `ended` event, auto-advances to the next track, wrapping to the first track after the last.
- Play/pause state is **not** persisted across reloads — every fresh page load starts paused, so a visitor is never surprised by unexpected audio.

**Responsive behavior:** below `md` breakpoint, the widget collapses to a compact form (play/pause + track title truncated, prev/next/progress-bar hidden or reachable via a small expand toggle) so it doesn't crowd small screens.

### Components touched

New `MusicPlayer.tsx`; `content.ts` gains `Track` type and `tracks` array; `app/layout.tsx` renders `<MusicPlayer />` once.

## Out of scope

- No route-based i18n (`/en`, `/pt` URLs) — client-side toggle only.
- No browser-language auto-detection for initial locale.
- No translation of project descriptions, contribution titles, or Terminal command lines.
- No playlist reordering, shuffle, or volume slider — play/pause, prev/next, seek, and mute only.
- No persistence of play/pause state across page reloads.
- Real `.mp3` files are not part of this change — placeholders ship; the user supplies real audio files and edits `tracks` afterward.
