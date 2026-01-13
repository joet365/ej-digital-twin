import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({ size = "lg", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg
        className="animate-spin-slow"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(239, 84%, 67%)" />
            <stop offset="50%" stopColor="hsl(271, 81%, 76%)" />
            <stop offset="100%" stopColor="hsl(217, 91%, 68%)" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="hsl(220, 14%, 96%)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="url(#spinner-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="180 252"
          transform="rotate(-90 50 50)"
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
