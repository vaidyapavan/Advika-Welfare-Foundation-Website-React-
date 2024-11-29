import React from "react";
import styles from '../assets/PageFooter.module.css';

const PageFooter = ({ onBack, onNext }) => {

    return (
        <div className={styles.pageFooter}>
            <button className={styles.goback} title="Go back" onClick={onBack}>
                BACK
            </button>
            <button className={styles.nextbutton} title="Go next" onClick={onNext}>
                NEXT
            </button>
        </div>
    );
}

export default PageFooter;
