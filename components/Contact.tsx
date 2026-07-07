import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { profile } from "@/content";

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-border px-6 py-24 md:px-12"
    >
      <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-accent">
        04. Contact
      </h2>
      <p className="max-w-xl text-foreground/60">
        Feel free to reach out through any of the channels below.
      </p>
      <div className="mt-8 flex flex-col gap-4 font-mono text-sm md:flex-row md:gap-8">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-accent"
        >
          <GithubIcon size={16} /> GitHub
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-accent"
        >
          <LinkedinIcon size={16} /> LinkedIn
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center gap-2 hover:text-accent"
        >
          <Mail size={16} aria-hidden="true" /> {profile.email}
        </a>
      </div>
    </section>
  );
}
