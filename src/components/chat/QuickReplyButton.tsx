import { cn } from "@/lib/utils";

interface QuickReplyButtonProps {
    label: string;
    onClick: (label: string) => void;
    variant?: "default" | "primary" | "outline";
    disabled?: boolean;
}

const QuickReplyButton = ({
    label,
    onClick,
    variant = "default",
    disabled = false,
}: QuickReplyButtonProps) => {
    const baseStyles = "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer select-none";

    const variants = {
        default: "bg-muted hover:bg-muted/80 text-foreground border border-border",
        primary: "bg-primary hover:bg-primary/90 text-primary-foreground",
        outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10",
    };

    return (
        <button
            type="button"
            onClick={() => onClick(label)}
            disabled={disabled}
            className={cn(
                baseStyles,
                variants[variant],
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            {label}
        </button>
    );
};

interface QuickReplyOptionsProps {
    options: string[];
    onSelect: (option: string) => void;
    disabled?: boolean;
}

export const QuickReplyOptions = ({
    options,
    onSelect,
    disabled = false,
}: QuickReplyOptionsProps) => {
    if (!options || options.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {options.map((option, index) => (
                <QuickReplyButton
                    key={index}
                    label={option}
                    onClick={onSelect}
                    disabled={disabled}
                />
            ))}
        </div>
    );
};

export default QuickReplyButton;
