import React from "react";
import { motion } from "framer-motion";

const NavBar = ({ optionsList, isMenuOpen })  => {

    return (
        <>
            {isMenuOpen &&
                <motion.div>
                    <h1
                        className="text-[2.6rem] text-[var(--text-color)] font-[550] max-md:text-[2rem] mb-4"
                    >
                        Menu
                    </h1>
                    <ul>
                        {optionsList.map((option, index) => (
                            <li
                                key={index}
                                className=""
                                onClick={() => window.location.href = option.route}
                            >
                                {option.name}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            }
        </>
    )
}

export default NavBar;