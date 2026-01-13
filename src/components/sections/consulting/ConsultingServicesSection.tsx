import { motion } from "framer-motion";
import { Map, Search, Rocket, TrendingUp, Building2, Puzzle } from "lucide-react";

const services = [
  {
    icon: Map,
    title: "AI Strategy & Roadmapping",
    description: "Define goals, identify use cases, create phased plan",
  },
  {
    icon: Search,
    title: "Technology Selection",
    description: "Evaluate platforms, recommend best-fit solutions",
  },
  {
    icon: Rocket,
    title: "Implementation Guidance",
    description: "Deployment support, team training, change management",
  },
  {
    icon: TrendingUp,
    title: "Performance Optimization",
    description: "Monitor effectiveness, refine, scale",
  },
  {
    icon: Building2,
    title: "Industry Expertise",
    description: "Specialized knowledge for your sector",
  },
  {
    icon: Puzzle,
    title: "Custom Solutions",
    description: "Tailored AI strategies for unique business needs",
  },
];

const ConsultingServicesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-purple-500/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Consulting Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive AI guidance for every stage of your journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-border shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center mb-4 group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300">
                <service.icon className="w-6 h-6 text-purple-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultingServicesSection;
