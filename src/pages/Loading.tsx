import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Loader2, RefreshCw } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import StepCard from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LoadingStep {
  id: number;
  label: string;
  status: "pending" | "active" | "complete" | "error";
}

const Loading = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("leadId") || "";
  const name = searchParams.get("name") || "";
  const hasStarted = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Video timeout fallback - ensure button shows after 40 seconds max
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoEnded) {
        console.log('Video timeout reached - showing button');
        setVideoEnded(true);
      }
    }, 40000);
    return () => clearTimeout(timeout);
  }, [videoEnded]);

  // Agent creation timeout - show error after 90 seconds
  useEffect(() => {
    if (!agentId && !errorMessage && hasStarted.current) {
      const timeout = setTimeout(() => {
        if (!agentId && !errorMessage) {
          setErrorMessage("Agent creation is taking longer than expected. Please try again.");
        }
      }, 90000);
      return () => clearTimeout(timeout);
    }
  }, [agentId, errorMessage]);

  const [steps, setSteps] = useState<LoadingStep[]>([
    { id: 1, label: "Verifying your information", status: "active" },
    { id: 2, label: "Reviewing your website", status: "pending" },
    { id: 3, label: "Creating your AI Sales Receptionist", status: "pending" },
    { id: 4, label: "Done! Ready for test", status: "pending" },
  ]);

  const updateStep = (stepId: number, status: LoadingStep["status"]) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId) {
          return { ...step, status };
        }
        if (step.id === stepId + 1 && status === "complete") {
          return { ...step, status: "active" };
        }
        return step;
      })
    );
  };

  useEffect(() => {
    if (!leadId || hasStarted.current) return;
    hasStarted.current = true;

    const buildAgent = async () => {
      try {
        // Step 1: Verifying information (quick visual feedback)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        updateStep(1, "complete");

        // Step 2 & 3: Call the edge function which does scraping + Vapi creation
        const { data, error } = await supabase.functions.invoke("generate-agent", {
          body: { leadId },
        });

        if (error) {
          throw new Error(error.message || "Failed to generate agent");
        }

        if (!data?.success || !data?.agentId) {
          throw new Error(data?.error || "Failed to create agent");
        }

        // Mark step 2 complete (scraping done)
        updateStep(2, "complete");
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Mark step 3 complete (agent created)
        updateStep(3, "complete");
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Step 4: Done
        updateStep(4, "complete");

        // Store agentId - button will show when video also ends
        setAgentId(data.agentId);
      } catch (error: any) {
        console.error("Agent creation error:", error);
        const message = error.message || "Something went wrong. Please try again.";
        setErrorMessage(message);
        toast({
          title: "Error Creating Agent",
          description: message,
          variant: "destructive",
        });

        // Mark current step as error
        setSteps((prev) =>
          prev.map((step) =>
            step.status === "active" ? { ...step, status: "error" } : step
          )
        );
      }
    };

    buildAgent();
  }, [leadId, name, navigate, toast]);

  return (
    <PageLayout>
      <StepCard currentStep={2}>
        <div className="text-center py-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Building Your AI Sales Receptionist
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            This takes about 30-60 seconds. We're analyzing your website and creating a custom agent trained on your business.
          </p>

          {/* Sales video */}
          <div className="relative w-full max-w-lg mx-auto mb-8 aspect-video bg-muted rounded-lg overflow-hidden">
            {videoError ? (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <p className="text-muted-foreground text-center">
                  Video couldn't load. Don't worry - your AI agent is being created!
                </p>
              </div>
            ) : (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                autoPlay
                muted
                playsInline
                onEnded={() => setVideoEnded(true)}
                onError={() => {
                  console.error('Video failed to load');
                  setVideoError(true);
                  setVideoEnded(true);
                }}
              >
                <source src="/videos/kate-intro.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Progress Steps */}
          <div className="space-y-4 max-w-sm mx-auto text-left">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 transition-all duration-300",
                  step.status === "pending" && "opacity-50"
                )}
              >
                {step.status === "complete" ? (
                  <div className="w-6 h-6 rounded-full bg-step-complete flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : step.status === "active" ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin flex-shrink-0" />
                ) : step.status === "error" ? (
                  <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center flex-shrink-0">
                    <span className="text-destructive-foreground text-xs font-bold">!</span>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    step.status === "complete" && "text-step-complete",
                    step.status === "active" && "text-foreground",
                    step.status === "pending" && "text-muted-foreground",
                    step.status === "error" && "text-destructive"
                  )}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Error state with Try Again button */}
          {errorMessage && (
            <div className="mt-8 text-center">
              <p className="text-destructive mb-4">{errorMessage}</p>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/")}
                className="mx-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {/* Talk to Kate button - shows when video ended (even if agent still building) */}
          {!errorMessage && videoEnded && (
            <Button 
              variant={agentId ? "success" : "outline"}
              size="xl"
              disabled={!agentId}
              onClick={() => agentId && navigate(`/demo?agentId=${agentId}&name=${encodeURIComponent(name)}`)}
              className="mt-8 mx-auto flex flex-col items-center gap-1 h-auto py-4"
            >
              <span className="text-lg font-semibold">
                {agentId ? "Talk to Kate" : "Almost Ready..."}
              </span>
              <span className="text-sm opacity-80 font-normal">
                {agentId ? "Your demo is ready" : "Creating your agent..."}
              </span>
            </Button>
          )}
        </div>
      </StepCard>
    </PageLayout>
  );
};

export default Loading;
