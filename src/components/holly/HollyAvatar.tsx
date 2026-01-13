import { cn } from "@/lib/utils";

interface HollyAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showSpeechBubble?: boolean;
  speechText?: string;
  speechPosition?: "left" | "right" | "bottom";
  imageSrc: string;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

export function HollyAvatar({
  size = "md",
  className,
  showSpeechBubble = false,
  speechText,
  speechPosition = "right",
  imageSrc,
}: HollyAvatarProps) {
  return (
    <div className={cn("relative flex items-center gap-4", className)}>
      {showSpeechBubble && speechText && speechPosition === "left" && (
        <div className="relative bg-card border border-border rounded-2xl p-4 shadow-lg max-w-xs animate-fade-in">
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-card" />
          <p className="text-sm text-foreground">{speechText}</p>
        </div>
      )}

      <div
        className={cn(
          "relative rounded-full overflow-hidden ring-4 ring-[hsl(16,85%,58%)]/30 shadow-xl flex-shrink-0",
          sizeClasses[size]
        )}
      >
        <img
          src={imageSrc}
          alt="Holly AI Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {showSpeechBubble && speechText && speechPosition === "right" && (
        <div className="relative bg-card border border-border rounded-2xl p-4 shadow-lg max-w-xs animate-fade-in">
          <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-card" />
          <p className="text-sm text-foreground">{speechText}</p>
        </div>
      )}

      {showSpeechBubble && speechText && speechPosition === "bottom" && (
        <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-2xl p-4 shadow-lg max-w-xs animate-fade-in">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-card" />
          <p className="text-sm text-foreground text-center">{speechText}</p>
        </div>
      )}
    </div>
  );
}
