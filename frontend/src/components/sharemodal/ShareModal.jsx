// src/components/ShareModal.js

import React from 'react';
import styles from './ShareModal.module.css';
import { toast } from 'react-toastify'
const ShareModal = ({ closeModal, shareLink, sendUrlLink, closeShareLinkModal }) => {
  


  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={closeShareLinkModal}>✖</button>
        <h2>Congrats your Quiz is <br /> Published!</h2>
        <input className={styles.shareLink} type="text" placeholder='your link is here' value={sendUrlLink} readOnly />
        <button className={styles.shareButton} onClick={() => {
          navigator.clipboard.writeText(sendUrlLink);
          toast.success('Link Copied Succefully')

        }

        }
        >Share</button>
      </div>
    </div>
  );
};

export default ShareModal;
