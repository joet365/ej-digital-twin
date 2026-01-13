import { motion } from "framer-motion";

type BenefitCategory = "sales" | "operations" | "marketing";

interface Benefit {
  text: string;
  category: BenefitCategory;
}

const benefits: Benefit[] = [
  // PURPLE BORDER (Sales)
  { text: "AI Sales Assistant", category: "sales" },
  { text: "AI Receptionist", category: "sales" },
  { text: "Speed to Lead", category: "sales" },
  { text: "Never Miss a Call", category: "sales" },
  { text: "Generate Leads", category: "sales" },
  { text: "Qualify Leads", category: "sales" },
  { text: "Enrich Leads", category: "sales" },
  { text: "Increase Conversion Rate", category: "sales" },
  { text: "Boost Revenue Growth", category: "sales" },
  
  // BLUE BORDER (Operations)
  { text: "Operational Efficiency", category: "operations" },
  { text: "Automate Workflows", category: "operations" },
  { text: "Save Costs", category: "operations" },
  { text: "Decrease Cost Per Lead", category: "operations" },
  { text: "Lead Qualification on Autopilot", category: "operations" },
  
  // PINK BORDER (Marketing)
  { text: "Automate Social Content", category: "marketing" },
  { text: "Increase SEO & AEO Results", category: "marketing" },
  { text: "Increase Opt-In Rate", category: "marketing" },
  { text: "Reach Relevant Prospects", category: "marketing" },
  { text: "Increase Pipeline", category: "marketing" },
  { text: "Stay Ahead of Competition", category: "marketing" },
];

const borderColors: Record<BenefitCategory, string> = {
  sales: "border-l-purple-500",
  operations: "border-l-blue-500",
  marketing: "border-l-pink-500",
};

const glowColors: Record<BenefitCategory, string> = {
  sales: "hover:shadow-purple-500/20",
  operations: "hover:shadow-blue-500/20",
  marketing: "hover:shadow-pink-500/20",
};

const BenefitsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-muted/70 via-muted/40 to-background relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Amplify Intelligence, Accelerate Growth
          </h2>
          <p className="text-xl text-muted-foreground">
            Power your growth with AI workers that identify, engage, and convert—free your team for higher-impact work
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className={`
                bg-card border border-border rounded-lg p-5
                border-l-4 ${borderColors[benefit.category]}
                shadow-sm hover:shadow-lg ${glowColors[benefit.category]}
                transition-shadow duration-300 cursor-default
              `}
            >
              <p className="text-foreground font-medium text-center">
                {benefit.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
