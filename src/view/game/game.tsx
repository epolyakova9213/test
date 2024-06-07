'use client'

import styles from './game.module.scss'
import React, {useEffect, useRef, useState} from "react";
import {GameController} from "@/controller/game/game.controller";

export const Game: React.FC = () => {

    const [controller] = useState(() => new GameController())

    const svg = useRef<SVGSVGElement | null>(null)

    useEffect(() => {
        if (svg.current) {
            controller.init(svg.current!)
        }

        return controller.dispose
    }, [])

    return (
        <svg ref={svg} className={styles.container}>

        </svg>
    )
}