import { Upload, ClipboardList, Trophy } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload",
    description: "Drag your PDF/DOCX resume onto our secure dashboard.",
  },
  {
    icon: ClipboardList,
    number: "02",
    title: "Match",
    description: "Paste the Job Description of the role you want.",
  },
  {
    icon: Trophy,
    number: "03",
    title: "Win",
    description: "Get your score and a list of specific fixes to get shortlisted.",
  },
];

const HowItWorks = () => {
  const ref = useScrollAnimation();

  return (
    <section id="how-it-works" className="py-24 bg-grid">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-foreground mb-4">
          How It Works
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-md mx-auto">
          Three simple steps to a recruiter-ready resume.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
          {/* Connecting line (desktop) — gradient */}
          <div className="hidden md:block absolute top-14 left-[17%] right-[17%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />

          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-primary flex items-center justify-center relative z-10 shadow-md">
                <step.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xs font-bold text-primary tracking-widest">{step.number}</span>
              <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
