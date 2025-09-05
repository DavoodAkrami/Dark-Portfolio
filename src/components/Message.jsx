import React from "react"
import { motion } from "framer-motion"

const Message = ({ message, layoutId }) => {

    return (
        <motion.div
            layoutId={layoutId}
            initial={{ 
                opacity: 0, 
                scale: 0.8, 
                y: 20,
                rotateX: -15
            }}
            animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                rotateX: 0
            }}
            transition={{ 
                duration: 0.4, 
                ease: "easeOut",
                layout: { duration: 0.4, ease: "easeInOut" },
                type: "spring",
                stiffness: 100,
                damping: 15
            }}
            className="text-[var(--text-color)] whitespace-pre-wrap max-w-[75%] max-md:max-w-[90%] p-6 rounded-ap [--ap-radius:1.6rem] bg-[var(--button-color)] shadow-lg"
        >
            {message}
        </motion.div>
    )
}

export default Message;