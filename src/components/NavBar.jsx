import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { usePathname } from "next/navigation";



const NavBar = ({ optionsList, isMenuOpen, className })  => {
    const pathname = usePathname();

    return (
        <>
            <AnimatePresence>
                {isMenuOpen &&
                    <motion.aside
                         className={clsx("min-w-[15vw] max-md:w-[70vw] h-[100vh] max-md:z-100 bg-[var(--button-color)] py-6 px-2", className)}
                    >
                        <h1
                            className="text-[2.6rem] text-[var(--accent-color)] font-[550] max-md:text-[2rem] mb-4 text-center"
                        >
                            Menu
                        </h1>
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
                                            "text-[var(--accent-color)] text-[1.2rem] flex items-center font-extrabold gap-[10px]",
                                            option.route === pathname && "text-[var(--text-color)]"
                                        )}
                                    >
                                        {option.icon}
                                        {option.name}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.aside>
                }
            </AnimatePresence>
        </>
    )
}

export default NavBar;