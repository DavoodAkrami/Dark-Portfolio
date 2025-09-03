"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";




const AdminPanel = () => {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_ADMIN_LOCAL_STORAGE_VALUE;
        if (typeof window !== "undefined" && key) {
            setIsAdmin(localStorage.getItem(key) === "true");
        }
    }, []);

    if (!isAdmin) {
        router.push("admin/login")
    }

    return (
        <div className="min-h-screen">
            
        </div>
    );
}

export default AdminPanel;
