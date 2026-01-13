import { motion } from "framer-motion";
import flowDiagram from "@/assets/conquer365-flow-diagram.jpg";
const FlowDiagramSection = () => {
  return <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-primary/5 via-accent/5 to-background">
      {/* Subtle background accents */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-100px"
      }} transition={{
        duration: 0.6
      }}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            One Platform, Every Channel
          </h2>
          <p className="text-xl text-muted-foreground">
            Capture and convert leads from every customer touchpoint—automatically
          </p>
        </motion.div>

        {/* Flow Diagram */}
        <motion.div className="max-w-5xl mx-auto" initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-100px"
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
          <motion.div className="relative rounded-2xl overflow-hidden shadow-2xl" whileHover={{
          scale: 1.02
        }} transition={{
          duration: 0.3
        }}>
            <img src={flowDiagram} alt="Conquer365 flow diagram showing how Phone, Chat, Social, Email, and SMS channels connect through the platform to generate Leads, Appointments, Revenue, Analytics, and Marketing results" className="w-full h-auto" />
          </motion.div>

          {/* Powered by text */}
          
        </motion.div>
      </div>
    </section>;
};
export default FlowDiagramSection;