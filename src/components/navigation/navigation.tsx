'use client'

import React from "react";
import styles from './navigation.module.scss'
import Link from "next/link";
import {cn, urls} from "@/constants";
import {usePathname} from "next/navigation";

export const Navigation: React.FC = () => {

    const path = usePathname()
    return (
        <nav className={styles.navigation}>
            <ul>
                {
                    Object.entries(urls).map(([key, pathName]) => {
                        return (
                            <li key={key}>
                                <Link className={cn(path === pathName && styles.activeLink)}
                                      href={pathName}>
                                    {key}
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </nav>
    )
}