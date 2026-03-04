"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export default function LayoutWrapper({
    children,
    user
}: {
    children: React.ReactNode;
    user: any;
}) {
    const pathname = usePathname();

    // Check if the current route is a sprint page
    // Sprint pages align to /paths/[slug]/[sprintSlug]
    // A regex check helps ensure we don't accidentally hide it on just /paths/[slug]
    const isSprintPage = pathname.match(/^\/paths\/[^\/]+\/[^\/]+$/);
    const isAuthPage = pathname === "/login" || pathname === "/register";
    const hideLayout = isSprintPage || isAuthPage;

    return (
        <>
            {!hideLayout && <Header user={user} />}
            <main>{children}</main>
            {!hideLayout && <Footer />}
        </>
    );
}
