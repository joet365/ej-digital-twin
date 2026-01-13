import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FlowDiagramSection from "@/components/sections/FlowDiagramSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import HomepageDemoSection from "@/components/sections/HomepageDemoSection";
import SiteSimulator from "./SiteSimulator";

import kateHeadshot from "@/assets/kate-headshot.jpg";
import joeHeadshot from "@/assets/joe-headshot.jpg";
import lexiHeadshot from "@/assets/lexi-headshot.jpg";

const team = [
  {
    name: "Kate",
    role: "AI Receptionist",
    description: "Answers every call 24/7, captures leads, and books appointments automatically.",
    image: kateHeadshot,
    link: "/kate",
  },
  {
    name: "Joe",
    role: "AI Implementation Expert",
    description: "Guides your AI transformation with technical expertise and custom solutions.",
    image: joeHeadshot,
    link: "/joe",
  },
  {
    name: "Lexi",
    role: "AI Content & Social",
    description: "Creates engaging content and manages your social presence around the clock.",
    image: lexiHeadshot,
    link: "/lexi",
  },
];

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] gradient-hero overflow-hidden flex items-center">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-grid" />

        {/* Floating gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
            animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-80 h-80 bg-success/20 rounded-full blur-3xl"
            animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container relative z-10 pt-32 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-primary-foreground mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              10X Your Business with a{" "}
              <span className="text-gradient">Digital AI Workforce</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Conquer365's AI team captures every lead, automates your operations, and amplifies your marketing, across every channel.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/onboarding">
                <Button
                  variant="success"
                  size="xl"
                  className="group glow-success hover:scale-105 transition-all duration-300"
                >
                  Get started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Try Kate Demo Section */}
      <HomepageDemoSection />

      {/* Meet Our Digital Workers Section */}
      <section className="py-32 bg-gradient-to-b from-muted/60 via-muted/30 to-background relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet our digital workers
            </h2>
            <p className="text-xl text-muted-foreground">
              AI-powered team members that work 24/7 to grow your business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={member.link} className="group block">
                  <motion.div
                    className="bg-card border border-border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-accent/30"
                    whileHover={{ y: -8 }}
                  >
                    {/* Portrait Image */}
                    <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                      <img
                        src={member.image}
                        alt={`${member.name} - ${member.role}`}
                        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                      {/* Name and role overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-foreground mb-1">{member.name}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{member.role}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="p-6 pt-4">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {member.description}
                      </p>
                      <div className="flex items-center text-accent font-semibold group-hover:gap-2 transition-all">
                        Meet {member.name}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow Diagram Section */}
      <FlowDiagramSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Bottom CTA Section */}
      <section className="py-32 gradient-cta-animated relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />

        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-success/20 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-8">
              Ready to hire your digital workers?
            </h2>

            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto">
              Transform your business with AI team members that work around the clock.
            </p>

            <Link to="/onboarding">
              <Button
                size="xl"
                className="bg-success text-success-foreground hover:bg-success/90 shadow-2xl transition-all duration-300 text-xl px-12 py-7 animate-pulse-glow hover:scale-105"
              >
                Get started today
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Index;
