import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Shield, Clock, MapPin, ChevronRight, Users, Zap } from 'lucide-react';
import { RouteGrid } from '@/components/routes/RouteGrid/RouteGrid';
import { useRouteStore } from '@/store/route.store';
import { motion } from 'framer-motion';
import { ROUTES } from '@/config/routes';
import styles from './Home.module.css';

// Lazy-load heavy animation components to isolate potential failures
const Canvas3DBackground = lazy(() => 
  import('@/components/animations/three/Canvas3DBackground').then(m => ({ default: m.Canvas3DBackground }))
);
const MagneticWrap = lazy(() => 
  import('@/components/animations/MagneticWrap').then(m => ({ default: m.MagneticWrap }))
);
const LiveRouteIndicator = lazy(() => 
  import('@/components/animations/LiveRouteIndicator').then(m => ({ default: m.LiveRouteIndicator }))
);
const GlowingRouteLine = lazy(() => 
  import('@/components/animations/GlowingRouteLine').then(m => ({ default: m.GlowingRouteLine }))
);
const FloatingStars = lazy(() => 
  import('@/components/animations/FloatingStars').then(m => ({ default: m.FloatingStars }))
);
const TiltCard = lazy(() => 
  import('@/components/animations/TiltCard').then(m => ({ default: m.TiltCard }))
);
const InteractiveJourneySteps = lazy(() => 
  import('@/components/animations/InteractiveJourneySteps').then(m => ({ default: m.InteractiveJourneySteps }))
);
import { FloatingAvatars } from '@/components/animations/FloatingAvatars';
import { StitchConnector } from '@/components/common/StitchConnector/StitchConnector';
import { FloatingCharacter } from '@/components/animations/FloatingCharacter';

// Character Assets
import charWavingBlack from '@/assets/images/characters/student-black-waving.png';
import charWavingWhite from '@/assets/images/characters/student-white-waving.png';
import charPairWaving from '@/assets/images/characters/students-pair-waving.png';
import charPairChatting from '@/assets/images/characters/students-pair-chatting.png';

/* Animated counter */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return <>{val}{suffix}</>;
}

const TESTIMONIALS = [
  { name: 'Ama Owusu',    uni: 'KNUST Student', text: 'Super easy to book and the bus was on time. Love it!',                                               stars: 5 },
  { name: 'Kofi Asante',  uni: 'UG Legon',      text: 'Finally a reliable way to get home during vacation. The prices are very fair.',                        stars: 5 },
  { name: 'Abena Mensah', uni: 'UCC Student',    text: 'The WhatsApp contact worked perfectly when I needed help. Great service!',                            stars: 5 },
];

// Simple fallback spinner for animation components
const AnimFallback = () => <div style={{ minHeight: 40 }} />;

