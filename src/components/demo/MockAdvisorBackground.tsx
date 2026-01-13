
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Search,
    Menu,
    User,
    ChevronRight,
    X,
    AlertCircle,
    Phone,
    Mail,
    MapPin,
    Check,
    FileText,
    Printer,
    ArrowRight
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const MockAdvisorBackground = () => {
    const [showDemoModal, setShowDemoModal] = useState(false);

    return (
        <div className="fixed inset-0 bg-white overflow-y-auto font-sans text-[#333]">
            {/* Hero Area - Real Sunset Boardwalk */}
            <section className="relative h-[400px] w-full overflow-hidden">
                <img
                    src="/boardwalk-hero.png"
                    alt="Corporate Heritage"
                    className="w-full h-full object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </section>

            {/* The Floating Card Layout */}
            <section className="relative -mt-32 px-8 z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Floating Advisor Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-b-8 border-[#FFCE00]">
                            <div className="aspect-[4/5] relative bg-slate-100">
                                <img
                                    src="/deborah-headshot.png"
                                    alt="Deborah D Saurage"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-green-700 uppercase">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            Active
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 text-center">
                                <h1 className="text-xl font-bold text-slate-900 mb-1">Deborah D Saurage</h1>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">CFP®, AAMS®</p>
                                <div className="flex items-center justify-center gap-2 text-xs font-bold text-green-700 bg-green-50 py-2 rounded-lg">
                                    <Check className="w-3.5 h-3.5" />
                                    Accepting New Clients
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Intro & Credentials Detail */}
                    <div className="lg:col-span-3 pt-4 lg:pt-36">
                        <div className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-xl lg:shadow-none lg:bg-transparent">
                            <div className="flex flex-col gap-6">
                                <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Financial Advisor</span>
                                    <ChevronRight className="w-3 h-3" />
                                    <span className="text-slate-900">Deborah D Saurage</span>
                                </nav>
                                <h2 className="text-4xl lg:text-5xl font-black text-[#002D15] leading-tight">
                                    Investment strategies <br className="hidden md:block" /> built for your <span className="text-green-700 italic">one-and-only</span> life.
                                </h2>

                                <div className="flex flex-wrap gap-3">
                                    {["Retirement Savings Strategies", "Estate & Legacy Strategies", "Business Retirement Plans"].map(tag => (
                                        <span key={tag} className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">

                {/* Left Side: About & Contact */}
                <div className="lg:col-span-2 space-y-16">

                    {/* About Section */}
                    <section className="space-y-6">
                        <h3 className="text-2xl font-black text-[#002D15]">Thinking about your financial future?</h3>
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
                            <p>
                                I grew up reading Reader's Digest, so it's probably no surprise I love a good story.
                                But the best stories aren't in books—they're the one you are living. My goal is to listen
                                to your story, understand what matters most to you, and build a strategy to help you get there.
                            </p>
                            <p>
                                Whether you're planning for retirement, saving for college for children or grandchildren,
                                or just trying to protect the financial future of the ones you love...
                            </p>
                        </div>
                        <Button variant="link" className="p-0 h-auto font-black text-green-700 hover:text-green-800">
                            SHOW FULL BIO <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </section>

                    {/* Authenticated "Send Me a Message" Form */}
                    <section id="contact-form" className="bg-slate-50 rounded-3xl p-10 border border-slate-200">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-[#002D15]">Send me a message</h3>
                                <p className="text-sm text-slate-500 font-medium italic">We'll get back to you as soon as possible.</p>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <label htmlFor="first_name" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">First Name *</label>
                                    <input id="first_name" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFCE00]" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="last_name" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Name *</label>
                                    <input id="last_name" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFCE00]" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address *</label>
                                    <input id="email" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFCE00]" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone Number *</label>
                                    <input id="phone" placeholder="(555) 555-5555" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFCE00]" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label htmlFor="support_type" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">How can we support you? *</label>
                                    <select id="support_type" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFCE00] appearance-none">
                                        <option>Select an option</option>
                                        <option>Starting to save or invest</option>
                                        <option>Planning for retirement</option>
                                        <option>Paying for education</option>
                                        <option>Reviewing your current portfolio</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 flex gap-3 pt-2">
                                    <input id="certify" type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300" />
                                    <label htmlFor="certify" className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                        I certify that I am the owner of this email and phone number, and I give Deborah Saurage permission to contact me.
                                    </label>
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <Button
                                        className="bg-[#002D15] hover:bg-slate-900 text-white font-black px-12 h-14 rounded-full w-full md:w-auto shadow-lg shadow-black/10"
                                        onClick={() => setShowDemoModal(true)}
                                    >
                                        SEND MESSAGE
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>

                {/* Right Side: Office Contact Info */}
                <div className="space-y-12 lg:pl-8 border-l border-slate-100">
                    <section className="space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] underline decoration-[#FFCE00] decoration-2 underline-offset-8">Office Information</h4>
                            <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="space-y-1 flex-1">
                                    <p className="text-slate-900 font-bold">Deborah D Saurage, CFP®, AAMS®</p>
                                    <p className="text-sm text-slate-500">5538 South Peek Road</p>
                                    <p className="text-sm text-slate-500">Katy, TX 77450</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button size="icon" variant="outline" className="rounded-xl border-slate-200"><MapPin className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Office</p>
                                    <p className="text-sm font-bold text-slate-900">(281) 371-0025</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                    <Printer className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Fax</p>
                                    <p className="text-sm font-bold text-slate-900">(888) 294-2012</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Our Professional Team</h4>
                            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-black text-slate-400">DM</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Debra Mastalski</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Branch Office Administrator</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer - Consistent with EJ.com */}
            <footer className="bg-[#f2f2f2] text-slate-500 py-16 px-8 border-t border-slate-200">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex justify-center flex-wrap gap-8 text-[11px] font-bold uppercase tracking-widest">
                        <span>Check the background of your financial professional on FINRA's BrokerCheck.</span>
                    </div>
                    <div className="text-[10px] leading-relaxed max-w-4xl mx-auto text-center font-medium">
                        Edward Jones is a licensed financial services firm. Member SIPC.
                        The information provided on this site is for educational purposes only and does not constitute investment advice.
                        Investment products: Not FDIC Insured • No Bank Guarantee • May Lose Value.
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold">© 2026 Deborah D Saurage, Financial Advisor. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Demo Context Modal */}
            <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
                <DialogContent className="sm:max-w-md bg-white border-4 border-[#002D15] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-[#002D15] font-black text-2xl">
                            <AlertCircle className="w-6 h-6 text-[#FFCE00]" />
                            AUTHENTIC ADVISOR SITE
                        </DialogTitle>
                        <DialogDescription className="text-slate-700 pt-4 leading-relaxed font-bold">
                            You are looking at a digital twin of Deborah Saurage's official Edward Jones site.
                            <br /><br />
                            <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-[#002D15]">
                                **Kate**, the AI assistant in the bottom right, is trained on Edward Jones history and compliance
                                to help Deborah qualify leads and schedule appointments directly on this page.
                            </div>
                            <br />
                            <span className="text-center block text-slate-400 uppercase tracking-[0.2em] text-[10px]">Click the chat bubble to start the demo</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center pt-2">
                        <Button
                            onClick={() => setShowDemoModal(false)}
                            className="bg-[#002D15] text-white rounded-full font-black px-12 h-14 hover:scale-105 transition-transform"
                        >
                            GOT IT!
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MockAdvisorBackground;
