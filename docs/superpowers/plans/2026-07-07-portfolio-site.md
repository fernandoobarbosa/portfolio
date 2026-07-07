# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship a fast, static, dark-themed portfolio site for Fernando Barbosa on Next.js, showcasing curated GitHub contributions, ready to deploy on Vercel.

**Architecture:** Next.js 15 App Router with `output: 'export'` (fully static, no server runtime). Tailwind CSS v4 for styling via design tokens. Content lives in one typed `content.ts` module. Five presentational components compose a single page.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, next/font (Geist Sans/Mono), lucide-react.

## Global Constraints

- Static export only: `next.config.ts` must set `output: "export"`. No API routes, no middleware, no `next/image` optimization (none of these are used).
- No GitHub API fetching at runtime or build time — all project/contribution data is hand-curated in `content.ts` (per spec decision).
- No animation library — CSS transitions only.
- No unit-test framework (Jest/Vitest) is added. This project has no branching business logic — it's a typed data module plus presentational components. Verification is via TypeScript's type checker (`npx tsc --noEmit`, and `npm run build`) for structural correctness, and manual visual review in the browser (`npm run dev`) for UI tasks. This keeps dev dependencies minimal, consistent with the "leve" (lightweight) requirement.
- Colors (defined once in Task 3, reused everywhere): background `#0a0a0a`, foreground `#ededed`, accent `#38bdf8`, border `#262626`.
- Fonts: Geist Sans (body), Geist Mono (headings/labels), loaded via `next/font/google`.
- Package manager: npm.

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: entire generated Next.js project under `portfolio/` (via `create-next-app`, then moved into place)
- Modify: `portfolio/next.config.ts`

**Interfaces:**
- Produces: a buildable Next.js app at `portfolio/` with TypeScript, Tailwind CSS v4, ESLint, App Router, no `src/` dir, import alias `@/*`, and `next.config.ts` setting `output: "export"`. `lucide-react` installed as a dependency.

- [ ] **Step 1: Scaffold into a temporary sibling directory**

The `portfolio/` directory already contains a git repo and a `docs/` folder (from the design spec). To avoid `create-next-app`'s non-empty-directory checks, scaffold into a temp folder first.

Run (from `Documents/`):
```bash
cd "/c/Users/Fernando Barbosa/Documents"
npx --yes create-next-app@latest portfolio-tmp --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm
```
Expected: command ends with `Success! Created portfolio-tmp at ...`

- [ ] **Step 2: Move generated files into `portfolio/`, discarding the tmp git repo**

```bash
cd "/c/Users/Fernando Barbosa/Documents"
rm -rf portfolio-tmp/.git
shopt -s dotglob
mv portfolio-tmp/* portfolio/
shopt -u dotglob
rmdir portfolio-tmp
```
Expected: `portfolio/` now contains `app/`, `public/`, `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, etc., alongside the pre-existing `docs/` folder.

- [ ] **Step 3: Install `lucide-react`**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm install lucide-react
```
Expected: `package.json` `dependencies` now includes `lucide-react`.

- [ ] **Step 4: Set static export in `next.config.ts`**

Replace the file contents with:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
```

- [ ] **Step 5: Verify the baseline app builds and exports statically**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
```
Expected: ends with `Compiled successfully`, and an `out/` directory is created containing `index.html`.

- [ ] **Step 6: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add -A
git commit -m "chore: scaffold Next.js app with static export"
```

---

### Task 2: Content data model

**Files:**
- Create: `portfolio/content.ts`

**Interfaces:**
- Produces: `Profile`, `Project`, `Contribution` types, and `profile: Profile`, `projects: Project[]` exports, all importable as `@/content`. These are the only data source every later component reads from.

- [ ] **Step 1: Write `content.ts` with types and intentionally incomplete data (the "failing test")**

```ts
export type Contribution = {
  title: string;
  url: string;
};

export type Project = {
  name: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  contributions: Contribution[];
};

export type Profile = {
  name: string;
  title: string;
  bio: string;
  github: string;
  linkedin: string;
  email: string;
};

export const profile: Profile = {
  name: "Fernando Barbosa",
  title: "Software Engineer",
  bio: "I am a developer with many years of experience developing scalable, high-impact solutions.",
  github: "https://github.com/fernandoobarbosa",
  linkedin: "https://www.linkedin.com/in/fernando-barbosa-a790771b8/",
};

export const projects: Project[] = [];
```

- [ ] **Step 2: Run the type checker and confirm it fails**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npx tsc --noEmit
```
Expected: FAIL, reporting `Property 'email' is missing in type '{ name: string; ... }' but required in type 'Profile'.` in `content.ts`.

- [ ] **Step 3: Complete the data**

