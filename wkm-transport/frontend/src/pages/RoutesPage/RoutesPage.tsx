import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, CreditCard, ArrowRight, Bus } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { StitchConnector } from '@/components/common/StitchConnector/StitchConnector';
import { MagneticWrap } from '@/components/animations/MagneticWrap';
import styles from './RoutesPage.module.css';

// Assets
import busAsset from '@/assets/images/characters/bus-shuttle.png';
import charWaving from '@/assets/images/characters/student-white-waving.png';

const ROUTE_DATA = [
  { id: 1, from: 'Accra (Nkrumah Circle)', to: 'Kumasi (Kejetia)', duration: '4h 30min', times: ['6:00 AM','9:00 AM','12:00 PM','3:00 PM'], price: 80, days: 'Daily' },
  { id: 2, from: 'Kumasi (Kejetia)', to: 'Accra (Nkrumah Circle)', duration: '4h 30min', times: ['6:00 AM','9:00 AM','12:00 PM','3:00 PM'], price: 80, days: 'Daily' },
  { id: 3, from: 'Legon (UG Main Gate)', to: 'KNUST (Ayigya Gate)', duration: '3h 00min', times: ['7:00 AM','11:00 AM','2:00 PM'], price: 60, days: 'Fri, Sat, Sun' },
  { id: 4, from: 'KNUST (Ayigya Gate)', to: 'Legon (UG Main Gate)', duration: '3h 00min', times: ['7:00 AM','11:00 AM','2:00 PM'], price: 60, days: 'Fri, Sat, Sun' },
  { id: 5, from: 'Cape Coast (UCC)', to: 'Accra (Circle)', duration: '2h 30min', times: ['6:30 AM','10:00 AM','1:00 PM'], price: 45, days: 'Daily' },
  { id: 6, from: 'Accra (Circle)', to: 'Cape Coast (UCC)', duration: '2h 30min', times: ['6:30 AM','10:00 AM','1:00 PM'], price: 45, days: 'Daily' },
  { id: 7, from: 'Kumasi (KNUST)', to: 'Tamale', duration: '6h 00min', times: ['5:00 AM','8:00 AM'], price: 120, days: 'Mon,Wed,Fri,Sun' },
  { id: 8, from: 'Accra', to: 'Takoradi', duration: '3h 30min', times: ['7:00 AM','12:00 PM'], price: 70, days: 'Daily' },
];

const FILTERS = ['All Routes','Accra','Kumasi','Cape Coast','Tamale','Takoradi'];

export const RoutesPage: React.FC = () => {
  const [filter, setFilter] = useState('All Routes');

  const visible = filter === 'All Routes'
    ? ROUTE_DATA
    : ROUTE_DATA.filter(r => r.from.includes(filter) || r.to.includes(filter));

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.hero}>
        <div className="container">
          <span className="badge badge-primary">📍 Routes & Schedule</span>
          <h1>Our <span className="text-gradient">Routes</span></h1>
          <p>Browse all available routes, departure times, and prices. Book your seat in seconds.</p>
        </div>
      </section>

    <StitchConnector />

      <section className={styles.routeSection}>
        <div className="container">
          {/* Filter Pills */}
          <div className={styles.filters}>
            {FILTERS.map(f => (
              <MagneticWrap key={f} strength={10}>
                <button
                  className={`${styles.pill} ${filter === f ? styles.pillActive : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              </MagneticWrap>
            ))}
          </div>

          {/* Route Cards */}
          <div className={styles.grid}>
            {visible.map(r => (
              <div key={r.id} className={`card ${styles.routeCard}`}>
                <div className={styles.routeRoute}>
                  <div className={styles.location}>
                    <MapPin size={14} className={styles.locIcon} />
                    <span>{r.from}</span>
                  </div>
                  <div className={styles.arrow}><ArrowRight size={16}/></div>
                  <div className={styles.location}>
                    <MapPin size={14} className={styles.locIconDest} />
                    <span>{r.to}</span>
                  </div>
                </div>
                <div className={styles.routeMeta}>
                  <span><Clock size={14}/> {r.duration}</span>
                  <span>
                    <img src={busAsset} alt="Bus" style={{ width: 24, height: 24, display: 'inline-block', marginRight: 4, verticalAlign: 'middle' }} /> 
                    {r.days}
                  </span>
                </div>
                <div className={styles.times}>
                  <p className={styles.timesLabel}>Departure Times:</p>
                  <div className={styles.timePills}>
                    {r.times.map(t => <span key={t} className={styles.timePill}>{t}</span>)}
                  </div>
                </div>
                <div className={styles.routeFooter}>
                  <div className={styles.price}>
                    <CreditCard size={14}/> GH₵ {r.price} <span>/ seat</span>
                  </div>
                  <Link to={ROUTES.BOOK_RIDE} className={styles.bookBtn}>Book Now</Link>
                </div>
              </div>
            ))}
          </div>

          {visible.length === 0 && (
            <div className={styles.empty}>
              <p>No routes found for "{filter}". Try a different filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
