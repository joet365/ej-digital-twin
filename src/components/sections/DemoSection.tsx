import { Phone, Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const DemoSection = () => {
  const features = [
    "Customized to your business",
    "Answers professionally 24/7",
    "Qualifies leads",
    "Captures caller information",
    "Books appointments",
    "Transfers phone calls",
  ];

  return (
    <section className="py-32 gradient-section-accent relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            Live Demo
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Try Kate Right Now
          </h2>
          <p className="text-xl text-muted-foreground">
            Call Kate and see how she handles your business. No signup required.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            {/* Animated gradient border container */}
            <div className="gradient-border p-1 rounded-3xl">
              <div className="bg-card rounded-[22px] p-8 md:p-12 shadow-xl">
                {/* Vapi Demo Widget Placeholder */}
                <div className="relative rounded-2xl overflow-hidden">
                  <video 
                    className="w-full rounded-2xl"
                    controls
                    poster="/videos/kate-poster.jpg"
                    preload="metadata"
                  >
                    <source src="/videos/kate-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Features list */}
                <div className="border-t border-border pt-10">
                  <h3 className="text-xl font-semibold text-foreground mb-8 text-center">
                    What Kate Does:
                  </h3>
                  <motion.div 
                    className="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        className="flex items-center gap-3 p-4 bg-success/5 rounded-xl border border-success/10 hover:border-success/30 hover:bg-success/10 transition-all duration-300"
                      >
                        <motion.div 
                          className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                        >
                          <Check className="w-4 h-4 text-success" />
                        </motion.div>
                        <span className="text-sm font-medium text-foreground">{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                  <a href="https://kate.conquer365.com/" target="_blank" rel="noopener noreferrer">
                    <Button 
                      variant="success" 
                      size="xl" 
                      className="group glow-success hover:scale-105 transition-all duration-300 text-lg px-10 py-6"
                    >
                      Demo Kate for Your Business
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;
