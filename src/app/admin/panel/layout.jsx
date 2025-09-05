"use client"
import clsx from "clsx";
import NavBar from "../../../components/NavBar";
import { useState } from "react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";
import { AiFillDatabase } from "react-icons/ai";
import { FaHome } from "react-icons/fa";


const adminPanelPages = [
    {
        name: "Home",
        route: "/",
        icon: <FaHome />
    },
    {
        name: "AI data",
        route: "/admin/panel/aidata",
        icon: <AiFillDatabase />,
    },
]

const layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        <div className="flex">
            <AnimatePresence>
                {isMenuOpen && 
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 'auto' }}
                        exit={{ width: 0 }}
                        transition={{ duration: 0.4 }}
                        className="max-md:fixed max-md:top-0 max-md:left-0 max-md:h-[100vh] max-md:z-100"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25}}
                            className={clsx(
                                "fixed inset-0 z-50",
                                "bg-[var(--background)]/20 bg-opacity-50 backdrop-blur-sm",
                                "transition-opacity duration-300 md:hidden"
                            )}
                            onClick={() => setIsMenuOpen(false)}
                        >
                        <NavBar
                            optionsList={adminPanelPages}
                            isMenuOpen={true}
                            onClose={() => setIsMenuOpen(false)}
                            className="md:hidden"
                        />
                        </motion.div>
                        <NavBar
                            optionsList={adminPanelPages}
                            isMenuOpen={true}
                            onClose={() => setIsMenuOpen(false)}
                            className="max-md:hidden"
                        />
                    </motion.div>
                }
            </AnimatePresence> 
            <div className="w-full relative">
                {isMenuOpen ? 
                    (<IoIosArrowBack
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={clsx(
                            "absolute top-[2rem] left-[2rem] rounded-full hover:bg-[var(--subtext-color)] text-[var(--accent-color)] text-[48px] max-md:text-[48px] soft cursor-pointer p-2 max-md:hidden",
                        )}
                    /> ): (
                    <IoReorderThreeOutline 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={clsx(
                            "absolute top-[2rem] left-[2rem] rounded-full hover:bg-[var(--subtext-color)] text-[var(--accent-color)] text-[64px] max-md:text-[48px] soft cursor-pointer p-2",
                        )}
                    />)
                }
                {children}
            </div>
        </div>
    )
}

export default layout;