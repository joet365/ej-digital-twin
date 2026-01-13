import { motion } from "framer-motion";
import { Check, Target, Lightbulb, Search, Rocket, GraduationCap, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Define AI strategy aligned with business goals",
  },
  {
    icon: Lightbulb,
    title: "Identify high-impact use cases",
  },
  {
    icon: Search,
    title: "Evaluate and select AI platforms",
  },
  {
    icon: Rocket,
    title: "Guide implementation and deployment",
  },
  {
    icon: GraduationCap,
    title: "Train your team on AI tools",
  },
  {
    icon: TrendingUp,
    title: "Optimize and scale AI initiatives",
  },
];

const ConsultingWhatWeDoSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-purple-500/5 to-blue-500/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What We Help You Achieve:
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 dark:border-purple-500/20 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <feature.icon className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-foreground font-medium">
                    {feature.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultingWhatWeDoSection;
