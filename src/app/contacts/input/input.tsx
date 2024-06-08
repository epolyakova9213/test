import React from 'react'
import styles from './input.module.scss'
import {cn} from "@/constants";

type tInput = {
    name: string,
    asTextArea?: boolean,
    containerClass?: string,
    focusedBackgroundClass?: string,
    value: string,
    [key: string]: any
}
export const Input: React.FC<tInput> = React.memo(({
                                                       name,
                                                       asTextArea,
                                                       containerClass,
                                                       focusedBackgroundClass,
                                                       value,
                                                       ...props
                                                   }) => {
    return (
        <div className={cn(styles.fieldContainer, containerClass)}>
            {
                asTextArea ?
                    <textarea className={cn(styles.input, styles.field, styles.textarea)}
                              value={value}
                              {...props}
                    /> :
                    <input className={cn(styles.input, styles.field)}
                           value={value}
                           {...props}
                    />
            }
            <div className={cn(styles.underField, value && styles.focusedDiv)}/>
            <div className={cn(styles.text, value && styles.focusedText)}>
                {name}
            </div>
        </div>
    )
})