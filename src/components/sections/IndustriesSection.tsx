import { Wrench, Scale, Sparkles, Stethoscope, Factory, Code } from "lucide-react";
import { motion } from "framer-motion";

const IndustriesSection = () => {
  const industries = [
    { 
      icon: Wrench, 
      name: "HVAC",
      description: "Heating & cooling",
      gradient: "from-orange-500/20 to-red-500/20",
    },
    { 
      icon: Scale, 
      name: "Lawyers",
      description: "Legal services",
      gradient: "from-blue-500/20 to-indigo-500/20",
    },
    { 
      icon: Sparkles, 
      name: "MedSpa",
      description: "Beauty & wellness",
      gradient: "from-pink-500/20 to-purple-500/20",
    },
    { 
      icon: Stethoscope, 
      name: "Doctors",
      description: "Medical practices",
      gradient: "from-teal-500/20 to-cyan-500/20",
    },
    { 
      icon: Factory, 
      name: "Manufacturing",
      description: "Industrial services",
      gradient: "from-slate-500/20 to-zinc-500/20",
    },
    { 
      icon: Code, 
      name: "Technology",
      description: "Software & IT",
      gradient: "from-violet-500/20 to-purple-500/20",
    },
  ];

  return (
    <section className="py-32 gradient-section-accent relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Built for Service Businesses
          </h2>
          <p className="text-xl text-muted-foreground">
            Kate is trained to handle calls for a wide range of industries
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="group cursor-pointer"
            >
              <div className={`relative bg-card border border-border rounded-2xl p-6 text-center transition-all duration-500 hover:shadow-2xl hover:border-accent/30 h-full overflow-hidden`}>
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-accent rounded-2xl" />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-all duration-300"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <industry.icon className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                  <p className="font-semibold text-foreground mb-1">{industry.name}</p>
                  <p className="text-xs text-muted-foreground">{industry.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
