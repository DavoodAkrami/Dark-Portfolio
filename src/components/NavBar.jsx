import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { MdAdminPanelSettings } from "react-icons/md";
import { LuPanelRightOpen, LuPanelLeftOpen } from "react-icons/lu";




const NavBar = ({ optionsList, isMenuOpen, className, onOpen })  => {
    const pathname = usePathname();

    return (
        <>
            <AnimatePresence>
                <motion.aside
                    className={clsx("h-[100vh] max-md:z-100 bg-[var(--button-color)] py-6 px-2 relative", className)}
                >
                    <h1
                        className={clsx("text-[2.6rem] text-[var(--accent-color)] font-[550] max-md:text-[2rem] mb-4 text-center truncate", !isMenuOpen && "flex justify-center items-center")}
                    >
                        {!isMenuOpen ? <MdAdminPanelSettings /> : "Menu"}
                    </h1>
                     
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent mb-6 mx-auto"></div>
                     
                    <ul>
                        {optionsList.map((option, index) => (
                            <li
                                key={index}
                                className={clsx(
                                    "p-4 cursor-pointer soft rounded-ap [--ap-radius:2rem]",
                                    option.route === pathname && "bg-[var(--accent-color)]"
                                )}
                                onClick={() => window.location.href = option.route}
                            >
                                <div 
                                    className={clsx(
                                        "text-[var(--accent-color)] text-[1.2rem] flex items-center font-extrabold gap-[10px] overflow-hidden max-h-[1.6rem] whitespace-nowrap",
                                        option.route === pathname && "text-[var(--text-color)]",
                                        !isMenuOpen && "justify-center"
                                    )}
                                >
                                    {option.icon}
                                    <span className={clsx(!isMenuOpen && "hidden", "truncate")}>
                                        {option.name}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {isMenuOpen ?
                        <LuPanelRightOpen 
                            onClick={onOpen}
                            className="absolute bottom-0 right-4.5 rounded-full hover:bg-[var(--subtext-color)]/40 text-[var(--accent-color)] text-[48px] max-md:text-[48px] soft cursor-pointer p-2 max-md:hidden"
                        /> :
                        <LuPanelLeftOpen 
                        onClick={onOpen}
                        className="absolute bottom-0 right-4.5 rounded-full hover:bg-[var(--subtext-color)]/40 text-[var(--accent-color)] text-[48px] max-md:text-[48px] soft cursor-pointer p-2 max-md:hidden"
                        />
                    }
                </motion.aside>
            </AnimatePresence>
        </>
    )
}

export default NavBar;