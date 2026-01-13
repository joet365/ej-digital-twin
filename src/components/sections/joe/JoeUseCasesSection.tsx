import { motion } from "framer-motion";
import { Database, GitBranch, FileText, Settings, Link2, BarChart3 } from "lucide-react";

const useCases = [
  {
    title: "CRM Automation",
    description: "Automatic data entry and updates",
    icon: Database,
  },
  {
    title: "Lead Routing",
    description: "Intelligent lead distribution",
    icon: GitBranch,
  },
  {
    title: "Data Entry",
    description: "Eliminate manual data work",
    icon: FileText,
  },
  {
    title: "Workflow Optimization",
    description: "Streamline processes",
    icon: Settings,
  },
  {
    title: "System Integration",
    description: "Connect all your tools",
    icon: Link2,
  },
  {
    title: "Performance Analytics",
    description: "Real-time insights",
    icon: BarChart3,
  },
];

const JoeUseCasesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What <span className="text-gradient-joe">Joe</span> Can Automate
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            From CRM to analytics, Joe handles it all
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-teal-500/40 transition-all duration-300 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:from-teal-500/30 group-hover:to-blue-500/30 transition-all">
                  <useCase.icon className="w-7 h-7 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
                <p className="text-white/60">{useCase.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JoeUseCasesSection;
