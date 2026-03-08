import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Score Breakdown", href: "#benefits" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="text-xl font-extrabold text-primary tracking-tight">
            ShortlistAI
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="gap-2">
                <User className="h-4 w-4" /> Profile
              </Button>
            )}
            <Button
              onClick={() => navigate("/analyze")}
              className="rounded-full px-6 font-semibold"
            >
              Check ATS Score Free
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-4 pb-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="block w-full text-left py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
          {user && (
            <button
              onClick={() => { setMobileOpen(false); navigate("/profile"); }}
              className="block w-full text-left py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              My Profile
            </button>
          )}
          <Button
            onClick={() => { setMobileOpen(false); navigate("/analyze"); }}
            className="rounded-full w-full mt-2 font-semibold"
          >
            Check ATS Score Free
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
