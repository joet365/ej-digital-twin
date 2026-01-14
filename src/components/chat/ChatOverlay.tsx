import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, UserCheck, Zap, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatMessage from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GeminiLiveButton, GeminiLiveButtonHandle } from "./GeminiLiveButton";
import { supabase } from "@/integrations/supabase/client";

interface Message {
    id: string;
    text: string;
    isKate: boolean;
    timestamp: Date;
    quickReplies?: string[];
    quickRepliesUsed?: boolean;
    imageUrl?: string;
    videoUrl?: string;
    locationId?: string;
}

// Lead capture stage tracking
type LeadCaptureStage = 'idle' | 'industry' | 'name' | 'email' | 'phone' | 'consent' | 'complete';

interface CapturedLead {
    name: string;
    email: string;
    phone: string;
    interest: string;
    industry: string;
    tcpaConsent: boolean;
}

// Validation helpers
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Block obviously fake patterns
    const fakePatterns = ['test@test', 'fake@fake', 'asdf@asdf', 'no@no', 'a@a'];
    const lowerEmail = email.toLowerCase();
    if (fakePatterns.some(p => lowerEmail.includes(p))) return false;
    return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
    // Remove all non-digits
    const digitsOnly = phone.replace(/\D/g, '');
    // Must have at least 10 digits (US format)
    if (digitsOnly.length < 10) return false;
    // Block obviously fake patterns
    const fakePatterns = ['1234567890', '0000000000', '1111111111', '5555555555'];
    if (fakePatterns.includes(digitsOnly)) return false;
    return true;
};

interface ChatOverlayProps {
    onClose: () => void;
    isCallActive: boolean;
    isConnecting?: boolean;
    onStartCall: () => void;
    onStopCall: () => void;
    avatar: string;
    onSendMessage?: (message: string) => void;
    onShowContactForm?: () => void;
    companyName?: string;
    logoUrl?: string;
    agentId?: string;
    onGeminiStart?: () => void;
    onGeminiEnd?: () => void;
    isVapiActive?: boolean;
    isGeminiActive?: boolean;
    geminiSystemMessage?: string | null;
}

