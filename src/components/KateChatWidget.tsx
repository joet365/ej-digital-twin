import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
// GEMINI MIGRATION: VAPI SDK bypassed (not deleted for rollback)
// import Vapi from "@vapi-ai/web";
import { supabase } from "@/integrations/supabase/client";
import ChatWidgetMinimized from "./chat/ChatWidgetMinimized";
import ChatOverlay from "./chat/ChatOverlay";
import LeadCaptureModal from "./chat/LeadCaptureModal";
import kateAvatar from "@/assets/kate-avatar.png";

// Pages where the chat widget should be HIDDEN
const HIDDEN_PAGES = [
    '/demo',
    '/phone-demo',
    '/admin',
    '/admin/auth',
    '/admin/leads',
    '/admin/conversations',
    '/admin/authority',
    '/admin/reset-password'
];

interface LeadInfo {
    name: string;
    email: string;
    phone: string;
    businessType: string;
    reason: string;
}

// Partial lead info captured during voice call
interface VoiceLeadInfo {
    name?: string;
    industry?: string;
}

interface KateChatWidgetProps {
    vapiPublicKey?: string;
    agentId?: string;
    avatar?: string;
    videoUrl?: string;
    companyName?: string;
    logoUrl?: string;
    geminiSystemMessage?: string;
}

