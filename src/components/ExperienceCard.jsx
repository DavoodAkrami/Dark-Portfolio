import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import clsx from "clsx";
import { PiStudent } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { IoCodeSlash, IoBusinessSharp } from "react-icons/io5";
import { MdOutlineCampaign } from "react-icons/md";
import { SiCodementor } from "react-icons/si";

const ICONS = {
  PiStudent,
  VscSettings,
  IoCodeSlash,
  IoBusinessSharp,
  MdOutlineCampaign,
  SiCodementor,
};

const Experiences = ({ exp, className, handleCardInView, setIsModalOpen }) => {

  const [currentCard, setCurrentCard] = useState(null);
  const experiencesRef = useRef(null);
  const isInView = useInView(experiencesRef, {
    margin: "-40% 0px -40% 0px",
    amount: 0
  });
  useEffect(() => {
    if (isInView) {
      setCurrentCard(exp.id);
      handleCardInView(exp.id);
    }
  }, [isInView]);

  const Icon = ICONS[exp.icon];

  return (
    <motion.div
      ref={experiencesRef}
      className={clsx(" p-[1rem] xs:p-[1.2rem] sm:p-[2rem] rounded-xl border-[var(--accent-color)] w-full max-w-[900px] mx-[5vw] select-none", className)}
    >
      <div className="flex items-center gap-2 mb-3">
        {Icon && (
          <Icon className="bg-[var(--accent-color)] p-1 text-[var(--text-color)] text-4xl max-md:text-2xl rounded-lg" />
        )}
        <h3 className="text-[1.4rem] max-md:text-[1rem] font-bold text-[var(--accent-color)] max-md:max-w-[90%]">
          {exp.title}
        </h3>
      </div>
      <p className="text-[var(--text-color)] text-xs xs:text-sm italic mb-2 ml-6 max-md:w-[95%] max-md:mx-auto">{exp.year || exp.date}</p>
      <p className="text-[var(--text-color)] leading-relaxed text-xs xs:text-md sm:text-base ml-6 max-md:w-[95%] max-md:mx-auto">{exp.description}</p>
      <motion.div className="md:hidden text-[var(--accent-color)] text-xs xs:text-md sm:text-base ml-6 max-md:w-[95%] max-md:mx-auto" onClick={() => setIsModalOpen(true)}>
          Read more
      </motion.div>
    </motion.div>
  );
};

export default Experiences; 