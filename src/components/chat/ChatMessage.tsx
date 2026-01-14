import { cn } from "@/lib/utils";
import { QuickReplyOptions } from "./QuickReplyButton";
import { MapPin, ExternalLink } from "lucide-react";

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
    locationId?: string;
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
    locationId,
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

    const renderLocationCard = () => {
        if (!locationId) return null;

        const address = "5538 South Peek Road, Katy, TX 77450";
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

        return (
            <div className="mb-3 rounded-2xl overflow-hidden border border-border/50 shadow-md bg-card animate-in zoom-in-95 duration-500">
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                    <img
                        src="https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=0&panoid=Ngvd2DQmnzIwouQP0zzjOQ&yaw=257.84894"
                        alt="Katy Branch Office"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider">Katy Branch Office</span>
                    </div>
                </div>
                <div className="p-4 space-y-3">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Address</p>
                        <p className="text-sm font-bold leading-tight">{address}</p>
                    </div>
                    <button
                        onClick={() => window.open(mapUrl, '_blank')}
                        className="w-full py-2.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
                    >
                        <ExternalLink className="w-3 h-3" />
                        View on Google Maps
                    </button>
                </div>
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
                    {renderLocationCard()}
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
