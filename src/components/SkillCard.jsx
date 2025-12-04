import React from "react";
import { motion } from "framer-motion";

const SkillCard = ({ skill }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-ap [--ap-radius:3rem] bg-[var(--button-color)] rounded-lg p-6 flex flex-col items-center gap-4 w-full max-w-[300px] shadow-lg soft border-2 border-transparent hover:border-[var(--accent-color)] hoverLight"
    >
      <div className="text-7xl text-[var(--text-color)]">
        {React.isValidElement(skill.icon)
          ? React.cloneElement(skill.icon, { color: skill.color || "currentColor" })
          : null}
      </div>
      <h3 className="text-[var(--text-color)] text-xl font-semibold">{skill.name}</h3>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <motion.div
          className="bg-[var(--accent-color)] h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.8}}
        />
      </div>
    </motion.div>
  );
};

export default SkillCard;
