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
