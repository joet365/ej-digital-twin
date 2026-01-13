import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import logo from "@/assets/conquer365-logo.png";

const navItems = [
  { label: "Kate", href: "/kate" },
  { label: "Joe", href: "/joe" },
  { label: "Lexi", href: "/lexi" },
  { label: "Holly", href: "/holly" },
  { label: "AI Consulting", href: "/consulting" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center flex-shrink-0">
            <img src={logo} alt="Conquer365" className="h-8" />
          </a>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                  activeClassName="text-foreground after:w-full"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right side: CTA + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Link to="/onboarding" className="hidden sm:inline-flex">
              <Button variant="success" size="sm">
                Try Kate Now
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                  activeClassName="text-foreground bg-muted/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="px-4 pt-2">
                <Link to="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="success" size="sm" className="w-full">
                    Try Kate Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
