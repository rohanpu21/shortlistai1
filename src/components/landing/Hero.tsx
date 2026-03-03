import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 bg-grid hero-glow overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left – Copy */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] text-foreground tracking-tight">
              Get Shortlisted for Your Dream Job{" "}
              <span className="text-primary">Without the 100+ Rejection Emails.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              The only ATS analyzer built for Indian freshers. Upload your resume, paste
              the JD, and get a recruiter-ready score in 60 seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full px-8 font-semibold text-base gap-2">
                Analyze My Resume Now <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-semibold text-base"
              >
                View Sample Report
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No signup required. Free forever for your first scan.
            </p>
          </div>

          {/* Right – Visual Mockup */}
          <div className="relative flex gap-4 justify-center lg:justify-end">
            {/* Bad resume card */}
            <div className="w-52 rounded-2xl border-2 border-destructive/30 bg-card p-5 shadow-lg animate-float relative">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="text-xs font-bold text-destructive uppercase tracking-wide">Before</span>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 bg-destructive/15 rounded-full w-full" />
                <div className="h-2.5 bg-destructive/15 rounded-full w-3/4" />
                <div className="h-2.5 bg-destructive/10 rounded-full w-5/6" />
                <div className="h-2.5 bg-destructive/10 rounded-full w-2/3" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-destructive/50" />
                <span className="text-xs text-destructive/60 font-medium">resume_v3_final.pdf</span>
              </div>
              <div className="mt-3 text-center">
                <span className="text-2xl font-extrabold text-destructive">34%</span>
                <p className="text-[10px] text-destructive/60 font-medium">ATS Score</p>
              </div>
            </div>

            {/* Good report card */}
            <div className="w-52 rounded-2xl border-2 border-accent/30 bg-card p-5 shadow-lg animate-float-reverse relative">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-xs font-bold text-accent uppercase tracking-wide">After</span>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 bg-accent/15 rounded-full w-full" />
                <div className="h-2.5 bg-accent/15 rounded-full w-full" />
                <div className="h-2.5 bg-accent/15 rounded-full w-5/6" />
                <div className="h-2.5 bg-accent/15 rounded-full w-full" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent/50" />
                <span className="text-xs text-accent/60 font-medium">ShortlistAI Report</span>
              </div>
              <div className="mt-3 text-center">
                <span className="text-2xl font-extrabold text-accent">92%</span>
                <p className="text-[10px] text-accent/60 font-medium">ATS Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
