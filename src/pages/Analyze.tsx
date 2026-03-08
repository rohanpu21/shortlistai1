import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SpeedometerGauge from "@/components/SpeedometerGauge";
import { Upload, FileText, Loader2, ArrowLeft, CheckCircle, AlertTriangle, Lightbulb, ListChecks, User, Wand2, Coins } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { pdf } from "@react-pdf/renderer";
import ResumePDF, { type ResumeData } from "@/components/ResumePDF";
import { load } from "@cashfreepayments/cashfree-js";
import { useCredits } from "@/hooks/useCredits";
import ProgressOverlay from "@/components/ProgressOverlay";

interface AnalysisResult {
  ats_score: number;
  detected_domain?: string;
  summary: string;
  keyword_gaps: string[];
  formatting_issues: string[];
  rewrite_suggestions: string[];
  section_feedback: { section: string; feedback: string; rating: string }[];
}

/* ── Upload Form ── */
const UploadForm = ({
  file, jd, loading, onFileChange, onJdChange, onAnalyze,
}: {
  file: File | null; jd: string; loading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onJdChange: (v: string) => void; onAnalyze: () => void;
}) => (
  <div className="space-y-8">
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">Analyze Your Resume</h1>
      <p className="text-muted-foreground mt-2">Upload your resume and get a detailed ATS analysis powered by AI</p>
    </div>
    <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center bg-card hover:border-primary/50 transition-colors">
      <input type="file" accept=".pdf,.docx" onChange={onFileChange} className="hidden" id="resume-upload" />
      <label htmlFor="resume-upload" className="cursor-pointer">
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <FileText className="h-12 w-12 text-primary" />
            <p className="font-semibold text-foreground">{file.name}</p>
            <p className="text-sm text-muted-foreground">Click to change file</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <p className="font-semibold text-foreground">Drop your resume here or click to upload</p>
            <p className="text-sm text-muted-foreground">Supports PDF & DOCX</p>
          </div>
        )}
      </label>
    </div>
    <div>
      <label className="text-sm font-medium text-foreground mb-2 block">
        Job Description <span className="text-muted-foreground">(optional — for keyword matching)</span>
      </label>
      <Textarea value={jd} onChange={(e) => onJdChange(e.target.value)} placeholder="Paste the job description here for keyword matching..." className="min-h-[120px]" />
    </div>
    <Button onClick={onAnalyze} disabled={!file || loading} className="w-full rounded-full font-semibold text-base h-12 gap-2" size="lg">
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
      {loading ? "Analyzing..." : "Analyze My Resume"}
    </Button>
  </div>
);

