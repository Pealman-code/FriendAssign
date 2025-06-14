import React from "react";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Benifit = () => {
  const items = [
    "👥 Collaborative Group Study",
    "📝 Create & Submit Assignments",
    "🎓 Peer-to-Peer Grading",
    "📅 Track Progress",
    "🔒 Secure User Access",
    "📱 Responsive Interface",
  ];

  return (
    <section className="flex flex-col md:flex-row items-center p-20 bg-gray-100 gap-8">
      <div className="md:w-1/2 mb-6 md:mb-0">
        <img
          src="https://i.postimg.cc/0NKjPkhH/0f770ed96ae280e123c40e90be24a604.jpg"
          alt="Crate with vegetables"
          className="rounded-lg shadow-lg w-full h-auto m-auto"
        />
      </div>
      <div className="md:w-1/2">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-gray-800 mb-4"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
        >
          Make learning simple and fun
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-6 text-sm md:text-lg"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ delay: 0.2 }}
        >
          Tools for collaboration, assignments, and peer feedback
        </motion.p>
        <motion.ul
          className="space-y-2 mb-6"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ delay: 0.4 }}
        >
          {items.map((item, i) => (
            <motion.li
              key={i}
              className="text-gray-700 text-sm md:text-base"
              variants={textVariants}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>
        <motion.button
          className="btn btn-outline btn-info py-2 px-4"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ delay: 0.8 }}
        >
          JOIN US
        </motion.button>
      </div>
    </section>
  );
};

export default Benifit;