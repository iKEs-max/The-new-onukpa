import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Instagram, Facebook, Twitter, Send } from 'lucide-react';
import { StitchConnector } from '@/components/common/StitchConnector/StitchConnector';
import { MagneticWrap } from '@/components/animations/MagneticWrap';
import { FloatingCharacter } from '@/components/animations/FloatingCharacter';
import styles from './Contact.module.css';

// Assets
import charWaving from '@/assets/images/characters/student-white-waving.png';

export const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Hi Onukpa Express Ride! My name is ${form.name} (${form.phone}). ${form.message}`);
    window.open(`https://wa.me/233XXXXXXXXX?text=${msg}`, '_blank');
    setSent(true);
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <span className="badge badge-primary">Get in Touch</span>
          <h1>We're Here to <span className="text-gradient">Help</span></h1>
          <p>Have a question about booking, routes, or payments? We respond fast via WhatsApp.</p>
        </div>
      </section>

      <StitchConnector />

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.grid}>
            {/* Contact Info */}
            <div className={styles.info}>
              <h2>Contact Information</h2>
              <p>Reach us through any of the channels below. WhatsApp is the fastest.</p>

              <div className={styles.contactCards}>
                <a href="https://wa.me/233XXXXXXXXX" target="_blank" rel="noopener noreferrer" className={`card ${styles.contactCard} ${styles.waCard}`}>
                  <MessageCircle size={24}/>
                  <div>
                    <strong>WhatsApp</strong>
                    <span>+233 XX XXX XXXX · Fastest response</span>
                  </div>
                </a>
                <a href="tel:+233XXXXXXXXX" className={`card ${styles.contactCard}`}>
                  <Phone size={24}/>
                  <div>
                    <strong>Phone</strong>
                    <span>+233 XX XXX XXXX · Mon–Sun, 6 AM–8 PM</span>
                  </div>
                </a>
                <a href="mailto:hello@onukpaexpress.com" className={`card ${styles.contactCard}`}>
                  <Mail size={24}/>
                  <div>
                    <strong>Email</strong>
                    <span>hello@onukpaexpress.com</span>
                  </div>
                </a>
              </div>

              <div className={styles.social}>
                <p>Follow us:</p>
                <div className={styles.socialLinks}>
                  <a href="#" aria-label="Facebook"  className={styles.socialLink}><Facebook  size={20}/></a>
                  <a href="#" aria-label="Instagram" className={styles.socialLink}><Instagram size={20}/></a>
                  <a href="#" aria-label="Twitter"   className={styles.socialLink}><Twitter   size={20}/></a>
                </div>
              </div>
            </div>

            {/* Message Form */}
            <div className={`card ${styles.formCard}`}>
              {sent ? (
                <div className={styles.sentMsg}>
                  <div className={styles.sentIcon}>✅</div>
                  <h3>Message Sent via WhatsApp!</h3>
                  <p>We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <>
                  <h2>Send a Message</h2>
                  <form onSubmit={handleSubmit} className={`card ${styles.contactForm}`}>
                    <h3>Send us a <span className="text-gradient">Message</span></h3>
                    <div className={styles.formGrid}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="John Doe" 
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" placeholder="john@example.com" />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="055 XXX XXXX" 
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label className="form-label">Message</label>
                      <textarea 
                        className="form-textarea" 
                        rows={4} 
                        placeholder="How can we help you?"
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <MagneticWrap strength={15}>
                      <button type="submit" className={styles.submitBtn}>
                        <Send size={18} /> Send via WhatsApp
                      </button>
                    </MagneticWrap>

                    <FloatingCharacter
                      src={charWaving}
                      alt="Student waving"
                      size={120}
                      bottom="-20px"
                      right="-30px"
                      delay={0.5}
                    />
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
