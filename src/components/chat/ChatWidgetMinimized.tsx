import { MessageCircle, X, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface ChatWidgetMinimizedProps {
    onClick: () => void;
    isOnline: boolean;
    isActive: boolean;
    avatar: string;
    videoUrl?: string;
}

const ChatWidgetMinimized = ({
    onClick,
    isOnline,
    isActive,
    avatar,
    videoUrl
}: ChatWidgetMinimizedProps) => {
    // Determine if we should show the large video popup or the minimized pill
    // Default to true (popup) if a video URL is provided
    const [showPopup, setShowPopup] = useState(!!videoUrl);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Cleanup video on unmount to prevent audio loops
    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        };
    }, []);

    const handleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowPopup(false);
    };

    const handleVideoClick = () => {
        if (isMuted) {
            // Unmute and restart video
            setIsMuted(false);
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play();
            }
        } else {
            // If already unmuted, clicking opens the chat (micro-commitment completed)
            if (videoRef.current) {
                videoRef.current.pause();
            }
            onClick();
        }
    };

    if (showPopup && videoUrl) {
        return (
            <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-500">
                <div
                    className="relative group w-[220px] sm:w-[260px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] cursor-pointer bg-white"
                    onClick={handleVideoClick}
                >
                    {/* Video Elements */}
                    <div className="absolute inset-0 bg-black/10 z-10" />
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                    />

                    {/* Online Badge */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full pointer-events-none">
                        <div className={cn("w-2.5 h-2.5 rounded-full", isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
                        <span className="text-xs font-medium text-white">Kate is online</span>
                    </div>

                    {/* Volume/Unmute Overlay Hint */}
                    {isMuted && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center animate-pulse">
                                <Volume2 className="w-6 h-6 text-white text-opacity-90" />
                            </div>
                        </div>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={handleMinimize}
                        className="absolute top-4 right-4 z-30 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Bottom CTA */}
                    <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center px-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (videoRef.current) {
                                    videoRef.current.pause();
                                }
                                onClick();
                            }}
                            className="w-full bg-white/90 hover:bg-white text-primary font-semibold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5 fill-current" />
                            Hi, want to chat?
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Minimized Pill State
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 animate-in slide-in-from-bottom-4 duration-500">
            {/* Minimized Pill */}
            <button
                onClick={onClick}
                className={cn(
                    "group flex items-center gap-3 p-1.5 pl-4 pr-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
                    "bg-white border-2 border-primary/10",
                    isActive ? "ring-2 ring-primary ring-offset-2" : ""
                )}
            >
                <div className="relative">
                    <img
                        src={avatar}
                        alt="Kate"
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                        isOnline ? "bg-green-500" : "bg-gray-400"
                    )} />
                </div>
                <div className="text-left">
                    <p className="text-xs font-medium text-muted-foreground">Kate AI</p>
                    <p className="text-sm font-bold text-primary flex items-center gap-1">
                        Hi, want to chat?
                    </p>
                </div>
            </button>
        </div>
    );
};

export default ChatWidgetMinimized;
