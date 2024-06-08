'use client'

import styles from './game.module.scss'
import React, {useEffect, useRef, useState} from "react";
import {GameController} from "@/infra/game/controller/game.controller";
import bg from '../../../../public/next.svg'
import Image from "next/image";

export const Game: React.FC = () => {

    const [controller] = useState(() => new GameController())

    const containerRef = useRef<HTMLDivElement | null>(null)


    useEffect(() => {
        if (containerRef.current) {
            controller.init(containerRef.current!)
        }

        return controller.dispose
    }, [])

    const src = (bg as any).src
    return (
        <div ref={containerRef}>
            {/*<svg id={'definitions'}>*/}
            {/**/}
            {/*</svg>*/}
            {/*<svg className={styles.mainLayer}>*/}
            {/*    <defs>*/}
            {/*        <pattern id={'url'} patternUnits={'userSpaceOnUse'} width={10} height={10}>*/}
            {/*            <image width={10} height={10} href={`/next.svg`}/>*/}
            {/*        </pattern>*/}
            {/*    </defs>*/}

            {/*    <rect x={100} y={100} width={300} height={300} fill={'url(#url)'}/>*/}
            {/*</svg>*/}
            {/*<svg className={styles.animationLayer}/>*/}
        </div>

    )
}