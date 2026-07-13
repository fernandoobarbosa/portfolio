"use client";

import { profile } from "@/content";
import { useLocale, useTranslation } from "@/components/LocaleProvider";

export default function About() {
  const { locale } = useLocale();
  const t = useTranslation();

  return (
    <section id="about" className="border-t border-border px-6 py-24 md:px-12">
      <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-accent">
        {t.about.heading}
      </h2>
      <p className="max-w-2xl text-lg leading-relaxed text-foreground/80 md:text-xl">
        {profile.bio[locale]}
      </p>
    </section>
  );
}
