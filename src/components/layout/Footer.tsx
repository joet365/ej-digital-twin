import logo from "@/assets/conquer365-logo.png";

const Footer = () => {
  return (
    <footer className="py-12 bg-secondary/30 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={logo} alt="Conquer365" className="h-8" />
          </a>

          {/* Legal Links */}
          <div className="flex items-center gap-4">
            <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms & Conditions
            </a>
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Conquer365. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
