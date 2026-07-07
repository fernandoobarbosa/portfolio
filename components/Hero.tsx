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
          const label =
            project.stars > 0
              ? `${project.stars} star${project.stars > 1 ? "s" : ""}`
              : `${project.contributions.length} PR${
                  project.contributions.length > 1 ? "s" : ""
                } merged`;
          const display =
            project.stars > 0 ? `${project.stars}★` : label;
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
