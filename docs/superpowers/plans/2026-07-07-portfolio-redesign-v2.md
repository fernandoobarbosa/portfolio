# Portfolio Redesign v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing portfolio's Hero and add a new Terminal component, inspired by johnenrique.tech (different color palette), showing a "remote roles" status badge with the Brazilian flag, real GitHub achievement badges, a subtle Pokémon easter egg, and a rewritten About bio — without changing the overall page architecture (Next.js static export, content.ts as sole data source).

**Architecture:** Same as v1 — Next.js 15 App Router, static export, Tailwind CSS v4 design tokens, one typed `content.ts` module. This plan only touches: `app/globals.css` (recolor + new animations), `content.ts` (new profile fields + achievements data + rewritten bio), `app/icon.tsx` (new favicon), `components/Hero.tsx` (redesign), `components/Terminal.tsx` (new), and `app/page.tsx` (wire in Terminal).

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, next/font (Geist Sans/Mono), lucide-react, `next/og` (`ImageResponse`, for the static favicon).

## Global Constraints

- Accent color changes from `#38bdf8` (blue) to `#a78bfa` (purple/violet) — defined once in Task 1 via the existing `--color-accent` Tailwind v4 `@theme` token, so every existing component that uses `text-accent`/`border-accent`/`bg-accent` picks up the new color automatically. Do not hand-edit the color in any other file.
- No new npm dependencies. `next/og`'s `ImageResponse` ships inside the already-installed `next` package.
- No GitHub API calls at runtime or build time. The achievement badge images are static, stable, publicly-hosted URLs on `github.githubassets.com` — hand-curated data in `content.ts`, same treatment as project data.
- Respect `prefers-reduced-motion`: any new CSS `@keyframes` animation (status-dot pulse, terminal cursor blink) must be neutralized by the existing reduced-motion media query in `globals.css` (extend it — don't add a second one).
- No test framework. Verification is via `npx tsc --noEmit` / `npm run build`, plus a `curl`-based structural check against the dev server for each task (adapt the same way v1's tasks did — no browser tool is available to implementer subagents). The controller (not a subagent) does a final real-browser visual check with Playwright (already installed in this environment) before considering the work done.
- Keep the Pokémon reference confined to the Terminal component's `$ pokedex --trainer` line and the favicon — no broader theme change (per spec's Non-Goals).
- Package manager: npm.

---

### Task 1: Recolor accent token and add animations

**Files:**
- Modify: `portfolio/app/globals.css`

**Interfaces:**
- Produces: `--color-accent: #a78bfa` (was `#38bdf8`) — every `text-accent`/`border-accent`/`bg-accent` Tailwind utility across the whole app updates automatically. New reusable classes: `.animate-pulse-dot` (status-dot pulse) and `.animate-blink` (terminal cursor blink), both neutralized under `prefers-reduced-motion: reduce`.

- [ ] **Step 1: Replace `globals.css` contents**

```css
@import "tailwindcss";

@theme {
  --color-background: #0a0a0a;
  --color-foreground: #ededed;
  --color-accent: #a78bfa;
  --color-border: #262626;
}

html {
  scroll-padding-top: 7rem;
}

body {
  background: var(--color-background);
  color: var(--color-foreground);
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-pulse-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes blink-cursor {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.animate-blink {
  animation: blink-cursor 1s steps(1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 2: Verify the build succeeds and the old color is gone**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
grep -r "38bdf8" app/ components/ content.ts
```
Expected: build ends with `Compiled successfully`; the `grep` finds nothing (exit code 1 / no output) — confirming the old blue is fully replaced.

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add app/globals.css
git commit -m "style: recolor accent to purple and add pulse/blink animations"
```

---

### Task 2: Update content.ts — profile fields, achievements, rewritten bio

**Files:**
- Modify: `portfolio/content.ts`

**Interfaces:**
- Produces: `Profile` type gains `location: string` and `timezone: string` fields. New `Achievement` type (`{ name: string; imageUrl: string }`) and `achievements: Achievement[]` export (3 entries). `profile.bio` is replaced with the v2 rewritten paragraph. The `projects` array is untouched.

- [ ] **Step 1: Replace the `Profile` type**

Find this block in `content.ts`:
```ts
export type Profile = {
  name: string;
  title: string;
  bio: string;
  github: string;
  linkedin: string;
  email: string;
};
```

Replace it with:
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

export type Achievement = {
  name: string;
  imageUrl: string;
};
```

- [ ] **Step 2: Replace the `profile` object**

Find this block:
```ts
export const profile: Profile = {
  name: "Fernando Barbosa",
  title: "Software Engineer",
  bio: "I am a developer with many years of experience developing scalable, high-impact solutions.",
  github: "https://github.com/fernandoobarbosa",
  linkedin: "https://www.linkedin.com/in/fernando-barbosa-a790771b8/",
  email: "fernandobarbosa1697@gmail.com",
};
```

Replace it with:
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

- [ ] **Step 3: Add the `achievements` export**

Immediately after the `skills` array (`export const skills: string[] = [...]`), add:

```ts
export const achievements: Achievement[] = [
  {
    name: "YOLO",
    imageUrl:
      "https://github.githubassets.com/assets/yolo-default-be0bbff04951.png",
  },
  {
    name: "Pull Shark",
    imageUrl:
      "https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png",
  },
  {
    name: "Quickdraw",
    imageUrl:
      "https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png",
  },
];
```

- [ ] **Step 4: Verify with the type checker**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npx tsc --noEmit
```
Expected: no output, exit code 0. (The `projects` array is untouched and still satisfies `Project[]`; `profile` now satisfies the extended `Profile` type; `achievements` satisfies `Achievement[]`.)

- [ ] **Step 5: Run a full build**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
```
Expected: `Compiled successfully`. (Nothing renders the new fields yet — Tasks 4–5 do — so this just confirms the data module alone is valid.)

- [ ] **Step 6: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add content.ts
git commit -m "feat: add location/timezone/achievements and rewrite bio in content.ts"
```

---

### Task 3: Replace favicon with a lightning-bolt icon

**Files:**
- Delete: `portfolio/app/favicon.ico`
- Create: `portfolio/app/icon.tsx`

**Interfaces:**
- Produces: a static app icon (Next.js file-convention route), replacing the default `create-next-app` favicon, rendered at build time via `next/og`'s `ImageResponse` (compatible with `output: "export"` since it's generated statically, not at request time).

- [ ] **Step 1: Delete the old favicon**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
rm app/favicon.ico
```

- [ ] **Step 2: Create `app/icon.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ⚡
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 3: Verify the build produces the new icon**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
grep -o 'rel="icon"[^>]*' out/index.html
ls out/ | grep -i icon
```
Expected: build ends with `Compiled successfully`; the `grep` on `out/index.html` shows an `<link rel="icon" ...>` tag pointing at a generated icon file (NOT `/favicon.ico`); the `ls`/`grep` on `out/` shows a generated icon image file present.

- [ ] **Step 4: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add -A -- app/icon.tsx app/favicon.ico
git commit -m "feat: replace favicon with lightning-bolt icon (subtle Pikachu nod)"
```
(`git add -A -- <paths>` stages both the new `icon.tsx` and the deletion of `favicon.ico` already removed from disk in Step 1.)

---

### Task 4: Redesign Hero — status badge, tech line, CTA buttons, proof-of-work stats

**Files:**
- Modify: `portfolio/components/Hero.tsx`

**Interfaces:**
- Consumes: `profile` (all fields, including new `location`/`timezone`), `skills`, `projects` from `@/content`; `GithubIcon`/`LinkedinIcon` from `@/components/icons`.
- Produces: same default-exported `Hero` component, no props, `id="hero"` (unchanged, so `page.tsx` and `Nav.tsx`'s `#hero`-adjacent anchors need no changes).

- [ ] **Step 1: Replace `components/Hero.tsx` contents**

```tsx
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { profile, skills, projects } from "@/content";

export default function Hero() {
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
        Open to remote roles · 🇧🇷 {profile.location} · {profile.timezone}
      </div>
      <h1 className="font-mono text-4xl font-bold tracking-tight md:text-6xl">
        {profile.name}
      </h1>
      <h2 className="text-2xl font-medium text-foreground/70 md:text-3xl">
        {profile.title}
      </h2>
      <p className="max-w-xl text-base text-foreground/60 md:text-lg">
        {profile.bio}
      </p>
      <p className="font-mono text-sm text-foreground/50">
        {skills.join(" · ")}
      </p>
      <div className="flex flex-wrap gap-4 pt-4">
        <a
          href={`mailto:${profile.email}`}
          className="rounded-md bg-accent px-5 py-3 font-mono text-sm font-semibold text-background transition-colors hover:opacity-90"
        >
          Email me
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border border-border px-5 py-3 font-mono text-sm transition-colors hover:border-accent hover:text-accent"
        >
          <GithubIcon size={16} />
          GitHub ↗
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border border-border px-5 py-3 font-mono text-sm transition-colors hover:border-accent hover:text-accent"
        >
          <LinkedinIcon size={16} />
          LinkedIn ↗
        </a>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 font-mono text-xs text-foreground/40">
        {projects.map((project) => {
          const label =
            project.stars > 0
              ? `${project.stars}★`
              : `${project.contributions.length} PR${
                  project.contributions.length > 1 ? "s" : ""
                } merged`;
          return (
            <span key={project.url}>
              {project.name} <span className="text-accent">{label}</span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
```

Note: the old icon-only Email button (using lucide-react's `Mail`) is removed — the `Mail` import is dropped entirely since Email is now the filled "Email me" text button.

- [ ] **Step 2: Structural check via curl**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run dev &
sleep 2
timeout 30 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done'
curl -s http://localhost:3000 | grep -o "Open to remote roles[^<]*"
curl -s http://localhost:3000 | grep -o "Email me"
curl -s http://localhost:3000 | grep -o "GitHub ↗"
curl -s http://localhost:3000 | grep -o "4★\|2★\|PR merged"
kill %1
```
Expected: each grep finds a match, confirming the status badge, CTA buttons, and proof-of-work stats render with real data.

- [ ] **Step 3: Run a full build**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add components/Hero.tsx
git commit -m "feat: redesign Hero with status badge, CTA buttons, and proof-of-work stats"
```

---

### Task 5: Terminal component (achievements + pokedex easter egg)

**Files:**
- Create: `portfolio/components/Terminal.tsx`
- Modify: `portfolio/app/page.tsx`

**Interfaces:**
- Consumes: `profile`, `achievements` from `@/content`.
- Produces: default-exported `Terminal` component, no props. Rendered in `page.tsx` directly after `<Hero />` and before `<About />`.

- [ ] **Step 1: Create `components/Terminal.tsx`**

```tsx
import { achievements, profile } from "@/content";

export default function Terminal() {
  return (
    <section className="border-t border-border px-6 py-16 md:px-12">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span
            className="h-3 w-3 rounded-full bg-foreground/20"
            aria-hidden="true"
          />
          <span
            className="h-3 w-3 rounded-full bg-foreground/20"
            aria-hidden="true"
          />
          <span
            className="h-3 w-3 rounded-full bg-foreground/20"
            aria-hidden="true"
          />
        </div>
        <div className="space-y-4 p-6 font-mono text-sm leading-relaxed">
          <div>
            <p className="text-accent">$ whoami</p>
            <p className="text-foreground/70">
              {profile.name.toLowerCase().replace(" ", "-")} —{" "}
              {profile.title.toLowerCase()}
            </p>
          </div>
          <div>
            <p className="text-accent">$ cat achievements.log</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {achievements.map((achievement) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={achievement.name}
                  src={achievement.imageUrl}
                  alt={`GitHub achievement: ${achievement.name}`}
                  title={achievement.name}
                  width={40}
                  height={40}
                  className="rounded"
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-accent">$ pokedex --trainer</p>
            <p className="text-foreground/70">
              Type: Backend/DevOps ⚡ · Region: {profile.location} 🇧🇷
            </p>
          </div>
          <p className="text-accent">
            ${" "}
            <span
              className="inline-block h-4 w-2 translate-y-0.5 bg-accent animate-blink"
              aria-hidden="true"
            />
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire `Terminal` into `page.tsx`, right after `Hero`**

```tsx
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Terminal from "@/components/Terminal";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Terminal />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Structural check via curl**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run dev &
sleep 2
timeout 30 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done'
curl -s http://localhost:3000 | grep -o "whoami"
curl -s http://localhost:3000 | grep -o "pokedex --trainer"
curl -s http://localhost:3000 | grep -o "yolo-default\|pull-shark-default\|quickdraw-default"
kill %1
```
Expected: each grep finds a match — confirming the terminal prompts and all 3 real achievement image URLs are present in the rendered HTML.

- [ ] **Step 4: Run a full build**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
```
Expected: `Compiled successfully`. (An ESLint warning about `<img>` vs `next/image` may appear — that's expected and acceptable per this project's static-export/no-next-image constraint; it must not be a build **error**.)

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add components/Terminal.tsx app/page.tsx
git commit -m "feat: add Terminal component with GitHub achievements and pokedex easter egg"
```

---

### Task 6: Final verification and visual check

**Files:** none (verification only)

- [ ] **Step 1: Full rebuild from a clean state**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
rm -rf .next out
npm run build
```
Expected: `Compiled successfully`, `out/index.html` present.

- [ ] **Step 2: Type-check**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npx tsc --noEmit
```
Expected: no output, exit code 0.

- [ ] **Step 3: Report completion**

Summarize in your final report: confirmation that all 5 prior tasks' commits exist (`git log --oneline` since the base commit), the final `npm run build` output, and a note that a human/controller will do a final real-browser visual pass (Playwright) before this is considered fully done — this project has no browser tool available to implementer subagents, so this step intentionally does not include a "visually verify" instruction like earlier tasks' curl-based approximations.
