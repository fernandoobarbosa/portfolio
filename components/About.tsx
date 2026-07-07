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
