import { skills } from "@/content";

export default function Skills() {
  return (
    <section id="skills" className="border-t border-border px-6 py-24 md:px-12">
      <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-accent">
        02. Skills
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
