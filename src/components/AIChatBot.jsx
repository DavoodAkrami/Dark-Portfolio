'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowForward } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import clsx from 'clsx';
import Message from './Message';

const STORAGE_KEY = 'ai_global_chat_messages';
const TTL = 24 * 60 * 60 * 1000;

const AIChatBot = ({ onClose, initialPrompt = '' }) => {
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const endOfMessagesRef = useRef(null);
    const inputRef = useRef(null);
    const hasSubmittedInitial = useRef(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const { messages: msgs, timestamp } = JSON.parse(stored);
                if (Date.now() - timestamp < TTL) setMessages(msgs);
            }
        } catch {}
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, timestamp: Date.now() }));
        }
    }, [messages]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (initialPrompt && !hasSubmittedInitial.current) {
            hasSubmittedInitial.current = true;
            sendMessage(initialPrompt);
        }
    }, [initialPrompt]);

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    const sendMessage = async (text) => {
        const messageText = text.trim();
        if (!messageText || loading) return;

        const userMsg = { id: Date.now(), role: 'user', text: messageText };
        setMessages((prev) => [...prev, userMsg]);
        setUserMessage('');
        setLoading(true);

        try {
            const res = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText }),
            });
            const data = await res.json();
            const reply = data.reply || "I couldn't process that request.";
            setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', text: reply }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, role: 'assistant', text: 'Something went wrong. Please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = () => {
        if (userMessage.trim()) sendMessage(userMessage);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClear = () => {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop — no motion to avoid layering/blur compositing bugs */}
            <motion.div
                className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
            />

            {/* Modal — expands from bottom where the pill button lives */}
            <motion.div
                className="relative z-10 flex flex-col bg-[var(--button-color)] max-md:p-5 p-7 rounded-ap [--ap-radius:2.4rem] shadow-2xl border border-[var(--accent-color)]/30 w-[58%] max-[1100px]:w-[70%] max-md:w-[94%] mx-4 max-h-[88vh]"
                initial={{ opacity: 0, scale: 0.4, y: '40vh', borderRadius: '999px' }}
                animate={{ opacity: 1, scale: 1, y: 0, borderRadius: '2.4rem' }}
                exit={{ opacity: 0, scale: 0.4, y: '40vh', borderRadius: '999px' }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5 flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-color)] animate-pulse" />
                        <h3 className="text-2xl font-bold text-[var(--accent-color)]">AI Assistant</h3>
                    </div>
                    <div className="flex items-center gap-1">
                        {messages.length > 0 && (
                            <button
                                onClick={handleClear}
                                title="Clear chat"
                                className="text-[var(--text-color)] opacity-50 hover:opacity-100 hover:text-red-400 transition-all p-1.5 rounded-full hover:bg-[var(--primary-color)] soft cursor-pointer"
                            >
                                <MdDeleteOutline size={22} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-[var(--text-color)] opacity-60 hover:opacity-100 hover:text-[var(--accent-color)] transition-all p-1.5 rounded-full hover:bg-[var(--primary-color)] soft cursor-pointer"
                        >
                            <IoClose size={24} />
                        </button>
                    </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 min-h-0 h-[60vh] w-full bg-[var(--primary-color)] rounded-ap [--ap-radius:1.6rem] p-4 mb-5 overflow-y-auto overflow-x-hidden">
                    {messages.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--text-color)] opacity-40 text-center px-6">
                            <span className="text-4xl">🤖</span>
                            <p className="text-base">Ask me anything about Davood!</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {messages.map((m) =>
                            m.role === 'user' ? (
                                <div key={m.id} className="flex justify-end">
                                    <Message message={m.text} />
                                </div>
                            ) : (
                                <div key={m.id} className="flex justify-start">
                                    <p className="text-[var(--text-color)] whitespace-pre-wrap max-w-[75%] max-md:max-w-[90%] p-4 rounded-ap [--ap-radius:1.4rem] bg-[var(--button-color)] text-base leading-relaxed">
                                        {m.text}
                                    </p>
                                </div>
                            )
                        )}

                        {loading && (
                            <div className="flex justify-start m-1">
                                <div className="flex items-center gap-[6px] px-4 py-3 rounded-ap [--ap-radius:1.4rem] bg-[var(--button-color)]">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            className="block w-[8px] h-[8px] rounded-full bg-[var(--accent-color)]"
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{
                                                duration: 0.7,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                                delay: i * 0.15,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={endOfMessagesRef} />
                    </div>
                </div>

                {/* Input row */}
                <div className="flex items-center gap-3 w-full flex-shrink-0">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask me anything..."
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        className="flex-1 border-transparent px-4 py-3.5 rounded-[14px] bg-[var(--primary-color)] autofill:bg-[var(--primary-color)] border outline-none focus:border focus:border-[var(--accent-color)] disabled:opacity-50 text-[var(--text-color)] transition-colors text-base"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !userMessage.trim()}
                        className={clsx(
                            'flex-shrink-0 text-[var(--accent-color)] text-[2.8rem] p-[0.5rem] rounded-full border-2 border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white soft cursor-pointer transition-all',
                            (loading || !userMessage.trim()) && 'opacity-40 pointer-events-none'
                        )}
                    >
                        <IoIosArrowForward />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AIChatBot;
