import React from 'react';
import styles from './Registers.module.css';

const Register = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>QUIZZIE</h1>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${styles.activeTab}`}>Sign Up</button>
                    <button className={styles.tab}>Log In</button>
                </div>
                <form className={styles.form}>
                    <div className={styles.inputName}>
                        <label>Name</label>
                        <input type="text"  className={styles.input} />
                    </div>
                    <div className={styles.inputName}>
                        <label >Email</label>
                        <input type="email"  className={styles.input} />
                    </div>
                    <div className={styles.inputName}>
                        <label >Password</label>
                        <input type="password"  className={styles.input} />
                    </div>
                    <div   className={styles.inputName}>
                        <label >Confirm Password</label>
                        <input type="password"  className={styles.input} />
                    </div>
                    <button type="submit" className={styles.button}>Sign-Up</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
