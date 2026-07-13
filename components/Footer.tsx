"use client";

import { useTranslation } from "@/components/LocaleProvider";

export default function Footer() {
  const t = useTranslation();

  return (
    <footer className="border-t border-border px-6 py-8 md:px-12">
      <p className="font-mono text-xs text-foreground/40">{t.footer.text}</p>
    </footer>
  );
}
