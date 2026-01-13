import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "Creates social media content",
  "Schedules posts across all platforms",
  "Engages with your audience",
  "Optimizes SEO & AEO",
  "Tracks performance metrics",
  "Amplifies your brand voice",
];

const LexiWhatDoesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What <span className="text-gradient-lexi">Lexi</span> Does:
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="p-6 rounded-2xl bg-pink-500/5 border border-pink-500/20 backdrop-blur-sm hover:bg-pink-500/10 hover:border-pink-500/40 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/30 transition-colors">
                    <Check className="w-5 h-5 text-pink-400" />
                  </div>
                  <span className="text-white font-medium text-lg">{feature}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LexiWhatDoesSection;
