import React from "react";
import styles from './header.module.css'
import {Navigation} from "@/components/navigation/navigation";
import bg from '../../../public/next.svg'
import {useRouter} from "next/router";

export const Header: React.FC = () => {

    return (
        <header className={styles.header}>
            <div className={styles.bg} style={{backgroundImage: `url(${(bg as { src: any }).src})`}}/>
            <Navigation />
        </header>
    )
}