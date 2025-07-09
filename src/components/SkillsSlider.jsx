"use client";
import Skills from "@/Data/skills";
import { clsx } from "clsx";

const SkillsSlider = ({ direction = "left" }) => {
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="overflow-hidden whitespace-nowrap w-full py-4 my-[1.6rem]">
      <div className={clsx("flex gap-10 min-w-max", animationClass)}>
        {[...Skills, ...Skills, ...Skills, ...Skills, ...Skills, ...Skills].map((skill, index) => (
          <div
            key={`${skill.name}-${index}`}
            className="flex flex-col items-center justify-center min-w-[90px] text-[var(--text-color)]"
          >
            <div className="text-[2.2rem]">{skill.icon}</div>
            <span className="text-xs mt-1 font-medium">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSlider;


