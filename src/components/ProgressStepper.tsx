import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  label: string;
}

interface ProgressStepperProps {
  currentStep: number;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { number: 1, label: "Fill out info" },
  { number: 2, label: "Building your AI receptionist" },
  { number: 3, label: "Talk to Kate" },
];

const ProgressStepper = ({ currentStep, steps = defaultSteps }: ProgressStepperProps) => {
  return (
    <div className="hidden md:block w-full bg-muted/80 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isComplete = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isInactive = step.number > currentStep;

          return (
            <div
              key={step.number}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                isActive && "bg-step-active text-primary-foreground",
                isComplete && "text-step-complete",
                isInactive && "text-muted-foreground"
              )}
            >
              {isComplete ? (
                <div className="w-5 h-5 rounded-full bg-step-complete flex items-center justify-center">
                  <Check className="w-3 h-3 text-success-foreground" />
                </div>
              ) : (
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold",
                    isActive && "bg-primary-foreground/20 text-primary-foreground",
                    isInactive && "bg-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {step.number}
                </div>
              )}
              <span className={cn(
                "text-sm font-medium whitespace-nowrap",
                isActive && "text-primary-foreground",
                isComplete && "text-step-complete",
                isInactive && "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
