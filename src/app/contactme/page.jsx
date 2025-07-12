'use client'
import  FeedbackForm from "@/components/FeedbackForm";
import ContactInfo from "@/Data/ContactInfo"
import Link from "next/link";
import { motion } from "framer-motion";
import { FaLinkedinIn } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";




const contactme = () => {
    const contact = ContactInfo[0];
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

        </div>
    )
}


export default contactme;