
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const EJNavigation = () => {
    const location = useLocation();

    // EJ Colors
    const ejYellow = "#FFCE00"; // Based on logo
    const ejGreen = "#183028"; // Dark green background

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="w-full bg-white text-slate-900 border-b-4 border-[#FFCE00] shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-20 grid grid-cols-3 items-center">
                {/* Left Side: Phone Number */}
                <div className="flex items-center justify-start">
                    <a
                        href="tel:4322879145"
                        className="text-lg font-black text-[#183028] hover:text-green-700 transition-colors"
                    >
                        (432) 287-9145
                    </a>
                </div>

                {/* Center: Navigation Links */}
                <div className="flex items-center justify-center gap-2">
                    <Link
                        to="/"
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest transition-all",
                            isActive('/') || isActive('/ej') ? "bg-[#183028] text-white shadow-lg" : "text-slate-500 hover:text-[#183028] hover:bg-slate-50"
                        )}
                    >
                        Home
                    </Link>

                    <Link
                        to="/branch"
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest transition-all",
                            isActive('/branch') ? "bg-[#183028] text-white shadow-lg" : "text-slate-500 hover:text-[#183028] hover:bg-slate-50"
                        )}
                    >
                        Branch Demo
                    </Link>

                    <Link
                        to="/corporate"
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest transition-all",
                            isActive('/corporate') ? "bg-[#183028] text-white shadow-lg" : "text-slate-500 hover:text-[#183028] hover:bg-slate-50"
                        )}
                    >
                        Corporate Demo
                    </Link>
                </div>

                {/* Right Side: Logo Area */}
                <div className="flex items-center justify-end">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <img
                            src="/ej-logo-new.png"
                            alt="Edward Jones"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default EJNavigation;
