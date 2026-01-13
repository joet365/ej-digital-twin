import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How much does Kate cost?",
      answer: "Pay-per-lead pricing starting at $25/lead. No monthly fees. You only pay when Kate captures a qualified lead for your business.",
    },
    {
      question: "Does Kate sound like a robot?",
      answer: "No. Kate uses advanced natural AI voice technology that sounds conversational and professional. Most callers can't tell they're speaking with an AI.",
    },
    {
      question: "Can Kate handle multiple calls at once?",
      answer: "Yes. Kate can handle unlimited simultaneous calls, so you never miss a lead even during your busiest hours.",
    },
    {
      question: "What industries does Kate work for?",
      answer: "Kate works for any service business including HVAC, legal, medical practices, MedSpas, manufacturing, technology companies, and more.",
    },
    {
      question: "How quickly can I get started?",
      answer: "Most businesses are up and running within 24-48 hours after completing the onboarding questionnaire.",
    },
    {
      question: "Can Kate transfer calls to my team?",
      answer: "Absolutely. Kate can transfer calls to your team based on rules you set—by caller type, urgency, or time of day.",
    },
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <HelpCircle className="w-8 h-8 text-accent" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about Kate
          </p>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="group bg-card border border-border rounded-2xl px-6 data-[state=open]:shadow-lg data-[state=open]:border-accent/30 transition-all duration-300 hover:border-accent/20"
                >
                  <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:no-underline py-6 group-data-[state=open]:text-accent transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
