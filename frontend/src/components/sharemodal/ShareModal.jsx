
// src/components/ShareModal.js

import React from 'react';
import styles from './ShareModal.module.css';
import { ToastContainer, toast } from 'react-toastify';

const ShareModal = ({ shareLink, sendUrlLink, closeShareLinkModal , onClose}) => {
  const linkToDisplay = shareLink || sendUrlLink;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
      <ToastContainer
      className={styles.toastcontainer}
      />
        <button className={styles.closeButton} onClick={()=>{
          // closeShareLinkModal();
          onClose()
          
          }}>✖</button>
        <h2>Congrats your Quiz is <br /> Published!</h2>
        <input className={styles.shareLink} type="text" placeholder='your link is here' value={linkToDisplay} readOnly />
        <button className={styles.shareButton} onClick={() => {
          navigator.clipboard.writeText(linkToDisplay);
          toast.success('Link Copied Successfully');
        }}>
          Share
        </button>
      </div>
    </div>
  );
};

export default ShareModal;

