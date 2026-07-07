# Portfolio Site — Design Spec

## Goal

A fast, lightweight, visually polished personal portfolio for Fernando Barbosa (Software Engineer), showcasing curated open-source contributions. Deployed on Vercel.

## Stack

- **Next.js 15 (App Router)**, static export (`output: 'export'`) — no server runtime, pure static HTML/CSS/JS served from Vercel's CDN.
- **TypeScript**
- **Tailwind CSS** for styling (utility classes, no runtime CSS-in-JS cost)
- **Geist Sans + Geist Mono** via `next/font` (self-hosted, no external font requests, matches the dark/tech aesthetic)
- **lucide-react** for generic icons (Mail, Star, ExternalLink), tree-shakeable. The installed version doesn't ship brand/logo icons, so GitHub and LinkedIn glyphs are small hand-written inline SVGs in `components/icons.tsx` instead.
- No animation library — CSS transitions only, respecting `prefers-reduced-motion`
- Content (profile + projects/contributions) lives in a single typed `content.ts` file, not fetched from any API. Manual curation, matching the current scope (a handful of hand-picked contributions).

## Folder Structure

```
portfolio/
  app/
    layout.tsx       # fonts, metadata, fixed dark theme
    page.tsx         # composes sections
    globals.css
  components/
    Hero.tsx
    Terminal.tsx      # NEW (v2): terminal-styled achievements/pokedex easter egg
    About.tsx
    Skills.tsx
    Projects.tsx
    ProjectCard.tsx
    Contact.tsx
    Footer.tsx
  content.ts          # profile data + contributions list
  next.config.ts       # output: 'export'
```

## Content Model (`content.ts`)

```ts
type Contribution = {
  title: string;        // e.g. "chore: Implement pull request template"
  url: string;           // PR link, or repo link if no specific PR
  description?: string;  // optional one-liner if the PR title needs context
};

type Project = {
  name: string;
  url: string;                // repo URL
  description: string;        // repo's own GitHub description
  language: string;           // primary language, shown as a badge
  stars: number;              // required — Hero's proof-of-work line branches on `stars > 0`
  contributions: Contribution[];
};

type Profile = {
  name: string;
  title: string;
  bio: string;
  github: string;
  linkedin: string;
  email: string;
  location: string;    // NEW (v2): e.g. "Brazil"
  timezone: string;    // NEW (v2): e.g. "UTC-3"
};

type Achievement = {   // NEW (v2)
  name: string;         // e.g. "Pull Shark"
  imageUrl: string;     // official GitHub achievement badge image URL
};

// skills: string[] — flat list of technology names shown as badges
// achievements: Achievement[] — NEW (v2), real badges from the user's GitHub profile
```

## Confirmed Content

**Profile**
- Name: Fernando Barbosa
- Title: Software Engineer
- Bio (v2 rewrite, replaces the old placeholder bio, based on the user's real GitHub profile README — used by both Hero and About, same as v1's architecture): "Back-end developer with 5+ years of experience building scalable systems in Node.js and TypeScript — microservices architecture, Express APIs, and message-driven systems with RabbitMQ. Beyond my day-to-day work, I contribute to open source: 6 merged contributions across 4 public repositories, from CI/CD pipelines to logging infrastructure and code-quality tooling."
- GitHub: https://github.com/fernandoobarbosa
- LinkedIn: https://www.linkedin.com/in/fernando-barbosa-a790771b8/
- Email: fernandobarbosa1697@gmail.com
- Location: Brazil (🇧🇷) — NEW (v2)
- Timezone: UTC-3 — NEW (v2)

**GitHub Achievements (v2, real badges confirmed present on github.com/fernandoobarbosa)**
- YOLO — `https://github.githubassets.com/assets/yolo-default-be0bbff04951.png`
- Pull Shark — `https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png`
- Quickdraw — `https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png`

**Skills**
- Node.js, TypeScript, JavaScript, Go, React, Java, Docker

**Projects & Contributions**

1. **ProjectStack** (`Shikhar-Shetty/ProjectStack`) — "A modern full-stack website built with Next.js, TypeScript, and CI/CD via GitHub Actions." · TypeScript · 4 stars
   - PR #19 — "chore: Implement pull request template" (merged)
   - PR #20 — "docs: Improve documentation" (merged)

