import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* <button className={styles.closeButton} onClick={onClose}>×</button> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
