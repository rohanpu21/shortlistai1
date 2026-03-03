import { Play, Zap, Layout, BarChart3 } from "lucide-react";

const features = [
  { icon: Zap, text: "Real-time keyword matching" },
  { icon: Layout, text: "Formatting check (columns/tables)" },
  { icon: BarChart3, text: "Experience relevance scoring" },
];

const Demo = () => (
  <section className="py-20 bg-card">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-foreground mb-4">
        See It in Action
      </h2>
      <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
        Watch a 90-second walkthrough of the full analysis flow.
      </p>

      <div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
        {/* Video placeholder */}
        <div className="aspect-video rounded-2xl bg-muted border border-border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors group">
          <div className="h-16 w-16 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
            <Play className="h-7 w-7 text-primary ml-1" />
          </div>
        </div>

        {/* Feature bullets */}
        <div className="space-y-6">
          {features.map((f) => (
            <div key={f.text} className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{f.text}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Powered by AI that understands Indian hiring patterns.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Demo;