Replace `content.ts` with the full version:
```ts
export type Contribution = {
  title: string;
  url: string;
};

export type Project = {
  name: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  contributions: Contribution[];
};

export type Profile = {
  name: string;
  title: string;
  bio: string;
  github: string;
  linkedin: string;
  email: string;
};

export const profile: Profile = {
  name: "Fernando Barbosa",
  title: "Software Engineer",
  bio: "I am a developer with many years of experience developing scalable, high-impact solutions.",
  github: "https://github.com/fernandoobarbosa",
  linkedin: "https://www.linkedin.com/in/fernando-barbosa-a790771b8/",
  email: "fernandobarbosa1697@gmail.com",
};

export const projects: Project[] = [
  {
    name: "ProjectStack",
    url: "https://github.com/Shikhar-Shetty/ProjectStack",
    description:
      "A modern full-stack website built with Next.js, TypeScript, and CI/CD via GitHub Actions.",
    language: "TypeScript",
    stars: 4,
    contributions: [
      {
        title: "chore: Implement pull request template",
        url: "https://github.com/Shikhar-Shetty/ProjectStack/pull/19",
      },
      {
        title: "docs: Improve documentation",
        url: "https://github.com/Shikhar-Shetty/ProjectStack/pull/20",
      },
    ],
  },
  {
    name: "bitbucket-automatic-pr-reviewer",
    url: "https://github.com/TinTinWinata/bitbucket-automatic-pr-reviewer",
    description:
      "Automated PR reviews using Claude CLI with Bitbucket webhooks.",
    language: "JavaScript",
    stars: 4,
    contributions: [
      {
        title: "Implement ESLint, Prettier, and Husky pre-commit hooks",
        url: "https://github.com/TinTinWinata/bitbucket-automatic-pr-reviewer/pull/28",
      },
      {
        title:
          "Implement Winston Logging with Daily Rotation and Console Logging",
        url: "https://github.com/TinTinWinata/bitbucket-automatic-pr-reviewer/pull/11",
      },
    ],
  },
  {
    name: "ob",
    url: "https://github.com/albertoboccolini/ob",
    description:
      "A tool that automatically syncs your Obsidian vault with a GitHub repository.",
    language: "Go",
    stars: 2,
    contributions: [
      {
        title: "CI/CD pipeline implementation",
        url: "https://github.com/albertoboccolini/ob",
      },
    ],
  },
  {
    name: "RBAC",
    url: "https://github.com/OPCODE-Open-Spring-Fest/RBAC",
    description:
      "An extendable Role-Based Access Control (RBAC) authentication system with JWT, built under Opcode, IIIT Bhagalpur.",
    language: "JavaScript",
    stars: 0,
    contributions: [
      {
        title: "Setup initial project folder structure and lint",
        url: "https://github.com/OPCODE-Open-Spring-Fest/RBAC/pull/8",
      },
    ],
  },
];
```

- [ ] **Step 4: Run the type checker and confirm it passes**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npx tsc --noEmit
```
Expected: no output, exit code 0.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add content.ts
git commit -m "feat: add profile and project content data"
```

---

### Task 3: Design tokens and global styles

**Files:**
- Modify: `portfolio/app/globals.css`

**Interfaces:**
- Produces: Tailwind utility classes `bg-background`, `text-foreground`, `text-accent`, `border-accent`, `border-border` (and their `/NN` opacity variants, e.g. `text-foreground/70`) available to every component.

- [ ] **Step 1: Replace `globals.css` contents**

```css
@import "tailwindcss";

@theme {
  --color-background: #0a0a0a;
  --color-foreground: #ededed;
  --color-accent: #38bdf8;
  --color-border: #262626;
}

body {
  background: var(--color-background);
  color: var(--color-foreground);
}
```

- [ ] **Step 2: Verify the build still succeeds**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add app/globals.css
git commit -m "style: add dark theme design tokens"
```

---

### Task 4: Root layout — fonts, metadata, base page shell

**Files:**
- Modify: `portfolio/app/layout.tsx`

**Interfaces:**
- Consumes: nothing from prior tasks (uses Tailwind classes from Task 3).
- Produces: the `<html>`/`<body>` shell every page (currently just `page.tsx`) renders inside, with `bg-background text-foreground` applied and Geist fonts available as CSS variables `--font-geist-sans` / `--font-geist-mono`.

- [ ] **Step 1: Replace `layout.tsx` contents**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fernando Barbosa — Software Engineer",
  description:
    "Portfolio of Fernando Barbosa, Software Engineer — open-source contributions and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify the build succeeds**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add app/layout.tsx
git commit -m "feat: configure root layout with fonts and metadata"
```

---

### Task 5: Hero component

**Files:**
- Create: `portfolio/components/Hero.tsx`

**Interfaces:**
- Consumes: `profile` from `@/content` (fields: `name`, `title`, `bio`, `github`, `linkedin`, `email`).
- Produces: default-exported `Hero` component, no props, `id="hero"`.

