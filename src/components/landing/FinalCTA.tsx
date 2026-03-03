import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => (
  <section className="py-20 bg-primary">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">
        Ready to stop getting rejected?
      </h2>
      <p className="text-primary-foreground/80 text-lg mb-8">
        Join 500+ Indian students who have fixed their resumes this week.
      </p>
      <Button
        size="lg"
        className="rounded-full px-10 font-semibold text-base bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2"
      >
        Get My ATS Score for ₹0 <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  </section>
);

export default FinalCTA;
