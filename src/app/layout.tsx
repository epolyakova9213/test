import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Root} from "@/view/root/root";
import React from "react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "NextJS Index",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Root>
            {children}
        </Root>
        </body>
        </html>
    );
}
