import React from "react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion";

const Modal = ({ children, onClose, isModalOpen, className }) => {

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    return (
            <>
                <AnimatePresence>
                    {isModalOpen &&
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25}}
                            className={clsx(
                                "fixed inset-0 z-50 flex items-center justify-center",
                                "bg-[var(--background)]/20 bg-opacity-50 backdrop-blur-sm",
                                "transition-opacity duration-300"
                            )}
                            onClick={handleBackdropClick}
                        >
                            <div
                                className={clsx(
                                    "bg-[var(--button-color)] text-[var(--text-color)] p-4 rounded-lg w-[40vw] max-lg:w-[60vw] max-md:w-[90vw]",
                                    className
                                )}
                                onClick={(e) => e.stopPropagation()} 
                            >
                                {children}
                            </div>
                        </motion.div>   
                    }
                </AnimatePresence>
            </>
    )
}

export default Modal;