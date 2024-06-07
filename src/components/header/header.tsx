import React from "react";
import styles from './header.module.css'
import {Navigation} from "@/components/navigation/navigation";

export const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <Navigation/>
            Header
        </header>
    )
}