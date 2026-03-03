import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import ProblemSolution from "@/components/landing/ProblemSolution";
import Benefits from "@/components/landing/Benefits";
import HowItWorks from "@/components/landing/HowItWorks";
import Demo from "@/components/landing/Demo";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InlineCTA = ({ text = "Analyze My Resume Now" }: { text?: string }) => {
  const navigate = useNavigate();
  return (
    <div className="py-10 text-center bg-background">
      <Button
        size="lg"
        className="rounded-full px-8 font-semibold text-base gap-2"
        onClick={() => navigate("/analyze")}
      >
        {text} <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <ProblemSolution />
        <InlineCTA />
        <Benefits />
        <HowItWorks />
        <Demo />
        <InlineCTA text="Check ATS Score Free" />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
