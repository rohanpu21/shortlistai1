import { XCircle, CheckCircle, FileX, Ghost, HelpCircle, Target, ShieldCheck, Rocket } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const oldWay = [
  { icon: FileX, text: "Applying to 50 jobs with the same generic PDF." },
  { icon: Ghost, text: "Getting 'Ghosted' by companies like Infosys/Wipro." },
  { icon: HelpCircle, text: "Wondering why your 8.5 CGPA isn't enough." },
];

const newWay = [
  { icon: Target, text: "Customizing keywords for every single job application." },
  { icon: ShieldCheck, text: 'Passing the ATS "Robot" filter 100% of the time.' },
  { icon: Rocket, text: "Walking into interviews with total confidence." },
];

const ProblemSolution = () => {
  const { ref, className: scrollClass } = useScrollAnimation();

  return (
    <section className="py-24 bg-grid">
      <div ref={ref} className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${scrollClass}`}>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-foreground mb-4">
          Stop Guessing, Start Getting Interview Calls
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
          See how ShortlistAI changes the game for freshers.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Old Way */}
          <div className="rounded-2xl border border-destructive/20 bg-card p-8 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-destructive mb-6">
              ✗ The Old Way
            </p>
            <ul className="space-y-4">
              {oldWay.map((item) => (
                <li key={item.text} className="flex gap-3 items-start">
                  <item.icon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <span className="text-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* New Way */}
          <div className="rounded-2xl border-2 border-accent/30 bg-card p-8 shadow-lg ring-1 ring-accent/10">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-6">
              ✓ The ShortlistAI Way
            </p>
            <ul className="space-y-4">
              {newWay.map((item) => (
                <li key={item.text} className="flex gap-3 items-start">
                  <item.icon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
