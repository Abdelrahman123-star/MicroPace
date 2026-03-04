import "./globals.css";
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
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
      <body
        className={`antialiased`}
      >
        <Header user={JSON.parse(JSON.stringify(user))} />
        {children}

        <Footer />

      </body>
    </html>
  );
}