const ChatOverlay = ({
    onClose,
    isCallActive,
    isConnecting = false,
    onStartCall,
    onStopCall,
    avatar,
    onSendMessage,
    onShowContactForm,
    companyName = "Conquer365",
    logoUrl = "/conquer-logo.png",
    agentId,
    onGeminiStart,
    onGeminiEnd,
    isVapiActive = false,
    isGeminiActive = false,
    geminiSystemMessage
}: ChatOverlayProps) => {
    // EJ Context logic: Either specific Agent ID OR explicit company name
    const isEJ = agentId === '50487a6f-72d7-434b-8444-8fe62382c671' || companyName === "Edward Jones";
    const isDeborah = agentId === '50487a6f-72d7-434b-8444-8fe62382c671';

    // Initialize messages from sessionStorage or default
    const getInitialMessages = (): Message[] => {
        try {
            const storageKey = `kate_messages_${agentId}`;
            const saved = sessionStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Restore Date objects
                return parsed.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));
            }
        } catch (e) {
            console.error('Failed to restore chat:', e);
        }

        if (isDeborah) {
            return [{
                id: "1",
                text: `Hi! 👋 I'm Kate, Deborah D Saurage's AI assistant. To get started, may I ask your name?`,
                isKate: true,
                timestamp: new Date(),
                quickReplies: ["Retirement Planning", "Estate Planning", "Investment Review", "Just Curious"],
            }];
        }

        // Generic / Corporate Fallback
        return [{
            id: "1",
            text: `Hi! 👋 I'm Kate, your AI assistant for ${companyName}. How can I help you today?`,
            isKate: true,
            timestamp: new Date(),
            quickReplies: ["AI Receptionist", "AI Sales", "AI Workforce", "Increase Sales", "How it Works"],
            imageUrl: "https://yuoksgysfefxplwhfprs.supabase.co/storage/v1/object/public/mms-images/branded_output.png",
        }];
    };

    const getInitialLeadStage = (): LeadCaptureStage => {
        try {
            const saved = sessionStorage.getItem(`kate_stage_${agentId}`);
            if (saved) return saved as LeadCaptureStage;
        } catch (e) { }
        return 'idle';
    };

    const getInitialLeadData = (): CapturedLead => {
        try {
            const saved = sessionStorage.getItem(`kate_lead_${agentId}`);
            if (saved) return JSON.parse(saved);
        } catch (e) { }
        return {
            name: '',
            email: '',
            phone: '',
            interest: '',
            industry: '',
            tcpaConsent: false,
        };
    };

    // Generate or retrieve a unified session ID for tracking across text/voice
    const getOrCreateSessionId = useCallback((): string => {
        try {
            const storageKey = `kate_sid_${agentId}`;
            let sessionId = sessionStorage.getItem(storageKey);
            if (!sessionId) {
                // Generate UUID v4
                sessionId = crypto.randomUUID();
                sessionStorage.setItem(storageKey, sessionId);
                console.log('Created new session ID for agent:', agentId, sessionId);
            }
            return sessionId;
        } catch (e) {
            console.error('Failed to create session ID:', e);
            return crypto.randomUUID();
        }
    }, [agentId]);

    const [sessionId] = useState<string>(getOrCreateSessionId());
    const [messages, setMessages] = useState<Message[]>(getInitialMessages());
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Lead capture state
    const [leadCaptureStage, setLeadCaptureStage] = useState<LeadCaptureStage>(getInitialLeadStage());
    const [capturedLead, setCapturedLead] = useState<CapturedLead>(getInitialLeadData());
    const [latestFrame, setLatestFrame] = useState<string | null>(null);
    const [voiceButtons, setVoiceButtons] = useState<string[]>([]);
    const geminiRef = useRef<GeminiLiveButtonHandle>(null);

    // Speech Recognition for Voice-to-Text
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const startListening = useCallback(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('Speech recognition not supported');
            return;
        }
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = (e: any) => {
            console.error('Speech error:', e.error);
            setIsListening(false);
        };
        recognitionRef.current.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setInputValue(prev => prev + finalTranscript);
            }
        };
        recognitionRef.current.start();
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    }, []);

    // Helper to persist messages to Supabase for cross-channel context
    const persistMessage = async (role: 'user' | 'assistant', content: string) => {
        try {
            const { error } = await supabase.from('transcript_messages').insert({
                conversation_id: sessionId,
                role: role,
                content: content,
                timestamp: new Date().toISOString(),
            });
            if (error) {
                console.error('[ChatOverlay] Failed to persist message:', error.message);
            }
        } catch (e) {
            console.error('[ChatOverlay] Persist message error:', e);
        }
    };
    // Persist to sessionStorage on changes
    useEffect(() => {
        sessionStorage.setItem(`kate_messages_${agentId}`, JSON.stringify(messages));
    }, [messages, agentId]);

    useEffect(() => {
        sessionStorage.setItem(`kate_stage_${agentId}`, leadCaptureStage);
    }, [leadCaptureStage, agentId]);

    useEffect(() => {
        sessionStorage.setItem(`kate_lead_${agentId}`, JSON.stringify(capturedLead));
    }, [capturedLead, agentId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle quick reply button click
    const handleQuickReplySelect = async (messageId: string, option: string) => {
        // Mark the quick replies as used so buttons disappear
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, quickRepliesUsed: true } : msg
        ));

        // Add user message with their selection
        const userMessage: Message = {
            id: Date.now().toString(),
            text: option,
            isKate: false,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);

        // Check if this is an interest selection (first set of buttons) - Bypass if EJ
        const interestOptions = ["AI Receptionist", "AI Sales", "AI Workforce", "Increase Sales", "AI Marketing", "Business Automation"];

        if (interestOptions.includes(option) && !isEJ) {
            // Save interest and ask for industry (step 2)
            setCapturedLead(prev => ({ ...prev, interest: option }));
            setLeadCaptureStage('industry');

            // Kate asks for industry
            setTimeout(() => {
                const industryRequest: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `Great choice! I'd love to tell you more about ${option}. First, what industry are you in?`,
                    isKate: true,
                    timestamp: new Date(),
                    quickReplies: ["🔧 Plumber/HVAC", "⚖️ Lawyer", "🍽️ Restaurant", "🏥 Medical/Dental", "🏠 Real Estate", "📦 Other"],
                };
                setMessages(prev => [...prev, industryRequest]);
            }, 1000);
            return;
        }

        // Handle industry selection (second question) - Bypass if EJ
        const industryOptions = ["🔧 Plumber/HVAC", "⚖️ Lawyer", "🍽️ Restaurant", "🏥 Medical/Dental", "🏠 Real Estate"];

        if (industryOptions.includes(option) && !isEJ) {
            // Save industry and ask for name
            const cleanIndustry = option.replace(/^[^\s]+\s/, ''); // Remove emoji
            setCapturedLead(prev => ({ ...prev, industry: cleanIndustry }));
            setLeadCaptureStage('name');

            setTimeout(() => {
                const nameRequest: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `Perfect! ${cleanIndustry} is a great industry for AI automation. What's your name?`,
                    isKate: true,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, nameRequest]);
            }, 1000);
            return;
        }

        // Handle "Other" industry - ask them to type it
        if (option === "📦 Other" && !isEJ) {
            setLeadCaptureStage('industry');
            setTimeout(() => {
                const otherIndustryRequest: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "No problem! What type of business are you in?",
                    isKate: true,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, otherIndustryRequest]);
            }, 1000);
            return;
        }

        // Handle TCPA consent buttons
        if (option === "✅ Yes, I consent") {
            setCapturedLead(prev => ({ ...prev, tcpaConsent: true }));
            setLeadCaptureStage('complete');

            setTimeout(() => {
                const thanksMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `Perfect, thanks for that ${capturedLead.name}! 🎉 Now, before I tell you more about ${capturedLead.interest}, I'd love to understand your situation better. What's your biggest challenge right now?`,
                    isKate: true,
                    timestamp: new Date(),
                    quickReplies: ["Missing calls", "Slow lead follow-up", "No 24/7 support", "Too many manual tasks", "Just curious"],
                };
                setMessages(prev => [...prev, thanksMsg]);
            }, 1000);
            return;
        }

        if (option === "❌ No thanks") {
            setCapturedLead(prev => ({ ...prev, tcpaConsent: false }));
            setLeadCaptureStage('complete');

            setTimeout(() => {
                const noConsentMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `No problem at all, ${capturedLead.name}! I'll only communicate with you through this chat. Now, let's learn more about your needs. What's your biggest challenge right now?`,
                    isKate: true,
                    timestamp: new Date(),
                    quickReplies: ["Missing calls", "Slow lead follow-up", "No 24/7 support", "Too many manual tasks", "Just curious"],
                };
                setMessages(prev => [...prev, noConsentMsg]);
            }, 1000);
            return;
        }


        // Handle pain point / discovery buttons with CRO stats
        const painPoints: Record<string, string> = {
            "Missing calls": "I totally get it - missed calls = missed revenue. 📊 Fun fact: Visitors who chat are 2.8x more likely to convert than those who don't! Our AI Voice Receptionist answers every call in 2 rings, 24/7. Tell me, roughly how many calls do you think you miss per week?",
            "Slow lead follow-up": "Speed is everything! 📊 Studies show you're 21x more likely to close a lead if you respond within 5 minutes - and businesses with live chat see a 38% increase in conversions! Our AI contacts leads in 30 seconds. How fast does your team currently respond?",
            "No 24/7 support": "Having coverage around the clock is a game-changer. 📊 Did you know 41% of customers prefer chat over phone? And 63% are more likely to return to a website that has chat! Our AI team works nights, weekends, and holidays. What hours do you miss the most inquiries?",
            "Too many manual tasks": "Automation is our specialty! 📊 With AI handling the repetitive stuff, businesses see up to 20% more conversions. We handle appointment booking, FAQs, lead nurturing, and follow-ups automatically. What task takes up most of your time?",
            "Just curious": "I love curiosity! 😊 Fun fact: websites with chat see 2-6x higher conversion rates! I'm Kate, an AI employee built by Conquer365. I answer calls, send texts, chat with visitors, and book appointments - all automatically. What sounds most interesting to you?",
        };

        if (painPoints[option] && !isEJ) {
            setTimeout(() => {
                const painPointResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: painPoints[option],
                    isKate: true,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, painPointResponse]);
            }, 1000);
            return;
        }


        // Handle next step buttons after discovery
        if (option === "📞 Start Voice Call" || option === "Talk to Kate (Voice)" || option === "Talk to Deborah (Voice)") {
            onStartCall();
            return;
        }

        if (option === "🤖 Try Demo Kate" || option === "Try it on my business") {
            window.open('/demo', '_blank');
            return;
        }

        // For other options, use AI response
        setIsTyping(true);
        try {
            const conversationHistory = messages.slice(-10).map(m => ({
                role: m.isKate ? "assistant" : "user",
                content: m.text
            }));
            conversationHistory.push({ role: "user", content: option });

            const { data, error } = await supabase.functions.invoke('chat-completion', {
                body: { messages: conversationHistory, sessionId: sessionId, agentId: agentId }
            });

            if (error) throw error;

            const replyTextRaw = data.reply || "I'd be happy to help with that!";

            // Parse for [video:url]
            const videoRegex = /\[video:([^\]]+)\]/i;
            const videoMatch = replyTextRaw.match(videoRegex);
            const videoUrl = videoMatch ? videoMatch[1].trim() : undefined;

            // Parse for [image:url]
            const imageRegex = /\[image:([^\]]+)\]/i;
            const imageMatch = replyTextRaw.match(imageRegex);
            const imageUrl = imageMatch ? imageMatch[1].trim() : undefined;

            // Parse for [location:id]
            const locationRegex = /\[location:([^\]]+)\]/i;
            const locationMatch = replyTextRaw.match(locationRegex);
            const locationId = locationMatch ? locationMatch[1].trim() : undefined;

            // Parse for [Buttons]
            const buttonRegex = /\[([^\]]+)\]/g;
            const buttons: string[] = [];
            let match;
            while ((match = buttonRegex.exec(replyTextRaw)) !== null) {
                if (match[0].toLowerCase().startsWith('[video:')) continue;
                if (match[0].toLowerCase().startsWith('[image:')) continue;
                if (match[0].toLowerCase().startsWith('[location:')) continue;
                buttons.push(match[1]);
            }

            // Clean text
            let cleanText = replyTextRaw.replace(buttonRegex, "").trim();
            if (videoUrl) {
                cleanText = cleanText.replace(videoRegex, "").trim();
            }
            if (imageUrl) {
                cleanText = cleanText.replace(imageRegex, "").trim();
            }
            if (locationId) {
                cleanText = cleanText.replace(locationRegex, "").trim();
            }

            const kateResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: cleanText,
                isKate: true,
                timestamp: new Date(),
                quickReplies: buttons.length > 0 ? buttons : undefined,
                videoUrl: videoUrl,
                imageUrl: imageUrl,
                locationId: locationId,
            };
            setMessages(prev => [...prev, kateResponse]);
        } catch (err) {
            console.error("Quick reply error:", err);
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'd love to tell you more! For the best experience, try the Voice Call button above.",
                isKate: true,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    };


    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userInput = inputValue.trim();
        const userMessage: Message = {
            id: Date.now().toString(),
            text: userInput,
            isKate: false,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");

        // Persist user message to Supabase for cross-channel context
        persistMessage('user', userInput);
        // Handle lead capture stages
        if (leadCaptureStage === 'industry' && !isEJ) {
            if (userInput.length < 2) {
                setTimeout(() => {
                    const errorMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        text: "I didn't quite catch that. What type of business are you in?",
                        isKate: true,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, errorMsg]);
                }, 300);
                return;
            }

            setCapturedLead(prev => ({ ...prev, industry: userInput }));
            setLeadCaptureStage('name');

            setTimeout(() => {
                const nameRequest: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `${userInput} - that's a great industry for AI automation! What's your name?`,
                    isKate: true,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, nameRequest]);
            }, 1000);
            return;
        }

        if (leadCaptureStage === 'name' && !isEJ) {
            if (userInput.length < 2) {
                setTimeout(() => {
                    const errorMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        text: "I didn't quite catch that. Could you tell me your name?",
                        isKate: true,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, errorMsg]);
                }, 300);
                return;
            }

            setCapturedLead(prev => ({ ...prev, name: userInput }));
            setLeadCaptureStage('email');

            setTimeout(() => {
                const emailRequest: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `Nice to meet you, ${userInput}! 😊 What's your email address so I can send you more info?`,
                    isKate: true,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, emailRequest]);
            }, 1000);
            return;
        }

        if (leadCaptureStage === 'email' && !isEJ) {
            if (!isValidEmail(userInput)) {
                setTimeout(() => {
                    const errorMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        text: "Hmm, that doesn't look like a valid email. Could you double-check it?",
                        isKate: true,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, errorMsg]);
                }, 300);
                return;
            }

            setCapturedLead(prev => ({ ...prev, email: userInput }));
            setLeadCaptureStage('phone');

            setTimeout(() => {
                const phoneRequest: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Perfect! And what's the best phone number to reach you?",
                    isKate: true,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, phoneRequest]);
            }, 1000);
            return;
        }

        if (leadCaptureStage === 'phone' && !isEJ) {
            if (!isValidPhone(userInput)) {
                setTimeout(() => {
                    const errorMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        text: "I need a valid phone number with at least 10 digits. Could you try again?",
                        isKate: true,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, errorMsg]);
                }, 300);
                return;
            }

            setCapturedLead(prev => ({ ...prev, phone: userInput }));
            setLeadCaptureStage('consent');

            setTimeout(() => {
                const consentRequest: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `Thanks ${capturedLead.name}! 📱 Quick question: Do you consent to receive calls and texts from Conquer365, including AI-powered communications? You can opt out anytime by replying STOP.`,
                    isKate: true,
                    timestamp: new Date(),
                    quickReplies: ["✅ Yes, I consent", "❌ No thanks"],
                };
                setMessages(prev => [...prev, consentRequest]);
            }, 1000);
            return;
        }


        // Handle name capture in EJ context
        if (isEJ && messages.length === 1) {
            sessionStorage.setItem('kate_captured_name_v2', userInput);
        }

        // Normal AI chat flow
        if (onSendMessage) {
            onSendMessage(userInput);
        }

        setIsTyping(true);

        try {
            const conversationHistory = [
                ...(geminiSystemMessage ? [{ role: "system", content: geminiSystemMessage }] : []),
                ...messages.slice(-10).map(m => ({
                    role: m.isKate ? "assistant" : "user",
                    content: m.text
                })),
                { role: "user", content: userInput }
            ];

            const { data, error } = await supabase.functions.invoke('chat-completion', {
                body: { messages: conversationHistory, sessionId: sessionId, agentId: agentId }
            });

            if (error) {
                console.error("Error invoking chat-completion:", error);
                throw error;
            }

            const replyTextRaw = data.reply || "I'm having trouble connecting right now. Please try again or use the Voice Call button!";

            // Parse for [video:url]
            const videoRegex = /\[video:([^\]]+)\]/i;
            const videoMatch = replyTextRaw.match(videoRegex);
            const videoUrl = videoMatch ? videoMatch[1].trim() : undefined;

            // Parse for [image:url]
            const imageRegex = /\[image:([^\]]+)\]/i;
            const imageMatch = replyTextRaw.match(imageRegex);
            const imageUrl = imageMatch ? imageMatch[1].trim() : undefined;

            // Parse for [location:id]
            const locationRegex = /\[location:([^\]]+)\]/i;
            const locationMatch = replyTextRaw.match(locationRegex);
            const locationId = locationMatch ? locationMatch[1].trim() : undefined;

            // Parse for [Buttons]
            const buttonRegex = /\[([^\]]+)\]/g;
            const buttons: string[] = [];
            let match;
            while ((match = buttonRegex.exec(replyTextRaw)) !== null) {
                if (match[0].toLowerCase().startsWith('[video:')) continue;
                if (match[0].toLowerCase().startsWith('[image:')) continue;
                if (match[0].toLowerCase().startsWith('[location:')) continue;
                buttons.push(match[1]);
            }

            // Clean text
            let cleanText = replyTextRaw.replace(buttonRegex, "").trim();
            if (videoUrl) {
                cleanText = cleanText.replace(videoRegex, "").trim();
            }
            if (imageUrl) {
                cleanText = cleanText.replace(imageRegex, "").trim();
            }
            if (locationId) {
                cleanText = cleanText.replace(locationRegex, "").trim();
            }

            const kateResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: cleanText,
                isKate: true,
                timestamp: new Date(),
                quickReplies: buttons.length > 0 ? buttons : undefined,
                videoUrl: videoUrl,
                imageUrl: imageUrl,
                locationId: locationId,
            };
            setMessages((prev) => [...prev, kateResponse]);

            // Persist AI response to Supabase for cross-channel context
            persistMessage('assistant', cleanText);
        } catch (err) {
            console.error("Failed to get chat response:", err);
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try the Voice Call for immediate assistance!",
                isKate: true,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    // Handle incoming transcriptions from Gemini - detect Hybrid UI Patterns
    const handleVoiceTranscription = (text: string, role: "user" | "model") => {
        if (role === "model") {
            // Extract [Buttons]
            const buttonRegex = /\[([^\]]+)\]/g;
            const buttons: string[] = [];
            let match;
            while ((match = buttonRegex.exec(text)) !== null) {
                buttons.push(match[1]);
            }

            if (buttons.length > 0) {
                console.log("Detected Voice Buttons:", buttons);
                setVoiceButtons(buttons);
            }
        } else if (role === "user") {
            // Clear buttons when user speaks
            setVoiceButtons([]);
        }
    };

    const handleVoiceButtonSelect = (option: string) => {
        console.log("Hybrid Button Selected:", option);
        // 1. Clear buttons
        setVoiceButtons([]);
        // 2. Add as message to UI for visual confirmation
        const userMessage: Message = {
            id: Date.now().toString(),
            text: option,
            isKate: false,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        // 3. Send to Gemini stream (silent turn)
        geminiRef.current?.sendText(option);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Chat Overlay */}
            <div
                className="fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:w-[450px] z-50 animate-in slide-in-from-right duration-300 mobile-safe-area"
                style={{
                    '--primary': isEJ ? '48 100% 50%' : undefined,
                    '--primary-foreground': isEJ ? '220 13% 18%' : undefined,
                    '--accent': isEJ ? '163 100% 14%' : undefined,
                } as React.CSSProperties}
            >
                <div className="h-full bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col border-l border-border">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {isEJ ? (
                                    <img
                                        src="/ej-logo.png"
                                        alt="Edward Jones"
                                        className="h-10 w-auto"
                                    />
                                ) : (
                                    <img
                                        src={avatar}
                                        alt="Assistant"
                                        className={cn(
                                            "w-12 h-12 rounded-full object-cover border-2",
                                            isCallActive ? "border-primary animate-pulse" : "border-border"
                                        )}
                                    />
                                )}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">
                                    {isDeborah ? "Deborah D Saurage" : (companyName === "Edward Jones" ? "Edward Jones AI" : "Kate")}
                                </h3>
                                <p className="text-[10px] text-muted-foreground leading-tight">
                                    {isDeborah ? "Financial Advisor" : (companyName === "Edward Jones" ? "Corporate Assistant" : "AI Assistant")}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="hover:bg-muted"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Vision Bridge Preview */}
                    {isCallActive && latestFrame && (
                        <div className="px-4 py-2 bg-indigo-600/10 border-b border-indigo-500/20 animate-in slide-in-from-top duration-300">
                            <div className="flex items-center gap-3">
                                <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-indigo-500/30 flex-shrink-0 shadow-lg">
                                    <img
                                        src={`data:image/jpeg;base64,${latestFrame}`}
                                        alt="Vision Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-1 left-1 flex gap-0.5">
                                        <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">Vision Bridge Active</p>
                                    <p className="text-xs text-slate-400 italic">{isEJ ? "Deborah" : "Kate"} can now see what you show her.</p>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                    <Zap className="w-2.5 h-2.5 fill-current" />
                                    <span className="text-[9px] font-bold uppercase tracking-tighter">1 FPS</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                        {messages.map((message) => (
                            <ChatMessage
                                key={message.id}
                                message={message.text}
                                isKate={message.isKate}
                                timestamp={message.timestamp}
                                avatar={avatar}
                                imageUrl={message.imageUrl}
                                videoUrl={message.videoUrl}
                                locationId={message.locationId}
                                quickReplies={message.quickRepliesUsed ? [] : message.quickReplies}
                                onQuickReplySelect={(option) => handleQuickReplySelect(message.id, option)}
                                disableQuickReplies={isTyping}
                            />
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-muted-foreground animate-pulse ml-1">
                                <span className="text-xs font-medium">{isEJ ? "Deborah" : "Kate"} is typing</span>
                                <span className="flex gap-1">
                                    <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></span>
                                </span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Action Bar for Voice & Hybrid Buttons */}
                    <div className="px-4 py-3 bg-muted/30 border-t border-border/50 flex flex-col gap-2">
                        <GeminiLiveButton
                            ref={geminiRef}
                            agentId={agentId}
                            sessionId={sessionId}
                            label={isDeborah ? "Deborah" : "Kate"}
                            onConnect={onStartCall}
                            onDisconnect={() => {
                                onStopCall();
                                setLatestFrame(null);
                                setVoiceButtons([]);
                            }}
                            onTranscription={handleVoiceTranscription}
                            systemMessage={geminiSystemMessage}
                            onFrameCapture={(base64) => setLatestFrame(base64)}
                        />

                        {/* Hybrid Voice Buttons */}
                        {isCallActive && voiceButtons.length > 0 && (
                            <div className="flex flex-wrap gap-2 py-2 animate-in fade-in slide-in-from-bottom-2">
                                {voiceButtons.map((btn, idx) => (
                                    <Button
                                        key={idx}
                                        variant="outline"
                                        size="sm"
                                        className="bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary font-medium rounded-full px-4"
                                        onClick={() => handleVoiceButtonSelect(btn)}
                                    >
                                        {btn}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-border bg-card/50">
                        <div className="relative flex items-center gap-2">
                            <button
                                type="button"
                                onClick={isListening ? stopListening : startListening}
                                className={cn(
                                    "flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center transition-all",
                                    isListening
                                        ? "bg-red-500 text-white animate-pulse"
                                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                                )}
                                title={isListening ? "Stop listening" : "Voice input"}
                            >
                                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={isListening ? "Listening..." : "Type your message..."}
                                className="flex-1 pr-12 min-h-[44px] bg-background/50 border-border focus:ring-primary/20 transition-all resize-none"
                            />
                            <Button
                                size="icon"
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isTyping}
                                className="absolute right-1 bottom-1 h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5 opacity-70">
                            <span className="flex items-center gap-1">
                                <UserCheck className="w-3 h-3" />
                                Secured by Conquer365 AI
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatOverlay;
