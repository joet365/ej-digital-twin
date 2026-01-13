import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HomepageDemoSection = () => {
  const features = [
    "Customized to your business",
    "Answers professionally 24/7",
    "Qualifies leads",
    "Captures caller information",
    "Books appointments",
    "Transfers phone calls",
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-success/5 rounded-full blur-3xl" />

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
          {/* Video container with gradient border */}
          <div className="relative mb-12">
            <div className="gradient-border p-1 rounded-3xl shadow-2xl">
              <div className="bg-card rounded-[22px] overflow-hidden">
                <video 
                  className="w-full"
                  controls
                  poster="/videos/kate-poster.jpg"
                  preload="metadata"
                >
                  <source src="/videos/kate-demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          {/* What Kate Does */}
          <div className="mb-12">
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
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex items-center gap-3 p-4 bg-success/10 rounded-xl shadow-sm hover:shadow-md hover:bg-success/15 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* CTA */}
          <div className="text-center">
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
        </motion.div>
      </div>
    </section>
  );
};

export default HomepageDemoSection;