- [ ] **Step 1: Create `components/Hero.tsx`**

```tsx
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content";

export default function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-[80vh] flex-col justify-center gap-6 px-6 py-24 md:px-12"
    >
      <p className="font-mono text-sm text-accent">Hi, my name is</p>
      <h1 className="font-mono text-4xl font-bold tracking-tight md:text-6xl">
        {profile.name}
      </h1>
      <h2 className="text-2xl font-medium text-foreground/70 md:text-3xl">
        {profile.title}
      </h2>
      <p className="max-w-xl text-base text-foreground/60 md:text-lg">
        {profile.bio}
      </p>
      <div className="flex gap-4 pt-4">
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="rounded-md border border-border p-3 transition-colors hover:border-accent hover:text-accent"
        >
          <Github size={20} />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="rounded-md border border-border p-3 transition-colors hover:border-accent hover:text-accent"
        >
          <Linkedin size={20} />
        </a>
        <a
          href={`mailto:${profile.email}`}
          aria-label="Email"
          className="rounded-md border border-border p-3 transition-colors hover:border-accent hover:text-accent"
        >
          <Mail size={20} />
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Temporarily render it in `page.tsx` to verify**

Replace `portfolio/app/page.tsx` contents with:
```tsx
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

- [ ] **Step 3: Run the dev server and visually confirm**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run dev
```
Open `http://localhost:3000` in a browser. Confirm: dark background, name and title in large mono/sans type, bio text, three icon buttons (GitHub/LinkedIn/Mail) that highlight in accent blue on hover and open the correct destinations. Stop the server (Ctrl+C) when done.

- [ ] **Step 4: Run a full build to confirm no type/build errors**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add components/Hero.tsx app/page.tsx
git commit -m "feat: add Hero section"
```

---

### Task 6: About component

**Files:**
- Create: `portfolio/components/About.tsx`
- Modify: `portfolio/app/page.tsx`

**Interfaces:**
- Consumes: `profile.bio` from `@/content`.
- Produces: default-exported `About` component, no props, `id="about"`.

- [ ] **Step 1: Create `components/About.tsx`**

```tsx
import { profile } from "@/content";

