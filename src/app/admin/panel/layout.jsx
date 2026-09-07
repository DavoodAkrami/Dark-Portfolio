import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    ADMIN_SESSION_COOKIE,
    verifyAdminSessionToken,
} from "@/lib/adminAuth";
import AdminPanelShell from "./AdminPanelShell";

export default async function AdminPanelLayout({ children }) {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

    if (!verifyAdminSessionToken(token)) {
        redirect("/admin/login");
    }

    return <AdminPanelShell>{children}</AdminPanelShell>;
}
