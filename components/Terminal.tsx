import { achievements, profile } from "@/content";

export default function Terminal() {
  return (
    <section className="border-t border-border px-6 py-16 md:px-12">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span
            className="h-3 w-3 rounded-full bg-foreground/20"
            aria-hidden="true"
          />
          <span
            className="h-3 w-3 rounded-full bg-foreground/20"
            aria-hidden="true"
          />
          <span
            className="h-3 w-3 rounded-full bg-foreground/20"
            aria-hidden="true"
          />
        </div>
        <div className="space-y-4 p-6 font-mono text-sm leading-relaxed">
          <div>
            <p className="text-accent">$ whoami</p>
            <p className="text-foreground/70">
              {profile.name.toLowerCase().replace(" ", "-")} —{" "}
              {profile.title.toLowerCase()}
            </p>
          </div>
          <div>
            <p className="text-accent">$ cat achievements.log</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {achievements.map((achievement) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={achievement.name}
                  src={achievement.imageUrl}
                  alt={`GitHub achievement: ${achievement.name}`}
                  title={achievement.name}
                  width={40}
                  height={40}
                  className="rounded"
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-accent">$ pokedex --trainer</p>
            <p className="text-foreground/70">
              Type: Backend/DevOps ⚡ · Region: {profile.location} 🇧🇷
            </p>
          </div>
          <p className="text-accent">
            ${" "}
            <span
              className="inline-block h-4 w-2 translate-y-0.5 bg-accent animate-blink"
              aria-hidden="true"
            />
          </p>
        </div>
      </div>
    </section>
  );
}
