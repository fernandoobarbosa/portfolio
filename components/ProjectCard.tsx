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
