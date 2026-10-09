import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target, Eye, Users, Award, MapPin } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { StitchConnector } from '@/components/common/StitchConnector/StitchConnector';
import { FloatingCharacter } from '@/components/animations/FloatingCharacter';
import { MagneticWrap } from '@/components/animations/MagneticWrap';
import styles from './About.module.css';

// Assets
import charTraveling from '@/assets/images/characters/student-black-waving.png'; // Reusing as traveling
import charPair from '@/assets/images/characters/students-pair-chatting.png';

const TEAM = [
  { name: 'Emmanuel Onukpa', role: 'Founder & CEO',        initial: 'E' },
  { name: 'Abena Asante',    role: 'Operations Manager',   initial: 'A' },
  { name: 'Kofi Mensah',     role: 'Driver Coordinator',   initial: 'K' },
];

export const About: React.FC = () => {
  return (
    <div className={styles.page}>
    {/* Hero */}
    <section className={styles.hero}>
      <div className={`container ${styles.heroInner}`}>
        <span className="badge badge-primary">Our Story</span>
        <h1>Making Student Travel <span className="text-gradient">Simple & Safe</span></h1>
        <p>
          We decided to change that.
        </p>
        <div className={styles.heroCtas}>
          <MagneticWrap strength={15}>
            <Link to={ROUTES.BOOK_RIDE} className={styles.btnPrimary}>Book a Ride Today</Link>
          </MagneticWrap>
          <MagneticWrap strength={10}>
            <Link to={ROUTES.CONTACT}   className={styles.btnOutline}>Get in Touch</Link>
          </MagneticWrap>
        </div>

        <FloatingCharacter 
          src={charTraveling} 
          alt="Traveling student" 
          size={160}
          bottom="-30px"
          right="20px"
          delay={0.8}
        />
      </div>
    </section>
    
    <StitchConnector />

    {/* Mission & Vision */}
    <section className={styles.mvSection}>
      <div className="container">
        <div className={styles.mvGrid}>
          <div className={`card ${styles.mvCard}`}>
            <span className={styles.mvIcon}><Target size={28}/></span>
            <h3>Our Mission</h3>
            <p>
              To provide students across Ghana with safe, reliable, and affordable transportation
              that fits their schedules and budgets — making every journey stress-free.
            </p>
          </div>
          <div className={`card ${styles.mvCard}`}>
            <span className={`${styles.mvIcon} ${styles.mvIconTeal}`}><Eye size={28}/></span>
            <h3>Our Vision</h3>
            <p>
              To be the most trusted student transport network in West Africa, connecting campuses
              to cities with technology-enabled, comfortable bus services.
            </p>
          </div>
          <div className={`card ${styles.mvCard}`}>
            <span className={`${styles.mvIcon} ${styles.mvIconGreen}`}><Heart size={28}/></span>
            <h3>Our Values</h3>
            <p>
              Safety first. Punctuality always. Respect for every passenger. We treat every student
              like family and every trip like it's our most important one.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <StitchConnector />

    {/* Stats */}
    <section className={styles.statsSection}>
      <div className="container">
        <div className={styles.statsGrid}>
          {[
            { icon: <Users  size={24}/>, val: '10,000+', lbl: 'Students Transported' },
            { icon: <MapPin size={24}/>, val: '8',        lbl: 'Active Routes'        },
            { icon: <Award  size={24}/>, val: '4.9★',     lbl: 'Average Rating'       },
            { icon: <Heart  size={24}/>, val: '2022',     lbl: 'Founded'              },
          ].map((s) => (
            <div key={s.lbl} className={styles.statCard}>
              <span className={styles.statIcon}>{s.icon}</span>
              <strong>{s.val}</strong>
              <span>{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
    
    <StitchConnector />

    {/* Team */}
    <section>
      <div className="container">
        <div className="section-heading">
          <h2>Meet the <span className="text-gradient">Team</span></h2>
          <p>The dedicated people behind Onukpa Express Ride.</p>
        </div>
        <div className={styles.teamGrid}>
          {TEAM.map((m) => (
            <div key={m.name} className={`card ${styles.teamCard}`}>
              <div className={styles.teamAvatar}>{m.initial}</div>
              <strong>{m.name}</strong>
              <span>{m.role}</span>
            </div>
          ))}
        </div>

        <FloatingCharacter 
          src={charPair} 
          alt="Students chatting" 
          size={160}
          top="-40px"
          right="-20px"
          delay={0.5}
          isWaving={false}
        />
      </div>
    </section>

    {/* CTA */}
    <section className={styles.ctaBanner}>
      <div className="container">
        <h2>Ready to Travel with Us?</h2>
        <p>Book your first ride today and experience the Onukpa Express Ride difference.</p>
        <MagneticWrap strength={15}>
          <Link to={ROUTES.BOOK_RIDE} className={styles.btnPrimary}>Book a Ride →</Link>
        </MagneticWrap>
      </div>
    </section>
    </div>
  );
};
