"use client"
import NavBar from "../../../components/NavBar";
import { useState } from "react";

const adminPanelPages = [
    {
        name: "AI data",
        route: "/admin/panel/aidata"
    }
]

const layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        <div>
            <NavBar optionsList={adminPanelPages} isMenuOpen={isMenuOpen}/>
            <div>
                {children}
            </div>
        </div>
    )
}

export default layout;