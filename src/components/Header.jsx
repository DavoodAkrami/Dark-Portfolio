"use client";
import pages from "@/Data/Pages.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React ,{ useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
    const pathName = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, []);

    return (
        <>
            <header ref={headerRef} className="flex justify-between items-center px-[5%] py-[2vh] bg-[var(--header-color)] text-[var(--text-color)] relative z-20">
                <div className="flex items-center gap-[10px] max-md:scale-[0.8]"> 
                    <img src="/Davood-noBG.png" alt="" className="rounded-full h-[7vh]" />
                    <span className="text-[1.4rem] font-[600]">Davood Akrami</span>
                </div>
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
                            <ThemeToggle />
                    </ul>
                </nav>
            </header>
            <nav
                className={clsx(
                    "md:hidden w-full left-0 fixed z-10",
                    isMenuOpen ? "block" : "hidden"
                )}
                style={{ top: headerHeight }}
            >
                <ul className={clsx(
                    "mobileMenu w-full bg-[var(--header-color)] overflow-hidden p-[1rem] list-none m-0 shadow-[0_4px_6px_rgba(0,0,0,0.1)]",
                    isMenuOpen && "open"
                )}>
                    {pages.map((page) => {
                        const isActive = pathName === page.path;
                        return (
                            <li
                                key={page.path}
                                className={clsx(
                                    "text-[var(--text-color)] cursor-pointer rounded-[10px]",
                                    isActive && "bg-[var(--primary-color)]"
                                )}
                            >
                                <Link href={page.path} className="w-full block h-full p-[1rem]" onClick={() => setIsMenuOpen(false)}>
                                    {page.name}
                                </Link>
                            </li>
                        );
                    })}
                    <li className="flex justify-center p-[1rem]">
                        <ThemeToggle />
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Header;
