import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import KateChatWidget from "@/components/KateChatWidget";
import MockEJBackground from "@/components/demo/MockEJBackground";
import MockAdvisorBackground from "@/components/demo/MockAdvisorBackground";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, AlertCircle } from "lucide-react";

interface SiteSimulatorProps {
    theme?: 'ej' | 'corporate';
    agentId?: string;
}

const SiteSimulator = ({ theme: propTheme, agentId: propAgentId }: SiteSimulatorProps = {}) => {
    const [searchParams] = useSearchParams();

    const theme = propTheme || searchParams.get('theme') || 'ej';
    const isBranch = theme === 'ej';

    // Select default agent based on theme
    const defaultAgentId = theme === 'corporate'
        ? '5f15ffb6-6c0a-4619-a293-332524af9fe9' // Corporate Sales Agent
        : (import.meta.env.VITE_EJ_AGENT_ID || '50487a6f-72d7-434b-8444-8fe62382c671');

    const agentId = propAgentId || searchParams.get('agentId') || defaultAgentId;

    // Personas Overrides (Frontend Force)
    const personaPrompt = isBranch
        ? "You are the AI assistant for Deborah D Saurage, CFP®, AAMS®, a Financial Advisor at Edward Jones. Your goal is to help clients in Katy, TX schedule reviews and answer basic financial advisory FAQs. You can mention her assistant Debra Mastalski if asked about the team. Never mention Conquer365."
        : "You are the Edward Jones Corporate Sales AI. Your goal is to help mirror the 'Advisor Match' logic and route leads to local advisors. Never mention Conquer365.";

    const [showInfo, setShowInfo] = useState(true);

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* The Mock Background */}
            {isBranch ? <MockAdvisorBackground /> : <MockEJBackground />}

            <KateChatWidget
                agentId={agentId}
                companyName="Edward Jones"
                geminiSystemMessage={personaPrompt}
                avatar={isBranch ? "/deborah-headshot.png" : undefined}
            />

            {/* Left Hand Demo Warning */}
            {showInfo && (
                <div className="fixed bottom-32 left-8 z-50 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="bg-[#FFCE00] text-[#183029] shadow-2xl border-2 border-[#183029]/10 rounded-2xl p-4 max-w-[200px] flex flex-col gap-2 relative overflow-hidden group hover:scale-105 transition-transform">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#183029]/10" />
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-[#183029]" />
                                <span className="font-black text-[10px] uppercase tracking-tighter">Demo Environment</span>
                            </div>
                            <button
                                onClick={() => setShowInfo(false)}
                                className="text-[#183029]/60 hover:text-[#183029] transition-colors"
                                aria-label="Dismiss info"
                                title="Dismiss info"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                        <p className="text-[11px] font-bold leading-tight">
                            Trained on Edward Jones basic info to act as an AI Sales Assistant.
                        </p>
                        <p className="text-[10px] text-[#183029]/80 italic font-medium">
                            Click on Kate to talk!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SiteSimulator;
