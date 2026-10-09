import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Smartphone, Ticket } from 'lucide-react';

export const InteractiveJourneySteps: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { 
      n: '01', 
      title: 'Choose Your Route',   
      text: 'Pick departure, destination, and your preferred travel date and time.',
      icon: <MapPin size={32} color="var(--brand-primary)" />,
      preview: (
        <div style={{ padding: '20px', background: 'var(--color-surface-2)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <strong>Accra</strong>
            <span style={{ opacity: 0.5 }}>→</span>
            <strong>Kumasi</strong>
          </div>
          <div style={{ background: 'var(--color-surface)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} /> <span>Tomorrow, 7:00 AM</span>
          </div>
        </div>
      )
    },
    { 
      n: '02', 
      title: 'Enter Your Details',  
      text: 'Provide your name and WhatsApp number to confirm your seat.',
      icon: <Smartphone size={32} color="var(--color-info)" />,
      preview: (
        <div style={{ padding: '20px', background: 'var(--color-surface-2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ height: '30px', background: 'var(--color-surface)', borderRadius: '6px', width: '100%' }} />
          <div style={{ height: '30px', background: 'var(--color-surface)', borderRadius: '6px', width: '70%' }} />
          <motion.div 
            animate={{ width: ['0%', '100%'] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ height: '2px', background: 'var(--brand-primary)', marginTop: '8px' }} 
          />
        </div>
      )
    },
    { 
      n: '03', 
      title: 'Hop On & Travel!',    
      text: 'Show up at the pick-up point and enjoy a smooth, comfortable ride.',
      icon: <Ticket size={32} color="var(--color-success)" />,
      preview: (
        <div style={{ padding: '20px', background: 'var(--color-success)', color: 'white', borderRadius: '12px', textAlign: 'center' }}>
          <Ticket size={48} style={{ margin: '0 auto 10px' }} />
          <h3>Seat Confirmed!</h3>
          <p style={{ opacity: 0.9, color: 'white' }}>Bus leaves in 12 hrs</p>
        </div>
      )
    },
  ];

  return (
    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
      
      {/* Left side: The text steps */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {steps.map((s, i) => (
          <motion.div 
            key={s.n} 
            onClick={() => setActiveStep(i)}
            style={{ 
              padding: '24px', 
              borderRadius: '16px', 
              cursor: 'pointer',
              background: activeStep === i ? 'var(--color-surface)' : 'transparent',
              border: `1px solid ${activeStep === i ? 'var(--color-border)' : 'transparent'}`,
              boxShadow: activeStep === i ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ 
                fontFamily: 'monospace', 
                fontWeight: 800, 
                fontSize: '1.2rem',
                color: activeStep === i ? 'var(--brand-primary)' : 'var(--color-text-light)'
              }}>
                {s.n}
              </div>
              <div>
                <h3 style={{ marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ margin: 0 }}>{s.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right side: Dynamic Preview Window */}
      <div style={{ flex: '1 1 350px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '400px', 
          height: '300px', 
          background: 'var(--color-surface)', 
          borderRadius: '24px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--color-surface-2)' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}/>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }}/>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}/>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Preview</span>
          </div>

          {/* Body with AnimatePresence */}
          <div style={{ flex: 1, padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.3, type: 'spring' }}
                style={{ width: '100%' }}
              >
                {steps[activeStep].preview}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
