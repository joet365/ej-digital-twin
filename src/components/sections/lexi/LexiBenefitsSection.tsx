import { motion } from "framer-motion";

const benefits = [
  {
    stat: "24/7",
    label: "Consistent brand presence",
  },
  {
    stat: "3x",
    label: "Increased engagement rates",
  },
  {
    stat: "50%",
    label: "Higher SEO rankings",
  },
  {
    stat: "10+",
    label: "Hours saved per week",
  },
];

const LexiBenefitsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Results You Can Expect
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-500/10 to-orange-500/10 border border-white/10 backdrop-blur-sm hover:border-pink-500/40 transition-all duration-300 text-center">
                <div className="text-5xl md:text-6xl font-bold text-gradient-lexi mb-3">
                  {benefit.stat}
                </div>
                <p className="text-white/70 font-medium">{benefit.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LexiBenefitsSection;
