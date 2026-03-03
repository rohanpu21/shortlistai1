import { XCircle, CheckCircle } from "lucide-react";

const oldWay = [
  "Applying to 50 jobs with the same generic PDF.",
  "Getting 'Ghosted' by companies like Infosys/Wipro.",
  "Wondering why your 8.5 CGPA isn't enough.",
];

const newWay = [
  "Customizing keywords for every single job application.",
  "Passing the ATS \"Robot\" filter 100% of the time.",
  "Walking into interviews with total confidence.",
];

const ProblemSolution = () => (
  <section className="py-20 bg-grid">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-foreground mb-4">
        Stop Guessing, Start Getting Interview Calls
      </h2>
      <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
        See how ShortlistAI changes the game for freshers.
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Old Way */}
        <div className="rounded-2xl border border-destructive/20 bg-card p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-destructive mb-6">
            ✗ The Old Way
          </p>
          <ul className="space-y-4">
            {oldWay.map((item) => (
              <li key={item} className="flex gap-3 items-start">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* New Way */}
        <div className="rounded-2xl border border-accent/20 bg-card p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-6">
            ✓ The ShortlistAI Way
          </p>
          <ul className="space-y-4">
            {newWay.map((item) => (
              <li key={item} className="flex gap-3 items-start">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default ProblemSolution;