const KateChatWidget = ({
    vapiPublicKey = "1ef5359f-d9d0-4079-bcde-32be1631c5ba",
    agentId = "00000000-0000-0000-0000-000000000001", // Default to DB ID for Kate
    avatar = kateAvatar,
    videoUrl = "/Kate-welcome.mp4",
    companyName = "Conquer365",
    logoUrl,
    geminiSystemMessage: propGeminiSystemMessage
}: KateChatWidgetProps) => {
    // Agent Config State
    const [agentConfig, setAgentConfig] = useState<any>(null);
    const [activeVapiId, setActiveVapiId] = useState("610fb26d-eca0-4132-b11f-c1b1b1dedc0d"); // Default Vapi Assistant

    // Fetch Agent Config (checks agents table, then falls back to leads table for Gemini demos)
    useEffect(() => {
        const fetchAgent = async () => {
            if (!agentId) return;

            // First try agents table
            const { data, error } = await supabase
                .from('agents' as any)
                .select('*')
                .eq('id', agentId)
                .single();

            if (data) {
                console.log("Loaded Agent Config from 'agents':", (data as any).name);
                setAgentConfig(data);
            } else {
                // Fallback: Check leads table (for Gemini demo leads)
                console.log("Agent not found in 'agents' table, checking 'leads'...");
                const { data: lead, error: leadError } = await supabase
                    .from('leads' as any)
                    .select('id, name, company_name, agent_config')
                    .eq('id', agentId)
                    .single();

                if (lead && (lead as any).agent_config) {
                    console.log("Loaded Agent Config from 'leads':", (lead as any).company_name || (lead as any).name);
                    setAgentConfig({
                        id: (lead as any).id,
                        name: (lead as any).company_name || (lead as any).name,
                        system_prompt: (lead as any).agent_config.systemPrompt,
                        welcome_message: (lead as any).agent_config.firstMessage
                    });
                } else {
                    console.error("Agent not found in agents or leads:", error, leadError);
                }
            }
        };
        fetchAgent();
    }, [agentId]);

    const [isExpanded, setIsExpanded] = useState(false);
    const [isVapiActive, setIsVapiActive] = useState(false);
    const [isGeminiActive, setIsGeminiActive] = useState(false);
    const isCallActive = isVapiActive || isGeminiActive;

    const [isConnecting, setIsConnecting] = useState(false);
    const [geminiSystemMessageOverride, setGeminiSystemMessageOverride] = useState<string | null>(null);
    const geminiSystemMessage = propGeminiSystemMessage || geminiSystemMessageOverride;
    const [showLeadCapture, setShowLeadCapture] = useState(false);
    const [capturedLead, setCapturedLead] = useState<LeadInfo | null>(null);
    const [voiceLeadInfo, setVoiceLeadInfo] = useState<VoiceLeadInfo>({});
    const [formDeclined, setFormDeclined] = useState(false);
    // GEMINI MIGRATION: vapiRef bypassed
    // const vapiRef = useRef<Vapi | null>(null);
    const vapiRef = useRef<any>(null); // Keep for interface compatibility

    // EJ Context logic
    const isEJ = agentId === '50487a6f-72d7-434b-8444-8fe62382c671';

    // Page visibility control
    const location = useLocation();
    const isHiddenPage = HIDDEN_PAGES.some(path =>
        location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'))
    );

    // Don't render on hidden pages
    if (isHiddenPage) {
        return null;
    }

    // Get or create session ID
    const getSessionId = useCallback(() => {
        const storageKey = `kate_sid_${agentId}`;
        let sessionId = sessionStorage.getItem(storageKey);
        if (!sessionId) {
            sessionId = typeof crypto.randomUUID === 'function'
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(2) + Date.now().toString(36);
            sessionStorage.setItem(storageKey, sessionId);
            console.log('Created session ID for agent:', agentId, sessionId);
        }
        return sessionId;
    }, [agentId]);

    // State to track if we need to add a text chat welcome message
    const [textChatWelcome, setTextChatWelcome] = useState<{ show: boolean; userName: string }>({ show: false, userName: "" });

    // Handle transition from voice to text chat
    const handleTransitionToTextChat = useCallback((userName: string) => {
        console.log("Transitioning to text chat for:", userName);
        setFormDeclined(true);

        // Store the welcome message info - will be picked up by ChatOverlay
        const welcomeMessage = `Hey ${userName}! 👋 Let's continue our conversation here via text. What questions can I answer for you?`;

        const storageKey = `kate_messages_${agentId}`;
        // Save to sessionStorage so ChatOverlay can pick it up
        const existingMessages = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
        existingMessages.push({
            id: Date.now().toString(),
            text: welcomeMessage,
            isKate: true,
            timestamp: new Date().toISOString(),
        });
        sessionStorage.setItem(storageKey, JSON.stringify(existingMessages));

        // Also store the user name for reference
        sessionStorage.setItem(`kate_voice_name_${agentId}`, userName);

        // End the voice call
        vapiRef.current?.stop();

        console.log("Call ended, text chat ready with welcome message");
    }, []);

    // GEMINI MODE: Voice calls now handled by GeminiLiveButton in ChatOverlay
    // The widget just manages state, not the actual voice connection

    // Start voice call immediately - no form blocking
    const handleStartCallRequest = async () => {
        // If we already have complete lead info (from previous call), skip asking
        if (capturedLead) {
            startVoiceCallWithLead(capturedLead);
            return;
        }

        // Start call immediately with new conversational flow
        // Kate will ask for name/industry during the call
        await startVoiceCallFresh();
    };

    // GEMINI MODE: Voice calls are handled by GeminiLiveButton
    // This function is now a no-op, but kept for interface compatibility
    const startVoiceCallFresh = async () => {
        console.log("startVoiceCallFresh called - now handled by GeminiLiveButton");
        // GeminiLiveButton handles the actual voice connection
    };

    // Start call with existing lead info (for returning users)
    const startVoiceCallWithLead = async (leadInfo: LeadInfo) => {
        if (!agentId) {
            console.error("No agent ID provided");
            return;
        }

        try {
            setIsConnecting(true);
            const sessionId = getSessionId();

            // Submit lead to backend (HighLevel CRM)
            try {
                const { supabase } = await import("@/integrations/supabase/client");
                await supabase.functions.invoke('submit-lead', {
                    body: {
                        name: leadInfo.name,
                        email: leadInfo.email,
                        phone: leadInfo.phone,
                        website: `Chat Widget - ${leadInfo.businessType}`,
                        notes: `Reason: ${leadInfo.reason}`,
                        sessionId: sessionId,
                    }
                });
                console.log("Lead submitted to CRM with session:", sessionId);
            } catch (crmError) {
                console.error("Failed to submit lead to CRM:", crmError);
            }

            const welcomeMessage = `Welcome back, ${leadInfo.name}! I'm ${agentConfig?.name || 'Kate'}. How can I help you today?`;

            await vapiRef.current?.start(activeVapiId, {
                firstMessage: welcomeMessage,
                model: agentConfig?.system_prompt ? {
                    messages: [
                        { role: "system", content: agentConfig.system_prompt }
                    ]
                } as any : undefined,
                metadata: {
                    sessionId: sessionId,
                    leadName: leadInfo.name,
                    leadEmail: leadInfo.email,
                    leadPhone: leadInfo.phone,
                    agentId: agentId
                },
            });
        } catch (error) {
            console.error("Failed to start call:", error);
            setIsConnecting(false);
        }
    };

    // Handle lead form submission (during active call)
    const handleLeadSubmit = async (leadInfo: LeadInfo) => {
        setCapturedLead(leadInfo);
        setShowLeadCapture(false);

        const sessionId = getSessionId();

        // Submit lead to backend
        try {
            const { supabase } = await import("@/integrations/supabase/client");
            await supabase.functions.invoke('submit-lead', {
                body: {
                    name: leadInfo.name,
                    email: leadInfo.email,
                    phone: leadInfo.phone,
                    website: `Voice Call - ${leadInfo.businessType}`,
                    notes: `Industry: ${voiceLeadInfo.industry || leadInfo.businessType}`,
                    sessionId: sessionId,
                }
            });
            console.log("Lead submitted from mid-call form");
        } catch (crmError) {
            console.error("Failed to submit lead:", crmError);
        }

        // Send confirmation back to Vapi to continue the call
        vapiRef.current?.send({
            type: "add-message",
            message: {
                role: "system",
                content: `User verified: ${leadInfo.name}, ${leadInfo.email}. Continue the conversation.`,
            },
        });

        // If Gemini is active, inject system message
        if (isGeminiActive) {
            console.log("Injecting Gemini system message for verification");
            setGeminiSystemMessageOverride(`System: User submitted verification form. Name: ${leadInfo.name}, Phone: ${leadInfo.phone}, Email: ${leadInfo.email}, Industry: ${voiceLeadInfo.industry || leadInfo.businessType}. CRITICAL: You must now READ THIS INFO BACK to the user to confirm it is correct. Ask: "Just to check, I have your number as [Phone], is that right?" If they confirm, proceed with the demo.`);
            // Reset after a short delay to allow component to pick it up? 
            // Better: Component listens to change.
            setTimeout(() => setGeminiSystemMessageOverride(null), 2000);
        }
    };

    // Handle form close/cancel - user declined
    const handleLeadCaptureClose = () => {
        setShowLeadCapture(false);

        // If call is still active, notify Kate that user declined
        if (isCallActive && vapiRef.current) {
            vapiRef.current.send({
                type: "add-message",
                message: {
                    role: "system",
                    content: "User closed the verification form without submitting. Offer to continue via text chat instead.",
                },
            });
        }
    };

    const handleStopCall = () => {
        vapiRef.current?.stop();
        setIsVapiActive(false);
        setIsConnecting(false);
    };

    const handleToggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleSendMessage = (message: string) => {
        console.log("Message sent:", message);
    };

    return (
        <>
            {!isExpanded && (
                <ChatWidgetMinimized
                    onClick={handleToggleExpanded}
                    isOnline={true}
                    isActive={isCallActive}
                    avatar={avatar}
                    videoUrl={videoUrl}
                />
            )}

            {isExpanded && (
                <ChatOverlay
                    onClose={handleToggleExpanded}
                    isCallActive={isCallActive}
                    isVapiActive={isVapiActive}
                    isGeminiActive={isGeminiActive}
                    isConnecting={isConnecting}
                    onStartCall={handleStartCallRequest}
                    onStopCall={handleStopCall}
                    agentId={agentId}
                    onSendMessage={handleSendMessage}
                    onShowContactForm={capturedLead ? undefined : () => setShowLeadCapture(true)}
                    onGeminiStart={() => setIsGeminiActive(true)}
                    onGeminiEnd={() => setIsGeminiActive(false)}
                    geminiSystemMessage={geminiSystemMessage}
                    companyName={agentConfig?.business_name || companyName}
                    logoUrl={agentConfig?.avatar_url || logoUrl || avatar}
                    avatar={agentConfig?.avatar_url || avatar}
                />
            )}

            {/* Lead Capture Modal - Now shows DURING voice call */}
            <LeadCaptureModal
                isOpen={showLeadCapture}
                onClose={handleLeadCaptureClose}
                onSubmit={handleLeadSubmit}
                companyName={agentConfig?.business_name || companyName}
                prefillName={voiceLeadInfo.name}
                prefillIndustry={voiceLeadInfo.industry}
                submitLabel={isCallActive ? "✅ Verify & Continue" : `🎤 Start Voice Call with ${agentConfig?.name || 'Kate'}`}
            />
        </>
    );
};

export default KateChatWidget;
