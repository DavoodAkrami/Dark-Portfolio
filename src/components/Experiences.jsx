import React, { useRef, useEffect, useState } from "react";
import clsx from "clsx";
import Experiences from "./ExperienceCard";
import { motion, useInView, AnimatePresence } from "framer-motion";





const ExperiencesSection = ({experiences, className}) => {
    
    const [currentCard, setCurrentCard] = useState(null);
    const [currentExperience, setCurrentExperience] = useState(null);
    const [readMoreModal, setReadMoreModal] = useState(null);
    const [readMore, setReadMore] = useState(null);
    const listRef = useRef(null);
    const cardRefs = useRef({});
    const isInView = useInView(listRef, {
        margin: "-30% 0px -50% 0px",
        amount: "some",
      });
    
    const handleCardInView = (id) => {
        setCurrentCard(id);
        console.log(currentCard);
    };
    
    useEffect(() => {
        setCurrentExperience(experiences.find((exp) => exp.id === currentCard))
    }, [currentCard])


    const handleReadMoreModal = (id) => {
            setReadMoreModal(id);
    }

    useState(() => {
        setReadMore(experiences.find(exp => exp.id === readMoreModal))
    }, [readMoreModal])

    return (
        <div 
            className={clsx("w-[80%] flex gap-[8rem] relative", className)}
        >
            <div
                ref={listRef}
                className={clsx("flex flex-col gap-[15rem] w-1/2")}
            >
                {experiences.map((exp, index) => (
                    <div
                        key={exp.id ?? index}
                        ref={(el) => {
                            if (el) {
                                cardRefs.current[exp.id] = el;
                            }
                        }}
                    >
                        <Experiences
                            exp={exp}
                            className={clsx(
                                "transition-all ease-in-out duration-300",
                                currentCard === exp.id ? "scale-[1]" : "scale-[0.9]",
                                currentCard !== exp.id && "blur-[2px]"
                            )}
                            handleCardInView={() => handleCardInView(exp.id)}
                        />
                    </div>
                ))}
            </div>
            <motion.div
                initial={{ opacity: 0, x: 400 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 400 }}
                transition={{ duration: 0.2 }}
                className="fixed right-[5%] top-[30%] bottom-[30%] w-1/3 flex gap-3 items-center"
            >
                <motion.div
                    initial={{ opacity: 0, x: -400 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -400 }}
                    transition={{ duration: 0.2 }}
                    className={clsx("soft bg-[var(--button-color)]/85 text-[var(--text-color)] p-8 rounded-ap  border border-[var(--accent-color)] backdrop-blur-[4px] h-full w-9/10 hoverLight")}
                >
                    <AnimatePresence mode="wait">
                        {currentExperience && (
                            <motion.div
                                key={currentExperience.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.25 }}
                            >
                                <h2 className="text-3xl font-bold text-center">
                                    {currentExperience.title}
                                </h2>
                                <p className="text-center text-[var(--text-color)]/70 mt-4">
                                    {currentExperience.date}
                                </p>
                                <hr className="mt-6 text-[var(--accent-color)]" />
                                <p className="text-center mt-6 text-lg">
                                    {currentExperience.description}
                                </p>
                                {/* <motion.button
                                    layoutId="read-more" 
                                    onClick={() => handleReadMoreModal(currentExperience.id)}
                                    className="bg-[var(--accent-color)] cursor-pointer text-[var(--text-color)] px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2 mt-8 mx-auto"
                                >
                                    Read more
                                </motion.button> */}
                            </motion.div>
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
            {/* <AnimatePresence>
                {readMoreModal && 
                    <motion.div
                        layoutId="read-more"
                        className=""
                    >
                        <h2 className="text-3xl font-bold text-center">
                            {readMore?.title}
                        </h2>
                        <p className="text-center text-[var(--text-color)]/70 mt-4">
                            {readMore?.date}
                        </p>
                        <hr className="mt-6 text-[var(--accent-color)]" />
                        <p className="text-center mt-6 text-lg">
                            {readMore?.description}
                        </p>
                    </motion.div>
                }
            </AnimatePresence> */}
        </div>
    )

}


export default ExperiencesSection;