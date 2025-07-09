"use client";
import ContactInfo from "@/Data/ContactInfo";
import Skills from "@/Data/skills";
import SkillsSlider from "@/components/SkillsSlider";
import SkillCard from "@/components/SkillCard";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const contact = ContactInfo[0];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-[var(--primary-color)] flex flex-col items-center justify-center py-[15vh]">
      <h1 className="text-[4rem] text-[var(--text-color)] font-[570] mb-[10vh]">My Resume</h1>
      <button
        onClick={() => window.open(contact.resume)}
        className="mb-[10vh] soft bg-[var(--button-color)] text-[1.2rem] text-[var(--text-color)] px-[1.2rem] py-[0.8rem] rounded-[10px] border border-transparent cursor-pointer hover:border-[var(--accent-color)]"
      >
        See Resume
      </button>

      <SkillsSlider direction="left" />

      <h2 className="text-[4rem] font-[570] text-[var(--text-color)] my-[10vh]">My Skills</h2>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-[900px]"
      >
        {Skills.map((skill, index) => (
          <motion.div key={index} variants={itemVariants} className="flex justify-center">
            <SkillCard skill={skill} />
          </motion.div>
        ))}
      </motion.div>

      <SkillsSlider direction="right" />

      <div className="mt-[10vh] text-[var(--text-color)] text-2xl">
        my experience
      </div>
    </div>
  );
};

export default About;


