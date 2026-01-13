import { motion } from "framer-motion";
import { MessageSquare, FileText, Mail, Megaphone, Video, Search } from "lucide-react";

const contentTypes = [
  {
    title: "Social Media Posts",
    description: "Engaging content for all platforms",
    icon: MessageSquare,
  },
  {
    title: "Blog Articles",
    description: "SEO-optimized long-form content",
    icon: FileText,
  },
  {
    title: "Email Campaigns",
    description: "Personalized email sequences",
    icon: Mail,
  },
  {
    title: "Ad Copy",
    description: "High-converting ad text",
    icon: Megaphone,
  },
  {
    title: "Video Scripts",
    description: "Engaging video content",
    icon: Video,
  },
  {
    title: "SEO Content",
    description: "Search-optimized articles",
    icon: Search,
  },
];

const LexiContentTypesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Content <span className="text-gradient-lexi">Lexi</span> Creates
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            From social posts to SEO articles, Lexi handles it all
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {contentTypes.map((content, index) => (
            <motion.div
              key={content.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-pink-500/40 transition-all duration-300 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:from-pink-500/30 group-hover:to-orange-500/30 transition-all">
                  <content.icon className="w-7 h-7 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{content.title}</h3>
                <p className="text-white/60">{content.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LexiContentTypesSection;
