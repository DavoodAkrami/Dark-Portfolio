import React, { useRef, useEffect, useState } from "react";
import clsx from "clsx";
import Experiences from "./ExperienceCard";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { parseRichText } from "@/utils/parseRichText";
import { RxCross2 } from "react-icons/rx";






const ExperiencesSection = ({experiences, className}) => {
    
    const [currentCard, setCurrentCard] = useState(null);
    const [currentExperience, setCurrentExperience] = useState(null);
    const [readMoreModal, setReadMoreModal] = useState(null);
    const [isCompact, setIsCompact] = useState(false);
    const listRef = useRef(null);
    const cardRefs = useRef({});
    const isInView = useInView(listRef, {
        margin: "-30% 0px -50% 0px",
        amount: "some",
    });

    const shouldDimBackground = isInView;
    
    const handleCardInView = (id) => {
        setCurrentCard(id);
        console.log(currentCard);
    };
    
    useEffect(() => {
        setCurrentExperience(experiences.find((exp) => exp.id === currentCard))
    }, [currentCard])




    useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia("(max-width: 1400px)");
        const update = () => setIsCompact(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);


    const summrizedText = (text, limit = 200) => {
        if (!text) return "";
        
        let cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1') 
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        
        if (cleanText.length > limit) {
            let truncated = cleanText.substring(0, limit);
            const lastChar = truncated[truncated.length - 1];
            const nextChar = cleanText[limit];

            if (/\w/.test(lastChar) && nextChar && /\w/.test(nextChar)) {
                const lastSpaceIndex = truncated.lastIndexOf(' ');
                if (lastSpaceIndex > 0) {
                    truncated = truncated.substring(0, lastSpaceIndex);
                }
            }
            return truncated + "...";
        } else {
            return cleanText;
        }
    }

    const handleModalReadMoreOpen = (id) => {
        setReadMoreModal(id)
        document.body.style.overflow = "hidden";
    }

    const handleCloseReadMoreModal = () => {
        setReadMoreModal(null)
    }
    
    useEffect(() => {
        !currentExperience && setReadMoreModal(null)
    }, [currentExperience])

    return (
        <div 
            className={clsx("w-[80%] max-[1300px]:w-[100%] flex gap-[8rem] relative", className, readMoreModal && "no-scroll")}
        >
            <AnimatePresence>
                {shouldDimBackground && (
                    <motion.div
                        key="experiences-dim-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-none fixed inset-0 bg-[var(--background)]/30 backdrop-blur-[2px] z-10"
                    />
                )}
            </AnimatePresence>
            <div
                ref={listRef}
                className={clsx("flex flex-col gap-[15rem] max-md:gap-[8rem] w-1/2 max-md:w-[90%] max-md:mx-auto")}
            >
                {experiences.map((exp, index) => (
                    <div
                        key={exp.id ?? index}
                        ref={(el) => {
                            if (el) {
                                cardRefs.current[exp.id] = el;
                            }  
                        }}
                        className={clsx(currentCard === exp.id && "z-11")}
                    >
                        <Experiences
                            exp={exp}
                            className={clsx(
                                "transition-all ease-in-out duration-300",
                                currentCard === exp.id ? "scale-[1.1] z-1000" : "scale-[0.9]",
                                currentCard !== exp.id && "blur-[2px]"
                            )}
                            handleCardInView={() => handleCardInView(exp.id)}
                            setIsModalOpen={setReadMoreModal}
                        />
                    </div>
                ))}
            </div>
            <motion.div
                initial={{ opacity: 0, x: 400 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 400 }}
                transition={{ duration: 0.2 }}
                className="fixed right-[5%] top-[30%] bottom-[30%] w-1/3 flex gap-3 items-center z-11 max-md:hidden"
            >
                <motion.div
                    initial={{ opacity: 0, x: -400 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -400 }}
                    transition={{ duration: 0.2 }}
                    className={clsx("soft bg-[var(--button-color)]/85 text-[var(--text-color)] p-10 rounded-ap [--ap-radius:4rem] border-2 border-[var(--accent-color)] backdrop-blur-[4px] h-full w-9/10 hoverLight")}
                >
                    <AnimatePresence mode="wait">
                        {currentExperience && (
                            <>
                                <motion.div
                                    key={currentExperience.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.25 }}
                                    className="reletave"
                                >
                                    <div className="">
                                        <h2 className="text-3xl font-bold text-center">
                                            {currentExperience.title}
                                        </h2>
                                        <p className="text-center text-[var(--text-color)]/70 mt-4">
                                            {currentExperience.date}
                                        </p>
                                    </div>
                                    <hr className="text-[var(--accent-color)] mt-4" />
                                    <div className="mt-6">
                                        <motion.p
                                            layoutId="read-more" 
                                            className="text-center mt-6 text-lg cursor-pointer select-none"
                                            onClick={() => handleModalReadMoreOpen(currentExperience.id)}
                                        >
                                            {summrizedText(currentExperience.full_discription, isCompact ? 100 : 200)}
                                        </motion.p>
                                    </div>
                                    {/* <button
                                        className="hoverLight bg-[var(--accent-color)] mx-auto cursor-pointer text-white px-5 py-3 mt-5 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2"
                                    >
                                        Ask AI about this experience
                                    </button> */}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </motion.div>
                <div className="flex flex-col gap-4 w-1/10">
                    {experiences.map((exp, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full cursor-pointer ${
                                exp.id === currentCard
                                    ? "bg-[var(--accent-color)]"
                                    : "bg-[var(--text-color)]"
                            }`}
                            onClick={() => {
                                setCurrentCard(exp.id);
                                const el = cardRefs.current[exp.id];
                                if (el && typeof el.scrollIntoView === "function") {
                                    el.scrollIntoView({
                                        behavior: "smooth",
                                        block: "center",
                                    });
                                }
                            }}
                        />
                    ))}
                </div>
            </motion.div>
            <AnimatePresence>
                {readMoreModal && currentExperience &&  
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="fixed inset-0 z-10000000 bg-[var(--background)]/50 backdrop-blur-lg"
                            onClick={handleCloseReadMoreModal}
                        />
                        <motion.div
                            layoutId="read-more"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={clsx("z-10000000000 max-md:w-[95%] max-md:overflow-hidden max-md:h-[90vh] max-md:m-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] bg-[var(--button-color)] p-8 text-[var(--text-color)] rounded-ap [--ap-radius:4rem] border-2 border-[var(--accent-color)] flex flex-col")}
                        >
                            <div 
                                className="absolute top-4 right-4 bg-[var(--accent-color)] p-2 rounded-full cursor-pointer transition-shadow ease-in-out duration-300 hoverLight" 
                                onClick={handleCloseReadMoreModal}
                            >
                                <RxCross2 className="text-xl font-bold" />
                            </div>
                            <div className="shrink-0">
                                <h2 className="text-3xl font-bold text-center w-[90%] mx-auto">
                                    {currentExperience.title}
                                </h2>
                                <p className="text-center text-[var(--text-color)]/70 mt-4">
                                    {currentExperience.date}
                                </p>
                                <hr className="mt-6 text-[var(--accent-color)]" />
                            </div>
                            <div className="text-center mt-6 text-lg w-[90%] max-md:w-[97%] mx-auto flex-1 max-md:overflow-y-auto max-md:pb-6 max-md:pr-2">
                                {parseRichText(currentExperience.full_discription)}
                            </div>
                        </motion.div>
                    </>
                }
            </AnimatePresence>
        </div>
    )

}


export default ExperiencesSection;