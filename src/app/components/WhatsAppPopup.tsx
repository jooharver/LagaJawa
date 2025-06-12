
"use client";

import React, { useState } from 'react';
import styles from './WhatsAppPopup.module.css'; 

const WhatsAppPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);


  const lagaJawaContact = {
    name: ' Kontak Kami', 
    title: 'LagaJawa Futsal', 
    phoneNumber: '62895600389272', 
    status: 'Available', 
    imageUrl: '/images/logo.png' 
  };


  const whatsappLink = `https://wa.me/${lagaJawaContact.phoneNumber}?text=${encodeURIComponent(lagaJawaContact.title)}`;

  return (
    <> 
      <button
        onClick={() => setIsOpen(!isOpen)} 
        className={styles.initialFixedTriggerButton} 
        title="Hubungi Kami via WhatsApp"
      >
        <img
          src="https://logodownload.org/wp-content/uploads/2015/04/whatsapp-logo-1.png" 
          alt="WhatsApp Messenger Logo"
          className={styles.wwsIcon} 
        />
      </button>
      {isOpen && (
        <div id="wws-layout-6" className={`${styles.wwsPopupContainer} ${styles.wwsPopupContainerPosition}`}>
          <div className={`${styles.wwsGradient} ${styles.wwsGradientPosition}`}></div>
          <div className={styles.wwsPopup} data-wws-popup-status={isOpen ? "1" : "0"}>
            <div className={styles.wwsPopupHeader}>
              <button
                onClick={() => setIsOpen(false)}
                className={`${styles.wwsPopupCloseBtn} ${styles.wwsBgColor} ${styles.wwsTextColor} ${styles.wwsShadow}`}
                aria-label="Close Chat"
              >
                <i className={`fa fa-times ${styles.wwsIcon} ${styles.wwsIconClose} ${styles.wwsPopupCloseIcon}`} aria-hidden="true"></i>
              </button>
              <div className={styles.wwsClearfix}></div>
            </div>
            <div className={styles.wwsPopupBody}>
              <div className={`${styles.wwsPopupSupportWrapper} ${styles.wwsShadow}`}>
                <div className={styles.wwsPopupSupport}>
                  <div className={`${styles.wwsPopupSupportAbout} ${styles.wwsBgColor} ${styles.wwsTextColor}`}>
                    {lagaJawaContact.title}
                  </div>
                </div>
              </div>
              <div className={styles.wwsClearfix}></div>
              <div className={`${styles.wwsPopupSupportPersonContainer} ${styles.wwsShadow}`}>
                <div className={styles.wwsPopupSupportPersonWrapper}>
                  <a className={styles.wwsPopupSupportPersonLink} href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wws-pre-msg={lagaJawaContact.title}>
                    <div className={styles.wwsPopupSupportPerson}>
                      <div className={styles.wwsPopupSupportPersonImgWrapper}>
                        <img className={styles.wwsPopupSupportPersonImg} src={lagaJawaContact.imageUrl} alt={lagaJawaContact.name} width={54} height={54} />
                        {lagaJawaContact.status === 'Available' && (
                          <div className={styles.wwsPopupSupportPersonAvailable}></div>
                        )}
                      </div>
                      <div className={styles.wwsPopupSupportPersonInfoWrapper}>
                        <div className={styles.wwsPopupSupportPersonTitle}>{lagaJawaContact.title}</div>
                        <div className={styles.wwsPopupSupportPersonName}>{lagaJawaContact.name}</div>
                        <div className={styles.wwsPopupSupportPersonStatus}>{lagaJawaContact.status}</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppPopup;