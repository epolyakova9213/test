import React from 'react'
import styles from './button.module.scss'
import {cn} from "@/constants";

type tButton = {
    text: string,
    containerClassName?: string,
    [key: string]: any,
}
export const Button: React.FC<tButton> = React.memo(({
                                                         text,
                                                         containerClassName,
                                                         ...props
                                                     }) => {
    return (
        <button className={cn(styles.submitBtn, containerClassName)} {...props}>
            {
                text
            }
        </button>
    )
})