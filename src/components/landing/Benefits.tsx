import { Bot, Search, Pencil, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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

const Benefits = () => {
  const ref = useScrollAnimation();

  return (
    <section id="benefits" className="py-24 bg-card">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-foreground mb-4">
          Why Students Love ShortlistAI
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-lg mx-auto">
          Features tell, benefits sell. Here's what you actually get.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-background p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <b.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="rounded-full px-8 font-semibold gap-2"
            onClick={() => document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" })}
          >
            See How It Works <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
