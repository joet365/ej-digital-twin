import { ReactNode } from "react";
import ProgressStepper from "./ProgressStepper";

interface StepCardProps {
  currentStep: number;
  children: ReactNode;
}

const StepCard = ({ currentStep, children }: StepCardProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-scale-in">
      <ProgressStepper currentStep={currentStep} />
      <div className="bg-card rounded-b-2xl shadow-card p-8 md:p-12">
        {children}
      </div>
    </div>
  );
};

export default StepCard;