/* ── Analysis Report ── */
const AnalysisReport = ({
  result, rewriting, onRewrite, onReset, credits, isUnlimited,
}: {
  result: AnalysisResult; rewriting: boolean; onRewrite: () => void; onReset: () => void;
  credits: number; isUnlimited: boolean;
}) => {
  const hasEnoughCredits = isUnlimited || credits >= 49;
  
  return (
  <div className="space-y-10">
    <div className="flex items-center gap-4">
      <Button variant="ghost" onClick={onReset} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> New Analysis
      </Button>
      <h1 className="text-2xl font-extrabold text-foreground">Your ATS Report</h1>
    </div>

    <div className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center">
      <SpeedometerGauge score={result.ats_score} />
      {result.detected_domain && (
        <span className="mt-3 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
          Domain: {result.detected_domain}
        </span>
      )}
      <p className="text-sm text-muted-foreground mt-4 text-center max-w-md">{result.summary}</p>
    </div>

    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">Want an ATS-optimized resume?</h2>
        <p className="text-sm text-muted-foreground">AI will rewrite your resume with all fixes applied and generate a downloadable PDF.</p>
        <div className="flex items-center gap-2 mt-2">
          <Coins className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {isUnlimited ? "Unlimited credits" : `${credits} credits`}
          </span>
          <span className="text-xs text-muted-foreground">• 49 credits per fix</span>
        </div>
      </div>
      {hasEnoughCredits ? (
        <Button onClick={onRewrite} disabled={rewriting} className="rounded-full font-semibold gap-2 whitespace-nowrap" size="lg">
          {rewriting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
          {rewriting ? "Rewriting..." : "Fix & Download (49 credits)"}
        </Button>
      ) : (
        <Button onClick={onRewrite} className="rounded-full font-semibold gap-2 whitespace-nowrap" size="lg">
          Buy 99 Credits — ₹99
        </Button>
      )}
    </div>

    {result.keyword_gaps.length > 0 && (
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-bold text-foreground">Missing Keywords</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.keyword_gaps.map((kw, i) => (
            <span key={i} className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">{kw}</span>
          ))}
        </div>
      </div>
    )}

    {result.formatting_issues.length > 0 && (
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <ListChecks className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Formatting Issues</h2>
        </div>
        <ul className="space-y-2">
          {result.formatting_issues.map((issue, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-1">•</span> {issue}
            </li>
          ))}
        </ul>
      </div>
    )}

    {result.rewrite_suggestions.length > 0 && (
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold text-foreground">Rewrite Suggestions</h2>
        </div>
        <ul className="space-y-3">
          {result.rewrite_suggestions.map((s, i) => (
            <li key={i} className="bg-accent/5 border border-accent/10 rounded-xl p-4 text-sm text-foreground">
              <ReactMarkdown>{typeof s === "string" ? s : JSON.stringify(s)}</ReactMarkdown>
            </li>
          ))}
        </ul>
      </div>
    )}

    {result.section_feedback.length > 0 && (
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold text-foreground">Section-by-Section Feedback</h2>
        </div>
        <div className="space-y-4">
          {result.section_feedback.map((sf, i) => (
            <div key={i} className="border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{sf.section}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  sf.rating === "good" ? "bg-accent/10 text-accent" :
                  sf.rating === "average" ? "bg-primary/10 text-primary" :
                  "bg-destructive/10 text-destructive"
                }`}>{sf.rating}</span>
              </div>
              <p className="text-sm text-muted-foreground">{sf.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  );
};

/* ── Main Page ── */
const Analyze = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { credits, isUnlimited, refetch: refetchCredits } = useCredits();

  // Handle return from Cashfree payment — add credits
  useEffect(() => {
    const handlePaymentReturn = async () => {
      const paymentType = searchParams.get("payment");
      if (!paymentType || !user) return;

      if (paymentType === "credits") {
        try {
          await supabase.functions.invoke("add-credits", {
            body: { credits: 99 },
          });
          await refetchCredits();
          toast({ title: "Payment successful!", description: "99 credits added to your account." });
        } catch (e: any) {
          toast({ title: "Error adding credits", description: e.message, variant: "destructive" });
        }
      }

      if (paymentType === "rewrite") {
        // Legacy rewrite payment flow — add credits then do rewrite
        try {
          await supabase.functions.invoke("add-credits", {
            body: { credits: 99 },
          });
          await refetchCredits();
        } catch {}

        const pending = sessionStorage.getItem("pendingRewrite");
        if (!pending) return;
        sessionStorage.removeItem("pendingRewrite");
        setRewriting(true);

        try {
          const { fileBase64: base64, fileName, analysis } = JSON.parse(pending);
          toast({ title: "Payment successful!", description: "Generating your optimized resume..." });

          // Deduct credits
          const { data: deductResult } = await supabase.rpc("deduct_credits", { p_user_id: user.id, p_amount: 49 });

          const { data, error } = await supabase.functions.invoke("rewrite-resume", {
            body: { fileBase64: base64, fileName, analysis },
          });
          if (error) throw error;

          const resumeData: ResumeData = data.resumeData;
          const blob = await pdf(<ResumePDF data={resumeData} />).toBlob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${resumeData.name?.replace(/\s+/g, "_") || "resume"}_ATS_Optimized.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast({ title: "Resume downloaded!", description: "Your ATS-optimized resume has been saved." });
          await refetchCredits();
        } catch (error: any) {
          toast({ title: "Rewrite failed", description: error.message, variant: "destructive" });
        } finally {
          setRewriting(false);
        }
      }
    };
    handlePaymentReturn();
  }, [searchParams, toast, user, refetchCredits]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf" && f.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      toast({ title: "Invalid file", description: "Please upload a PDF or DOCX file.", variant: "destructive" });
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 20MB.", variant: "destructive" });
      return;
    }
    setFile(f);
  };

  const readFileAsBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const handleAnalyze = async () => {
    if (!file || !user) return;
    setLoading(true);
    setResult(null);

    try {
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("resumes").upload(filePath, file);
      if (uploadError) throw uploadError;

      const base64 = await readFileAsBase64(file);
      setFileBase64(base64);

      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { fileBase64: base64, fileName: file.name, jobDescription: jd || undefined },
      });
      if (error) throw error;

      const analysis: AnalysisResult = data.analysis;
      setResult(analysis);

      await supabase.from("resumes").insert({
        user_id: user.id,
        file_name: file.name,
        file_url: filePath,
        job_description: jd || null,
        ats_score: analysis.ats_score,
        analysis: analysis as any,
      });
    } catch (error: any) {
      toast({ title: "Analysis failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRewrite = useCallback(async () => {
    if (!file || !result || !user) return;
    const hasEnoughCredits = isUnlimited || credits >= 49;

    if (!hasEnoughCredits) {
      // Redirect to buy credits via Cashfree
      try {
        const { data, error } = await supabase.functions.invoke("create-cashfree-order", {
          body: {
            amount: 99,
            currency: "INR",
            customer_email: user.email || "",
            customer_id: user.id,
            return_url: `${window.location.origin}/analyze?payment=rewrite`,
          },
        });
        if (error) throw error;

        sessionStorage.setItem("pendingRewrite", JSON.stringify({
          fileBase64: fileBase64 || await readFileAsBase64(file),
          fileName: file.name,
          analysis: result,
        }));

        const cashfree = await load({ mode: "production" });
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_self",
        });
      } catch (error: any) {
        toast({ title: "Payment error", description: error.message, variant: "destructive" });
      }
      return;
    }

    // Has credits — deduct and rewrite
    setRewriting(true);
    try {
      const { data: deductOk } = await supabase.rpc("deduct_credits", { p_user_id: user.id, p_amount: 49 });
      if (!deductOk) {
        toast({ title: "Insufficient credits", description: "You need 49 credits to fix your resume.", variant: "destructive" });
        setRewriting(false);
        return;
      }

      const base64 = fileBase64 || (await readFileAsBase64(file));
      const { data, error } = await supabase.functions.invoke("rewrite-resume", {
        body: { fileBase64: base64, fileName: file.name, analysis: result },
      });
      if (error) throw error;

      const resumeData: ResumeData = data.resumeData;
      const blob = await pdf(<ResumePDF data={resumeData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resumeData.name?.replace(/\s+/g, "_") || "resume"}_ATS_Optimized.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: "Resume downloaded!", description: "Your ATS-optimized resume has been saved." });
      await refetchCredits();
    } catch (error: any) {
      toast({ title: "Rewrite failed", description: error.message, variant: "destructive" });
    } finally {
      setRewriting(false);
    }
  }, [file, result, user, isUnlimited, credits, fileBase64, toast, refetchCredits]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="/" className="text-xl font-extrabold text-primary tracking-tight">ShortlistAI</a>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mr-2">
              <Coins className="h-4 w-4 text-primary" />
              <span className="font-medium">{isUnlimited ? "∞" : credits}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="gap-2">
              <User className="h-4 w-4" /> Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <ProgressOverlay mode="analyze" />
        ) : rewriting ? (
          <ProgressOverlay mode="rewrite" />
        ) : !result ? (
          <UploadForm file={file} jd={jd} loading={loading} onFileChange={handleFileChange} onJdChange={setJd} onAnalyze={handleAnalyze} />
        ) : (
          <AnalysisReport result={result} rewriting={rewriting} onRewrite={handleRewrite} onReset={() => { setResult(null); setFile(null); }} credits={credits} isUnlimited={isUnlimited} />
        )}
      </main>
    </div>
  );
};

export default Analyze;
