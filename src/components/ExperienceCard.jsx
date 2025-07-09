import React from "react";

const Experiences = ({exp}) => {
  return (
    <div className="bg-[var(--button-color)] p-[1rem] xs:p-[1.2rem] sm:p-[2rem] rounded-xl shadow-lg border-l-8 border-[var(--accent-color)] w-[90vw] max-w-[900px] mx-[5vw]">
      <h3 className="text-lg xs:text-xl font-bold text-[var(--accent-color)] mb-2">{exp.title}</h3>
      <p className="text-[var(--text-color)] text-xs xs:text-sm italic mb-2">{exp.year || exp.date}</p>
      <p className="text-[var(--text-color)] leading-relaxed text-xs xs:text-sm sm:text-base">{exp.description}</p>
    </div>
  );
};

export default Experiences; 