import React from "react";
import styles from './header.module.scss'
import {Navigation} from "@/infra/navigation/navigation";
import bg from '../../../public/next.svg'

export const Header: React.FC = () => {

    return (
        <header className={styles.header}>
            <div className={styles.bg} style={{backgroundImage: `url(${(bg as { src: any }).src})`}}/>
            <Navigation />
        </header>
    )
}