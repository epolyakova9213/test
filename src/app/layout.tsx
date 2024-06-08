import type {Metadata} from "next";
import {Comic_Neue, Inter, Open_Sans, Roboto} from "next/font/google";
import "./globals.css";
import {Root} from "@/infra/root/root";
import React from "react";

const roboto = Open_Sans({
    weight: '400',
    subsets: ['latin'],
})

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
        <body className={roboto.className}>
        <Root>
            {children}
        </Root>
        </body>
        </html>
    );
}
