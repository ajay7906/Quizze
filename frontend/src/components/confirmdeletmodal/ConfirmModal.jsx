


import React, { useState } from 'react';
import styles from './Confirm.module.css';
import { ColorRing } from 'react-loader-spinner';

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalText}>
          Are you sure you <br /> want to delete?
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.confirmButton} onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <ColorRing
                visible={true}
                height="20"
                width="20"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']}
              />
            ) : 'Confirm Delete'}
          </button>
          <button className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

