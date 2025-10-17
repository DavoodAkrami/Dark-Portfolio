"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";

const Home = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        },
    };
    
    const sentences = [
        " Studying for Konkor...",
        " Exercising...",
    ]

    const [currentSentence, setCurrentSentence] = useState(0);
    const [displayedLetters, setDisplayedLetters] = useState([]);

    useEffect(() => {
        let i = 0;
        setDisplayedLetters([]);
        const letters = sentences[currentSentence].split("");

        const interval = setInterval(() => {
            setDisplayedLetters((prev) => [...prev, letters[i]]);
            i++;
            if (i >= letters.length) {
              clearInterval(interval);
              setTimeout(() => {
                setCurrentSentence((prev) => (prev + 1) % sentences.length);
              }, 1500);
            }
          }, 90);
      
          return () => clearInterval(interval);
    }, [currentSentence])

    return (
        <div className="bg-[var(--primary-color)] min-h-screen px-[5vw] py-[15vh] flex items-center justify-around max-lg:flex-col relative overflow-hidden">
            <div className="absolute top-20 left-20 w-32 h-32 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-[var(--accent-color)] rounded-full opacity-10 blur-3xl"></div>
            
            <motion.div 
                className="flex-1 max-w-2xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1 
                    variants={itemVariants}
                    className="text-[2.6rem] text-[var(--text-color)] font-[550] max-md:text-[2rem] mb-4"
                >
                    Hi, I'm <span className="text-[var(--accent-color)]">Davood Akrami</span>
                </motion.h1>
                
                <motion.h2 
                    variants={itemVariants}
                    className="text-[2rem] text-[var(--accent-color)] font-[550] max-md:text-[1.6rem] mb-2"
                >
                    Junior Front-End Developer
                </motion.h2>

                <motion.h3
                    variants={itemVariants}
                    className="text-[1.4rem] flex gap-[10px] items-center text-[var(--text-color)] font-[480] max-md:text-[1.2rem] mb-4">
                    <span className="font-semibold text-[var(--text-color">Current Mode: </span>
                    <span className="text-[1.4rem] text-[var(--accent-color)] font-[500] max-md:text-[1.4rem]">{displayedLetters.join("")}</span>
                </motion.h3>
                
                <motion.p 
                    variants={itemVariants}
                    className="text-[var(--text-color)] text-[1.2rem] mb-8 w-full font-[520] max-md:text-[1rem] leading-relaxed"
                >
                    Junior Front-End Developer familiar with JavaScript, React.js, MUI, and RESTful APIs. Passionate about entrepreneurship, with hands-on involvement in early-stage ideation and pitch deck development. Actively collaborated with teams through multiple non-coding and technical initiatives, with a strong interest in teamwork and creative problem-solving.
                </motion.p>

                <motion.div 
                    variants={itemVariants}
                    className="flex flex-wrap gap-4 mb-8"
                >
                    <Link 
                        href='https://flowcv.com/resume/2bohp73170'
                        className="hoverLight bg-[var(--accent-color)] cursor-pointer text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2">
                        <FaDownload />
                        Download Resume
                    </Link>
                    <Link 
                        href='/projects'
                        className="hoverLight soft border-2 border-[var(--accent-color)] cursor-pointer text-[var(--accent-color)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--accent-color)] hover:text-white transition-all duration-300">
                        Projects
                    </Link>
                </motion.div>

                <motion.div 
                    variants={itemVariants}
                    className="flex gap-4"
                >
                    <a href="https://github.com/DavoodAkrami" target="_blank" rel="noopener noreferrer" className="text-[var(--text-color)] hover:text-[var(--accent-color)] transition-colors duration-300">
                        <FaGithub size={24} />
                    </a>
                    <a href="https://www.linkedin.com/in/davood-akrami-72014a329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className="text-[var(--text-color)] hover:text-[var(--accent-color)] transition-colors duration-300">
                        <FaLinkedin size={24} />
                    </a>
                    <a href="mailto:akramii.davood@gmail.com" className="text-[var(--text-color)] hover:text-[var(--accent-color)] transition-colors duration-300">
                        <FaEnvelope size={24} />
                    </a>
                </motion.div>
            </motion.div>

            <motion.div
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 flex justify-center items-center"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                >
                    <Image
                        src="/Davood-noBG.png"
                        alt="Davood Akrami"
                        width={400}
                        height={400}
                        className="object-cover rounded-full shadow-2xl"
                        priority
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent-color)] to-transparent opacity-20 blur-xl"></div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Home;