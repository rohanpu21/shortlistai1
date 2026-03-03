import { GraduationCap, Quote, Star } from "lucide-react";

const universities = ["VIT", "SRM", "AKTU", "Pune University", "Mumbai University"];

const SocialProof = () => {
  return (
    <section className="py-16 border-y border-border bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* University logos */}
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
          Used by students from
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
          {universities.map((u, i) => (
            <div key={u} className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-semibold">{u}</span>
              {i < universities.length - 1 && (
                <span className="hidden md:inline ml-4 text-border">|</span>
              )}
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="max-w-2xl mx-auto bg-background rounded-2xl p-6 md:p-8 border border-border shadow-sm">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
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
};

export default SocialProof;
