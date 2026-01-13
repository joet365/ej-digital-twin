import { Play } from "lucide-react";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Using placeholder until video thumbnail is uploaded
const videoThumbnail = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=675&fit=crop";

const HollyVideoSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [isPlaying, setIsPlaying] = useState(false);

  // TODO: Replace with actual YouTube video ID
  const youtubeVideoId = "YOUR_YOUTUBE_VIDEO_ID";

  return (
    <section className="py-20 lg:py-32 gradient-hero-holly">
      <div className="container">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            See Holly in Action
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Watch how Holly transforms ordinary listing photos into scroll-stopping content
          </p>
        </div>

        <div
          className={`max-w-4xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black/20">
            {!isPlaying ? (
              <>
                {/* Thumbnail */}
                <img
                  src={videoThumbnail}
                  alt="Holly demo video thumbnail"
                  className="w-full h-full object-cover"
                />

                {/* Play button overlay */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors group"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[hsl(16,85%,58%)] to-[hsl(30,90%,65%)] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </button>
              </>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                title="Holly Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HollyVideoSection;
