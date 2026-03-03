import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => (
  <section className="py-24 bg-primary relative overflow-hidden">
    {/* Subtle texture overlay */}
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-60" />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h2 className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-4">
        Ready to stop getting rejected?
      </h2>
      <p className="text-primary-foreground/80 text-lg mb-4">
        Join 500+ Indian students who have fixed their resumes this week.
      </p>
      <p className="text-primary-foreground/60 text-sm mb-8">
        Your first scan is free. No credit card required.
      </p>
      <Button
        size="lg"
        className="rounded-full px-10 font-semibold text-base bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 group"
      >
        Get My ATS Score for ₹0 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  </section>
);

export default FinalCTA;
