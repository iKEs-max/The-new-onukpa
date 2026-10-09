import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { PageTransition } from '@/components/common/PageTransition/PageTransition';
import styles from './MainLayout.module.css';

export const MainLayout: React.FC = () => {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export const DashboardLayout: React.FC = () => {
  return (
    <div className={styles.page}>
      <Header />
      <div className={`container ${styles.dashboardContainer}`}>
        <main className={styles.dashboardMain}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
      <Footer />
    </div>
  );
};
