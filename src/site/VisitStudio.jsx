import React, { useEffect, useState } from 'react';
import { Check, Copy, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

import { rise } from './motion.js';

export function PaperVisit({ steps }) {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[0.86fr_1.14fr]">
      <div role="tablist" aria-label="Steps in a first visit" className="grid gap-2">
        {steps.map((step, index) => {
          const on = index === active;
          return (
            <motion.button
              key={step.title}
              type="button"
              role="tab"
              id={`visit-tab-${index}`}
              aria-selected={on}
              aria-controls="visit-sheet"
              data-testid={`visit-sheet-${index}`}
              onClick={() => setActive(index)}
              {...rise(index)}
              whileTap={{ scale: 0.98 }}
              className={`grid grid-cols-[3.2rem_1fr_auto] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                on
                  ? 'border-clinic-maroon bg-clinic-maroon text-clinic-ivory shadow-card'
                  : 'border-clinic-sand bg-clinic-porcelain text-clinic-ink hover:border-clinic-saffron'
              }`}
            >
              <span className={`font-heading text-2xl font-semibold ${on ? 'text-clinic-saffronSoft' : 'text-clinic-saffron'}`}>{step.no}</span>
              <span className="text-sm font-semibold leading-snug sm:text-base">{step.title}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${on ? 'bg-white/12 text-clinic-ivory' : 'bg-clinic-ivory text-clinic-maroon'}`}>{step.time}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="paper-stage" data-testid="paper-stage">
        {steps.map((step, index) => {
          const offset = index - active;
          const folded = offset < 0;
          const depth = Math.max(offset, 0);
          const transform = reduced
            ? `translateY(${depth * 10}px)`
            : `translateY(${depth * 14}px) rotateX(${folded ? -92 : 0}deg)`;
          return (
            <article
              key={step.title}
              id={index === active ? 'visit-sheet' : undefined}
              role="tabpanel"
              aria-labelledby={`visit-tab-${index}`}
              aria-hidden={index !== active}
              className="paper-sheet"
              style={{
                transform,
                zIndex: steps.length - Math.abs(offset),
                opacity: folded ? 0 : 1,
                pointerEvents: index === active ? 'auto' : 'none',
              }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-clinic-maroon">Sheet {step.no} · {step.time}</p>
              <h3 className="mt-4 font-heading text-3xl font-semibold leading-tight text-clinic-ink sm:text-4xl">{step.title}</h3>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-clinic-umber">{step.text}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function ShareClinic({ clinicName, address, phone }) {
  const [note, setNote] = useState('');
  const pageUrl = typeof window === 'undefined' ? 'https://srirudraspeechandhearing.com/' : `${window.location.origin}${window.location.pathname}`;
  const shareText = `${clinicName}\n${address}\nCall ${phone}\n${pageUrl}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setNote('Copied. Paste it into a message for the person coming with you.');
    } catch {
      setNote(shareText);
    }
  };

  return (
    <div className="mt-10 rounded-[1.75rem] border border-clinic-sand bg-clinic-porcelain p-5 shadow-card sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-clinic-maroon">Send this to family</p>
      <p className="mt-2 max-w-xl text-sm leading-6 text-clinic-umber">
        Share the clinic name, address, and phone in one note — useful when a parent, spouse, or driver is bringing the patient.
      </p>
      {note && <p className="mt-3 whitespace-pre-wrap text-sm font-medium text-clinic-maroon" data-testid="share-note">{note}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" data-testid="copy-clinic" onClick={copy} className="btn-secondary">
          {note.startsWith('Copied') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy clinic card
        </button>
        <a
          data-testid="share-whatsapp"
          className="btn-primary"
          target="_blank"
          rel="noreferrer"
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp it
        </a>
      </div>
    </div>
  );
}
