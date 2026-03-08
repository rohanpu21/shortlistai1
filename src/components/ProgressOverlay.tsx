import { useState, useEffect } from "react";
import { FileSearch, Cpu, BarChart3, Wand2, FileText, Download, CheckCircle } from "lucide-react";

const analyzeSteps = [
  { icon: FileSearch, label: "Extracting text from resume", duration: 3000 },
  { icon: Cpu, label: "Running ATS keyword scan", duration: 5000 },
  { icon: BarChart3, label: "Evaluating formatting & structure", duration: 4000 },
  { icon: CheckCircle, label: "Generating your ATS report", duration: 3000 },
];

const rewriteSteps = [
  { icon: FileSearch, label: "Reading your resume content", duration: 3000 },
  { icon: Cpu, label: "Applying ATS optimizations", duration: 6000 },
  { icon: Wand2, label: "Rewriting bullet points", duration: 5000 },
  { icon: FileText, label: "Structuring ATS-friendly layout", duration: 4000 },
  { icon: Download, label: "Generating downloadable PDF", duration: 3000 },
];

const funFacts = [
  "75% of resumes are rejected by ATS before a human sees them.",
  "Most ATS systems can't read text inside images or graphics.",
  "Using the right keywords can boost your ATS score by 40%.",
  "Single-column layouts perform best with ATS systems.",
  "Recruiters spend an average of 7 seconds scanning a resume.",
  "PDF format is the safest choice for ATS compatibility.",
  "Quantified achievements get 2x more recruiter attention.",
];

interface ProgressOverlayProps {
  mode: "analyze" | "rewrite";
}

const ProgressOverlay = ({ mode }: ProgressOverlayProps) => {
  const steps = mode === "analyze" ? analyzeSteps : rewriteSteps;
  const [activeStep, setActiveStep] = useState(0);
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * funFacts.length));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const pct = Math.min((elapsed / totalDuration) * 100, 95);
      setProgress(pct);

      let cumulative = 0;
      for (let i = 0; i < steps.length; i++) {
        cumulative += steps[i].duration;
        if (elapsed < cumulative) {
          setActiveStep(i);
          break;
        }
        if (i === steps.length - 1) setActiveStep(i);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [steps]);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 5000);
    return () => clearInterval(factInterval);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
          {mode === "analyze" ? "Analyzing Your Resume" : "Optimizing Your Resume"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {mode === "analyze" ? "Our AI is scanning every detail…" : "AI is rewriting for maximum ATS impact…"}
        </p>
      </div>

      {/* Progress bar */}
      <div className="max-w-md mx-auto">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right mt-1">{Math.round(progress)}%</p>
      </div>

      {/* Steps */}
      <div className="max-w-sm mx-auto space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === activeStep;
          const isDone = i < activeStep;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                isActive
                  ? "bg-primary/10 border border-primary/20 scale-[1.02]"
                  : isDone
                  ? "opacity-60"
                  : "opacity-30"
              }`}
            >
              <div className={`shrink-0 ${isActive ? "text-primary" : isDone ? "text-accent" : "text-muted-foreground"}`}>
                {isDone ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Icon className={`h-5 w-5 ${isActive ? "animate-pulse" : ""}`} />
                )}
              </div>
              <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
              {isActive && (
                <div className="ml-auto flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fun fact */}
      <div className="max-w-md mx-auto bg-card border border-border rounded-xl p-4 text-center">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Did you know?</p>
        <p className="text-sm text-muted-foreground transition-opacity duration-500">{funFacts[factIndex]}</p>
      </div>
    </div>
  );
};

export default ProgressOverlay;
