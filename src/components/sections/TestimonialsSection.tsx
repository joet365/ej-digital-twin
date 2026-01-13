import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "KATE captured 47 leads in the first month. That's $30,000 in revenue we would have lost.",
      name: "John D.",
      company: "ABC HVAC",
      rating: 5,
      initials: "JD",
    },
    {
      quote: "I used to miss 10-15 calls a week. Now I miss zero. KATE pays for herself 10x over.",
      name: "Sarah M.",
      company: "Smith Law Firm",
      rating: 5,
      initials: "SM",
    },
    {
      quote: "Our clients love the 24/7 availability. KATE handles intake perfectly.",
      name: "Dr. Lisa T.",
      company: "Wellness MedSpa",
      rating: 5,
      initials: "LT",
    },
  ];

  return (
    <section className="py-32 gradient-section-accent relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-success/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Trusted by Service Businesses
          </h2>
          <p className="text-xl text-muted-foreground">
            See what business owners are saying about KATE
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative bg-card border border-border rounded-2xl p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-accent/30 h-full">
                {/* Gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 via-transparent to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Large quote icon in background */}
                <Quote className="absolute top-6 right-6 w-16 h-16 text-accent/10 group-hover:text-accent/20 transition-colors duration-300" />

                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                      >
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg text-foreground mb-8 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-border">
                    {/* Avatar placeholder with gradient */}
                    <motion.div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground font-semibold"
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--primary)) 100%)",
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {testimonial.initials}
                    </motion.div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
