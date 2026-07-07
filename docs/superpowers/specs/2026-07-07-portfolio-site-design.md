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
  stars?: number;
  contributions: Contribution[];
};

type Profile = {
  name: string;
  title: string;
  bio: string;
  github: string;
  linkedin: string;
  email: string;
};

// skills: string[] — flat list of technology names shown as badges
```

## Confirmed Content

**Profile**
- Name: Fernando Barbosa
- Title: Software Engineer
- Bio: "I am a developer with many years of experience developing scalable, high-impact solutions."
- GitHub: https://github.com/fernandoobarbosa
- LinkedIn: https://www.linkedin.com/in/fernando-barbosa-a790771b8/
- Email: fernandobarbosa1697@gmail.com

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

1. **Hero** — name, "Software Engineer", bio, contact icon-links (GitHub/LinkedIn/Email).
2. **About** — expanded bio paragraph.
3. **Skills** — badges for each technology (Node.js, TypeScript, Go, React, Java, Docker), same badge style as the project-card language tags.
4. **Projects** — grid of project cards (one per repo). Each card shows repo name, description, language badge, star count, repo link, and a nested list of the specific contributions (title + link) for that repo.
5. **Contact** — footer-style repeat of contact links.

## Visual Design

- Near-black background (`#0a0a0a`), off-white text, one accent color (electric blue or lime green) used sparingly for links/hover states.
- Geist Sans for body text, Geist Mono for name/labels/technical bits (terminal-like feel).
- Cards: 1px subtle border, border brightens to accent color on hover. No heavy shadows, no glassmorphism.
- Fixed dark theme (no light/dark toggle — out of scope).

## Non-Goals

- No CMS or GitHub API fetching (manual content only, per decision).
- No blog, no additional sections beyond Hero/About/Skills/Projects/Contact.
- No light theme / theme toggle.
- No client-side routing beyond the single page (may add simple in-page anchor nav).

## Deployment

- Static export, deployed to Vercel from a Git repository (GitHub).
