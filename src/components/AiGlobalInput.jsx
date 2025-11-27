'use client'
import React, { useState } from 'react'
import { FaCircleArrowUp } from "react-icons/fa6";
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

const AiGlobalInput = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');

    const allowedPages = ['/', '/resume', '/projects', '/contactme'];
    
    const shouldShow = () => {
        if (pathname?.startsWith('/admin')) {
            return false;
        }
        
        if (!pathname || !allowedPages.includes(pathname)) {
            return false;
        }
        
        if (pathname === '/contactme') {
            const openAI = searchParams?.get('openAI');
            if (openAI === '1' || openAI === 'true') {
                return false; 
            }
        }
        
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        
        const prompt = encodeURIComponent(inputValue.trim());
        router.push(`/contactme?openAI=1&prompt=${prompt}`);
        setInputValue('');
    };

    if (!shouldShow()) {
        return null;
    }

    return (
        <div 
            className='fixed bottom-5 w-full z-50 max-md:hidden'
        >
            <form
                onSubmit={handleSubmit}
                className='flex items-center justify-center w-[17%] max-xl:w-[23%] max-lg:w-[32%] mx-auto'
            >
                <input 
                    type="text" 
                    placeholder="Ask anything about Davood"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className='w-full relative px-[0.7rem] py-[0.7rem] !rounded-full soft bg-[var(--button-color)]/75 backdrop-blur-sm autofill:bg-[var(--primary-color)] focusrLight border border-[var(--accent-color)]/80 outline-none focus:border-1 focus:border-[var(--accent-color)]' 
                />
                <button 
                    type="submit"
                    className='relative cursor-pointer !rounded-full hover:!shadow-none '
                >
                    <FaCircleArrowUp
                        className='absolute right-2 top-0 text-center translate-y-[-50%] text-3xl text-[var(--accent-color)] hoverLight rounded-full'
                    />
                </button>
            </form>
        </div>
    )
}


export default AiGlobalInput;