export const Home: React.FC = () => {
  const { routes, isLoading, fetchRoutes } = useRouteStore();
  useEffect(() => { fetchRoutes(); }, [fetchRoutes]);
  const activeRoutes = routes.filter((r) => r.status === 'ACTIVE');

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero} style={{ position: 'relative', overflow: 'hidden' }}>
        {/* 3D WebGL Background */}
        <Suspense fallback={null}>
          <Canvas3DBackground />
        </Suspense>

        <div className={`container ${styles.heroInner}`} style={{ zIndex: 1, position: 'relative' }}>
          <div className={styles.heroContent}>
            <span className={`badge badge-primary animate-scaleIn ${styles.heroBadge}`}>
              🎓 Student-Focused Transport
            </span>
            
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className={`${styles.heroTitle} text-glow`}
            >
              {['Travel', 'Between', 'Campus', '&', 'City', '—'].map((word, i) => (
                <motion.span 
                  key={i}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                  variants={{
                    hidden: { opacity: 0, y: 20, rotateX: -90 },
                    visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } }
                  }}
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span 
                className="text-gradient-animated"
                style={{ display: 'inline-block' }}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { type: 'spring', delay: 0.6 } }
                }}
              >
                Effortlessly
              </motion.span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={styles.heroSub}
            >
              Onukpa Express Ride connects university students with major cities across Ghana.
              Safe, affordable, and always on time.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className={styles.heroCtas}
            >
              <Suspense fallback={<Link to={ROUTES.BOOK_RIDE} className={styles.btnPrimary}><Bus size={18} /> Book a Ride</Link>}>
                <MagneticWrap strength={20}>
                  <Link to={ROUTES.BOOK_RIDE} className={styles.btnPrimary}>
                    <Bus size={18} /> Book a Ride
                  </Link>
                </MagneticWrap>
              </Suspense>
              
              <Suspense fallback={<Link to={ROUTES.ROUTES} className={styles.btnOutline}>View Routes <ChevronRight size={16} /></Link>}>
                <MagneticWrap strength={10}>
                  <Link to={ROUTES.ROUTES} className={styles.btnOutline}>
                    View Routes <ChevronRight size={16} />
                  </Link>
                </MagneticWrap>
              </Suspense>
            </motion.div>

            {/* Hero Character */}
            <FloatingCharacter 
              src={charWavingBlack} 
              alt="Student waving" 
              size={180}
              bottom="-20px"
              right="-40px"
              delay={1.2}
              className={styles.heroChar}
            />
          </div>

          {/* Live Route Indicator */}
          <div style={{ position: 'absolute', right: '5%', top: '25%', zIndex: 2 }}>
            <Suspense fallback={null}>
              <LiveRouteIndicator route="Accra → Kumasi" seats={12} />
            </Suspense>
          </div>
        </div>

        {/* Stats bar */}
        <div className={`container ${styles.statsBar} glass`}>
          {[
            { icon: <Users size={28}/>, val: 10000, suffix: '+', lbl: 'Happy Riders', color: 'var(--brand-primary)' },
            { custom: 'glowing', val: 50, suffix: '+', lbl: 'Daily Trips' },
            { custom: 'glowing', val: 8, suffix: '',  lbl: 'Routes'      },
            { custom: 'stars',   val: 49, suffix: '', lbl: 'Rating (4.9★)'},
          ].map((s, i) => (
            <motion.div 
              key={s.lbl} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5, type: 'spring' }}
              className={styles.statItem}
            >
              <span className={styles.statIcon} style={{ color: s.color || 'var(--brand-primary)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                {s.custom === 'glowing' && (
                  <Suspense fallback={<span style={{ width: 100, height: 40, display: 'block' }} />}>
                    <GlowingRouteLine />
                  </Suspense>
                )}
                {s.custom === 'stars' && (
                  <Suspense fallback={<span>★★★★★</span>}>
                    <FloatingStars />
                  </Suspense>
                )}
                {!s.custom && s.icon}
              </span>
              <strong style={{ fontSize: '2.5rem', lineHeight: 1 }}><Counter target={s.val} suffix={s.suffix} /></strong>
              <span style={{ fontWeight: 600, opacity: 0.8 }}>{s.lbl}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className={styles.features}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="section-heading"
          >
            <h2>Why Students <span className="text-gradient">Love Us</span></h2>
            <p>We built Onukpa Express Ride specifically for student needs — affordable fares, convenient schedules, and a super-easy booking process.</p>
          </motion.div>
          
          <div className={styles.featureGridWrapper} style={{ position: 'relative' }}>
            <FloatingCharacter 
              src={charWavingWhite} 
              alt="White student waving" 
              size={140}
              top="-60px"
              left="-40px"
              delay={0.5}
              isWaving={true}
              className={styles.featureChar}
            />
            
            <div className={styles.featureGrid}>
              {[
                { icon: <Shield size={28}/>, title: 'Safe & Secure',   text: 'All drivers are vetted, vehicles maintained, and trips tracked for your peace of mind.', color: '#ede9fe', iconClr: '#4f46e5' },
                { icon: <Clock  size={28}/>, title: 'Always On Time',   text: 'We pride ourselves on punctuality. Departure times are strictly observed every day.',         color: '#cffafe', iconClr: '#0891b2' },
                { icon: <Zap    size={28}/>, title: 'Instant Booking', text: 'Book your seat in under 2 minutes from any phone — no queue, no hassle.',                   color: '#fef3c7', iconClr: '#d97706' },
                { icon: <MapPin size={28}/>, title: 'Campus Pickup',   text: 'Pick-up points right at or near your campus gates for maximum convenience.',                 color: '#d1fae5', iconClr: '#065f46' },
              ].map((f, i) => (
                <motion.div 
                  key={f.title} 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                  style={{ perspective: 1000 }}
                >
                  <Suspense fallback={
                    <div className={`card ${styles.featureCard}`}>
                      <span className={styles.featureIcon} style={{ background: f.color, color: f.iconClr }}>{f.icon}</span>
                      <h3>{f.title}</h3>
                      <p>{f.text}</p>
                    </div>
                  }>
                    <TiltCard intensity={15}>
                      <div className={`card ${styles.featureCard}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <span className={styles.featureIcon} style={{ background: f.color, color: f.iconClr }}>{f.icon}</span>
                        <h3>{f.title}</h3>
                        <p>{f.text}</p>
                      </div>
                    </TiltCard>
                  </Suspense>
                </motion.div>
              ))}
            </div>

            <FloatingCharacter 
              src={charPairWaving} 
              alt="Students waving" 
              size={160}
              bottom="-40px"
              right="-60px"
              delay={0.8}
              className={styles.featureCharPair}
            />
          </div>
        </div>
      </section>

      <StitchConnector />

      {/* ── Popular Routes ── */}
      <section className={styles.routesSection}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={styles.routesHeader}
          >
            <div>
              <h2>Popular <span className="text-gradient">Routes</span></h2>
              <p>Choose your destination and book in seconds.</p>
            </div>
            <div className={styles.routesHeaderRight}>
              <Link to={ROUTES.ROUTES} className={styles.viewAll}>View All Routes →</Link>
            </div>
          </motion.div>
          <RouteGrid routes={activeRoutes.slice(0, 6)} isLoading={isLoading} />
        </div>
      </section>

      <StitchConnector />

      {/* ── How It Works ── */}
      <section className={styles.howSection}>
        <div className={`orb orb-2 ${styles.howOrb}`} />
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="section-heading"
          >
            <h2>Book in <span className="text-gradient">3 Easy Steps</span></h2>
          </motion.div>
          <div style={{ marginTop: '3rem' }}>
            <Suspense fallback={<AnimFallback />}>
              <InteractiveJourneySteps />
            </Suspense>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center" 
            style={{ marginTop: '2.5rem' }}
          >
            <Link to={ROUTES.BOOK_RIDE} className={styles.btnPrimary}>
              <Bus size={18}/> Start Booking Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className={styles.testimonials} style={{ position: 'relative', overflow: 'hidden' }}>
        <Suspense fallback={null}>
          <FloatingAvatars />
        </Suspense>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="section-heading"
          >
            <h2>What Students <span className="text-gradient">Say</span></h2>
          </motion.div>
          <div className={styles.testimonialGridWrapper} style={{ position: 'relative' }}>
            <FloatingCharacter 
              src={charPairChatting} 
              alt="Students chatting" 
              size={180}
              top="-100px"
              right="0"
              delay={0.5}
              isWaving={false}
              className={styles.testimonialChar}
            />
            
            <div className={styles.testimonialGrid}>
              {TESTIMONIALS.map((t, i) => (
                <motion.div 
                  key={t.name} 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.15, ease: 'easeOut' }}
                >
                  <div className={`card ${styles.testimonialCard}`}>
                    <div className={styles.stars}>{'★'.repeat(t.stars)}</div>
                    <p className={styles.testimonialText}>"{t.text}"</p>
                    <div className={styles.testimonialAuthor}>
                      <div className={styles.avatar}>{t.name[0]}</div>
                      <div>
                        <strong>{t.name}</strong>
                        <span>{t.uni}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: 'spring' }}
            className={styles.ctaInner}
          >
            <h2>Ready for Your Next Trip?</h2>
            <p>Join thousands of students who trust Onukpa Express Ride every week.</p>
            <div className={styles.ctaBtns}>
              <Link to={ROUTES.BOOK_RIDE} className={styles.ctaBtnWhite}>Book a Ride →</Link>
              <Link to={ROUTES.CONTACT}   className={styles.ctaBtnGhost}>Contact Us</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
