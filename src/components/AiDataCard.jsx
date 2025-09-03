import React from "react";


const AiDataCard = ({ title, cat, onDelete, onEdit }) => {


    return (
        <div
            className="bg-[var(--button-color)] rounded-lg p-6 flex flex-col items-center gap-4 w-full max-w-[300px] shadow-lg soft border border-transparent hover:border-[var(--accent-color)] hoverLight"
        >
            <h2
                className="text-[1.8rem] text-[var(--accent-color)] font-[550] max-md:text-[1.4rem] mb-6"
            >
                {title}
            </h2>   
            <p
                className="text-[1.2rem] text-[var(--text-color)] max-md:text-[1rem]"
            >
                Category: {cat}
            </p>
        </div>
    )
}

export default AiDataCard;