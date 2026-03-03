import { GraduationCap, Quote } from "lucide-react";

const universities = ["VIT", "SRM", "AKTU", "Pune University", "Mumbai University"];

const SocialProof = () => (
  <section className="py-14 border-y border-border bg-card">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* University logos */}
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
        Used by students from
      </p>
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
        {universities.map((u) => (
          <div
            key={u}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="text-sm font-semibold">{u}</span>
          </div>
        ))}
      </div>

      {/* Testimonial */}
      <div className="max-w-2xl mx-auto bg-background rounded-2xl p-6 md:p-8 border border-border shadow-sm">
        <Quote className="h-6 w-6 text-primary/30 mb-3" />
        <p className="text-foreground leading-relaxed">
          "I applied to 40 companies with no luck. After using ShortlistAI for ₹99, I
          realized I was missing 5 key skills. Got an interview with TCS the next week!"
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            A
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Ankit Sharma</p>
            <p className="text-xs text-muted-foreground">B.Tech Final Year</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default SocialProof;
