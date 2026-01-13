import { motion } from "framer-motion";

const benefits = [
  {
    stat: "50%",
    label: "Reduction in manual tasks",
  },
  {
    stat: "30%",
    label: "Faster processing time",
  },
  {
    stat: "24/7",
    label: "Operational efficiency",
  },
  {
    stat: "100%",
    label: "Seamless integration",
  },
];

const JoeBenefitsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
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
              <div className="p-8 rounded-2xl bg-gradient-to-br from-teal-500/10 to-blue-500/10 border border-white/10 backdrop-blur-sm hover:border-teal-500/40 transition-all duration-300 text-center">
                <div className="text-5xl md:text-6xl font-bold text-gradient-joe mb-3">
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

export default JoeBenefitsSection;
