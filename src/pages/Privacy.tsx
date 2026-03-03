import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
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

        <h1 className="text-3xl font-extrabold text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">Last updated: March 3, 2026</p>

        <h2 className="text-foreground">1. Information We Collect</h2>
        <p className="text-muted-foreground">When you sign up for ShortlistAI, we collect your name, mobile number, email address, college name, academic year, and branch. When you use our services, we collect the resumes you upload and any job descriptions you provide.</p>

        <h2 className="text-foreground">2. How We Use Your Information</h2>
        <p className="text-muted-foreground">We use your information to provide our ATS analysis services, maintain your account, store your resume analysis history, and improve our services. We do not sell your personal data to third parties.</p>

        <h2 className="text-foreground">3. Data Storage & Security</h2>
        <p className="text-muted-foreground">Your data is stored securely using industry-standard encryption. Resumes are stored in secure cloud storage accessible only to your account. We implement appropriate security measures to protect against unauthorized access.</p>

        <h2 className="text-foreground">4. AI Processing</h2>
        <p className="text-muted-foreground">Your resume content is processed by AI models to generate ATS scores and improvement suggestions. This processing is done in real-time and the content is not used to train AI models.</p>

        <h2 className="text-foreground">5. Data Retention</h2>
        <p className="text-muted-foreground">We retain your account data and resume history for as long as your account is active. You may request deletion of your data at any time by contacting us.</p>

        <h2 className="text-foreground">6. Your Rights</h2>
        <p className="text-muted-foreground">You have the right to access, correct, or delete your personal data. You may also request a copy of your data in a portable format.</p>

        <h2 className="text-foreground">7. Contact Us</h2>
        <p className="text-muted-foreground">
          If you have questions about this Privacy Policy, contact us at:<br />
          Phone: <a href="tel:9337709699" className="text-primary">9337709699</a><br />
          Email: <a href="mailto:support@shortlistai.in" className="text-primary">support@shortlistai.in</a>
        </p>
      </main>
    </div>
  );
};

export default Privacy;
