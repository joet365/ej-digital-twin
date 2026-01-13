import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, Clock, Zap, Settings, Play } from "lucide-react";
import joeHeadshot from "@/assets/joe-headshot.jpg";

const JoeHeroSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero-joe">
      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black border-white/20">
          <video
            controls
            autoPlay
            poster="/videos/joe-poster.jpg"
            className="w-full aspect-video"
          >
            <source src="/videos/joe-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-500/30 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-teal-300 text-sm font-medium">Available 24/7</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Meet <span className="text-gradient-joe">Joe</span>, Your AI Operations Specialist
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
              Streamline workflows, automate processes, and scale your operations—24/7
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button
                size="xl"
                className="bg-teal-500 hover:bg-teal-600 text-white glow-teal group"
                onClick={() => document.getElementById('discovery-call')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Schedule Free Discovery Call
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 group"
                onClick={() => setIsVideoOpen(true)}
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                See Joe in Action
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              {[
                { icon: Settings, text: "Workflow Automation" },
                { icon: Clock, text: "24/7 Efficiency" },
                { icon: Zap, text: "Seamless Integration" },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2 text-white/70"
                >
                  <item.icon className="w-5 h-5 text-teal-400" />
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right content - Joe's image and video */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-blue-500/30 rounded-3xl blur-2xl transform scale-110" />
              
              {/* Main image container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                <img
                  src={joeHeadshot}
                  alt="Joe - AI Operations Specialist"
                  className="w-full h-auto object-cover"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent" />
              </div>

              {/* Stats badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              >
                <div className="text-2xl font-bold text-teal-400">50%</div>
                <div className="text-xs text-white/70">Tasks Automated</div>
              </motion.div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JoeHeroSection;
