import styles from './root.module.css'
import {Header} from "@/components/header/header";
import {Footer} from "@/components/footer/footer";
import React from "react";

export const Root: React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <main className={styles.root}>
            <Header/>
            {children}
            <Footer/>
        </main>
    )
}