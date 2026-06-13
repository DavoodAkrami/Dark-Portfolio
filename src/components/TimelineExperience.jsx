"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import clsx from "clsx";

const TimelineExperience = ({ experiences, className }) => {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });

  // Smooth the raw scroll progress so the line fill eases as the user
  // scrolls in either direction (down increases, up decreases).
  const rawLineProgress = useTransform(scrollYProgress, [0, 0.85], [0, 1], { clamp: true });
  const lineProgress = useSpring(rawLineProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={timelineRef} className={clsx("relative w-full max-w-[1200px] mx-auto px-4", className)}>
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--accent-color)] opacity-30">
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-[var(--accent-color)] to-[var(--highlight-color)] origin-top"
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
    offset: ["start end", "center center"]
  });

  const isEven = index % 2 === 0;

  // Spring config shared by every scroll-driven value so the motion feels
  // consistent and eases naturally whether scrolling down or back up.
  const spring = { stiffness: 120, damping: 24, restDelta: 0.001 };

  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.4], [0, 1]), spring);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.4], [0.85, 1]), spring);
  // Slide the card in from its own side of the timeline (left for even,
  // right for odd). Reverses smoothly when the user scrolls back up.
  const x = useSpring(
    useTransform(scrollYProgress, [0, 0.4], [isEven ? -60 : 60, 0]),
    spring
  );
  const dotScale = useSpring(useTransform(scrollYProgress, [0, 0.35, 0.5], [0, 1.2, 1]), spring);
  const dotOpacity = useSpring(useTransform(scrollYProgress, [0, 0.35], [0, 1]), spring);

  return (
    <motion.div
      ref={itemRef}
      style={{ opacity, scale, x }}
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