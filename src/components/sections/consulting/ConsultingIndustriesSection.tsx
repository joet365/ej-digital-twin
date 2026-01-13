import { motion } from "framer-motion";
import { Building2, Briefcase, ShoppingCart, Heart, Landmark, Home } from "lucide-react";

const industries = [
  {
    icon: Building2,
    title: "B2B SaaS Companies",
    description: "Sales automation, operations optimization",
  },
  {
    icon: Briefcase,
    title: "Professional Services",
    description: "Client management, workflow automation",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Customer engagement, inventory optimization",
  },
  {
    icon: Heart,
    title: "Healthcare",
    description: "Patient care, administrative automation",
  },
  {
    icon: Landmark,
    title: "Financial Services",
    description: "Risk assessment, customer service",
  },
  {
    icon: Home,
    title: "Real Estate",
    description: "Lead management, property marketing",
  },
];

const ConsultingIndustriesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Industries We Serve
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized AI consulting across multiple sectors
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-gradient-to-br from-purple-500/5 to-blue-500/5 hover:from-purple-500/10 hover:to-blue-500/10 rounded-xl p-6 border border-purple-200/30 dark:border-purple-500/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-shadow duration-300">
                  <industry.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {industry.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {industry.description}
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

export default ConsultingIndustriesSection;
