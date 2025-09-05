"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Badge = ({ text }) => (
    <span className="rounded-full bg-gray-700 px-2 py-1 text-xs text-[var(--accent-color)] font-semibold select-none">
        {text}
    </span>
);

const ProjectCard = ({ project, onSelect, index }) => {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "center start"]
    });
    const fromX = index % 2 === 0 ? -150 : 150;
    const x = useTransform(scrollYProgress, [0.03, 0.10, 0.85, 0.97], [fromX, 0, 0, fromX]);
    const opacity = useTransform(scrollYProgress, [0.03, 0.20, 0.85, 0.97], [0, 1, 1, 0]);
    const MAX_DESC_LENGTH = 90;
    const shortDescription =
        project.description.length > MAX_DESC_LENGTH
            ? project.description.slice(0, MAX_DESC_LENGTH) + "..."
            : project.description;
    const techLength = project.technologies.length;
    return (
        <motion.div
            ref={cardRef}
            style={{ x, opacity }}
            layoutId={`card-${project.id}`}
            onClick={() => onSelect(project.id)}
            className="cursor-pointer bg-[var(--button-color)] hoverLight soft rounded-[12px] border border-transparent hover:border-[var(--accent-color)] p-[1.4rem] flex flex-col gap-6 w-[45rem] mx-auto min-h-[360px] max-[1480px]:w-[37rem] max-[1250px]:w-[30rem] max-[1100px]:w-[80%] max-sm:w-[90%] rounded-ap [--ap-radius:4rem]"
        >
            <img
                src={project.img}
                alt={project.title}
                className="rounded-md aspect-[16/10] object-cover w-full h-40 rounded-ap [--ap-radius:2.6rem]"
            />
            <h2
                className="text-[1.8rem] text-[var(--text-color)] font-[570] max-md:text-[1.4rem] leading-0.7"
            >
                {project.title}
            </h2>
            <p className="text-[var(--subtext-color)]">
                {shortDescription}
            </p>
            <hr className="w-[95%] text-[var(--text-color)] opacity-[0.4] mx-auto" />
            <div className="flex gap-[4px] mx-[3%]">
                {project.technologies.slice(0, 3).map((tech, idx) => (
                    <Badge key={idx} text={tech} />
                ))}
                {techLength > 3 && <Badge text={`+${techLength - 3}`} />}
            </div>
        </motion.div>
    );
}

const ProjectsGrid = ({ projects, onSelect }) => {
  return (
    <div className="grid max-[1100px]:grid-cols-1 grid-cols-2 gap-8 px-4 md:px-16 py-8">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} onSelect={onSelect} index={index} />
      ))}
    </div>
  );
}

const ProjectDetails = ({ project, onClose }) => {
  return (
    <motion.div
      layoutId={`card-${project.id}`}
      className="bg-[var(--button-color)] soft rounded-[40px] max-w-[45rem] mx-auto pt-0 p-[1.6rem] relative z-50 max-[800px]:max-w-[90%] rounded-ap [--ap-radius:4rem]"
    >
        <img
            src={project.img}
            alt={project.title}
            className="rounded-[40px] w-full aspect-[16/10] object-cover py-4 rounded-ap [--ap-radius:2.6rem]"
        />
        <h2 className="text-[var(--text-color)] text-2xl font-bold mb-2">{project.title}</h2>
        <p className="text-[var(--subtext-color)] mb-4 text-sm">{project.description}</p>
        <hr className="mb-[1rem] mx-[-1.6rem] text-[var(--text-color)] opacity-[0.5]"/>
        <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, i) => (
            <Badge key={i} text={tech} />
            ))}
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => window.open(project.url)}
                className="bg-[var(--accent-color)] cursor-pointer text-[var(--text-color)] px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2"
            >
                Visit
            </button>
            <button 
                onClick={() => window.open(project.gitHub)}
                className="px-[1.7rem] py-[0.7rem] rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-[580] cursor-pointer hover:text-[var(--text-color)] hover:bg-[var(--accent-color)] soft transition-all duration-300"
            >
                GitHub
            </button>
        </div>
    </motion.div>
  );
}

export {ProjectDetails,ProjectsGrid, ProjectCard};
