# EN/PT Toggle and Floating Music Player Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a client-side EN/PT language toggle and a floating, persistent music player widget to the portfolio, matching the terminal/Pokémon visual style already in place.

**Architecture:** A React Context (`LocaleProvider`) provides the active locale (default `"en"`) and persists it to `localStorage`; a `translations.ts` dictionary supplies fixed UI copy for both languages; components read both via a `useTranslation()` hook. Separately, a new `MusicPlayer` client component reads a `tracks` array from `content.ts`, drives a native `<audio>` element, and renders as a `fixed`-position widget mounted once in `app/layout.tsx`. The two features share no code.

**Tech Stack:** Next.js 16 / React 19 / TypeScript, Tailwind CSS v4, `lucide-react` for icons. No test runner in this repo (`package.json` only defines `dev`, `build`, `start`, `lint`) — verification for every task is `npm run lint`, `npm run build`, and a manual visual check via `npm run dev`, not automated tests.

## Global Constraints

- Default locale is `"en"` (not Portuguese, not browser-detected) — confirmed by the user after the design doc was written.
- No route-based i18n (`/en`, `/pt`) — locale is client-side React state persisted to `localStorage` under the key `locale`. The URL never changes.
- Only fixed UI copy and `profile.bio` are translated. Project `description`, contribution `title` fields, and `Terminal.tsx` command lines stay English-only.
- Music tracks are referenced as `/assets/music/{file}` (files live in `public/assets/music/`). The user already added two real files (`dewford-emerald.mp3`, `fuschia-pokopia.mp3`) directly to `public/`; this plan moves them into `public/assets/music/` and wires up real titles.
- `public/` gets a `public/assets/` subfolder (`images/`, `music/`) to keep real content assets separate from the unused default Next.js SVGs at the root. `trainer-card.png` (used by the existing hall-of-fame easter egg) moves into `public/assets/images/`, and `content.ts`'s `hallOfFame.trainerCardImage` path updates accordingly. The default SVGs stay put — out of scope.
- No autoplay. No volume slider (mute/unmute only). No shuffle/reorder. Play/pause state is not persisted across reloads.
- Any component that calls `useLocale()`, `useTranslation()`, or uses `useState`/`useRef` needs a `"use client"` directive at the top of the file (this repo's components are Server Components by default).

---

### Task 1: Locale infrastructure — translations dictionary + `LocaleProvider`

**Files:**
- Create: `translations.ts`
- Create: `components/LocaleProvider.tsx`
- Modify: `app/layout.tsx:1-35`

**Interfaces:**
- Produces: `translations` object and `Translations` type, exported from `translations.ts`.
- Produces: `Locale` type (`"en" | "pt"`), `LocaleProvider` component, `useLocale()` hook (returns `{ locale: Locale; setLocale: (l: Locale) => void }`), and `useTranslation()` hook (returns `translations[locale]`), all exported from `components/LocaleProvider.tsx`.

- [ ] **Step 1: Create `translations.ts`**

```ts
export const translations = {
  en: {
    nav: {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      openToRemote: "Open to remote roles",
      emailMe: "Email me",
    },
    about: {
      heading: "01. About",
    },
    skills: {
      heading: "02. Skills",
    },
    projects: {
      heading: "03. Projects & Contributions",
    },
    contact: {
      heading: "04. Contact",
      intro: "Feel free to reach out through any of the channels below.",
    },
    footer: {
      text: "Built with Next.js, deployed on Vercel.",
    },
  },
  pt: {
    nav: {
      about: "Sobre",
      skills: "Habilidades",
      projects: "Projetos",
      contact: "Contato",
    },
    hero: {
      openToRemote: "Aberto a vagas remotas",
      emailMe: "Enviar email",
    },
    about: {
      heading: "01. Sobre",
    },
    skills: {
      heading: "02. Habilidades",
    },
    projects: {
      heading: "03. Projetos & Contribuições",
    },
    contact: {
      heading: "04. Contato",
      intro:
        "Fique à vontade para entrar em contato por qualquer um dos canais abaixo.",
    },
    footer: {
      text: "Feito com Next.js, publicado na Vercel.",
    },
  },
} as const;

export type Translations = typeof translations.en;
```

- [ ] **Step 2: Create `components/LocaleProvider.tsx`**

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/translations";

export type Locale = "en" | "pt";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "pt") {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

export function useTranslation() {
  const { locale } = useLocale();
  return translations[locale];
}
```

- [ ] **Step 3: Wrap the app in `LocaleProvider` in `app/layout.tsx`**

Current `app/layout.tsx` body (lines 26-35):

```tsx
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
```

Change to:

```tsx
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
```

And add the import near the top of the file, after the `"./globals.css"` import:

```tsx
import { LocaleProvider } from "@/components/LocaleProvider";
```

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build succeeds with no type errors. (Nothing consumes `useLocale`/`useTranslation` yet, so this only verifies the new files and the `layout.tsx` change compile.)

- [ ] **Step 6: Commit**

```bash
git add translations.ts components/LocaleProvider.tsx app/layout.tsx
git commit -m "feat: add locale provider and translations dictionary"
```

---

### Task 2: Nav language toggle

**Files:**
- Modify: `components/Nav.tsx` (full rewrite of the existing 18-line file)

**Interfaces:**
- Consumes: `useLocale()` and `useTranslation()` from `components/LocaleProvider.tsx` (Task 1).

- [ ] **Step 1: Rewrite `components/Nav.tsx`**

```tsx
"use client";

import { useLocale, useTranslation } from "@/components/LocaleProvider";

export default function Nav() {
  const { locale, setLocale } = useLocale();
  const t = useTranslation();

  const links = [
    { href: "#about", label: t.nav.about },
    { href: "#skills", label: t.nav.skills },
    { href: "#projects", label: t.nav.projects },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex flex-wrap items-center justify-end gap-4 gap-y-2 border-b border-border bg-background/80 px-6 py-4 font-mono text-sm backdrop-blur-sm md:px-12">
      {links.map((link) => (
        <a key={link.href} href={link.href} className="hover:text-accent">
          {link.label}
        </a>
      ))}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={locale === "en" ? "text-accent" : "hover:text-accent"}
        >
          EN
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() => setLocale("pt")}
          className={locale === "pt" ? "text-accent" : "hover:text-accent"}
        >
          PT
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open the site. Confirm:
- Nav shows `About · Skills · Projects · Contact · EN · PT` (section labels still English since Task 3 hasn't run yet).
- `EN` is highlighted (accent color) by default.
- Clicking `PT` highlights `PT` instead and un-highlights `EN` (section labels won't change yet — that's expected, Task 3 wires those up).
- Reload the page — the `PT` selection persists (confirms `localStorage` read-back works).
- Click back to `EN` before moving on, so the default state is clean for the next task's manual check.

Stop the dev server after confirming.

- [ ] **Step 5: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat: add EN/PT language toggle to nav"
```

---

### Task 3: Translate Skills, Projects, Contact, and Footer copy

**Files:**
- Modify: `components/Skills.tsx` (full rewrite of the existing 21-line file)
- Modify: `components/Projects.tsx` (full rewrite of the existing 20-line file)
- Modify: `components/Contact.tsx` (full rewrite of the existing 43-line file)
- Modify: `components/Footer.tsx` (full rewrite of the existing 9-line file)

**Interfaces:**
- Consumes: `useTranslation()` from `components/LocaleProvider.tsx` (Task 1).

- [ ] **Step 1: Rewrite `components/Skills.tsx`**

```tsx
"use client";

import { skills } from "@/content";
import { useTranslation } from "@/components/LocaleProvider";

export default function Skills() {
  const t = useTranslation();

  return (
    <section id="skills" className="border-t border-border px-6 py-24 md:px-12">
      <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-accent">
        {t.skills.heading}
      </h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-border px-4 py-2 font-mono text-sm text-foreground/70"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Rewrite `components/Projects.tsx`**

```tsx
"use client";

import { projects } from "@/content";
import ProjectCard from "@/components/ProjectCard";
import { useTranslation } from "@/components/LocaleProvider";

export default function Projects() {
  const t = useTranslation();

  return (
    <section
      id="projects"
      className="border-t border-border px-6 py-24 md:px-12"
    >
      <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-accent">
        {t.projects.heading}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.url} project={project} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Rewrite `components/Contact.tsx`**

```tsx
"use client";

import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { profile } from "@/content";
import { useTranslation } from "@/components/LocaleProvider";

export default function Contact() {
  const t = useTranslation();

  return (
    <section
      id="contact"
      className="border-t border-border px-6 py-24 md:px-12"
    >
      <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-accent">
        {t.contact.heading}
      </h2>
      <p className="max-w-xl text-foreground/60">{t.contact.intro}</p>
      <div className="mt-8 flex flex-col gap-4 font-mono text-sm md:flex-row md:gap-8">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-accent"
        >
          <GithubIcon size={16} /> GitHub
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-accent"
        >
          <LinkedinIcon size={16} /> LinkedIn
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center gap-2 hover:text-accent"
        >
          <Mail size={16} aria-hidden="true" /> {profile.email}
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Rewrite `components/Footer.tsx`**

```tsx
"use client";

import { useTranslation } from "@/components/LocaleProvider";

export default function Footer() {
  const t = useTranslation();

  return (
    <footer className="border-t border-border px-6 py-8 md:px-12">
      <p className="font-mono text-xs text-foreground/40">{t.footer.text}</p>
    </footer>
  );
}
```

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 7: Manual visual check**

Run: `npm run dev`, open the site. Confirm with `EN` selected (default):
- Skills section heading reads "02. Skills".
- Projects section heading reads "03. Projects & Contributions".
- Contact heading reads "04. Contact" and the intro line reads "Feel free to reach out through any of the channels below."
- Footer reads "Built with Next.js, deployed on Vercel."

Click `PT` in the nav and confirm:
- Skills heading reads "02. Habilidades".
- Projects heading reads "03. Projetos & Contribuições".
- Contact heading reads "04. Contato" and the intro reads "Fique à vontade para entrar em contato por qualquer um dos canais abaixo."
- Footer reads "Feito com Next.js, publicado na Vercel."

Switch back to `EN` and stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add components/Skills.tsx components/Projects.tsx components/Contact.tsx components/Footer.tsx
git commit -m "feat: translate skills, projects, contact, and footer sections"
```

---

### Task 4: Bilingual bio + Hero translations

**Files:**
- Modify: `content.ts:15-24` (`Profile` type) and `content.ts:36-45` (`profile` const)
- Modify: `components/About.tsx` (full rewrite of the existing 14-line file)
- Modify: `components/Hero.tsx` (full rewrite of the existing 77-line file)

**Interfaces:**
- Produces: `Profile.bio` changes from `string` to `{ en: string; pt: string }`.
- Consumes: `useLocale()` and `useTranslation()` from `components/LocaleProvider.tsx` (Task 1).

- [ ] **Step 1: Change the `Profile` type in `content.ts`**

Current (content.ts:15-24):

```ts
export type Profile = {
  name: string;
  title: string;
  bio: string;
  github: string;
  linkedin: string;
  email: string;
  location: string;
  timezone: string;
};
```

Change `bio: string;` to:

```ts
export type Profile = {
  name: string;
  title: string;
  bio: { en: string; pt: string };
  github: string;
  linkedin: string;
  email: string;
  location: string;
  timezone: string;
};
```

- [ ] **Step 2: Change the `profile` const in `content.ts`**

Current (content.ts:36-45):

```ts
export const profile: Profile = {
  name: "Fernando Barbosa",
  title: "Software Engineer",
  bio: "Back-end developer with 5+ years of experience building scalable systems in Node.js and TypeScript — microservices architecture, Express APIs, and message-driven systems with RabbitMQ. Beyond my day-to-day work, I contribute to open source: 6 merged contributions across 4 public repositories, from CI/CD pipelines to logging infrastructure and code-quality tooling.",
  github: "https://github.com/fernandoobarbosa",
  linkedin: "https://www.linkedin.com/in/fernando-barbosa-a790771b8/",
  email: "fernandobarbosa1697@gmail.com",
  location: "Brazil",
  timezone: "UTC-3",
};
```

Replace with:

```ts
export const profile: Profile = {
  name: "Fernando Barbosa",
  title: "Software Engineer",
  bio: {
    en: "Back-end developer with 5+ years of experience building scalable systems in Node.js and TypeScript — microservices architecture, Express APIs, and message-driven systems with RabbitMQ. Beyond my day-to-day work, I contribute to open source: 6 merged contributions across 4 public repositories, from CI/CD pipelines to logging infrastructure and code-quality tooling.",
    pt: "Desenvolvedor back-end com mais de 5 anos de experiência construindo sistemas escaláveis em Node.js e TypeScript — arquitetura de microsserviços, APIs em Express e sistemas orientados a mensagens com RabbitMQ. Além do trabalho do dia a dia, contribuo com projetos open source: 6 contribuições mescladas em 4 repositórios públicos, de pipelines de CI/CD a infraestrutura de logging e ferramentas de qualidade de código.",
  },
  github: "https://github.com/fernandoobarbosa",
  linkedin: "https://www.linkedin.com/in/fernando-barbosa-a790771b8/",
  email: "fernandobarbosa1697@gmail.com",
  location: "Brazil",
  timezone: "UTC-3",
};
```

- [ ] **Step 3: Rewrite `components/About.tsx`**

```tsx
"use client";

import { profile } from "@/content";
import { useLocale, useTranslation } from "@/components/LocaleProvider";

export default function About() {
  const { locale } = useLocale();
  const t = useTranslation();

  return (
    <section id="about" className="border-t border-border px-6 py-24 md:px-12">
      <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-accent">
        {t.about.heading}
      </h2>
      <p className="max-w-2xl text-lg leading-relaxed text-foreground/80 md:text-xl">
        {profile.bio[locale]}
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Rewrite `components/Hero.tsx`**

```tsx
"use client";

import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { profile, skills, projects, type Project } from "@/content";
import {
  useLocale,
  useTranslation,
  type Locale,
} from "@/components/LocaleProvider";

function getProjectLabel(project: Project, locale: Locale) {
  if (project.stars > 0) {
    const unit =
      locale === "pt"
        ? project.stars > 1
          ? "estrelas"
          : "estrela"
        : project.stars > 1
          ? "stars"
          : "star";
    return `${project.stars} ${unit}`;
  }
  const count = project.contributions.length;
  return locale === "pt"
    ? `${count} PR${count > 1 ? "s" : ""} mesclado${count > 1 ? "s" : ""}`
    : `${count} PR${count > 1 ? "s" : ""} merged`;
}

export default function Hero() {
  const { locale } = useLocale();
  const t = useTranslation();

  return (
    <section
      id="hero"
      className="flex min-h-[80vh] flex-col justify-center gap-6 px-6 py-24 md:px-12"
    >
      <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-accent">
        <span
          className="h-2 w-2 rounded-full bg-accent animate-pulse-dot"
          aria-hidden="true"
        />
        {t.hero.openToRemote} · 🇧🇷 {profile.location} · {profile.timezone}
      </div>
      <h1 className="font-mono text-4xl font-bold tracking-tight md:text-6xl">
        {profile.name}
      </h1>
      <h2 className="text-2xl font-medium text-foreground/70 md:text-3xl">
        {profile.title}
      </h2>
      <p className="max-w-xl text-base text-foreground/60 md:text-lg">
        {profile.bio[locale]}
      </p>
      <p className="font-mono text-sm text-foreground/50">
        {skills.join(" · ")}
      </p>
      <div className="flex flex-wrap gap-4 pt-4">
        <a
          href={`mailto:${profile.email}`}
          className="rounded-md bg-accent px-5 py-3 font-mono text-sm font-semibold text-background transition-colors hover:opacity-90"
        >
          {t.hero.emailMe}
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border border-border px-5 py-3 font-mono text-sm transition-colors hover:border-accent hover:text-accent"
        >
          <GithubIcon size={16} />
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border border-border px-5 py-3 font-mono text-sm transition-colors hover:border-accent hover:text-accent"
        >
          <LinkedinIcon size={16} />
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 font-mono text-xs text-foreground/40">
        {projects.map((project) => {
          const label = getProjectLabel(project, locale);
          const display = project.stars > 0 ? `${project.stars}★` : label;
          return (
            <span key={project.url}>
              {project.name}{" "}
              <span className="text-accent" aria-label={label}>
                <span aria-hidden="true">{display}</span>
              </span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: build succeeds with no type errors. (This is the step that proves the `Profile.bio` type change and its two consumers — `Hero.tsx`, `About.tsx` — are all consistent.)

- [ ] **Step 7: Manual visual check**

Run: `npm run dev`, open the site. Confirm with `EN` selected (default):
- Hero shows "Open to remote roles · 🇧🇷 Brazil · UTC-3", the English bio, and an "Email me" button.
- Project star/PR badges read like "4 stars" / "2 PRs merged" (check against `content.ts` counts).
- About section shows the same English bio as Hero.

Click `PT` and confirm:
- Hero shows "Aberto a vagas remotas · 🇧🇷 Brazil · UTC-3", the Portuguese bio, and an "Enviar email" button.
- Project badges read like "4 estrelas" / "2 PRs mesclados".
- About section shows the Portuguese bio, heading "01. Sobre".

Switch back to `EN` and stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add content.ts components/About.tsx components/Hero.tsx
git commit -m "feat: add bilingual bio and translate hero section"
```

---

### Task 5: Asset reorganization + music data model

**Files:**
- Move: `public/trainer-card.png` → `public/assets/images/trainer-card.png`
- Move: `public/dewford-emerald.mp3` → `public/assets/music/dewford-emerald.mp3`
- Move: `public/fuschia-pokopia.mp3` → `public/assets/music/fuschia-pokopia.mp3`
- Modify: `content.ts` (update `hallOfFame.trainerCardImage`; add `Track` type right after the `HallOfFame` type; add `tracks` const right after the `hallOfFame` const, before `export const projects`) — note: Task 4 already edited this file and shifted its line numbers, so locate insertion points by the surrounding type/const names shown below, not by absolute line number.

**Interfaces:**
- Produces: `Track` type (`{ file: string; title: string; artist: string }`) and `tracks: Track[]` constant, exported from `content.ts`.

- [ ] **Step 1: Move the trainer card image**

```bash
mkdir -p public/assets/images public/assets/music
git mv public/trainer-card.png public/assets/images/trainer-card.png
```

- [ ] **Step 2: Move the music files**

The two `.mp3` files are already in `public/` but untracked by git (confirm with `git status --short` — they should show as `??`):

```bash
mv public/dewford-emerald.mp3 public/assets/music/dewford-emerald.mp3
mv public/fuschia-pokopia.mp3 public/assets/music/fuschia-pokopia.mp3
```

- [ ] **Step 3: Update `hallOfFame.trainerCardImage` in `content.ts`**

Current:

```ts
export const hallOfFame: HallOfFame = {
  game: "Pokemon Yellow Legacy",
  trainerCardImage: "/trainer-card.png",
};
```

Change the path to:

```ts
export const hallOfFame: HallOfFame = {
  game: "Pokemon Yellow Legacy",
  trainerCardImage: "/assets/images/trainer-card.png",
};
```

- [ ] **Step 4: Add the `Track` type to `content.ts`**

Insert immediately after the `HallOfFame` type (`export type HallOfFame = { game: string; trainerCardImage: string };`) and before `export const profile`:

```ts
export type Track = {
  file: string;
  title: string;
  artist: string;
};
```

- [ ] **Step 5: Add the `tracks` const to `content.ts`**

Insert immediately after the `hallOfFame` const, before `export const projects`:

```ts
export const tracks: Track[] = [
  {
    file: "dewford-emerald.mp3",
    title: "Dewford Town",
    artist: "Pokémon Emerald OST",
  },
  {
    file: "fuschia-pokopia.mp3",
    title: "Fuchsia City",
    artist: "Pokémon Emerald OST",
  },
];
```

- [ ] **Step 6: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: build succeeds with no type errors. (Nothing references `tracks` yet — this only verifies `content.ts` still compiles and the hall-of-fame image path change is valid.)

- [ ] **Step 8: Manual visual check of the moved trainer card image**

Run: `npm run dev`, scroll to the Terminal section, confirm the `$ cat trainer-card.png` block still renders the trainer card image correctly (proves the path update in Step 3 works). Stop the dev server after confirming.

- [ ] **Step 9: Commit**

```bash
git add content.ts public/assets
git status --short
```

Confirm the output shows the two `.mp3` files and `trainer-card.png` as added under `public/assets/`, and `public/trainer-card.png` as deleted (renamed). Then:

```bash
git commit -m "feat: reorganize public assets and add music track data model"
```

---

### Task 6: Music player widget

**Files:**
- Create: `components/MusicPlayer.tsx`
- Modify: `app/layout.tsx` (render `<MusicPlayer />`)

**Interfaces:**
- Consumes: `tracks: Track[]` from `content.ts` (Task 5).
- Produces: default-exported `MusicPlayer` component, no props.

- [ ] **Step 1: Create `components/MusicPlayer.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { tracks } from "@/content";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, trackIndex]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [trackIndex]);

  if (tracks.length === 0) return null;

  const track = tracks[trackIndex];

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const goToNext = () => setTrackIndex((prev) => (prev + 1) % tracks.length);
  const goToPrevious = () =>
    setTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-6 right-6 z-20 w-56 rounded-lg border border-border bg-background/80 p-4 font-mono text-xs backdrop-blur-sm md:w-72">
      <audio
        ref={audioRef}
        src={`/assets/music/${track.file}`}
        muted={isMuted}
        onEnded={goToNext}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      />
      <p className="text-accent">$ now_playing</p>
      <p className="mt-1 truncate text-foreground/70">
        {track.title} — {track.artist}
      </p>
      <div
        className="mt-3 hidden h-1 cursor-pointer rounded-full bg-foreground/20 md:block"
        onClick={handleSeek}
      >
        <div
          className="h-1 rounded-full bg-accent"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1 hidden justify-between text-foreground/40 md:flex">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goToPrevious}
          aria-label="Previous track"
          className="hidden md:inline-flex"
        >
          <SkipBack size={16} />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          type="button"
          onClick={goToNext}
          aria-label="Next track"
          className="hidden md:inline-flex"
        >
          <SkipForward size={16} />
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Render `MusicPlayer` in `app/layout.tsx`**

Add the import, alongside the `LocaleProvider` import added in Task 1:

```tsx
import MusicPlayer from "@/components/MusicPlayer";
```

Change the body (as left by Task 1):

```tsx
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
```

to:

```tsx
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <LocaleProvider>{children}</LocaleProvider>
        <MusicPlayer />
      </body>
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 5: Manual visual check**

Run: `npm run dev`, open the site. Confirm:
- A widget is fixed to the bottom-right corner, visible while scrolling through every section.
- It shows `$ now_playing` and "Dewford Town — Pokémon Emerald OST".
- Clicking play actually starts audio playback from `/assets/music/dewford-emerald.mp3` (the real file moved into place in Task 5), the play icon toggles to pause, and the progress bar/time advance. Click pause to stop.
- Clicking next advances to "Fuchsia City — Pokémon Emerald OST" and starts playing `fuschia-pokopia.mp3`; clicking next again wraps back to "Dewford Town". Clicking previous from "Dewford Town" wraps to "Fuchsia City".
- Clicking the mute button toggles the icon between speaker and muted-speaker, and actually silences/restores audio.
- Resize the browser to a narrow (mobile) width and confirm the previous/next buttons and the seek bar/time row disappear, leaving only the track name, play/pause, and mute button.

Stop the dev server after confirming.

- [ ] **Step 6: Commit**

```bash
git add components/MusicPlayer.tsx app/layout.tsx
git commit -m "feat: add floating music player widget"
```
