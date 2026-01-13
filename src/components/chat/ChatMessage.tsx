import { cn } from "@/lib/utils";
import { QuickReplyOptions } from "./QuickReplyButton";

interface ChatMessageProps {
    message: string;
    isKate: boolean;
    timestamp: Date;
    avatar?: string;
    quickReplies?: string[];
    onQuickReplySelect?: (option: string) => void;
    disableQuickReplies?: boolean;
    imageUrl?: string;
    videoUrl?: string;
}

const ChatMessage = ({
    message,
    isKate,
    timestamp,
    avatar,
    quickReplies,
    onQuickReplySelect,
    disableQuickReplies = false,
    imageUrl,
    videoUrl,
}: ChatMessageProps) => {
    const formattedTime = timestamp.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const renderVideo = () => {
        if (!videoUrl) return null;

        // Check for YouTube/Vimeo
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com')) {
            let embedUrl = videoUrl;
            if (videoUrl.includes('youtube.com/watch?v=')) {
                embedUrl = videoUrl.replace('watch?v=', 'embed/');
            } else if (videoUrl.includes('youtu.be/')) {
                embedUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
            }

            return (
                <div className="mb-2 rounded-lg overflow-hidden border border-border/50 shadow-sm aspect-video">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Shared video"
                    />
                </div>
            );
        }

        return (
            <div className="mb-2 rounded-lg overflow-hidden border border-border/50 shadow-sm">
                <video
                    src={videoUrl}
                    controls
                    className="w-full h-auto max-h-[400px]"
                />
            </div>
        );
    };

    return (
        <div
            className={cn(
                "flex gap-3 mb-4 animate-in slide-in-from-bottom-2 duration-300",
                isKate ? "justify-start" : "justify-end"
            )}
        >
            {isKate && avatar && (
                <div className="flex-shrink-0">
                    <img
                        src={avatar}
                        alt="Kate"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                </div>
            )}

            <div className="flex flex-col max-w-[80%]">
                <div
                    className={cn(
                        "rounded-2xl px-4 py-2.5 shadow-sm",
                        isKate
                            ? "bg-primary text-primary-foreground rounded-tl-none"
                            : "bg-muted text-foreground rounded-tr-none"
                    )}
                >
                    {imageUrl && (
                        <div className="mb-2 rounded-lg overflow-hidden border border-border/50 shadow-sm max-h-[300px]">
                            <img
                                src={imageUrl}
                                alt="Shared image"
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                onClick={() => window.open(imageUrl, '_blank')}
                            />
                        </div>
                    )}
                    {renderVideo()}
                    <p className="text-sm leading-relaxed">{message}</p>
                    <span className={cn(
                        "text-xs mt-1 block",
                        isKate ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                        {formattedTime}
                    </span>
                </div>

                {/* Quick Reply Buttons - Only show for Kate's messages */}
                {isKate && quickReplies && quickReplies.length > 0 && onQuickReplySelect && (
                    <QuickReplyOptions
                        options={quickReplies}
                        onSelect={onQuickReplySelect}
                        disabled={disableQuickReplies}
                    />
                )}
            </div>

            {!isKate && (
                <div className="flex-shrink-0 w-8" />
            )}
        </div>
    );
};

export default ChatMessage;
