import { Bot, Search, Pencil } from "lucide-react";

const benefits = [
  {
    icon: Bot,
    title: "Beat the Bot",
    description:
      "Our AI acts like a real HR manager to tell you exactly why you're being filtered out.",
  },
  {
    icon: Search,
    title: "Keyword Power-Up",
    description:
      "Don't just list skills. We tell you the exact missing words recruiters are searching for.",
  },
  {
    icon: Pencil,
    title: "Bullet Point Magic",
    description:
      "We rewrite your boring responsibilities into action-oriented achievements.",
  },
];

const Benefits = () => (
  <section id="benefits" className="py-20 bg-card">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-foreground mb-4">
        Why Students Love ShortlistAI
      </h2>
      <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
        Features tell, benefits sell. Here's what you actually get.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="rounded-2xl border border-border bg-background p-8 text-center hover:shadow-md transition-shadow"
          >
            <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <b.icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Benefits;
