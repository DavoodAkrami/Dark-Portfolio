import { FaHtml5 } from "react-icons/fa";
import { FaCss3Alt } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import { RiReactjsFill } from "react-icons/ri";
import { SiMui } from "react-icons/si";
import { FaGitSquare } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { RiNextjsFill } from "react-icons/ri";
import { SiAdobepremierepro } from "react-icons/si";
import { BiLogoTypescript } from "react-icons/bi";
import { RiSupabaseFill } from "react-icons/ri";
import { TbBrandRedux } from "react-icons/tb";




const Skills = [
    {
        name: "HTML",
        icon: <FaHtml5 />,
        level: 100,
        color: "#E34F26",
    },
    {
        name: "CSS",
        icon: <FaCss3Alt />,
        level: 75,
        color: "#1572B6",
    },
    {
        name: "JavaScript",
        icon: <IoLogoJavascript />,
        level: 75,
        color: "#F7DF1E",
    },
    {
        name: "TypeScript",
        icon: <BiLogoTypescript />,
        level: 75,
        color: "#007acc",
    },
    {
        name: "React.js",
        icon: <RiReactjsFill />,
        level: 65,
        color: "#61DAFB",
    },
    {
        name: "Next.js",
        icon: <RiNextjsFill />,
        level: 40,
        color: "#000",
    },
    {
        name: "Redux",
        icon: <TbBrandRedux />,
        level: 35,
        color: "#764ABC",
    },
    {
        name: "Tailwind CSS",
        icon: <RiTailwindCssFill />,
        level: 40,
        color: "#38B2AC",
    },
    {
        name: "MUI",
        icon: <SiMui />,
        level: 60,
        color: "#007FFF",
    },
    {
        name: "Supabase",
        icon: <RiSupabaseFill />,
        level: 45,
        color: "#34B27B"
    },
    {
        name: "Git",
        icon: <FaGitSquare />,
        level: 50,
        color: "#F05032",
    },
    {
        name: "Adobe Premiere",
        icon: <SiAdobepremierepro />,
        level: 30,
        color: "#9999FF",
    },
]

export default Skills;