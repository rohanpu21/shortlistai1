import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const tiers = [
  {
    name: "Free",
    price: "₹0",
    description: "Try it out, no strings attached.",
    features: ["Basic ATS Score", "Formatting Check"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹99",
    description: "Best for Placement Season",
    features: [
      "Full Keyword List",
      "5 Bullet Point Rewrites",
      "ATS Optimized Template",
      "Everything in Free",
    ],
    cta: "Get Pro Access",
    highlighted: true,
    badge: "Best for Placement Season",
  },
  {
    name: "Elite",
    price: "₹299",
    description: "The full career toolkit.",
    features: [
      "Everything in Pro",
      "LinkedIn Profile Audit",
      "1-on-1 AI Interview Prep",
    ],
    cta: "Go Elite",
    highlighted: false,
  },
];

const Pricing = () => {
  const ref = useScrollAnimation();

  return (
    <section id="pricing" className="py-24 bg-grid">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-foreground mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-md mx-auto">
          First analysis is free. No subscriptions, no hidden fees.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-8 relative transition-all duration-300 ${
                tier.highlighted
                  ? "border-primary bg-card shadow-xl scale-[1.04] ring-2 ring-primary/20"
                  : "border-border bg-card hover:shadow-md"
              }`}
            >
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-xs shadow-sm">
                  {tier.badge}
                </Badge>
              )}
              <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
              <div className="mt-2 mb-1">
                <span className="text-4xl font-extrabold text-foreground">{tier.price}</span>
                {tier.price !== "₹0" && (
                  <span className="text-sm text-muted-foreground ml-1">/ analysis</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`rounded-full w-full font-semibold ${
                  tier.highlighted ? "" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                variant={tier.highlighted ? "default" : "secondary"}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-10 text-sm">
          Still unsure?{" "}
          <button
            onClick={() => document.querySelector("#faq")?.scrollIntoView({ behavior: "smooth" })}
            className="text-primary font-semibold hover:underline"
          >
            Try it free first →
          </button>
        </p>
      </div>
    </section>
  );
};

export default Pricing;
