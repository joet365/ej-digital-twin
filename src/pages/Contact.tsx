import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, Bot, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How much does Conquer365 cost?",
    answer: "Our pay-per-lead pricing starts at $25 per qualified lead. No monthly fees, no setup costs—you only pay for results. This model ensures you get real value from every dollar spent."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! You can try Kate completely free with no commitment. Experience how our AI receptionist handles calls, qualifies leads, and books appointments before making any decision."
  },
  {
    question: "How long does onboarding take?",
    answer: "Most businesses are live within 24-48 hours. Our team handles the technical setup, and we'll work with you to customize Kate's responses to match your brand and business needs."
  },
  {
    question: "What do I need to get started?",
    answer: "Just your business information and call routing preferences. We'll handle the rest—from setting up your AI receptionist to integrating with your existing systems."
  },
  {
    question: "What systems does Conquer365 integrate with?",
    answer: "We integrate with popular CRMs (HubSpot, Salesforce, Zoho), calendar systems (Google Calendar, Outlook), and automation platforms like Zapier and Make for custom workflows."
  },
  {
    question: "Can I connect my existing CRM?",
    answer: "Absolutely! We support direct integrations with major CRMs and can set up custom connections via our API or Zapier. Your leads flow directly into your existing systems."
  }
];

const Contact = () => {
  useEffect(() => {
    // Load the Maisy365 form embed script
    const script = document.createElement("script");
    script.src = "https://api2.maisy365.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://api2.maisy365.com/js/form_embed.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact Us | Conquer365</title>
        <meta
          name="description"
          content="Get in touch with Conquer365. Our AI team is ready 24/7 to help you capture more leads and grow your business."
        />
      </Helmet>

      <Navbar />

      {/* Main Contact Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-16 overflow-hidden">
        {/* Teal glow accent */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Ready to transform your business with AI? Let's talk.
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* LEFT COLUMN - Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden p-0 min-h-[800px] lg:min-h-[850px]"
            >
              <iframe
                src="https://api2.maisy365.com/widget/form/IvcdZGQeNLgLcSf3LHUj"
                style={{ width: '100%', height: '850px', border: 'none', borderRadius: '3px' }}
                id="inline-IvcdZGQeNLgLcSf3LHUj"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="conquer365 form"
                data-height="1211"
                data-layout-iframe-id="inline-IvcdZGQeNLgLcSf3LHUj"
                data-form-id="IvcdZGQeNLgLcSf3LHUj"
                title="conquer365 form"
              />
            </motion.div>

            {/* RIGHT COLUMN - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              {/* Title & Subtext */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Get in Touch
                </h2>
                <p className="text-lg text-slate-300">
                  We'd love to hear from you. Our AI team is ready 24/7.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <a 
                  href="mailto:hello@conquer365.com"
                  className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                    <Mail className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-white font-medium">hello@conquer365.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Location</p>
                    <p className="text-white font-medium">Katy, TX</p>
                  </div>
                </div>
              </div>

              {/* Office Hours Card */}
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Clock className="w-5 h-5 text-teal-400" />
                  <h3 className="text-lg font-semibold text-white">Office Hours</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Bot className="w-5 h-5 text-slate-300" />
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-800" />
                    </div>
                    <div>
                      <p className="text-white font-medium">AI Agents</p>
                      <p className="text-sm text-green-400">Available 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-300" />
                    <div>
                      <p className="text-white font-medium">Human Support</p>
                      <p className="text-sm text-slate-400">Mon-Fri, 9am - 6pm CST</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Everything you need to know about getting started with Conquer365.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl px-6 data-[state=open]:bg-white/10 transition-colors"
                >
                  <AccordionTrigger className="text-left text-white hover:text-teal-400 transition-colors py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300 pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
