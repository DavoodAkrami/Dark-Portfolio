import React, { useRef, useEffect, useState } from "react";
import clsx from "clsx";
import Experiences from "./ExperienceCard";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { parseRichText } from "@/utils/parseRichText";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";
import { FaCircleArrowUp } from "react-icons/fa6";
import Message from "@/components/Message";






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
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const endOfMessagesRef = useRef(null);
    const textareaRef = useRef(null);

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

    useEffect(() => {
        setIsAiModalOpen(false)
    }, [currentExperience])

    useEffect(() => {
        if (!isInView) {
            setIsAiModalOpen(false)
        }
    }, [isInView])

    const checkIsPersian = (text) => {
        return /[\u0600-\u06FF]/.test(text);
    }

    const linkify = (text) => {
        if (!text) return "";
      
        const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
        text = text.replace(
          markdownLinkRegex,
          `<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>`
        );
      
        return text;
    };

    const handleSend = async () => {
        if (!userMessage.trim()) return;
        const content = userMessage;
        const experienceText = currentExperience?.full_discription || "";
        setUserMessage("");
        if (textareaRef.current) {
            textareaRef.current.style.height = '';
        }

        const userMsg = {
            id: `${Date.now()}-user`,
            role: 'user',
            text: content,
            timestamp: Date.now()
        };
        setMessages((prev) => [...prev, userMsg]);
        let loadingDelayId = setTimeout(() => setLoading(true), 100);

        try {
            const res = await fetch("/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: content,
                    "experience-data": experienceText,
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            if (data.error) {
                const assistantError = {
                    id: `${Date.now()}-assistant`,
                    role: 'assistant',
                    text: `Error: ${data.error}`,
                    timestamp: Date.now()
                };
                setMessages((prev) => [...prev, assistantError]);
                return;
            }

            let text = data.reply || "";
            if (typeof text !== 'string') {
                const invalidFormat = {
                    id: `${Date.now()}-assistant`,
                    role: 'assistant',
                    text: "Error: Invalid response format",
                    timestamp: Date.now()
                };
                setMessages((prev) => [...prev, invalidFormat]);
                return;
            }

            text = text.replace(/undefined/g, '').replace(/null/g, '').trim();

            const assistantId = `${Date.now()}-assistant`;
            const assistantMsg = {
                id: assistantId,
                role: 'assistant',
                text: '',
                timestamp: Date.now()
            };
            setMessages((prev) => [...prev, assistantMsg]);

            let i = 0;
            const typingSpeedMs = 10;
            const intervalId = setInterval(() => {
                i++;
                setMessages((prev) => prev.map((msg) =>
                    msg.id === assistantId ? { ...msg, text: text.slice(0, i) } : msg
                ));
                if (i >= text.length) {
                    clearInterval(intervalId);
                }
            }, typingSpeedMs);
        } catch (err) {
            console.error(err);
            const assistantErr = {
                id: `${Date.now()}-assistant`,
                role: 'assistant',
                text: `Error: ${err.message}`,
                timestamp: Date.now()
            };
            setMessages((prev) => [...prev, assistantErr]);
        } finally {
            if (loadingDelayId) clearTimeout(loadingDelayId);
            setLoading(false);
        }
    };

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (isAiModalOpen) {
            const id = setTimeout(() => {
                endOfMessagesRef.current?.scrollIntoView({ behavior: 'auto' });
            }, 0);
            return () => clearTimeout(id);
        } else {
            setMessages([]);
            setUserMessage("");
        }
    }, [isAiModalOpen]);

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
                className="fixed right-[5%] top-[28%] bottom-[28%] max-[1850px]:top-[25%] max-[1850px]:bottom-[25%] w-1/3 flex gap-3 items-center z-11 max-md:hidden"
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
                                    className="relative flex flex-col h-full"
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
                                            {summrizedText(currentExperience.full_discription, isCompact ? 100 : 185)}
                                        </motion.p>
                                    </div>
                                    <div className=" flex justify-around px-4 max-xl:px-0 gap-6 w-full max-[1200px]:hidden">
                                        <button
                                            onClick={() => handleModalReadMoreOpen(currentExperience.id)}
                                            className="hoverLight w-1/2 bg-[var(--accent-color)] mx-auto cursor-pointer text-white px-5 py-3 mt-5 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            Read more
                                        </button> 
                                        <motion.button
                                            layoutId="ai-modal"
                                            onClick={() => setIsAiModalOpen(true)}
                                            className="hoverLight w-1/2 bg-[var(--accent-color)] mx-auto cursor-pointer text-white px-5 py-3 mt-5 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            Ask AI
                                        </motion.button> 
                                    </div>
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
            <AnimatePresence>
                {isAiModalOpen && (
                    <motion.div 
                        layoutId="ai-modal"
                        className="fixed right-[5%] top-[73%] w-1/3 z-1000000"
                        onClose={() => setIsAiModalOpen(false)}
                    >
                        <div className="relative w-9/10 bg-[var(--button-color)]/85 text-[var(--text-color)] p-4 rounded-ap [--ap-radius:4rem] border-2 border-[var(--accent-color)] backdrop-blur-[4px]">
                            <div className="absolute top-2.5 left-2.5 z-10 select-none">
                                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent-color)]/70 bg-[var(--primary-color)]/70 px-2 py-0.5 text-[0.7rem] font-semibold tracking-wide text-[var(--text-color)] backdrop-blur-[4px]">
                                    Beta
                                </span>
                            </div>
                            <div className="absolute top-2.5 right-2.5 bg-[var(--accent-color)] p-1 rounded-full cursor-pointer transition-shadow ease-in-out duration-300 hoverLight z-10" 
                                onClick={() => setIsAiModalOpen(false)}
                            >
                                <RxCross2 className="text-lg font-bold" />
                            </div>
                            <div className="flex flex-col w-[90%] mx-auto">
                                {messages.length > 0 && (
                                    <div
                                        className="w-full bg-[var(--primary-color)] rounded-ap [--ap-radius:2rem] px-[0.6rem] pt-[0.6rem] mb-[2vh] overflow-y-auto overflow-x-auto relative"
                                        style={{ height: "auto", maxHeight: "13vh" }}
                                    >
                                        <div className="flex flex-col gap-3 items-stretch min-h-full justify-end relative">
                                            {messages.map((m) => (
                                                m.role === 'user' ? (
                                                    <div key={m.id} className="flex justify-end">
                                                        <Message message={m.text} />
                                                    </div>
                                                ) : (
                                                    <div key={m.id} className={clsx("flex", checkIsPersian(m.text) ? "justify-end" : "justify-start") }>
                                                        <p
                                                            className="text-[var(--text-color)] whitespace-pre-wrap max-w-[90%] max-md:max-w-[100%] p-4 rounded-ap [--ap-radius:1.6rem] text-lg max-md:text-md"
                                                            dangerouslySetInnerHTML={{ __html: linkify(m.text) }}
                                                            style={{ direction: checkIsPersian(m.text) ? 'rtl' : 'ltr', textAlign: checkIsPersian(m.text) ? 'right' : 'left' }}
                                                        />                                                
                                                    </div>
                                                )
                                            ))}

                                            {loading && (
                                                <div className="flex justify-start text-[var(--text-color)] m-4 animate-pulse text-xl max-md:text-md italic">
                                                    Thinking...
                                                </div>
                                            )}
                                            <div ref={endOfMessagesRef} className="flex items-end" />
                                        </div>
                                    </div>
                                )}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSend();
                                    }}
                                    className="flex justify-center items-center gap-[0.8rem] disabled:opacity-60 w-[98%]"
                                >
                                    <textarea 
                                        ref={textareaRef}
                                        rows={1}
                                        type="text"
                                        placeholder={`Ask AI about ${currentExperience?.title || 'this experience'}`}
                                        value={userMessage}
                                        onChange={(e) => {
                                            setUserMessage(e.target.value);
                                            const el = e.target;
                                            const lineHeightRem = 1.4;
                                            const maxRows = 2;
                                            const maxHeightPx = lineHeightRem * maxRows * 16;
                                            el.style.height = 'auto';
                                            const newHeight = Math.min(el.scrollHeight, maxHeightPx);
                                            el.style.height = `${newHeight}px`;
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        style={{ 
                                            overflowY: 'hidden', 
                                            direction: checkIsPersian(userMessage) ? 'rtl' : 'ltr',
                                            textAlign: checkIsPersian(userMessage) ? 'right' : 'left',
                                            lineHeight: '1.6rem',
                                        }}
                                        className="w-[90%] resize-none border border-transparent py-[0.6rem] px-[0.6rem] rounded-[12px] bg-[var(--primary-color)] focusrLight outline-none focus:border-1 focus:border-[var(--accent-color)] text-[var(--text-color)] transition-all overflow-hidden leading-[1.6rem] max-h-[8rem]"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !userMessage.trim()}
                                        className="!shadow-none hover:!shadow-none"
                                    >
                                        <IoIosArrowForward 
                                            className={clsx(
                                                "text-[var(--accent-color)] hoverLight rounded-full font-extrabold text-[3rem] p-[0.6rem] border-2 border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--text-color)] button soft cursor-pointer",
                                                !userMessage.trim() && 'opacity-60',
                                            )}
                                        />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

}


export default ExperiencesSection;