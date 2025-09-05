"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ExperienceCard from "./ExperienceCard";

const TimelineExperience = ({ experiences }) => {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });

  const lineProgress = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.3, 0.7, 1]);

  return (
    <div ref={timelineRef} className="relative w-full max-w-[1200px] mx-auto px-4">
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent-color)] to-[var(--accent-color)] opacity-30">
        <motion.div
          className="absolute top-0 left-0 w-full bg-[var(--accent-color)] origin-top"
          style={{ scaleY: lineProgress }}
        />
      </div>

      <div className="relative">
        {experiences.map((exp, index) => (
          <TimelineItem key={index} experience={exp} index={index} total={experiences.length} />
        ))}
      </div>
    </div>
  );
};

const TimelineItem = ({ experience, index, total }) => {
  const itemRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "center start"]
  });

  const isEven = index % 2 === 0;
  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.95], [0, 1, 1, 1]);
  const scale = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0.8, 1, 1, 1]);
  const dotScale = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1.2, 1, 1]);
  const dotOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 1]);

  return (
    <motion.div
      ref={itemRef}
      style={{ opacity, scale }}
      className={`relative flex items-center mb-12 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
        <div className={`absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10 max-md:hidden`}>
            <motion.div
                style={{ scale: dotScale, opacity: dotOpacity }}
                className="w-5 h-5 bg-[var(--accent-color)] rounded-full border-4 border-[var(--primary-color)] shadow-lg"
            />
            <motion.div
            animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[var(--accent-color)] rounded-full"
            />
        </div>

        <div className={`w-full md:w-6/12 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
            <motion.div
            transition={{ duration: 0.2 }}
            >
            <div className="bg-[var(--button-color)] p-8 rounded-ap [--ap-radius:3rem] shadow-xl border-l-6 border-[var(--accent-color)] hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-2xl font-bold text-[var(--accent-color)] leading-tight">{experience.title}</h3>
                <div className="flex-shrink-0">
                    <span className="inline-block bg-gradient-to-r from-[var(--accent-color)] to-[var(--highlight-color)] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform hover:scale-105 transition-transform duration-200">
                    {experience.date}
                    </span>
                </div>
                </div>
                <p className="text-[var(--text-color)] leading-relaxed text-base">{experience.description}</p>
            </div>
            </motion.div>
        </div>
    </motion.div>
  );
};

export default TimelineExperience; 