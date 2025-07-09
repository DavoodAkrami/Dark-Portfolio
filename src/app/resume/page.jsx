"use client"
import ContactInfo from "@/Data/ContactInfo";
import SkillsSlider from "@/components/SkillsSlider";

const about = () => {
    const contact = ContactInfo[0];
    
    return (
        <div className="bg-[var(--primary-color)] min-h-[80vh] flex flex-col items-center justify-center">
            <h1 className="text-[2.5rem] text-[var(--text-color)] font-[570] mb-[1rem]">My Resume</h1>
            <button 
                onClick={() => window.open(contact.resume)}
                className="bg-[var(--button-color)] text-[1.2rem] text-[var(--text-color)] px-[1.2rem] py-[0.8rem] rounded-[10px] border border-transparent cursor-pointer hover:border-[var(--accent-color)]"
            >
                See Resume
            </button>
            <SkillsSlider direction="left"/>
            <div className="w-[80%] mx-[auto] my-[0] bg-[var(--button-color)] ">
                my skills
            </div>
            <div>
                my experience
            </div>
        </div>
    )
}

export default about;