"use client";
import pages from "@/Data/Pages.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React ,{ useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import routes from "@/routes/routes";

const Header = () => {
    const pathName = usePathname(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const NoHeaderPages = routes.filter(page => page.hasHeader === false);
    const NoHeaderPage = NoHeaderPages.find(page => pathName.includes(page.path));

    useEffect(() => {
        const updateHeaderHeight = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };

        updateHeaderHeight();
        window.addEventListener("resize", updateHeaderHeight);

        return () => window.removeEventListener("resize", updateHeaderHeight);
    }, []);

    
        useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
    
        setIsMobile(mediaQuery.matches);
    
        const handler = (e) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);
    
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);


    const { scrollY } = useScroll();

    const borderRadius = useTransform(scrollY, [0, 70], ["0px", "50px"]);
    const mobileBorderRadus = useTransform(scrollY, [0, 70], ["0px", "30px"]);
    const background = useTransform(
        scrollY,
        [40, 100],
        ["var(--header-color)", "var(--header-color-transparent)"]
    );

    const marginTop = useTransform(scrollY, [40, 100], ["0px", "15px"]);
    const mobileWidth = useTransform(scrollY, [40, 100], ["100%", "90%"]);
    const width = useTransform(scrollY, [40, 100], ["100%", "50%"]);
    const mobileNavTop = useMotionTemplate`calc(${headerHeight}px + ${marginTop})`;
    const padding = useTransform(scrollY, [40, 100], ["20px", "8px"]);
    const themeTogglePadding = useTransform(scrollY, [40, 100], ["12px", "20px"]);
    const borderWidth = useTransform(scrollY, [40, 100], ["0px", "1px"]);
    const borderColor = useTransform(scrollY, [40, 100], ["transparent", "var(--accent-color-tr)"]);
    if (NoHeaderPage) return null

    return (
        <>
            <motion.header
                ref={headerRef}
                style={{
                    borderRadius: isMobile ? mobileBorderRadus : borderRadius,
                    background,
                    marginTop,
                    width: isMobile ? mobileWidth : width,
                    padding,
                    borderWidth,
                    borderColor,
                    borderStyle: "solid",
                }}
                className={clsx(
                    "fixed top-0 left-0 right-0  mx-auto rounded-full flex justify-between items-center bg-[var(--header-color)] text-[var(--text-color)] backdrop-blur-sm max-md:bg-transparent z-20 transition-all duration-300 ease-in-out",
                    isMenuOpen && "rounded-b-none! !border-b-transparent",
                )}
            >
                <Link className="flex items-center gap-[10px] max-md:scale-[0.8]" href="/"> 
                    <img src="/Davood-noBG.png" alt="" className="rounded-full h-[7vh]" style={{ borderWidth, borderColor}} />
                    <span className="text-[1.4rem] font-[600]">Davood Akrami</span>
                </Link>
                <div
                    className="flex md:hidden flex-col gap-[6px] cursor-pointer p-[5px] transition-transform duration-300 ease-out"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span
                        className={clsx(
                            "block w-[25px] h-[3px] bg-[var(--text-color)] transition-all duration-300 ease-out origin-center",
                            isMenuOpen && "translate-y-[9px] rotate-[45deg]"
                        )}
                    />
                    <span
                        className={clsx(
                            "block w-[25px] h-[3px] bg-[var(--text-color)] transition-all duration-300 ease-out origin-center",
                            isMenuOpen && "opacity-0 scale-0"
                        )}
                    />
                    <span
                        className={clsx(
                            "block w-[25px] h-[3px] bg-[var(--text-color)] transition-all duration-300 ease-out origin-center",
                            isMenuOpen && "translate-y-[-9px] rotate-[-45deg]"
                        )}
                    />
                </div>
                <nav className="hidden md:flex">
                    <ul className="flex gap-6 items-center">
                        {pages.map((page) => {
                            const isActive = pathName === page.path;
                            return (
                                <li key={page.path} className="relative group">
                                    <Link
                                        href={page.path}
                                        className={`relative px-2 py-1 font-medium transition-colors
                                            ${isActive ? "text-accent text-[var(--accent-color)] max-md:text-[0.8rem]" : "hover:text-[var(--accent-color)] max-md:text-[0.8rem]"}
                                        `}
                                    >
                                        {page.name}
                                        <span
                                            className={`
                                                pointer-events-none
                                                absolute left-0 -bottom-1 h-[1.8px] w-full
                                                bg-[var(--accent-color)]
                                                origin-left
                                                transition-transform duration-300
                                                ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                                            `}
                                        />
                                    </Link>
                                </li>
                            );
                        })}
                        <li>
                            <ThemeToggle padding={themeTogglePadding} />
                        </li>
                    </ul>
                </nav>
            </motion.header>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.nav
                        key="mobile-nav"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className={clsx(
                            "md:hidden w-full left-0 right-0 fixed z-1000000 mx-auto rounded-t-none! backdrop-blur-sm !border-t-0"
                        )}
                        style={{ top: mobileNavTop,

                            borderRadius: isMobile ? mobileBorderRadus : borderRadius, background, width: isMobile ? mobileWidth : width, borderWidth, borderColor
                         }}
                    >
                        <ul style={{ borderRadius, background }} className="w-full overflow-hidden p-[1rem] list-none m-0 rounded-ap">
                            {pages.map((page) => {
                                const isActive = pathName === page.path;
                                return (
                                    <li
                                        key={page.path}
                                        className={clsx(
                                            "text-[var(--text-color)] cursor-pointer rounded-[10px] rounded-ap",
                                            isActive && "bg-[var(--primary-color)]"
                                        )}
                                    >
                                        <Link href={page.path} className="w-full block h-full p-[1rem]" onClick={() => setIsMenuOpen(false)}>
                                            {page.name}
                                        </Link>
                                    </li>
                                );
                            })}
                            <li className="flex justify-center p-[1rem] !rounded-full">
                                <ThemeToggle padding={themeTogglePadding} />
                            </li>
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
}

export default Header;
