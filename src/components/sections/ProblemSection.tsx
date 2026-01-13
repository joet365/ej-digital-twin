import { DollarSign, PhoneOff, Clock } from "lucide-react";
import { motion } from "framer-motion";

const ProblemSection = () => {
  const problems = [
    {
      icon: Clock,
      title: "After-Hours Calls",
      loss: "$2,500",
      period: "lost per month",
      description: "Customers call when you're closed and never call back",
    },
    {
      icon: PhoneOff,
      title: "Busy Times",
      loss: "$5,000",
      period: "lost per month",
      description: "Calls go unanswered when your team is overwhelmed",
    },
    {
      icon: DollarSign,
      title: "Weekends & Holidays",
      loss: "Customers",
      period: "gone forever",
      description: "Your competition answers when you don't",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section className="py-32 gradient-section-light relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-destructive/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Every Missed Call is Money Walking Out the Door
          </h2>
          <p className="text-xl text-muted-foreground">
            While you're busy running your business, potential customers are calling—and hanging up.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-card border border-border rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl hover:border-destructive/30 hover:-translate-y-2"
              whileHover={{ scale: 1.02 }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-6 group-hover:bg-destructive/20 group-hover:scale-110 transition-all duration-300">
                  <problem.icon className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{problem.title}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-destructive">{problem.loss}</span>
                  <span className="text-muted-foreground ml-2 text-lg">{problem.period}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="relative bg-card border border-border rounded-3xl p-10 md:p-14 text-center overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Animated background pulse */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-transparent to-destructive/5"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          <div className="relative z-10">
            <p className="text-muted-foreground mb-3 text-lg">Industry Research Shows:</p>
            <motion.p 
              className="text-3xl md:text-4xl font-bold text-foreground"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              The average small business loses{" "}
              <span className="text-destructive">$75,000/year</span> in missed calls
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
