import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SpeedometerGauge from "@/components/SpeedometerGauge";
import { Upload, FileText, Loader2, ArrowLeft, CheckCircle, AlertTriangle, Lightbulb, ListChecks, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AnalysisResult {
  ats_score: number;
  summary: string;
  keyword_gaps: string[];
  formatting_issues: string[];
  rewrite_suggestions: string[];
  section_feedback: { section: string; feedback: string; rating: string }[];
}

const Analyze = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && (f.type === "application/pdf" || f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setFile(f);
    } else {
      toast({ title: "Invalid file", description: "Please upload a PDF or DOCX file.", variant: "destructive" });
    }
  };

  const handleAnalyze = async () => {
    if (!file || !user) return;
    setLoading(true);
    setResult(null);

    try {
      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("resumes").upload(filePath, file);
      if (uploadError) throw uploadError;

      // Read file as base64 for AI
      const reader = new FileReader();
      const fileText = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Call edge function
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { fileBase64: fileText, fileName: file.name, jobDescription: jd || undefined },
      });
      if (error) throw error;

      const analysis: AnalysisResult = data.analysis;
      setResult(analysis);

      // Save to database
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="/" className="text-xl font-extrabold text-primary tracking-tight">ShortlistAI</a>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="gap-2">
              <User className="h-4 w-4" /> Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {!result ? (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">Analyze Your Resume</h1>
              <p className="text-muted-foreground mt-2">Upload your resume and get a detailed ATS analysis powered by AI</p>
            </div>

            {/* Upload area */}
            <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center bg-card hover:border-primary/50 transition-colors">
              <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" id="resume-upload" />
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

            {/* JD (optional) */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Job Description <span className="text-muted-foreground">(optional — for keyword matching)</span>
              </label>
              <Textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here for keyword matching..."
                className="min-h-[120px]"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="w-full rounded-full font-semibold text-base h-12 gap-2"
              size="lg"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              {loading ? "Analyzing..." : "Analyze My Resume"}
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => { setResult(null); setFile(null); }} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> New Analysis
              </Button>
              <h1 className="text-2xl font-extrabold text-foreground">Your ATS Report</h1>
            </div>

            {/* Speedometer */}
            <div className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center">
              <SpeedometerGauge score={result.ats_score} />
              <p className="text-sm text-muted-foreground mt-4 text-center max-w-md">{result.summary}</p>
            </div>

            {/* Keyword gaps */}
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

            {/* Formatting issues */}
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

            {/* Rewrite suggestions */}
            {result.rewrite_suggestions.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  <h2 className="text-lg font-bold text-foreground">Rewrite Suggestions</h2>
                </div>
                <ul className="space-y-3">
                  {result.rewrite_suggestions.map((s, i) => (
                    <li key={i} className="bg-accent/5 border border-accent/10 rounded-xl p-4 text-sm text-foreground">
                      <ReactMarkdown>{s}</ReactMarkdown>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Section feedback */}
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
        )}
      </main>
    </div>
  );
};

export default Analyze;
