"use client"
import clsx from "clsx";
import NavBar from "../../../components/NavBar";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiFillDatabase } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { useRouter } from "next/navigation";



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
]

const layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const authStatus = localStorage.getItem(process.env.NEXT_PUBLIC_ADMIN_LOCAL_STORAGE_VALUE) === "true";
            setIsAuthenticated(authStatus);
            setIsLoading(false);
            
            if (!authStatus) {
                router.push('/admin/login');
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[var(--primary-color)]">
                <div className="text-[var(--accent-color)] text-2xl">Loading....</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; 
    }

    return (
        <div className="flex">
            <motion.div
                initial={{ width: '80px' }}
                animate={{ width: isMenuOpen ? '350px' : '80px' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 max-md:h-[100vh] max-md:z-100"
            >
                {isMenuOpen &&
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
                    </motion.div>
                }
                <NavBar
                    optionsList={adminPanelPages}
                    isMenuOpen={isMenuOpen}
                    onOpen={() => setIsMenuOpen(!isMenuOpen)}
                    onClose={() => setIsMenuOpen(false)}
                    className="max-md:hidden"
                />
            </motion.div> 
            <motion.div 
                className="w-full overflow-y-auto h-screen max-md:pl-0"
                animate={{ 
                    paddingLeft: isMenuOpen ? '350px' : '80px' 
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {children}
            </motion.div>
        </div>
    )
}

export default layout;