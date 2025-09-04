import React from "react";


const AiDataCard = ({ title, cat, onDelete, onEdit }) => {


    return (
        <div
            className="bg-[var(--button-color)] rounded-lg p-6 flex flex-col items-center gap-4 w-full shadow-lg soft border border-transparent"
        >
            <h2
                className="text-[1.8rem] text-[var(--accent-color)] font-[550] max-md:text-[1.4rem] mb-6 text-center"
            >
                {title}
            </h2>   
            <p
                className="text-[1.2rem] text-[var(--text-color)] max-md:text-[1rem]"
            >
                Category: {cat}
            </p>
            <div
                className="flex gap-[10px] w-full"
            >
                <button
                    className="text-[var(--accent-color)] w-full rounded-lg font-[570] px-[1.7rem] py-[0.7rem] border-2 border-[var(--accent-color)] cursor-pointer hoverLight hover:text-[var(--text-color)] hover:bg-[var(--accent-color)]"
                    onClick={onEdit}
                >
                    Edit
                </button>
                <button
                    className="px-[1.7rem] py-[0.7rem] rounded-lg w-full border-2 border-[var(--accent-color)] text-[var(--text-color)] bg-[var(--accent-color)] font-[580] cursor-pointer hoverLight soft transition-all duration-300"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default AiDataCard;