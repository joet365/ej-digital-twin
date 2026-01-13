import { Phone, Clock, UserCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import kateImage from "@/assets/kate-ai-agent.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid" />

      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1]
        }} transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }} />
        <motion.div className="absolute bottom-20 left-20 w-80 h-80 bg-success/20 rounded-full blur-3xl" animate={{
          y: [0, 20, 0],
          scale: [1, 1.05, 1]
        }} transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }} />
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" animate={{
          scale: [1, 1.2, 1]
        }} transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }} />
      </div>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(12)].map((_, i) => <motion.div key={i} className="particle" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }} animate={{
          y: [0, -100, 0],
          opacity: [0.2, 0.5, 0.2]
        }} transition={{
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 4
        }} />)}
      </div>

      <div className="container relative z-10 pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium text-primary-foreground" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }}>
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              Available 24/7
            </motion.div>

            <motion.h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-primary-foreground" initial={{
              opacity: 0,
              y: 40
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.1
            }}>
              Meet Kate, Your{" "}
              <span className="text-gradient">AI Receptionist & Sales Assistant</span>
            </motion.h1>

            <motion.p className="text-xl md:text-2xl text-primary-foreground/80 max-w-xl" initial={{
              opacity: 0,
              y: 40
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }}>Never miss a call or lose a lead again. Kate answers every call professionally, qualifies prospects, and books appointments, 24/7.</motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4" initial={{
              opacity: 0,
              y: 40
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.3
            }}>
              <Link to="/onboarding">
                <Button variant="success" size="xl" className="group glow-success hover:scale-105 transition-all duration-300">
                  Try Kate Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="ghost" size="xl" className="border border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-transparent">
                See How It Works
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div className="flex items-center gap-8 pt-4 text-sm text-primary-foreground/70" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.4
            }}>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>No missed calls</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>24/7 availability</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>Pay per lead</span>
              </div>
            </motion.div>
          </div>

          {/* Right illustration - Kate AI Agent Image */}
          <motion.div className="relative lg:pl-12" initial={{
            opacity: 0,
            x: 40
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }}>
            <motion.div className="relative" animate={{
              y: [0, -10, 0]
            }} transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}>
              <img src={kateImage} alt="Kate - AI Receptionist" className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl" />
            </motion.div>

            {/* Floating badge */}
            <motion.div className="absolute -top-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-xl shadow-lg text-sm font-semibold glow-success" initial={{
              opacity: 0,
              scale: 0
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              delay: 0.6,
              type: "spring"
            }}>
              47 leads this month
            </motion.div>

            {/* Floating accent elements */}
            <motion.div className="absolute -bottom-8 -left-8 w-20 h-20 bg-accent/30 rounded-2xl blur-xl" animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0]
            }} transition={{
              duration: 4,
              repeat: Infinity
            }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
