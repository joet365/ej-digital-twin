import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    question: "What kind of photos can I upload?",
    answer:
      "Holly works with any listing photos—MLS shots, smartphone pics, even older photos. She's trained to enhance and transform images of any quality into stunning lifestyle content.",
  },
  {
    question: "How long does it take to generate content?",
    answer:
      "Most transformations are ready in under 2 minutes. Story videos may take a bit longer, but you'll have scroll-stopping content ready before your coffee gets cold.",
  },
  {
    question: "Can I customize the staging styles?",
    answer:
      "Absolutely! Holly offers multiple staging styles—modern, traditional, minimalist, and more. You can also specify preferences like color schemes and furniture types.",
  },
  {
    question: "Is the content branded with my information?",
    answer:
      "Yes! You can add your logo, contact info, and branding to all generated content. Holly makes sure you get full credit for the amazing visuals.",
  },
  {
    question: "What platforms can I post to?",
    answer:
      "Holly generates content optimized for Instagram, TikTok, Facebook, LinkedIn, and more. Each piece is sized and formatted perfectly for maximum engagement on each platform.",
  },
];

const HollyFAQSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container max-w-3xl">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Frequently Asked <span className="text-gradient-holly">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Holly
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className={`transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left text-foreground hover:text-[hsl(16,85%,58%)] hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default HollyFAQSection;
