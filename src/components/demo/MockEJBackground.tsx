import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Menu, User, ChevronRight, X, AlertCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const MockEJBackground = () => {
    const [showDemoModal, setShowDemoModal] = useState(false);

    return (
        <div className="fixed inset-0 bg-white overflow-y-auto font-sans text-slate-800">

            {/* Main Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        {/* CSS-BASED WORDMARK LOGO - FAST & LITE */}
                        {/* OFFICIAL EJ LOGO IMAGE */}
                        <img
                            src="/ej-logo.png"
                            alt="Edward Jones"
                            className="h-20 w-auto"
                        />

                        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-[#183029]/80 uppercase tracking-tight">
                            <span className="cursor-pointer hover:text-[#183029]">What We Do</span>
                            <span className="cursor-pointer hover:text-[#183029]">Services</span>
                            <span className="cursor-pointer hover:text-[#183029]">News</span>
                            <span className="cursor-pointer hover:text-[#183029]">About</span>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="font-bold text-[#183029]">Log In</Button>
                        <Button size="sm" className="bg-[#183029] hover:bg-[#2a4d44] text-white font-bold px-6 rounded-full">
                            Find an Advisor
                        </Button>
                        <Menu className="w-6 h-6 lg:hidden text-slate-800" />
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main>
                <div className="bg-[#183029] py-24 px-8 border-b-8 border-[#FFCE00]">
                    <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8 text-white">
                        <h1 className="text-5xl md:text-7xl font-black leading-tight max-w-4xl">
                            Making sense of your <span className="text-[#FFCE00]">financial future.</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl font-medium">
                            Professional guidance tailored to your goals. Start your free evaluation today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                size="lg"
                                onClick={() => setShowDemoModal(true)}
                                className="bg-[#FFCE00] hover:bg-[#FFD700] text-[#183029] font-black px-12 h-16 text-xl rounded-full shadow-lg"
                            >
                                Start Evaluation
                            </Button>
                            <Button
                                size="lg"
                                onClick={() => setShowDemoModal(true)}
                                className="bg-white hover:bg-slate-100 text-[#183029] font-bold px-12 h-16 text-xl rounded-full transition-colors shadow-md"
                            >
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Demo Modal */}
                <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
                    <DialogContent className="sm:max-w-md bg-white border-2 border-[#FFCE00]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#183029] font-black underline decoration-[#FFCE00] decoration-4 underline-offset-4">
                                <AlertCircle className="w-5 h-5 text-[#FFCE00]" />
                                DEMO ENVIRONMENT
                            </DialogTitle>
                            <DialogDescription className="text-slate-700 pt-4 leading-relaxed font-medium">
                                This is a demo. It is trained on Edward Jones Basic information to act as an AI Sales Assistant for your Landing Page.
                                <br /><br />
                                <strong>Kate</strong> is an AI Sales Voice and Text receptionist; she can speak and text with you.
                                <br /><br />
                                <span className="text-[#183029] font-bold">Click on Kate (bottom right) to talk to her!</span>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end pt-2">
                            <Button
                                onClick={() => setShowDemoModal(false)}
                                className="bg-[#183029] text-white rounded-full font-bold hover:scale-105 transition-transform"
                            >
                                Got it!
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Persistent Right Side Warning Tab */}
                <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] group">
                    <div
                        onClick={() => setShowDemoModal(true)}
                        className="bg-[#FFCE00] text-[#183029] font-black py-4 px-2 rounded-l-xl shadow-xl flex items-center justify-center cursor-pointer hover:pl-4 transition-all duration-300 border-y border-l border-[#183029]/10"
                        style={{ writingMode: 'vertical-rl' }}
                    >
                        <span className="tracking-widest text-sm">DEMO ENVIRONMENT</span>
                    </div>
                </div>

                {/* Grid */}
                <section className="py-24 px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Personal Strategy", desc: "Tailored to your risk and retirement goals." },
                            { title: "Local Advisors", desc: "Expert guidance in your local community." },
                            { title: "Market Insights", desc: "Stay ahead with our research and analysis." }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-1.5 bg-[#FFCE00] mb-6" />
                                <h3 className="text-2xl font-black text-[#183029] mb-4">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-100 text-slate-600 py-16 px-8 mt-20">
                <div className="max-w-7xl mx-auto text-center space-y-4">
                    <p className="font-bold text-[#183029]">Edward Jones</p>
                    <p className="text-xs">© 2026 Edward Jones. All rights reserved. Member SIPC.</p>
                </div>
            </footer>
        </div>
    );
};

export default MockEJBackground;
