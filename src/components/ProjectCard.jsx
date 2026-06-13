"use client";
import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IoClose } from "react-icons/io5";

const Badge = ({ text }) => (
    <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] text-[var(--accent-color)] font-semibold select-none tracking-widest uppercase flex justify-center items-center text-center">
        {text}
    </span>
);

// Bento pattern: wide, narrow, narrow, wide, narrow, wide, ...
// index 0 → col-span-2, index 1 → col-span-1, index 2 → col-span-1,
// index 3 → col-span-1, index 4 → col-span-2, index 5 → col-span-1, repeats
const SPAN_PATTERN = [1, 2, 2, 1, 2, 1];

const ProjectCard = ({ project, onSelect, index }) => {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "center start"]
    });
    const y = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [60, 0, 0, -20]);
    const opacity = useTransform(scrollYProgress, [0.03, 0.2, 0.82, 0.97], [0, 1, 1, 0]);

    const span = SPAN_PATTERN[index % SPAN_PATTERN.length];
    // Taller image for wide cards
    const imageAspect = span === 2 ? "aspect-[21/9]" : "aspect-[4/3]";

    return (
        <motion.div
            ref={cardRef}
            style={{ y, opacity }}
            layoutId={`project-card-${project.id}`}
            onClick={() => onSelect(project.id)}
            className={`cursor-pointer relative overflow-hidden rounded-[24px] bg-[var(--button-color)] shadow-[0_2px_24px_rgba(0,0,0,0.22)] group will-change-transform col-span-1 ${span === 2 ? 'md:col-span-2' : 'md:col-span-1'}`}
            whileHover={{ scale: 1.02, transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] } }}
        >
            {/* Image */}
            <motion.div
                layoutId={`project-image-${project.id}`}
                className={`relative w-full ${imageAspect} overflow-hidden`}
            >
                <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Title overlaid on image bottom for wide cards */}
                {span === 2 && (
                    <motion.h2
                        layoutId={`project-title-${project.id}`}
                        className="absolute bottom-4 left-5 text-white text-[1.35rem] font-[650] leading-tight drop-shadow-lg"
                    >
                        {project.title}
                    </motion.h2>
                )}
            </motion.div>

            {/* Card body */}
            <div className="p-4 flex flex-col gap-2.5">
                {span !== 2 && (
                    <motion.h2
                        layoutId={`project-title-${project.id}`}
                        className="text-[var(--text-color)] text-[1.1rem] font-[650] leading-tight"
                    >
                        {project.title}
                    </motion.h2>
                )}
                <p className="text-[var(--subtext-color)] text-[0.82rem] leading-relaxed line-clamp-2">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {project.technologies.slice(0, span === 2 ? 5 : 3).map((tech, idx) => (
                        <Badge key={idx} text={tech} />
                    ))}
                    {project.technologies.length > (span === 2 ? 5 : 3) && (
                        <Badge text={`+${project.technologies.length - (span === 2 ? 5 : 3)}`} />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const ProjectDetails = ({ project, onClose }) => {
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <motion.div
            layoutId={`project-card-${project.id}`}
            className="relative rounded-[28px] w-full max-w-[580px] mx-4 max-h-[88vh] overflow-hidden flex flex-col shadow-2xl bg-[var(--button-color)] border border-white/10"
        >
            {/* Image header */}
            <motion.div
                layoutId={`project-image-${project.id}`}
                className="relative w-full aspect-[16/9] flex-shrink-0 overflow-hidden"
            >
                <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

                <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.18, ease: 'easeOut' }}
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/75 transition-colors cursor-pointer z-10"
                >
                    <IoClose size={16} />
                </motion.button>
            </motion.div>

            {/* Content */}
            <div className="relative flex-1 min-h-0">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.26, ease: 'easeOut' }}
                    className="overflow-y-auto h-full p-6 flex flex-col gap-4"
                >
                    <motion.h2
                        layoutId={`project-title-${project.id}`}
                        className="text-[var(--text-color)] text-[1.5rem] font-[650] leading-tight"
                    >
                        {project.title}
                    </motion.h2>
                    <p className="text-[var(--subtext-color)] text-[0.9rem] leading-relaxed">
                        {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                            <Badge key={i} text={tech} />
                        ))}
                    </div>
                    <div className="flex gap-3 pt-1 pb-1">
                        <button
                            onClick={() => window.open(project.url)}
                            className="bg-[var(--accent-color)] cursor-pointer text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-85 transition-opacity text-sm"
                        >
                            Visit Site
                        </button>
                        {project.gitHub && (
                            <button
                                onClick={() => window.open(project.gitHub)}
                                className="px-6 py-2.5 rounded-xl border border-[var(--accent-color)]/60 text-[var(--accent-color)] font-semibold cursor-pointer hover:bg-[var(--accent-color)] hover:text-white hover:border-transparent transition-all duration-200 text-sm"
                            >
                                GitHub
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const ProjectsGrid = ({ projects, onSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-10 py-4 w-full max-w-[1300px]">
            {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} onSelect={onSelect} index={index} />
            ))}
        </div>
    );
};

export { ProjectDetails, ProjectsGrid, ProjectCard };
