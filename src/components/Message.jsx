import React from "react"



const Message = ({ message }) => {

    return (
        <div
            className="text-[var(--text-color)] whitespace-pre-wrap max-w-[75%] p-6 rounded-lg bg-[var(--button-color)]"
        >
            {message}
        </div>
    )
}

export default Message;