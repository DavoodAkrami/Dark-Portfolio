import Image from "next/image";

function Home() {
    return (
        <div className="bg-[var(--primary-color)] min-h-[80vh] px-[5vw] py-[15vh] flex items-center justify-around max-lg:flex-col">
            <div className="">
            <h1 className="text-[2.6rem] text-[var(--text-color)] font-[550] max-md:text-[2rem]">Hi I'm Davood Akrami</h1>
            <h2 className="text-[1.8rem] text-[var(--accent-color)] font-[550] max-md:text-[1.4rem]">Junior Front-End Developer</h2>
                <div className="text-[var(--text-color)] text-[1.2rem] mt-[1.4rem] w-[80%] font-[520] max-md:text-[1rem]">
                    Junior Front-End Developer familiar with JavaScript, React.js, MUI, and RESTful APIs. Passionate about entrepreneurship, with hands-on involvement in early-stage ideation and pitch deck development. Actively collaborated with teams through multiple non-coding and technical initiatives, with a strong interest in teamwork and creative problem-solving. Eager to grow in a learning-focused and innovation-driven environment and bring ideas to life in collaborative teams.
                </div>
            </div>
            <Image
                src="/Davood-noBG.png"
                alt="Davood Akrami"
                width={300}
                height={300}
                className="object-cover h-[100%] w-[100%] rounded-full "
            />
        </div>
    );
}

export default Home;