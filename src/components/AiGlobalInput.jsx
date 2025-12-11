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
            className='fixed bottom-5 w-full z-50 pointer-events-none'
        >
            <form
                onSubmit={handleSubmit}
                className='relative flex items-center justify-center w-full transition-all ease-in-out duration-500 pointer-events-none'
            >
                <div className='relative w-[18%] max-2xl:w-[30%] max-lg:w-[45%] max-md:w-[70%] max-sm:w-[80%] mx-auto transition-all ease-in-out duration-500 hover:scale-[1.1] focus-within:scale-[1.1] focus-within:w-[23%] max-2xl:focus-within:w-[35%] max-lg:focus-within:w-[54%] max-md:focus-within:w-[80%] pointer-events-auto'>
                    <input 
                        type="text" 
                        placeholder="Ask anything about Davood"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)} 
                        className='w-full cursor-pointer relative px-[0.7rem] pr-12 py-[0.7rem] !rounded-full bg-[var(--button-color)]/75 backdrop-blur-sm autofill:bg-[var(--primary-color)] ring-2 ring-[var(--accent-color)] outline-none focus:ring-2! focus:ring-[var(--accent-color)] max-md:h-[2.5rem]' 
                    />
                    <button 
                        type="submit"
                        className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full !shadow-none hover:!shadow-none cursor-pointer'
                    >
                        <FaCircleArrowUp
                            className='text-3xl text-[var(--accent-color)] hoverLight rounded-full'
                        />
                    </button>
                </div>
            </form>
        </div>
    )
}


export default AiGlobalInput;
