import { projects } from "@/content";
import ProjectCard from "@/components/ProjectCard";

export default function Projects() {
  return (
    <section
      id="projects"
      className="border-t border-border px-6 py-24 md:px-12"
    >
      <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-accent">
        03. Projects & Contributions
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.url} project={project} />
        ))}
      </div>
    </section>
  );
}
