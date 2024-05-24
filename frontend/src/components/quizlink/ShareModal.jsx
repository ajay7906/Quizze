// src/components/ShareModal.js

import React from 'react';
import styles from './ShareModal.module.css';

const ShareModal = ({ isOpen, onClose, shareLink }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        <h2>Congrats your Quiz is Published!</h2>
        <input className={styles.shareLink} type="text" value={shareLink} readOnly />
        <button className={styles.shareButton} onClick={() => navigator.clipboard.writeText(shareLink)}>Share</button>
      </div>
    </div>
  );
};

export default ShareModal;
