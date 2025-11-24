import clsx from "clsx";



const SuggestionOption = ({text, onClick, className}) => {
    
    return (
        <button 
            onClick={onClick}
            className={clsx("!rounded-full p-3 flex justify-center items-center bg-[var(--button-color)]/80 backdrop-blur-[2px] cursor-pointer soft hoiver:border border-2 text-sm text-[var(--text-color)] hover:border-[var(--accent-color)] border-[var(--secondary-color)]", className)}>
            {text}
        </button>
    )
}

export default SuggestionOption;