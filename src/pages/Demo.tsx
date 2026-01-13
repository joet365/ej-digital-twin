import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Mic, MicOff, CheckCircle, Lightbulb, Share2, Plus } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import StepCard from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import kateAvatar from "@/assets/kate-avatar.png";
import { GeminiLiveButton } from "@/components/chat/GeminiLiveButton";
import KateChatWidget from "@/components/KateChatWidget";

// GEMINI MIGRATION: VAPI SDK replaced with GeminiLiveButton
// import Vapi from "@vapi-ai/web";
// VAPI Public Key will be read from import.meta.env

const Demo = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const agentId = searchParams.get("agentId") || "";
  const name = searchParams.get("name") || "there";
  const companyName = searchParams.get("company") || "Conquer365";

  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  // GEMINI MIGRATION: vapiRef removed, GeminiLiveButton manages its own state
  // const vapiRef = useRef<Vapi | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connection timeout - 15 seconds max
  useEffect(() => {
    if (isConnecting) {
      connectionTimeoutRef.current = setTimeout(() => {
        if (isConnecting && !isCallActive) {
          setIsConnecting(false);
          setConnectionError("Connection timed out");
          toast({
            title: "Connection Timeout",
            description: "Could not connect to Kate. Please check your microphone permissions and try again.",
            variant: "destructive",
          });
        }
      }, 15000);
    }
    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, [isConnecting, isCallActive, toast]);

  /* GEMINI MIGRATION: VAPI initialization commented out
  useEffect(() => {
    vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);
    const vapi = vapiRef.current;
    vapi.on("call-start", () => { ... });
    vapi.on("call-end", () => { ... });
    vapi.on("error", (error) => { ... });
    return () => { vapiRef.current?.stop(); };
  }, [toast]);
  END VAPI CODE */

  // Gemini callback handlers
  const handleGeminiConnect = () => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    setIsConnecting(false);
    setIsCallActive(true);
    setConnectionError(null);
    toast({
      title: "Connected to Kate",
      description: "You're now talking via Gemini!",
    });
  };

  const handleGeminiDisconnect = () => {
    setIsCallActive(false);
    setIsConnecting(false);
    toast({
      title: "Call Ended",
      description: "Thanks for talking with Kate!",
    });
  };

  /* GEMINI MIGRATION: handleStartCall commented out - GeminiLiveButton handles this
  const handleStartCall = async () => { ... };
  const handleStopCall = () => { vapiRef.current?.stop(); };
  END VAPI CODE */

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Share this demo with others.",
    });
  };

  const handleCreateAnother = () => {
    navigate("/");
  };

  const tips = [
    { icon: Lightbulb, text: "Ask about your services" },
    { icon: Lightbulb, text: "Test appointment booking" },
    { icon: Lightbulb, text: "Try common customer questions" },
  ];

  return (
    <PageLayout>
      <StepCard currentStep={3}>
        <div className="text-center">
          {/* Success Message */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-step-complete" />
            <span className="text-xl font-bold text-step-complete">
              Your AI Agent is Ready!
            </span>
          </div>

          <p className="text-foreground mb-8">
            Welcome, {decodeURIComponent(name)}! Meet Kate, your personalized AI receptionist.
          </p>

          {/* Kate Avatar */}
          <div className="relative inline-block mb-4">
            <div className={cn(
              "w-40 h-40 rounded-full overflow-hidden border-4 shadow-lg mx-auto transition-all duration-300",
              isCallActive ? "border-step-complete shadow-step-complete/30" : "border-card"
            )}>
              <img
                src={kateAvatar}
                alt="Kate - AI Receptionist"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={cn(
              "absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-card transition-colors",
              isCallActive ? "bg-step-complete animate-pulse" : "bg-step-complete"
            )} />
          </div>

          <p className="text-step-complete font-medium mb-6 flex items-center justify-center gap-2">
            <span className={cn(
              "w-2 h-2 bg-step-complete rounded-full",
              isCallActive && "animate-pulse"
            )} />
            {isCallActive ? "On Call" : "Online"}
          </p>

          {/* GEMINI MIGRATION: Replaced VAPI button with GeminiLiveButton */}
          <div className="mb-6">
            <GeminiLiveButton
              agentId={agentId}
              onConnect={handleGeminiConnect}
              onDisconnect={handleGeminiDisconnect}
              disabled={isConnecting}
            />
          </div>

          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
            Click the button and allow microphone access.
            <br />
            Kate knows all about your business and is ready to help!
          </p>

          {/* Tips Section */}
          <div className="bg-muted rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 justify-center text-foreground"
                >
                  <tip.icon className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium">{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </StepCard>

      {/* Bottom Links */}
      <div className="hidden md:flex items-center justify-end gap-6 max-w-4xl mx-auto mt-6">
        <button
          onClick={handleShare}
          className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share this demo
        </button>
        <button
          onClick={handleCreateAnother}
          className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create another agent
        </button>
      </div>

      {/* Kate Chat Widget - keeping for text chat backup */}
      <KateChatWidget
        vapiPublicKey={import.meta.env.VITE_VAPI_PUBLIC_KEY || ""}
        agentId={agentId}
        avatar={kateAvatar}
      />
    </PageLayout>
  );
};

// Helper for conditional classes
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export default Demo;
