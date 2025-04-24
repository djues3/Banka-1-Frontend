import React from 'react';
import styles from '../../styles/CreditCardDisplay.module.css';
import Switch from '@mui/material/Switch';
import {useAuth} from "../../context/AuthContext";

const CreditCardDisplay = ({ card, onBlockToggle, onActiveToggle, theme = 'dark' }) => {
    const {userInfo} = useAuth();
    let isClient = false;
    if(userInfo.position === "NONE"){
        isClient = true;
    }

    const formatCardNumber = (number) => {
        return number.replace(/(.{4})/g, '$1 ').trim();
    };

    const cardNumberGroups = formatCardNumber(card.cardNumber).split(' ');


    return (
        <div className={`${styles.creditCard} ${styles[theme]} ${card.blocked ? styles.blocked : ''} ${!card.active ? styles.deactivated : ''}`}>
            <div className={styles.cardTop}>
                <div className={styles.chip} />
                <div className={styles.brand}>{card.cardBrand ? card.cardBrand : "Unknown"}</div>
            </div>

            <div className={styles.cardNumber}>
                {cardNumberGroups.map((group, index) => (
                    <span key={index}>{group}</span>
                ))}
            </div>

            <div className={styles.cardInfo}>
                <div className={styles.cardName}>{card.firstName} {card.lastName}</div>
                <div className={styles.cardLimit}>Limit: {card.cardLimit}</div>
                <div className={styles.cardStatus}>
                    {card.active ? "Active" : "Deactivated"} | {card.blocked ? "Blocked" : "Unblocked"}
                </div>
            </div>

            <div className={styles.cardButtons}>
                <div
                    className={styles.toggleLabel}
                    onClick={(e) => { e.stopPropagation(); }}
                >
                    <Switch
                        checked={card.blocked}
                        onChange={() => onBlockToggle(card)}
                        className={styles.blockSwitch}
                        disabled={!card.active}
                    />
                    <span>{card.blocked ? "Blocked" : "Unblocked"}</span>
                </div>
                <div
                    className={styles.toggleLabel}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >


                    {!isClient && (
                        <div>
                            <Switch
                                checked={card.active}
                                className={styles.activeSwitch}
                                disabled={!card.active}
                                onChange={() => onActiveToggle(card)}
                            />
                            <span>{card.active ? "Active" : "Deactivated"}</span>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CreditCardDisplay;