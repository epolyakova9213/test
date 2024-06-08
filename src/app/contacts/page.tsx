import React from "react";
import {ContactForm} from "@/app/contacts/contact-form/contact-form";
import styles from './contacts.module.scss'

export const metadata = {
    title: 'NextJS Contacts'
}


export default function Page() {
    return (
        <div className={styles.container}>
            <ContactForm/>
        </div>
    )
}