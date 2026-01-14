import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const EJNavigation = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // EJ Colors
    const ejYellow = "#FFCE00"; // Based on logo
    const ejGreen = "#183028"; // Dark green background

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Branch Demo", path: "/branch" },
        { name: "Corporate Demo", path: "/corporate" },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="w-full bg-white text-slate-900 border-b-4 border-[#FFCE00] shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Left Side: Logo Area */}
                <div className="flex items-center shrink-0">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <img
                            src="/ej-logo-new.png"
                            alt="Edward Jones"
                            className="h-8 md:h-10 w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Center: Navigation Links - Visible on Tablets/Desktop */}
                <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "px-3 xl:px-4 py-2 rounded-full text-[10px] xl:text-xs font-black uppercase tracking-widest transition-all",
                                isActive(link.path) ? "bg-[#183028] text-white shadow-lg" : "text-slate-500 hover:text-[#183028] hover:bg-slate-50"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side: Contact Info & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end justify-center shrink-0">
                        <span className="text-[8px] md:text-xs font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
                            Contact Joe Tran
                        </span>
                        <a
                            href="tel:4322879145"
                            className="text-sm md:text-lg font-black text-[#183028] hover:text-green-700 transition-colors leading-none"
                        >
                            (432) 287-9145
                        </a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMenu}
                        className="lg:hidden p-2 text-[#183028] hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex flex-col p-4 gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                                    isActive(link.path)
                                        ? "bg-[#183028] text-white"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-[#183028]"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default EJNavigation;
