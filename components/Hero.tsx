import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
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
          <GithubIcon size={20} />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="rounded-md border border-border p-3 transition-colors hover:border-accent hover:text-accent"
        >
          <LinkedinIcon size={20} />
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
