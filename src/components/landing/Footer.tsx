import { Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => (
  <footer className="py-10 border-t border-border bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <img src={logo} alt="ShortlistAI" className="h-7" />

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="mailto:support@shortlistai.in" className="hover:text-foreground transition-colors">Contact</a>
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
        © 2025 ShortlistAI. Built for the Next Generation of Indian Engineers.
      </p>
    </div>
  </footer>
);

export default Footer;
