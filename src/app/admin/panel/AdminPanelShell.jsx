"use client"

import clsx from "clsx";
import NavBar from "../../../components/NavBar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillDatabase } from "react-icons/ai";
import { IoArrowBack, IoLogOutOutline } from "react-icons/io5";
import { MdDashboard, MdMenu } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";

const AdminPanelShell = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
        router.replace("/admin/login");
        router.refresh();
    };

    const adminPanelPages = [
        {
            name: "Dashboard",
            route: "/admin/panel",
            icon: <MdDashboard />
        },
        {
            name: "AI data",
            route: "/admin/panel/aidata",
            icon: <AiFillDatabase />,
        },
        {
            name: "Back To Home",
            route: "/",
            icon: <IoArrowBack />
        },
        {
            name: "Log out",
            route: null,
            icon: <IoLogOutOutline />,
            onClick: handleLogout,
        },
    ];

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    return (
        <div className="flex">
            {!isMenuOpen && (
                <button
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Open menu"
                    className="md:hidden fixed top-4 left-4 z-[120] bg-[var(--button-color)] text-[var(--accent-color)] p-3 rounded-full shadow-lg hoverLight soft cursor-pointer"
                >
                    <MdMenu size={22} />
                </button>
            )}

            <AnimatePresence>
                {isMenuOpen &&
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25}}
                        className={clsx(
                            "fixed inset-0 z-[110]",
                            "bg-[var(--background)]/40 backdrop-blur-sm",
                            "transition-opacity duration-300 md:hidden"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                    />
                }
            </AnimatePresence>

            <motion.div
                initial={{ width: '80px' }}
                animate={{ width: isMenuOpen ? '350px' : '80px' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 h-screen z-30 max-md:hidden"
            >
                <NavBar
                    optionsList={adminPanelPages}
                    isMenuOpen={isMenuOpen}
                    onOpen={() => setIsMenuOpen(!isMenuOpen)}
                    onClose={() => setIsMenuOpen(false)}
                />
            </motion.div>

            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: isMenuOpen ? '0%' : '-100%' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 h-screen w-[280px] z-[115] md:hidden"
            >
                <div className="relative h-full">
                    <NavBar
                        optionsList={adminPanelPages}
                        isMenuOpen={true}
                        onOpen={() => setIsMenuOpen(false)}
                        onClose={() => setIsMenuOpen(false)}
                    />
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close menu"
                        className="absolute top-5 right-3 text-[var(--accent-color)] p-1.5 rounded-full hover:bg-[var(--accent-color)]/15 soft cursor-pointer"
                    >
                        <RxCross2 size={22} />
                    </button>
                </div>
            </motion.div>

            <motion.div
                className="w-full overflow-y-auto h-screen"
                animate={{
                    paddingLeft: isMobile ? '0px' : (isMenuOpen ? '350px' : '80px')
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {children}
            </motion.div>
        </div>
    )
}

export default AdminPanelShell;
