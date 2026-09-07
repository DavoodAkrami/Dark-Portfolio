import React from "react";


const AiDataCard = ({ title, cat, isAutoSynced, onDelete, onEdit }) => {


    return (
        <div
            className="bg-[var(--button-color)] rounded-lg p-6 flex min-h-[220px] flex-col items-center gap-4 w-full shadow-lg soft border border-transparent rounded-ap [--ap-radius:2rem]"
        >
            {isAutoSynced && (
                <span className="self-end text-[0.65rem] uppercase tracking-wide font-semibold text-[var(--subtext-color)] bg-[var(--primary-color)] px-2 py-1 rounded-full">
                    Auto-synced
                </span>
            )}
            <h2
                className="w-full break-words text-[1.35rem] text-[var(--accent-color)] font-[550] max-md:text-[1.2rem] mb-1 text-center"
            >
                {title}
            </h2>
            <p
                className="text-[1rem] text-[var(--text-color)] max-md:text-[0.95rem]"
            >
                Category: {cat}
            </p>
            <div
                className="mt-auto flex w-full gap-2 max-md:flex-col"
            >
                <button
                    className="min-h-11 text-[var(--accent-color)] w-full rounded-lg font-[570] px-4 py-2 border-2 border-[var(--accent-color)] cursor-pointer hoverLight hover:text-[var(--text-color)] hover:bg-[var(--accent-color)]"
                    onClick={onEdit}
                >
                    Edit
                </button>
                <button
                    className="min-h-11 px-4 py-2 rounded-lg w-full border-2 border-[var(--accent-color)] text-[var(--text-color)] bg-[var(--accent-color)] font-[580] cursor-pointer hoverLight soft transition-all duration-300"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default AiDataCard;
