import React from 'react';
import styles from './Card.module.css'; // Import CSS Module

const Berita = () => {
  return (
    <div className={styles.body}>
      <div className={styles.kartu}>
        <h3>Ini Card</h3>
        <p>berita hari ini</p>
      </div>
    </div>
  );
};

export default Berita;