import { Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-10 border-t border-border bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm font-bold text-foreground">ShortlistAI</p>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <a href="tel:9337709699" className="hover:text-foreground transition-colors">Contact: 9337709699</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        © {new Date().getFullYear()} ShortlistAI. Built for the Next Generation of Indian Engineers.
      </p>
    </div>
  </footer>
);

export default Footer;
