// src/components/MainLayout.jsx
import React from 'react';
import Navbar from './Navbar';
import styles from '../Styles/mainlayout.module.css'

const MainLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
