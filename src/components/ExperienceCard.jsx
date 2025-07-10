import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";



const Experiences = ({exp}) => {

  const experiencesRef = useRef(null);
  const { scrollYProgress } = useScroll({
      target: experiencesRef,
      offset: ["start end", "center start"]
  })
  const x = useTransform(scrollYProgress, [0.07, 0.25, 0.85, 0.97], [-100, 0, 0, 0]);
  const opacity = useTransform(scrollYProgress, [0.07, 0.25, 0.85, 0.97], [0.1, 1, 1, 1]);

  return (
      <motion.div 
      ref={experiencesRef}
      style={{
        x,
        opacity
      }} 
      className="bg-[var(--button-color)] p-[1rem] xs:p-[1.2rem] sm:p-[2rem] rounded-xl shadow-lg border-l-8 border-[var(--accent-color)] w-[90vw] max-w-[900px] mx-[5vw]"
    >
      <h3 className="text-lg xs:text-xl font-bold text-[var(--accent-color)] mb-2">{exp.title}</h3>
      <p className="text-[var(--text-color)] text-xs xs:text-sm italic mb-2">{exp.year || exp.date}</p>
      <p className="text-[var(--text-color)] leading-relaxed text-xs xs:text-sm sm:text-base">{exp.description}</p>
    </motion.div>
  );
};

export default Experiences; 