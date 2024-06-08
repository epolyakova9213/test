'use client'

import styles from './game.module.scss'
import React, {useEffect, useRef, useState} from "react";
import {GameController} from "@/infra/game/controller/game.controller";

export const Game: React.FC = () => {

    const [controller] = useState(() => new GameController())

    const containerRef = useRef<HTMLDivElement | null>(null)


    useEffect(() => {
        if (containerRef.current) {
            controller.init(containerRef.current!)
        }

        return controller.dispose
    }, [])

    return (
        <div ref={containerRef} className={styles.container}>
            <svg className={styles.mainLayer}/>
            <svg className={styles.animationLayer}/>
        </div>

    )
}