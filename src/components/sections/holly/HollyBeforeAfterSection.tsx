import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { BeforeAfterSlider } from "@/components/holly/BeforeAfterSlider";

// Using placeholders until images are uploaded
const beforeMain = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop";
const afterMain = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop";
const beforeFireplace = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop";
const afterFireplace = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop";
const beforeLivingroom = "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&h=400&fit=crop";
const afterLivingroom = "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop";

const transformations = [
  {
    id: 1,
    before: beforeMain,
    after: afterMain,
    title: "Kitchen Transformation",
    beforeAlt: "Empty kitchen before staging",
    afterAlt: "Beautifully staged kitchen after Holly",
  },
  {
    id: 2,
    before: beforeFireplace,
    after: afterFireplace,
    title: "Living Room with Fireplace",
    beforeAlt: "Empty living room before staging",
    afterAlt: "Cozy living room after Holly",
  },
  {
    id: 3,
    before: beforeLivingroom,
    after: afterLivingroom,
    title: "Modern Living Space",
    beforeAlt: "Vacant living space before staging",
    afterAlt: "Modern staged living space after Holly",
  },
];

const HollyBeforeAfterSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [selectedTransformation, setSelectedTransformation] = useState<
    (typeof transformations)[0] | null
  >(null);

  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="container">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Real <span className="text-gradient-holly">Transformations</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Click any transformation to compare before and after with our interactive slider
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {transformations.map((item, index) => (
            <div
              key={item.id}
              className={`group cursor-pointer transition-all duration-700 delay-${index * 100} ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              onClick={() => setSelectedTransformation(item)}
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                {/* Before image */}
                <img
                  src={item.before}
                  alt={item.beforeAlt}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                {/* After image */}
                <img
                  src={item.after}
                  alt={item.afterAlt}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-white/70">Hover to see after • Click to compare</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setSelectedTransformation(transformations[0])}
            className="border-[hsl(16,85%,58%)]/30 text-[hsl(16,85%,58%)] hover:bg-[hsl(16,85%,58%)]/10"
          >
            Open Interactive Comparison
          </Button>
        </div>

        {/* Before/After Slider Modal */}
        {selectedTransformation && (
          <BeforeAfterSlider
            isOpen={!!selectedTransformation}
            onClose={() => setSelectedTransformation(null)}
            beforeImage={selectedTransformation.before}
            afterImage={selectedTransformation.after}
            beforeAlt={selectedTransformation.beforeAlt}
            afterAlt={selectedTransformation.afterAlt}
          />
        )}
      </div>
    </section>
  );
};

export default HollyBeforeAfterSection;
