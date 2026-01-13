import { motion } from "framer-motion";

const platforms = [
  { name: "Facebook", color: "from-blue-600 to-blue-500" },
  { name: "Instagram", color: "from-pink-600 to-purple-500" },
  { name: "LinkedIn", color: "from-blue-700 to-blue-600" },
  { name: "Twitter/X", color: "from-gray-800 to-gray-700" },
  { name: "TikTok", color: "from-pink-500 to-cyan-500" },
  { name: "YouTube", color: "from-red-600 to-red-500" },
];

const LexiPlatformsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Platforms <span className="text-gradient-lexi">Lexi</span> Manages
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            One AI, all your channels
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="group"
            >
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-pink-500/40 transition-all duration-300 text-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <span className="text-white font-bold text-lg">{platform.name.charAt(0)}</span>
                </div>
                <p className="text-white font-medium text-sm">{platform.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LexiPlatformsSection;
