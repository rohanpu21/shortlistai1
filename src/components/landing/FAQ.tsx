import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    q: "Is this right for me?",
    a: "Yes, if you are a 3rd/4th year student applying for off-campus or on-campus roles. ShortlistAI is built specifically for Indian freshers.",
  },
  {
    q: "How long does it take?",
    a: "Less than 60 seconds for the full analysis. Upload, paste, and get your score — it's that fast.",
  },
  {
    q: "Do I need experience?",
    a: "No! We help freshers highlight projects, internships, and coursework in a way that passes ATS filters.",
  },
  {
    q: "What if it doesn't work?",
    a: "If your score doesn't improve after our fixes, we'll refund your ₹99 — no questions asked.",
  },
];

const FAQ = () => {
  const { ref, className: scrollClass } = useScrollAnimation();

  return (
    <section id="faq" className="py-24 bg-card">
      <div ref={ref} className={`max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 ${scrollClass}`}>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Got questions? We've got answers.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-foreground font-semibold">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Still have questions?{" "}
          <a href="mailto:support@shortlistai.in" className="text-primary font-semibold hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </section>
  );
};

export default FAQ;
