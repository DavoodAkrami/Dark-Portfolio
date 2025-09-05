"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
    const router = useRouter();

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    const localStorageValue = process.env.NEXT_PUBLIC_ADMIN_LOCAL_STORAGE_VALUE;

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (adminEmail === loginForm.email && adminPassword === loginForm.password) {
            localStorage.setItem(localStorageValue, "true");
            router.push('panel/aidata');
        } else {
            setError("Wrong email or password");
        }
    }

    return (
        <div
            className="flex justify-center items-center bg-[var(--primary-color)] h-[90vh] rounded-ap [--ap-radius:3rem]"
        >
            <form
                onSubmit={handleSubmit}
                className="p-12 max-md:p-8 rounded-xl w-[40vw] max-2xl:w-[50vw] max-xl:w-[60vw] max-md:lg-[70vw] max-md:w-[95vw] bg-[var(--button-color)] flex flex-col justify-center gap-[1.4rem]"
            >
                <h2
                    className="text-[3rem] text-[var(--accent-color)] font-[550] max-md:text-[2rem] mb-6 text-center"
                >
                    Login
                </h2>
                <input 
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} 
                    name="email"
                    placeholder="Email"
                    className="w-[90%] mx-auto px-[0.6rem] py-[0.6rem] rounded-[12px] bg-[var(--primary-color)] autofill:bg-[var(--primary-color)] focusrLight border border-transparent outline-none focus:border-1 focus:border-[var(--accent-color)]"
                />
                <input 
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} 
                    name="password"
                    placeholder="Password"
                    className="w-[90%] mx-auto px-[0.6rem] py-[0.6rem] rounded-[12px] bg-[var(--primary-color)] autofill:bg-[var(--primary-color)] focusrLight border border-transparent outline-none focus:border-1 focus:border-[var(--accent-color)]"
                />
                {error && (
                    <div className="w-[90%] mx-auto text-red-500 text-center">
                        {error}
                    </div>
                )}
                <div
                    className="w-[90%] mx-auto flex gap-[5%] justify-between items-center"
                >
                    <button
                        type="button"
                        onClick={() => (window.location.href = '/')}
                        className="text-[var(--accent-color)] w-[48%] rounded-lg font-[570] px-[1.7rem] py-[0.7rem] border-2 border-[var(--accent-color)] cursor-pointer hoverLight hover:text-[var(--text-color)] hover:bg-[var(--accent-color)]"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="px-[1.7rem] py-[0.7rem] rounded-lg w-[48%] border-2 border-[var(--accent-color)] text-[var(--text-color)] bg-[var(--accent-color)] font-[580] cursor-pointer hoverLight soft transition-all duration-300"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>        
    )
}

export default Login;