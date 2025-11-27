'use client'
import  FeedbackForm from "@/components/FeedbackForm";
import ContactInfo from "@/Data/ContactInfo"
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaLinkedinIn } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import clsx from "clsx";
import Message from "@/components/Message";
import SuggestionOption from "@/components/SuggestionOption";




const contactme = () => {
    const contact = ContactInfo[0];
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userMessage, setUserMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const endOfMessagesRef = useRef(null);
    const textareaRef = useRef(null);

    const suggestions = [
        {
            id: 1,
            title: "Send an email",
            text: "Send an Email to Davood"
        },
        {
            id: 2,
            title: "Davood's resume",
            text: "Send me Davood's resume?"
        },
        {
            id: 3,
            title: "Davood's Skills",
            text: "What are Davood's soft skills and hard skills?"
        }
    ] 
    
    const handleClose = () => {
        setIsModalOpen(false);
        const params = new URLSearchParams(window.location.search);
        params.delete('openAI');
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        router.replace(newUrl);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        const params = new URLSearchParams(window.location.search);
        params.set('openAI', '1');
        const newUrl = window.location.pathname + '?' + params.toString();
        router.replace(newUrl);
    };

    const handleSend = async () => {
        if (!userMessage.trim()) return;
        const content = userMessage;
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
                body: JSON.stringify({ message: content })
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

    const checkIsPersian = (text) => {
        return /[\u0600-\u06FF]/.test(text);
    }

    useEffect(() => {
        try {
            const raw = localStorage.getItem('contact_ai_messages');
            if (raw) {
                const parsed = JSON.parse(raw);
                const oneDayMs = 24 * 60 * 60 * 1000;
                const now = Date.now();
                let storedMessages = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.messages) ? parsed.messages : [];
                const freshMessages = storedMessages.filter((m) => typeof m?.timestamp === 'number' && (now - m.timestamp) <= oneDayMs);
                if (freshMessages.length > 0) {
                    setMessages(freshMessages);
                } else {
                    localStorage.removeItem('contact_ai_messages');
                }
            }
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                const openAI = params.get('openAI');
                if (openAI === '1' || openAI === 'true') {
                    setIsModalOpen(true);
                }
            }
        } catch (e) {
            console.warn('Failed to load messages from storage', e);
        }
    }, []);


    useEffect(() => {
        if (isModalOpen && typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const prompt = params.get('prompt');
            if (prompt && prompt.trim()) {
                const decodedPrompt = decodeURIComponent(prompt);
                const timer = setTimeout(async () => {
                    const content = decodedPrompt;
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
                            body: JSON.stringify({ message: content })
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
                        const typingSpeedMs = 18; 
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
                    
                    const newParams = new URLSearchParams(window.location.search);
                    newParams.delete('prompt');
                    const newUrl = window.location.pathname + (newParams.toString() ? '?' + newParams.toString() : '');
                    window.history.replaceState({}, '', newUrl);
                }, 300);
                return () => clearTimeout(timer);
            }
        }
    }, [isModalOpen]);

    useEffect(() => {
        try {
            const oneDayMs = 24 * 60 * 60 * 1000;
            const now = Date.now();
            const freshMessages = (messages || []).filter((m) => typeof m?.timestamp === 'number' && (now - m.timestamp) <= oneDayMs);
            localStorage.setItem('contact_ai_messages', JSON.stringify({ messages: freshMessages, savedAt: now }));
        } catch (e) {
            console.warn('Failed to save messages to storage', e);
        }
    }, [messages]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (isModalOpen) {
            const id = setTimeout(() => {
                endOfMessagesRef.current?.scrollIntoView({ behavior: 'auto' });
            }, 0);
            return () => clearTimeout(id);
        }
    }, [isModalOpen]);

    const linkify = (text) => {
        if (!text) return "";
      
        const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
        text = text.replace(
          markdownLinkRegex,
          `<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>`
        );
      
      
        return text;
    };

    
    return (
        <div className="bg-[var(--primary-color)] ">
                <h1 className="text-[4rem] text-[var(--text-color)] font-[570] max-md:text-[3.4rem] flex justify-center max-sm:text-[3rem] pt-[6vh] text-center">Contact with me</h1>
                <div className="grid grid-cols-[5%_1fr_10px_1fr_5%] max-[1400px]:grid-cols-[5%_1fr_5%] max-[700px]:grid-cols[2%_1fr_2%]">
                <div className="col-start-2 col-end-3 mx-[12%] my-[8%] max-[700px]:mx-[0%]">
                    <FeedbackForm />
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="col-start-4 col-end-5 bg-[var(--button-color)] rounded-[12px] mx-[12%] my-[8%] p-[1.6rem] max-[1400px]:col-start-2 max-[1400px]:col-end-3 max-[700px]:mx-[0%] rounded-ap [--ap-radius:3rem]">
                    <h2 className="text-[2.5rem] text-[var(--text-color)] font-[570] max-md:text-[2.4rem] flex justify-center max-[600px]:text-[1.5rem] text-center">Contact Information</h2>
                    <div className="flex gap-[2rem] justify-center items-center mt-[3.4rem]"> 
                        <Link href={contact.github}>
                            <FaGithub className="contactIcons soft"/>
                        </Link>
                        <Link href={contact.linkedin}>
                            <FaLinkedinIn className="contactIcons soft"/>
                        </Link>
                        <Link href={contact.telegram}>
                            <FaTelegram className="contactIcons soft"/>
                        </Link>
                        <Link href={contact.instagram}> 
                            <IoLogoInstagram className="contactIcons soft"/>
                        </Link>
                    </div>
                    <div className="text-[var(--text-color)] text-[1.4rem] font-[540] flex flex-col justify-center items-center gap-[0.6remrem] mt-[5rem] max-md:text-[0.9rem]">
                        <div>Phone: <span className="text-[var(--accent-color)] cursor-pointer">{contact.phone}</span></div>
                        <div>Email: <span className="text-[var(--accent-color)] cursor-pointer hover:text-[var(--subtext-color)]">{contact.email}</span></div>
                    </div>
                    <div className="flex flex-col justify-center items-center text-[var(--text-color)] mt-[3rem]">
                        <h3 className="text-[1.8rem] text-[var(--text-color)] font-[570] max-md:text-[1.5rem] mb-[3rem] text-center flex justify-center max-[400px]:text-[1.2rem]">Ask question about me from my AI</h3>
                        <motion.button
                            onClick={handleOpenModal}
                            layoutId="AI-box"
                            className="text-[var(--accent-color)] rounded-lg font-[570] px-[4rem] py-[0.8rem] border-2 border-[var(--accent-color)] cursor-pointer hoverLight hover:text-[var(--text-color)] hover:bg-[var(--accent-color)]"
                        >
                            AI
                        </motion.button>
                    </div>
                </motion.div>
            </div>
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    > 
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={handleClose}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.48 }}
                        />  
                        <motion.div 
                            className="relative z-10 bg-[var(--button-color)] min-h-[70vh] max-md:p-4 p-6 rounded-2xl shadow-2xl border border-[var(--accent-color)] w-[40%] max-[1000px]:w-[60%] max-md:w-[90%] mx-4 rounded-ap [--ap-radius:3rem]"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div 
                                layoutId="AI-box"
                                className="text-center"
                            >
                                <div>
                                    <h3 className="text-2xl font-bold text-[var(--accent-color)] mb-4">AI Assistant</h3>
                                </div>
                                <div
                                    className="h-[60vh] w-[98%] mx-auto bg-[var(--primary-color)] rounded-ap [--ap-radius:2rem] px-[0.6rem] pt-[0.6rem] mb-[2vh] overflow-y-auto overflow-x-auto relative"
                                >
                                    <div className={clsx("absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 transition-opacity ease-in-out duration-300 w-[85%]", messages.length > 0 && "opacity-0 pointer-events-none")}>
                                        <h2 className="text-[2.4rem] max-md:text-[1.8rem] text-[var(--text-color)] font-bold">
                                            Hi I'm Davood's assistant
                                        </h2>
                                        <p className="text-[1.2rem] text-[var(--text-color)]">
                                            Ask me anything about Davood
                                        </p>
                                    </div>
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
                                    <div className={clsx("flex justify-start gap-2 sticky bottom-0 left-0 right-0 z-10 w-full whitespace-nowrap py-2 px-2 overflow-x-auto overflow-y-visible no-scrollbar")}> 
                                            {suggestions.map(s => (
                                                <SuggestionOption 
                                                className={clsx(userMessage.includes(s.text) && "hidden", "shrink-0")}
                                                    key={s.id}
                                                    text={s.title}
                                                    onClick={() => setUserMessage(s.text)}
                                                />
                                            ))}
                                        </div>
                                        <div ref={endOfMessagesRef} className="flex items-end" />
                                    </div>
                                </div>  
                                <form
                                    onSubmit={handleSend}
                                    className="flex justify-center items-center gap-[1rem] disabled:opacity-60 w-[98%] mx-auto"
                                >
                                    <textarea 
                                        ref={textareaRef}
                                        rows={1}
                                        max-rows={4}
                                        type="text"
                                        placeholder="Ask me anything"
                                        value={userMessage}
                                        onChange={(e) => {
                                            setUserMessage(e.target.value);
                                            const el = e.target;
                                            el.style.height = 'auto';
                                            el.style.height = `${el.scrollHeight}px`;
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
                                            textAlign: checkIsPersian(userMessage) ? 'right' : 'left'
                                        }}
                                        className="w-[90%] resize-none border border-transparent mx-auto py-[0.6rem] px-[0.6rem] rounded-[12px] bg-[var(--primary-color)] focusrLight outline-none focus:border-1 focus:border-[var(--accent-color)] text-[var(--text-color)] transition-all overflow-hidden leading-[1.6rem] max-h-[8rem]"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !userMessage.trim()}
                                        className="!shadow-none hover:!shadow-none"
                                    >
                                    <IoIosArrowForward 
                                        onClick={handleSend}
                                        className={clsx(
                                            "text-[var(--accent-color)] hoverLight rounded-full font-extrabold text-[3rem] p-[0.6rem]  border-2 border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--text-color)] button soft cursor-pointer",
                                            !userMessage.trim() && 'opacity-60',
                                            
                                        )}
                                    />
                                    </button>
      
                                </form>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default contactme;