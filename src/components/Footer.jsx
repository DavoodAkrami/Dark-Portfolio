"use client"
import React from "react";
import ContactInfo from "@/Data/ContactInfo"
import { FaLinkedinIn } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";




const Footer = () => {
    const contact = ContactInfo[0];
    return (
        <div className="bg-[var(--primary-color)]">
            <hr className="text-[var(--accent-color)] w-[85%] mx-auto my-[0]" />
            <div className="flex items-center justify-between px-[10%] py-[3rem] text-[var(--text-color)] max-sm:flex-col max-sm:gap-[1.4rem]"> 
                <div className="flex gap-[1.8rem] max-md:gap-[1rem]">
                    <FaGithub onClick={() => window.open(contact.github)} className="ContactIcons soft" />
                    <FaLinkedinIn onClick={() => window.open(contact.linkedin)} className="ContactIcons soft" />
                    <FaTelegram onClick={() => window.open(contact.telegram)} className="ContactIcons soft" />
                    <IoLogoInstagram onClick={() => window.open(contact.instagram)} className="ContactIcons soft" /> 
                    <MdEmail onClick={() => window.open(`mailto:${contact.email}`)} className="ContactIcons soft" /> 
                </div>
                <h3 className="text-[1.2rem] max-md:text-[1rem]">Developed By Davood Akrami</h3>
            </div>
        </div>
    )
}

export default Footer;