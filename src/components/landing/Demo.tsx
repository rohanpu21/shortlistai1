import { Play, Zap, Layout, BarChart3 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  { icon: Zap, title: "Real-time keyword matching", desc: "Instantly identifies missing keywords from the job description." },
  { icon: Layout, title: "Formatting check", desc: "Detects columns, tables, and other ATS-breaking layouts." },
  { icon: BarChart3, title: "Experience relevance scoring", desc: "Rates how well your experience matches the role requirements." },
];

const Demo = () => {
  const { ref, className: scrollClass } = useScrollAnimation();

  return (
    <section className="py-24 bg-card">
      <div ref={ref} className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${scrollClass}`}>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-foreground mb-4">
          See It in Action
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-md mx-auto">
          Watch a 90-second walkthrough of the full analysis flow.
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Video placeholder */}
          <div className="aspect-video rounded-2xl bg-muted border border-border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors group">
            <div className="h-20 w-20 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors animate-pulse-glow">
              <Play className="h-8 w-8 text-primary ml-1" />
            </div>
          </div>

          {/* Feature bullets */}
          <div className="space-y-8">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{f.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
