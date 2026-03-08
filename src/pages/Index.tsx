import { lazy, Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SocialProof = lazy(() => import("@/components/landing/SocialProof"));
const ProblemSolution = lazy(() => import("@/components/landing/ProblemSolution"));
const Benefits = lazy(() => import("@/components/landing/Benefits"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const Demo = lazy(() => import("@/components/landing/Demo"));
const Pricing = lazy(() => import("@/components/landing/Pricing"));
const FAQ = lazy(() => import("@/components/landing/FAQ"));
const FinalCTA = lazy(() => import("@/components/landing/FinalCTA"));
const Footer = lazy(() => import("@/components/landing/Footer"));

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
        <Suspense fallback={null}>
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
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
