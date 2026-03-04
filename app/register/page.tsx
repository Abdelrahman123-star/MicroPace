import { getAuthUser } from "@/middleware/middleware"
import { redirect } from "next/navigation"
import RegisterForm from "./RegisterForm"

export default async function RegisterPage() {
    const user = await getAuthUser();
    if (user) redirect("/dashboard");

    return <RegisterForm />;
}