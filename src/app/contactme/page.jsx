'use client'
import  FeedbackForm from "@/components/FeedbackForm";
import ContactInfo from "@/Data/ContactInfo"
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaLinkedinIn } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { useState } from "react";

const contactme = () => {
    const contact = ContactInfo[0];
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleClose = () => {
        setIsModalOpen(false);
    };
    
    return (
        <div className="bg-[var(--primary-color)] ">
                <h1 className="text-[4rem] text-[var(--text-color)] font-[570] max-md:text-[3.4rem] flex justify-center max-sm:text-[3rem] pt-[6vh] text-center">Contact with me</h1>
                <div className="grid grid-cols-[5%_1fr_10px_1fr_5%] max-[1400px]:grid-cols-[5%_1fr_5%] max-[700px]:grid-cols[2%_1fr_2%]">
                <div className="col-start-2 col-end-3 mx-[12%] my-[10%] max-[700px]:mx-[3%]">
                    <FeedbackForm />
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="col-start-4 col-end-5 bg-[var(--button-color)] rounded-[12px] mx-[12%] my-[10%] p-[1.6rem] max-[1400px]:col-start-2 max-[1400px]:col-end-3 max-[700px]:mx-[3%]">
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
                            onClick={() => setIsModalOpen(true)}
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
                            className="relative z-10 bg-[var(--button-color)] p-8 rounded-2xl shadow-2xl border border-[var(--accent-color)] max-w-md mx-4"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div 
                                layoutId="AI-box"
                                className="text-center"
                            >
                                <h3 className="text-2xl font-bold text-[var(--accent-color)] mb-4">AI Assistant</h3>
                                <p className="text-[var(--text-color)] text-lg mb-6">Coming Soon!</p>
                                <p className="text-[var(--subtext-color)] text-sm">I'm working on an AI assistant that can answer questions about me, my experience, skills, and projects.</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default contactme;