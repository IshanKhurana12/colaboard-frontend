// PopupContainer.jsx
import React, { useState } from 'react';
import Livechat from './Livechat';
import styles from '../Styles/popupContainer.module.css'; // Import CSS module for styling

export default function PopupContainer() {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.container}>
            <button onClick={togglePopup} className={styles.openButton}>
                {isOpen ? 'Close Chat' : 'Open Chat'}
            </button>
            {isOpen && (
                <div className={styles.popup}>
                    <Livechat />
                </div>
            )}
        </div>
    );
}
