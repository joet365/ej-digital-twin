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
        ? "You are the AI assistant for Deborah D Saurage, CFP®, AAMS®, a Financial Advisor at Edward Jones. Your goal is to help clients in Katy, TX schedule reviews and answer basic financial advisory FAQs. Her office is located at 5538 South Peek Road, Katy, TX 77450, right off S Fry Rd and across from Williams Elementary (next to RE/MAX). You can mention her assistant Debra Mastalski if asked about the team. Never mention Conquer365."
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

        </div>
    );
};

export default SiteSimulator;
