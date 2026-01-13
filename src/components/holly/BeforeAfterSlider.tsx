import { useState, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  isOpen,
  onClose,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-card border-border overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">Drag to Compare</h3>
            <p className="text-muted-foreground">
              Slide left and right to see the transformation
            </p>
          </div>

          <div
            ref={containerRef}
            className="relative w-full aspect-[16/10] rounded-xl overflow-hidden cursor-col-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={handleClick}
          >
            {/* After Image (Background) */}
            <img
              src={afterImage}
              alt={afterAlt}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={beforeImage}
                alt={beforeAlt}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  width: containerRef.current?.offsetWidth || "100%",
                  maxWidth: "none",
                }}
              />
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-10"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-4 bg-muted-foreground rounded-full" />
                  <div className="w-0.5 h-4 bg-muted-foreground rounded-full" />
                </div>
              </div>
            </div>

            {/* Labels */}
            <span className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-foreground">
              Before
            </span>
            <span className="absolute bottom-4 right-4 bg-[hsl(16,85%,58%)]/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-white">
              After
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