2. **bitbucket-automatic-pr-reviewer** (`TinTinWinata/bitbucket-automatic-pr-reviewer`) — "Automated PR reviews using Claude CLI with Bitbucket webhooks." · JavaScript · 4 stars
   - PR #28 — "Implement ESLint, Prettier, and Husky pre-commit hooks" (merged, +2417/-121)
   - PR #11 — "Implement Winston Logging with Daily Rotation and Console Logging" (merged, +722/-74)

3. **ob** (`albertoboccolini/ob`) — "A tool that automatically syncs your Obsidian vault with a GitHub repository." · Go · 2 stars
   - Contribution: CI/CD pipeline implementation (no specific PR link available — link to repo)

4. **RBAC** (`OPCODE-Open-Spring-Fest/RBAC`) — "An extendable Role-Based Access Control (RBAC) authentication system with JWT... Built under Opcode, IIIT Bhagalpur." · JavaScript · 0 stars
   - PR #8 — "Setup initial project folder structure and lint" (merged, +1012/-60)

## Page Sections

1. **Hero** — status badge (`● OPEN TO REMOTE ROLES · 🇧🇷 BRAZIL · UTC-3`, pulsing accent dot), name, "Software Engineer" title, bio, inline tech-stack line, three CTA buttons (Email me / GitHub / LinkedIn — filled + outlined styles), and a "proof of work" stats line built from real `projects` data (e.g. `ProjectStack 4★ · bitbucket-pr-reviewer 4★ · ob 2★ · RBAC 1 PR merged`).
2. **Terminal** (NEW v2) — a terminal-window-styled component directly below Hero: mac-style dot controls, monospace `$ whoami` / `$ cat achievements.log` / `$ pokedex --trainer` prompts, rendering the real GitHub achievement badges and a final "Type: Backend/DevOps ⚡ · Region: Brazil 🇧🇷" line (the Pokémon easter egg). Blinking cursor via CSS, respecting `prefers-reduced-motion`.
3. **About** — the v2 rewritten bio paragraph (see Confirmed Content above).
4. **Skills** — badges for each technology (Node.js, TypeScript, JavaScript, Go, React, Java, Docker), same badge style as the project-card language tags.
5. **Projects** — grid of project cards (one per repo). Each card shows repo name, description, language badge, star count, repo link, and a nested list of the specific contributions (title + link) for that repo.
6. **Contact** — footer-style repeat of contact links.

## Visual Design

- Near-black background (`#0a0a0a`), off-white text, **accent color: purple/violet `#a78bfa`** (v2 — replaces the original blue `#38bdf8`, changed because the user wanted a different palette from the johnenrique.tech reference site that inspired the v2 redesign).
- Geist Sans for body text, Geist Mono for name/labels/technical bits and the entire Terminal component (terminal-like feel, reinforced in v2 by the "more tech" request).
- Cards: 1px subtle border, border brightens to accent color on hover. No heavy shadows, no glassmorphism.
- Fixed dark theme (no light/dark toggle — out of scope).
- Favicon: `⚡` (lightning bolt) — doubles as a "fast/tech" signal and a subtle Pikachu nod (v2 Pokémon easter egg, kept deliberately understated per user's "subtle easter egg" choice).

## Non-Goals

- No CMS or GitHub API fetching for project/contribution data (manual content only, per decision). GitHub achievement badge images (v2) are an exception: they're static, stable, publicly-hosted image URLs on `github.githubassets.com`, hand-curated the same way as project data — not a runtime API call.
- No blog, no additional sections beyond Hero/Terminal/About/Skills/Projects/Contact.
- No light theme / theme toggle.
- No client-side routing beyond the single page (in-page anchor nav via `Nav.tsx`).
- No heavy Pokémon theming — v2's Pokémon reference is limited to the Terminal component's `pokedex` line and the favicon; no color/illustration theme change.
- No EN/PT language toggle (unlike the reference site) — out of scope for this redesign.

## Deployment

- Static export, deployed to Vercel from a Git repository (GitHub).
