"use client";

import { useLocale, useTranslation } from "@/components/LocaleProvider";

export default function Nav() {
  const { locale, setLocale } = useLocale();
  const t = useTranslation();

  const links = [
    { href: "#about", label: t.nav.about },
    { href: "#skills", label: t.nav.skills },
    { href: "#projects", label: t.nav.projects },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex flex-wrap items-center justify-end gap-4 gap-y-2 border-b border-border bg-background/80 px-6 py-4 font-mono text-sm backdrop-blur-sm md:px-12">
      {links.map((link) => (
        <a key={link.href} href={link.href} className="hover:text-accent">
          {link.label}
        </a>
      ))}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={locale === "en" ? "text-accent" : "hover:text-accent"}
        >
          EN
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() => setLocale("pt")}
          className={locale === "pt" ? "text-accent" : "hover:text-accent"}
        >
          PT
        </button>
      </div>
    </header>
  );
}
