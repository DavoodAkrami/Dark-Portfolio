"use client";
import ContactInfo from "@/Data/ContactInfo";
import Skills from "@/Data/skills";
import SkillsSlider from "@/components/SkillsSlider";
import SkillCard from "@/components/SkillCard";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import TimelineExperience from "@/components/TimelineExperience";
import Experience from "@/Data/Experience";
import GitHubCalendar from "react-github-calendar";
import { useTheme } from "@/components/ThemeProvider";

import ExperiencesSection from "@/components/Experiences";




const About = () => {
    const contact = ContactInfo[0];
    const { isLightMode } = useTheme();

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.1 });

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 },
    };

    const getCurrentTheme = () => {
        return isLightMode 
            ? {
                light: ["#f0f9ff", "#7dd3fc", "#0ea5e9", "#0284c7", "#0369a1"],
                dark: ["#a9c6f1", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
              }
            : {
                light: ["#f0f9ff", "#7dd3fc", "#0ea5e9", "#0284c7", "#0369a1"],
                dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
              };
    };

    return (
        <div className="bg-[var(--primary-color)] flex flex-col items-center justify-center py-[15vh]">
            <h1 className="text-[4rem] text-[var(--text-color)] font-[570] mb-[10vh] max-md:text-[2.8rem]">My Resume</h1>
            <button
                onClick={() => window.open(contact.resume)}
                className="mb-[10vh] soft bg-[var(--button-color)] text-[1.2rem] text-[var(--text-color)] px-[1.2rem] py-[0.8rem] rounded-[10px] border border-transparent cursor-pointer hover:border-[var(--accent-color)]"
            >
                See Resume
            </button>

            <SkillsSlider direction="left" />

            

            <h1 className="text-[4rem] text-[var(--text-color)] font-[570] my-[10vh] max-md:text-[2.8rem]">My Skills</h1>

            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-[900px] mb-[10vh]"
            >
                {Skills.map((skill, index) => (
                    <motion.div key={index} variants={itemVariants} className="flex justify-center">
                        <SkillCard skill={skill} />
                    </motion.div>
                ))}
            </motion.div>

            <SkillsSlider direction="right" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="w-full flex flex-col items-center"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-[4rem] text-[var(--text-color)] font-[570] my-[10vh] max-md:text-[2.8rem]"
                >
                    My GitHub Activity
                </motion.h1>
                <motion.div
                    variants={itemVariants}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                    className="w-full flex flex-col items-center"
                >
                    <div className="mb-6 text-center">
                        <p className="text-[var(--text-color)] text-lg mb-2 opacity-80">
                            This table shows only public repository commits
                        </p>
                        <p className="text-[var(--text-color)] text-sm opacity-70">
                            For better understanding check{" "}
                            <a 
                                href="https://github.com/DavoodAkrami" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[var(--accent-color)] hover:text-[var(--highlight-color)] transition-colors duration-300 underline decoration-2 underline-offset-2 hover:decoration-[var(--highlight-color)] font-medium"
                            >
                                My GitHub Profile
                            </a>
                        </p>
                    </div>
                    <div className="p-10 mb-[5vh] max-md:max-w-[95%] max-md:p-8 flex justify-center items-center bg-[var(--button-color)] rounded-lg github-calendar hoverLight soft border-2 border-transparent hover:border-[var(--accent-color)] rounded-ap [--ap-radius:3rem]">
                        <GitHubCalendar 
                            key={isLightMode ? 'light' : 'dark'}
                            username="DavoodAkrami" 
                            theme={getCurrentTheme()} 
                        />
                    </div>
                </motion.div>
            </motion.div>

            <SkillsSlider direction="left" />


            <h1 className="text-[4rem] text-[var(--text-color)] font-[570] my-[10vh] max-md:text-[2.8rem] text-center">My Professional Experiences</h1>            
            <ExperiencesSection experiences={Experience} className={"max-md:hidden mb-[15vh]"} />
            <TimelineExperience experiences={Experience} className={"md:hidden"} />
        </div>
    );
};

export default About;