import React from "react";
import styles from './footer.module.scss'
import {FaTelegram, FaWhatsappSquare} from "react-icons/fa";
import {IoMailOpen} from "react-icons/io5";

export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.icons}>
                <a href={'https://t.me/alexandroBas'}>
                    <FaTelegram/>
                </a>
                <a href={'mailto: gatesoftommorow91@mail.ru'}>
                    <IoMailOpen/>
                </a>
                <a href={'https://wa.me/79251811173'}>
                    <FaWhatsappSquare/>
                </a>
            </div>
            <div className={styles.info}>
                <span>Alexandr Basalov</span><span className={styles.copy}>{'\u00A9'}</span>
            </div>
        </footer>
    )
}