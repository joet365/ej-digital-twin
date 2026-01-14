
import { useNavigate } from "react-router-dom";
import { Building2, Store, ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const WelcomeHub = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-100 flex items-center justify-center p-4 sm:p-8">
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-stretch">

                {/* Intro Section */}
                <div className="md:col-span-2 text-center mb-8 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium">
                        <Bot className="w-4 h-4" />
                        <span>Conquer365 AI Platform</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-serif leading-tight">
                        One Platform. <br />
                        <span className="text-indigo-600">Two AI Personalities.</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        See how our AI adapts its behavior, voice, and knowledge base depending on the context—whether it's supporting a local Financial Advisor or managing corporate inbound leads.
                    </p>
                </div>

                {/* Branch Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 group relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#FFCE00]" />
                    <div className="p-8 flex flex-col h-full">
                        <div className="w-14 h-14 bg-[#183028] rounded-xl flex items-center justify-center mb-6 shadow-lg">
                            <Store className="w-7 h-7 text-[#FFCE00]" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Branch Office Demo</h2>
                        <p className="text-slate-500 mb-6 flex-1">
                            Experience <strong>Deborah's AI Assistant</strong>.
                            Designed for local advisor sites, she handles <strong>appointment scheduling</strong>, <strong>client follow-ups</strong>, and <strong>answers FAQs</strong> with a warm, personal touch.
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                Voice & Text AI Receptionist
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                Outbound Call-Back (Safety Net)
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                Multi-Channel Session Memory
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                Advisor Match & Local Knowledge
                            </div>
                        </div>

                        <Button
                            onClick={() => navigate('/branch')}
                            className="w-full bg-[#183028] hover:bg-[#2a4d40] text-white h-12 text-lg group-hover:shadow-lg transition-all"
                        >
                            Visit Branch Demo
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>

                {/* Corporate Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 group relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500" />
                    <div className="p-8 flex flex-col h-full">
                        <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                            <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Corporate Sales Demo</h2>
                        <p className="text-slate-500 mb-6 flex-1">
                            Experience the <strong>Corporate AI Sales Agent</strong>.
                            Designed for high-volume landing pages. She qualifies leads in real-time, manages engagement funnels, and routes prospects to the right advisor.
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">✓</span>
                                Instant Lead Qualification
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">✓</span>
                                Automated Nurture Sequences
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">✓</span>
                                CRM & Calendar Sync
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">✓</span>
                                AI-Powered Lead Scoring
                            </div>
                        </div>

                        <Button
                            onClick={() => navigate('/corporate')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg group-hover:shadow-lg transition-all"
                        >
                            Visit Corporate Demo
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WelcomeHub;
