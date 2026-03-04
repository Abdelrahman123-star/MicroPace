import "./globals.css";
import LayoutWrapper from '@/components/LayoutWrapper';
import type { Metadata } from "next";


import { getAuthUser } from "@/middleware/middleware";

export const metadata: Metadata = {
  title: "Sprint.Io",
  description: "Learn with interactive sprints and skill paths",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser();

  return (
    <html lang="en">
      <body className={`antialiased`}>
        <LayoutWrapper user={user ? JSON.parse(JSON.stringify(user)) : null}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
