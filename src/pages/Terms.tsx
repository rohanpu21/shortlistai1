import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <a href="/" className="text-xl font-extrabold text-primary tracking-tight">ShortlistAI</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 prose prose-sm">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 mb-6 no-underline">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <h1 className="text-3xl font-extrabold text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground text-sm">Last updated: March 3, 2026</p>

        <h2 className="text-foreground">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground">By accessing or using ShortlistAI, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

        <h2 className="text-foreground">2. Services</h2>
        <p className="text-muted-foreground">ShortlistAI provides AI-powered resume analysis and ATS score optimization for job seekers, primarily targeting Indian freshers and students. Our services include resume scanning, keyword gap analysis, formatting checks, and improvement suggestions.</p>

        <h2 className="text-foreground">3. User Accounts</h2>
        <p className="text-muted-foreground">You must create an account to use our services. You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration.</p>

        <h2 className="text-foreground">4. Free & Paid Plans</h2>
        <p className="text-muted-foreground">ShortlistAI offers a free plan with basic ATS scoring and formatting checks. The Pro plan (₹99 per analysis) includes full keyword analysis, bullet point rewrites, and ATS-optimized templates. Pricing is subject to change with prior notice.</p>

        <h2 className="text-foreground">5. Refund Policy</h2>
        <p className="text-muted-foreground">If your ATS score does not improve after implementing our suggested changes, you are eligible for a full refund of your ₹99 Pro analysis fee. Refund requests must be made within 7 days of purchase.</p>

        <h2 className="text-foreground">6. Limitation of Liability</h2>
        <p className="text-muted-foreground">ShortlistAI provides suggestions and analysis based on AI models. We do not guarantee job placements or interview calls. Our analysis is advisory in nature and should be used as a guide to improve your resume.</p>

        <h2 className="text-foreground">7. Intellectual Property</h2>
        <p className="text-muted-foreground">You retain ownership of your resume content. By uploading your resume, you grant ShortlistAI a limited license to process it for analysis purposes only.</p>

        <h2 className="text-foreground">8. Termination</h2>
        <p className="text-muted-foreground">We reserve the right to suspend or terminate accounts that violate these terms or engage in abusive behavior.</p>

        <h2 className="text-foreground">9. Contact</h2>
        <p className="text-muted-foreground">
          For questions about these Terms, contact us at:<br />
          Phone: <a href="tel:9337709699" className="text-primary">9337709699</a><br />
          Email: <a href="mailto:support@shortlistai.in" className="text-primary">support@shortlistai.in</a>
        </p>
      </main>
    </div>
  );
};

export default Terms;
