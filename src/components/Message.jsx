import React from "react"



const Message = ({ message }) => {

    return (
        <div
            className="text-[var(--text-color)] whitespace-pre-wrap max-w-[75%] max-md:max-w-[90%] p-6 rounded-ap [--ap-radius:1.6rem] bg-[var(--button-color)]"
        >
            {message}
        </div>
    )
}

export default Message;