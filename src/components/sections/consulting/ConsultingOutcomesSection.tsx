import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedCounterProps {
  value: string;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter = ({ value, suffix = "", prefix = "" }: AnimatedCounterProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
      const duration = 2;
      const startTime = Date.now();
      
      const updateValue = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(numericValue * eased);
        setDisplayValue(current.toString());
        
        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };
      
      requestAnimationFrame(updateValue);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};

const outcomes = [
  {
    value: "35-50",
    suffix: "%",
    label: "Increase in conversion rates",
  },
  {
    value: "20-30",
    suffix: "%",
    label: "Reduction in sales cycle",
  },
  {
    value: "40",
    suffix: "%+",
    label: "Operational cost savings",
  },
  {
    value: "24/7",
    suffix: "",
    label: "Customer engagement capability",
    isStatic: true,
  },
];

const ConsultingOutcomesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-purple-500/5 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Typical Outcomes
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {outcomes.map((outcome, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-all duration-300 text-center overflow-hidden"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-bold text-gradient-consulting mb-3">
                  {outcome.isStatic ? (
                    outcome.value
                  ) : (
                    <AnimatedCounter 
                      value={outcome.value.split("-")[0]} 
                      suffix={outcome.value.includes("-") ? `-${outcome.value.split("-")[1]}${outcome.suffix}` : outcome.suffix}
                    />
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  {outcome.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultingOutcomesSection;
