import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import styles from './Footer.module.css';
import { Logo } from '@/components/common/Logo/Logo';

export const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={`container ${styles.inner}`}>
      {/* Brand */}
      <div className={styles.brand}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          <Logo size={48} />
        </Link>
        <p>Safe, affordable, and reliable transport connecting university students with cities across Ghana.</p>
        <div className={styles.socials}>
          <a href="#" aria-label="Facebook"  className={styles.social}><Facebook  size={18}/></a>
          <a href="#" aria-label="Instagram" className={styles.social}><Instagram size={18}/></a>
          <a href="#" aria-label="Twitter"   className={styles.social}><Twitter   size={18}/></a>
        </div>
      </div>

      {/* Quick Links */}
      <div className={styles.col}>
        <h4>Quick Links</h4>
        <ul>
          <li><Link to={ROUTES.HOME}>Home</Link></li>
          <li><Link to={ROUTES.ABOUT}>About Us</Link></li>
          <li><Link to={ROUTES.ROUTES}>Routes</Link></li>
          <li><Link to={ROUTES.PRICING}>Pricing</Link></li>
          <li><Link to={ROUTES.CONTACT}>Contact</Link></li>
        </ul>
      </div>

      {/* Popular Routes */}
      <div className={styles.col}>
        <h4>Popular Routes</h4>
        <ul>
          <li><Link to={ROUTES.BOOK_RIDE}>Accra → Kumasi</Link></li>
          <li><Link to={ROUTES.BOOK_RIDE}>Kumasi → Accra</Link></li>
          <li><Link to={ROUTES.BOOK_RIDE}>Legon → KNUST</Link></li>
          <li><Link to={ROUTES.BOOK_RIDE}>Accra → Cape Coast</Link></li>
          <li><Link to={ROUTES.BOOK_RIDE}>Accra → Takoradi</Link></li>
        </ul>
      </div>

      {/* Contact */}
      <div className={styles.col}>
        <h4>Get in Touch</h4>
        <div className={styles.contacts}>
          <a href="https://wa.me/233XXXXXXXXX" target="_blank" rel="noopener noreferrer" className={styles.contactRow}>
            <MessageCircle size={16}/> WhatsApp Us
          </a>
          <a href="tel:+233XXXXXXXXX" className={styles.contactRow}>
            <Phone size={16}/> +233 XX XXX XXXX
          </a>
          <a href="mailto:hello@onukpaexpress.com" className={styles.contactRow}>
            <Mail size={16}/> hello@onukpaexpress.com
          </a>
        </div>
        <Link to={ROUTES.BOOK_RIDE} className={styles.bookBtn}>📅 Book a Ride Now</Link>
      </div>
    </div>

    <div className={styles.bottom}>
      <div className="container">
        <span>© {new Date().getFullYear()} Onukpa Express Ride. All rights reserved.</span>
        <span>Made with ❤️ for Ghanaian students</span>
        <Link to={ROUTES.ADMIN_LOGIN} style={{ opacity: 0.4, fontSize: '0.8rem', marginLeft: 'auto' }}>Admin Portal</Link>
      </div>
    </div>
  </footer>
);