export default function About() {
  return (
    <section id="about" className="border-t border-border px-6 py-24 md:px-12">
      <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-accent">
        01. About
      </h2>
      <p className="max-w-2xl text-lg leading-relaxed text-foreground/80 md:text-xl">
        {profile.bio}
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Add it to `page.tsx`**

```tsx
import Hero from "@/components/Hero";
import About from "@/components/About";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
    </main>
  );
}
```

- [ ] **Step 3: Visually verify**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run dev
```
Open `http://localhost:3000`, scroll down. Confirm an "01. About" section appears below Hero with a top border separating it, in accent-colored mono uppercase label followed by the bio paragraph. Stop the server when done.

- [ ] **Step 4: Run a full build**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add components/About.tsx app/page.tsx
git commit -m "feat: add About section"
```

---

### Task 7: ProjectCard and Projects components

**Files:**
- Create: `portfolio/components/ProjectCard.tsx`
- Create: `portfolio/components/Projects.tsx`
- Modify: `portfolio/app/page.tsx`

**Interfaces:**
- Consumes: `projects` from `@/content` (in `Projects.tsx`); `Project` type and a `project: Project` prop (in `ProjectCard.tsx`).
- Produces: default-exported `ProjectCard({ project: Project })` and default-exported `Projects()` (no props, `id="projects"`), rendering one `ProjectCard` per entry in `projects`.

- [ ] **Step 1: Create `components/ProjectCard.tsx`**

```tsx
import { ExternalLink, Star } from "lucide-react";
import type { Project } from "@/content";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-lg border border-border p-6 transition-colors hover:border-accent">
      <div className="flex items-start justify-between gap-4">
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-lg font-semibold hover:text-accent"
        >
          {project.name}
        </a>
        <div className="flex items-center gap-1 text-sm text-foreground/50">
          <Star size={14} />
          {project.stars}
        </div>
      </div>
      <p className="mt-3 text-sm text-foreground/60">{project.description}</p>
      <span className="mt-4 inline-block rounded-full border border-border px-3 py-1 font-mono text-xs text-foreground/60">
        {project.language}
      </span>
      <ul className="mt-5 flex flex-col gap-2 border-t border-border pt-4">
        {project.contributions.map((contribution) => (
          <li key={contribution.url + contribution.title}>
            <a
              href={contribution.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-foreground/70 hover:text-accent"
            >
              <ExternalLink size={14} />
              {contribution.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Create `components/Projects.tsx`**

```tsx
import { projects } from "@/content";
import ProjectCard from "@/components/ProjectCard";

export default function Projects() {
  return (
    <section
      id="projects"
      className="border-t border-border px-6 py-24 md:px-12"
    >
      <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-accent">
        02. Projects & Contributions
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

- [ ] **Step 3: Add `Projects` to `page.tsx`**

```tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
    </main>
  );
}
```

- [ ] **Step 4: Visually verify**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run dev
```
Open `http://localhost:3000`, scroll to Projects. Confirm 4 cards render (ProjectStack, bitbucket-automatic-pr-reviewer, ob, RBAC) in a 2-column grid on desktop / 1-column on mobile width, each with name, star count, description, language badge, and its listed contribution links; hovering a card border turns accent blue; all links point to the correct GitHub URLs. Stop the server when done.

- [ ] **Step 5: Run a full build**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 6: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add components/ProjectCard.tsx components/Projects.tsx app/page.tsx
git commit -m "feat: add Projects section with contribution cards"
```

---

### Task 8: Contact and Footer components

**Files:**
- Create: `portfolio/components/Contact.tsx`
- Create: `portfolio/components/Footer.tsx`
- Modify: `portfolio/app/page.tsx`

**Interfaces:**
- Consumes: `profile` from `@/content` (in `Contact.tsx`).
- Produces: default-exported `Contact` (no props, `id="contact"`) and default-exported `Footer` (no props).

- [ ] **Step 1: Create `components/Contact.tsx`**

```tsx
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content";

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-border px-6 py-24 md:px-12"
    >
      <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-accent">
        03. Contact
      </h2>
      <p className="max-w-xl text-foreground/60">
        Feel free to reach out through any of the channels below.
      </p>
      <div className="mt-8 flex flex-col gap-4 font-mono text-sm md:flex-row md:gap-8">
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-accent"
        >
          <Github size={16} /> GitHub
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-accent"
        >
          <Linkedin size={16} /> LinkedIn
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center gap-2 hover:text-accent"
        >
          <Mail size={16} /> {profile.email}
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 md:px-12">
      <p className="font-mono text-xs text-foreground/40">
        Built with Next.js, deployed on Vercel.
      </p>
    </footer>
  );
}
```

- [ ] **Step 3: Add both to `page.tsx`**

```tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 4: Visually verify**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run dev
```
Open `http://localhost:3000`, scroll to the bottom. Confirm the "03. Contact" section shows GitHub/LinkedIn/Email links with icons that turn accent blue on hover, and a small footer line below it. Stop the server when done.

- [ ] **Step 5: Run a full build**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 6: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add components/Contact.tsx components/Footer.tsx app/page.tsx
git commit -m "feat: add Contact section and footer"
```

---

### Task 9: In-page navigation, final responsive check, and README

**Files:**
- Create: `portfolio/components/Nav.tsx`
- Modify: `portfolio/app/page.tsx`
- Modify: `portfolio/README.md`

**Interfaces:**
- Consumes: nothing (static anchor links to `#hero`, `#about`, `#projects`, `#contact`, defined as `id` attributes in Tasks 5–8).
- Produces: default-exported `Nav` component, no props, fixed to the top of the page.

- [ ] **Step 1: Create `components/Nav.tsx`**

```tsx
const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex justify-end gap-6 border-b border-border bg-background/80 px-6 py-4 font-mono text-sm backdrop-blur-sm md:px-12">
      {links.map((link) => (
        <a key={link.href} href={link.href} className="hover:text-accent">
          {link.label}
        </a>
      ))}
    </header>
  );
}
```

- [ ] **Step 2: Add `Nav` to `page.tsx`**

```tsx
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Visually verify the full page and responsive behavior**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run dev
```
Open `http://localhost:3000`. Confirm: a fixed translucent nav bar with "About / Projects / Contact" links that scroll to the right sections; resize the browser to a narrow (mobile) width and confirm the Projects grid collapses to one column and no horizontal scrollbar appears anywhere on the page. Stop the server when done.

- [ ] **Step 4: Write `README.md`**

Replace `portfolio/README.md` contents with:
```markdown
# Fernando Barbosa — Portfolio

A fast, static portfolio built with Next.js (static export), Tailwind CSS, and TypeScript.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

Static output is generated in `out/`.

## Content

All personal info and project/contribution data lives in `content.ts`. Edit that file to update the site — no other files need to change for content updates.

## Deployment

Push this repository to GitHub, then import it in Vercel. Vercel auto-detects the Next.js static export and serves `out/` — no extra configuration is required.
```

- [ ] **Step 5: Run the final build**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
npm run build
```
Expected: `Compiled successfully`, `out/index.html` present.

- [ ] **Step 6: Commit**

```bash
cd "/c/Users/Fernando Barbosa/Documents/portfolio"
git add components/Nav.tsx app/page.tsx README.md
git commit -m "feat: add in-page navigation and project README"
```
