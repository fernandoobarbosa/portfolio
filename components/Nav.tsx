const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex justify-end gap-6 border-b border-border bg-background/80 px-6 py-4 font-mono text-sm backdrop-blur-sm md:px-12">
      {links.map((link) => (
        <a key={link.href} href={link.href} className="hover:text-accent">
          {link.label}
        </a>
      ))}
    </header>
  );
}
