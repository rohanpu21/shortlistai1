

# ShortlistAI – Landing Page Implementation Plan

## Brand System
- **Primary**: Royal Blue (#2563EB), **Accent**: Success Green (#10B981)
- **Font**: Inter (Sans Serif), **Buttons**: Pill-shaped (fully rounded)
- **Background**: Off-white (#F9FAFB) with subtle grid pattern

---

## 1. Sticky Navbar (Glassmorphism)
- Logo "ShortlistAI" on left
- Center links: How it Works, Score Breakdown, Pricing, FAQ (smooth scroll anchors)
- Right CTA pill button: "Check ATS Score Free"
- Transparent blur background on scroll with thin bottom border

## 2. Hero Section
- Bold headline: "Get Shortlisted for Your Dream Job Without the 100+ Rejection Emails."
- Subheading about Indian freshers, 60-second analysis
- Two CTAs: "Analyze My Resume Now" (primary) + "View Sample Report" (outline)
- Split-screen visual: red "bad resume" vs green "optimized report with 92% score" mockup (illustrated with CSS/components)

## 3. Social Proof Bar
- University logos/names: VIT, SRM, AKTU, Pune University, Mumbai University
- Testimonial card from Ankit Sharma with quote about TCS interview success

## 4. Problem → Solution (Old Way vs New Way)
- Section title: "Stop Guessing, Start Getting Interview Calls"
- Two-column comparison with red ✗ items (old way) vs green ✓ items (ShortlistAI way)
- Covers generic PDFs, ghosting, CGPA frustration vs keywords, ATS pass, confidence

## 5. Benefits Section
- Three benefit cards with icons:
  - "Beat the Bot" – AI acts like real HR
  - "Keyword Power-Up" – exact missing words
  - "Bullet Point Magic" – action-oriented rewrites

## 6. How It Works (3 Steps)
- Step 1: Upload (drag PDF/DOCX)
- Step 2: Match (paste JD)
- Step 3: Win (get score + fixes)
- Numbered steps with icons and connecting visual flow

## 7. Demo / Visual Section
- Video placeholder area (90-second walkthrough placeholder)
- Feature bullets: real-time keyword matching, formatting check, experience relevance scoring

## 8. Pricing Section
- Three-tier card layout:
  - Free (₹0): Basic ATS Score + Formatting Check
  - Pro (₹99, recommended): Full keywords + 5 bullet rewrites + template — "Best for Placement Season" badge
  - Elite (₹299): Everything in Pro + LinkedIn audit + AI interview prep
- Pro card visually highlighted/elevated

## 9. FAQ Section
- Accordion-style with 4 questions covering target audience, speed, experience requirements, refund policy

## 10. Final CTA Section
- Full-width Royal Blue background
- "Ready to stop getting rejected?" headline
- "Join 500+ Indian students" subheading
- White pill CTA: "Get My ATS Score for ₹0"

## 11. Footer
- Links: Privacy Policy, Terms of Service, Contact
- Social icons: Instagram, LinkedIn
- Copyright line

---

## Technical Notes
- All sections are anchor-linked from the navbar for smooth scrolling
- Fully responsive and mobile-first
- Landing page only (no auth/dashboard/backend in this step)
- Custom color theme applied globally via Tailwind CSS variables

