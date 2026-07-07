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
  location: string;
  timezone: string;
};

export type Achievement = {
  name: string;
  imageUrl: string;
};

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

export const skills: string[] = [
  "Node.js",
  "TypeScript",
  "JavaScript",
  "Go",
  "React",
  "Java",
  "Docker",
];

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
