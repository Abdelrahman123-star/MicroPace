import { getAuthUser } from "@/middleware/middleware"
import { redirect } from "next/navigation"
import LoginForm from "./LoginForm"

export default async function LoginPage() {
    const user = await getAuthUser();
    if (user) redirect("/dashboard");

    return <LoginForm />;
}