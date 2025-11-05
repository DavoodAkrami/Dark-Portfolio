import { motion } from "framer-motion";





const AIChatBot = () => {
    

    return (
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
                        className="h-[60vh] w-[98%] mx-auto bg-[var(--primary-color)] rounded-ap [--ap-radius:2rem] p-[0.6rem] mb-[2vh] overflow-y-auto overflow-x-auto"
                    >
                        <div className="flex flex-col gap-3 items-stretch">
                            {messages.map((m) => (
                                m.role === 'user' ? (
                                    <div key={m.id} className="flex justify-end">
                                        <Message message={m.text} />
                                    </div>
                                ) : (
                                    <div key={m.id} className="flex justify-start">
                                        <p className="text-[var(--text-color)] whitespace-pre-wrap max-w-[75%] max-md:max-w-[90%] p-6 rounded-lg bg-[var(--button-color)]/50 rounded-ap [--ap-radius:1.6rem]">{m.text}</p>
                                    </div>
                                )
                            ))}

                            {loading && (
                                <div className="flex justify-start bg-">
                                    <div className="text-[var(--accent-color)] animate-pulse whitespace-pre-wrap max-w-[75%] max-md:max-w-[90%] p-6 rounded-lg bg-[var(--button-color)]/50">Thinking...</div>
                                </div>
                            )}
                            <div ref={endOfMessagesRef} />
                        </div>
                    </div>  
                    <div
                        className="flex justify-center items-center gap-[1rem] disabled:opacity-60 w-[98%] mx-auto"
                    >
                        <input 
                            type="text"
                            placeholder="Ask me anything"
                            name="chatbot"
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            className="w-[90%] border-transparent mx-auto px-[0.6rem] py-[0.6rem] rounded-[12px] bg-[var(--primary-color)] autofill:bg-[var(--primary-color)] focusrLight border outline-none focus:border-1 focus:border-[var(--accent-color)]" 
                        />
                        <IoIosArrowForward 
                            onClick={handleSend}
                            className={clsx(
                                "text-[var(--accent-color)] font-extrabold text-[3rem] p-[0.6rem] rounded-full border-2 border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--text-color)] button soft cursor-pointer",
                                loading && 'opacity-60'
                            )}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default AIChatBot;