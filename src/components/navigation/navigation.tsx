import React from "react";
import styles from './navigation.module.css'
import Link from "next/link";

export const Navigation: React.FC = () => {
    return (
        <nav className={styles.navigation}>
            <ul>
                <li><Link href={'/'}>Main</Link></li>
                <li><Link href={'/game'}>Game</Link></li>
                <li><Link href={'/contacts'}>Contacts</Link></li>
            </ul>
        </nav>
    )
}