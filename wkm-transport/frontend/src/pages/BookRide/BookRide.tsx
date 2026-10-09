import React, { useState } from 'react';
import { Bus, MapPin, User, ChevronRight, CheckCircle } from 'lucide-react';
import { StitchConnector } from '@/components/common/StitchConnector/StitchConnector';
import styles from './BookRide.module.css';

const ROUTE_OPTIONS = [
  { value: 'accra-kumasi',       label: 'Accra → Kumasi',        price: 80  },
  { value: 'kumasi-accra',       label: 'Kumasi → Accra',        price: 80  },
  { value: 'legon-knust',        label: 'Legon (UG) → KNUST',    price: 60  },
  { value: 'knust-legon',        label: 'KNUST → Legon (UG)',    price: 60  },
  { value: 'accra-cape-coast',   label: 'Accra → Cape Coast',    price: 45  },
  { value: 'cape-coast-accra',   label: 'Cape Coast → Accra',    price: 45  },
  { value: 'accra-takoradi',     label: 'Accra → Takoradi',      price: 70  },
  { value: 'kumasi-tamale',      label: 'Kumasi → Tamale',       price: 120 },
];

const TIMES: Record<string, string[]> = {
  'accra-kumasi':     ['6:00 AM','9:00 AM','12:00 PM','3:00 PM'],
  'kumasi-accra':     ['6:00 AM','9:00 AM','12:00 PM','3:00 PM'],
  'legon-knust':      ['7:00 AM','11:00 AM','2:00 PM'],
  'knust-legon':      ['7:00 AM','11:00 AM','2:00 PM'],
  'accra-cape-coast': ['6:30 AM','10:00 AM','1:00 PM'],
  'cape-coast-accra': ['6:30 AM','10:00 AM','1:00 PM'],
  'accra-takoradi':   ['7:00 AM','12:00 PM'],
  'kumasi-tamale':    ['5:00 AM','8:00 AM'],
};

interface BookingForm { route: string; date: string; time: string; seats: string; name: string; phone: string; payment: string; }

