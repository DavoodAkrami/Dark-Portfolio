"use client"
import React, { useState } from "react";
import Projects from "@/Data/Projects.json";
import { ProjectsGrid, ProjectDetails } from "@/components/ProjectCard";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const ProjectSection = () => {
    const [selectedId, setSelectedId] = useState(null);

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    const handleClose = () => {
        setSelectedId(null);
    };

    const selectedProject = Projects.find((p) => p.id === selectedId);

    return (
        <div className="bg-[var(--primary-color)] min-h-screen relative flex flex-col items-center py-[15vh]">
            <div className="max-w-4xl mx-auto px-4 md:px-0 mt-10 mb-12 text-center">
                <h1 className="text-[4rem] text-[var(--text-color)] font-[570] mb-[10vh] max-md:text-[2.8rem]">Projects</h1>
                <p className="text-[var(--subtext-color)] text-[1.4rem] leading-relaxed max-md:text-[1rem]">
                    Each project featured below represents a key milestone in my journey as a junior Front-End developer. From concept to deployment, these works showcase my growth in building responsive user interfaces, integrating APIs and continuously refining user experience. Whether developed during a bootcamp,for learning, or personal challenges, each project reflects a deep commitment to learning, problem-solving, and bringing ideas to life with modern technologies. 
                </p>
            </div>
            <ProjectsGrid projects={Projects} onSelect={handleSelect} />
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">

                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={handleClose}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        />
                        <div className="relative z-10" onClick={e => e.stopPropagation()}>
                            <ProjectDetails project={selectedProject} onClose={handleClose} />
                        </div>
                    </div>
                )}
            </AnimatePresence>
            
            <div className="max-w-[70%] mx-auto px-4 max-md:max-w-[90%] mb-16 text-center">
                <motion.h2 
                    initial={{ opacity: 0, y: -50}}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1}}
                    className="text-[3rem] text-[var(--text-color)] font-[570] max-md:text-[2.8rem] mt-[5rem] mb-[1vh]"
                > What I learned?</motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: -50}}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1}}
                    className="text-[var(--subtext-color)] text-[1.4rem] leading-relaxed mb-10 max-md:text-[1rem]"
                >
                    Throughout these projects, I faced real-world challenges such as responsive design complexities, state management, performance optimization, and balancing UI/UX considerations. These experiences taught me how to think critically, adapt quickly, and collaborate effectively. They also deepened my knowledge of tools like React, Next.js, and Tailwind CSS. Each project was more than just code—it was an opportunity to grow and explore the mindset of product-focused development.
                    This journey has been incredibly enriching. I've learned not just technical skills, but also how to approach problems with a builder’s mindset, communicate ideas clearly, and stay curious in the face of new challenges. It helped shape my identity as a developer who continuously learns and improves.
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1}} 
                    className="text-[3rem] text-[var(--text-color)] font-[570] max-md:text-[2.8rem] mb-[1vh]"
                >My Journey</motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 50}}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1}}
                    className="text-[var(--subtext-color)] text-[1.4rem] leading-relaxed max-md:text-[1rem]"
                >
                    I began my programming journey at Rubikamp, where I was first introduced to Python. After learning the basics, I chose to specialize in web development and started exploring HTML and CSS. Soon after, I dove into JavaScript and React, gradually shifting from static pages to building dynamic, interactive applications.
                    <br className="hidden md:block" />
                    More than just learning syntax, Rubikamp taught me how to learn — how to approach code logically, how to build things from scratch, and how to stay curious and resilient in the face of challenges. That mindset has been my greatest takeaway.
                    <br className="hidden md:block" />
                    I began with small, simple projects using React and Vite, but as my confidence grew, I intentionally took on more complex challenges to deepen my understanding. Each project became a playground for learning new concepts and strengthening my problem-solving skills.
                    <br className="hidden md:block" />
                    This journey wouldn’t have been the same without the guidance and support of 
                    <a href="https://rubikamp.org" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] hover:text-[var(--text-color)] transition"> Rubikamp</a>,
                    <a href="https://www.linkedin.com/in/hadizare/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] hover:text-[var(--text-color)] transition"> Hadi Zare</a>, 
                    <a href="https://www.linkedin.com/in/mohammadsadegh-zanganehfar-a96438174/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] hover:text-[var(--text-color)] transition"> Mohammad Zanganehfar</a> and 
                    <a href="https://www.linkedin.com/in/mona-asghari/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] hover:text-[var(--text-color)] transition"> Mona Asghari</a>. They taught me far more than just code — they helped shape how I think, build, and grow.
                </motion.p>
            </div>
        </div>
    );
};

export default ProjectSection;