export const BookRide: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BookingForm>({ route:'', date:'', time:'', seats:'1', name:'', phone:'', payment:'momo' });
  const [confirmed, setConfirmed] = useState(false);

  const selectedRoute = ROUTE_OPTIONS.find(r => r.value === form.route);
  const times = form.route ? TIMES[form.route] || [] : [];
  const total = selectedRoute ? selectedRoute.price * parseInt(form.seats || '1') : 0;

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else {
      const msg = encodeURIComponent(
        `🚌 *ONUKPA EXPRESS BOOKING*\n\nRoute: ${selectedRoute?.label}\nDate: ${form.date} at ${form.time}\nSeats: ${form.seats}\nName: ${form.name}\nPhone: ${form.phone}\nPayment: ${form.payment.toUpperCase()}\nTotal: GH₵ ${total}\n\nPlease confirm my booking!`
      );
      window.open(`https://wa.me/233XXXXXXXXX?text=${msg}`, '_blank');
      setConfirmed(true);
    }
  };

  if (confirmed) {
    return (
      <div className={styles.page}>
        <div className={styles.successWrap}>
          <div className={`card ${styles.successCard}`}>
            <CheckCircle size={60} className={styles.successIcon}/>
            <h2>Booking Request Sent!</h2>
            <p>We've opened WhatsApp with your booking details. Our team will confirm your seat shortly.</p>
            <div className={styles.bookingSummary}>
              <div className={styles.summaryRow}><span>Route</span><strong>{selectedRoute?.label}</strong></div>
              <div className={styles.summaryRow}><span>Date</span><strong>{form.date} · {form.time}</strong></div>
              <div className={styles.summaryRow}><span>Seats</span><strong>{form.seats}</strong></div>
              <div className={styles.summaryRow}><span>Name</span><strong>{form.name}</strong></div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Total</span><strong>GH₵ {total}</strong></div>
            </div>
            <button className={styles.newBookingBtn} onClick={() => { setConfirmed(false); setStep(1); setForm({ route:'',date:'',time:'',seats:'1',name:'',phone:'',payment:'momo' }); }}>
              Make Another Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <span className="badge badge-primary">📅 Book a Ride</span>
          <h1>Reserve Your <span className="text-gradient">Seat</span></h1>
          <p>Fill in the details below and we'll confirm your booking via WhatsApp.</p>
        </div>
      </section>

      <StitchConnector />

      <section className={styles.formSection}>
        <div className="container">
          <div className={styles.layout}>
            {/* Form */}
            <div>
              {/* Step Indicator */}
              <div className={styles.steps}>
                {['Trip Details','Your Info','Payment'].map((label, i) => (
                  <div key={label} className={`${styles.stepItem} ${step > i+1 ? styles.stepDone : ''} ${step === i+1 ? styles.stepActive : ''}`}>
                    <div className={styles.stepNum}>{step > i+1 ? '✓' : i+1}</div>
                    <span>{label}</span>
                    {i < 2 && <div className={styles.stepLine}/>}
                  </div>
                ))}
              </div>

              <form onSubmit={handleNext} className={`card ${styles.formCard}`}>
                {step === 1 && (
                  <div className={styles.formBody}>
                    <h3><MapPin size={18}/> Trip Details</h3>
                    <div className="form-group">
                      <label className="form-label" htmlFor="route">Select Route *</label>
                      <select id="route" className="form-select" value={form.route} onChange={e => setForm({...form, route: e.target.value, time: ''})} required>
                        <option value="">Choose your route…</option>
                        {ROUTE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label} — GH₵{r.price}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="date">Travel Date *</label>
                      <input id="date" type="date" className="form-input" min={minDate} value={form.date} onChange={e => setForm({...form, date: e.target.value})} required/>
                    </div>
                    {times.length > 0 && (
                      <div className="form-group">
                        <label className="form-label">Departure Time *</label>
                        <div className={styles.timePills}>
                          {times.map(t => (
                            <button key={t} type="button" className={`${styles.timePill} ${form.time === t ? styles.timePillActive : ''}`} onClick={() => setForm({...form, time: t})}>
                              {t}
                            </button>
                          ))}
                        </div>
                        <input type="hidden" value={form.time} required/>
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-label" htmlFor="seats">Number of Seats *</label>
                      <select id="seats" className="form-select" value={form.seats} onChange={e => setForm({...form, seats: e.target.value})}>
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                    <button type="submit" className={styles.nextBtn} disabled={!form.route || !form.date || !form.time}>
                      Continue <ChevronRight size={16}/>
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className={styles.formBody}>
                    <h3><User size={18}/> Your Information</h3>
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name *</label>
                      <input id="name" className="form-input" placeholder="e.g. Ama Owusu" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required/>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone Number (WhatsApp) *</label>
                      <input id="phone" className="form-input" placeholder="e.g. 055 123 4567" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required/>
                    </div>
                    <p className={styles.hint}>We'll send your booking confirmation to this number via WhatsApp.</p>
                    <div className={styles.navRow}>
                      <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
                      <button type="submit" className={styles.nextBtn} disabled={!form.name || !form.phone}>Continue <ChevronRight size={16}/></button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className={styles.formBody}>
                    <h3><Bus size={18}/> Payment Method</h3>
                    <div className={styles.payOptions}>
                      {[
                        { value:'momo',   label:'MTN Mobile Money',     emoji:'📱' },
                        { value:'telecel',label:'Telecel Cash',          emoji:'📱' },
                        { value:'airtel', label:'AirtelTigo Money',      emoji:'📱' },
                        { value:'onsite', label:'Pay on Arrival (Cash)', emoji:'💵' },
                      ].map(opt => (
                        <label key={opt.value} className={`${styles.payOption} ${form.payment === opt.value ? styles.payOptionActive : ''}`}>
                          <input type="radio" name="payment" value={opt.value} checked={form.payment === opt.value} onChange={() => setForm({...form, payment: opt.value})}/>
                          <span className={styles.payEmoji}>{opt.emoji}</span>
                          <span className={styles.payLabel}>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.navRow}>
                      <button type="button" className={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
                      <button type="submit" className={styles.confirmBtn}>
                        Confirm Booking via WhatsApp →
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Summary Sidebar */}
            <div>
              <div className={`card ${styles.summary}`}>
                <h3 className={styles.summaryTitle}>Booking Summary</h3>
                {selectedRoute ? (
                  <>
                    <div className={styles.summaryRouteLabel}>{selectedRoute.label}</div>
                    {form.date && <div className={styles.summaryRow}><span>Date</span><strong>{form.date}</strong></div>}
                    {form.time && <div className={styles.summaryRow}><span>Time</span><strong>{form.time}</strong></div>}
                    <div className={styles.summaryRow}><span>Seats</span><strong>{form.seats}</strong></div>
                    <div className={styles.summaryRow}><span>Price/seat</span><strong>GH₵ {selectedRoute.price}</strong></div>
                    <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Total</span><strong>GH₵ {total}</strong></div>
                  </>
                ) : (
                  <p className={styles.summaryEmpty}>Select a route to see your booking summary.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
