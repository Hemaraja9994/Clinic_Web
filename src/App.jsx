import { createContext, useContext, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  Baby,
  Brain,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ClipboardCheck,
  Dumbbell,
  Ear,
  ExternalLink,
  Image,
  HandHeart,
  Headphones,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MicVocal,
  Moon,
  Phone,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  UsersRound,
  Volume2,
  Waves,
  X,
} from 'lucide-react';

import { PaperVisit, ShareClinic } from '@/site/VisitStudio.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const clinicName = 'Sri Rudra Speech & Hearing Clinic';
const clinicNameTe = 'శ్రీ రుద్ర స్పీచ్ & హియరింగ్ క్లినిక్';
const logoImage = '/clinic-logo-mobile.png';
const heroImage = '/audiology-booth.jpg';
const clinicImage = '/consultation-room.jpg';
const audiometryEquipment = '/audiometry-equipment.jpg';
const soundBooth = '/sound-booth.jpg';
const otRoomImage = '/ot-physio-room.jpg';
const motorSkillsImage = '/motor-skills.jpg';
const pediatricSensoryImage = '/pediatric-sensory.jpg';
const hearingAssessmentImage = '/hearing-assessment.jpg';
const audiometerImage = '/audiometer-ad629.jpg';
const immittanceImage = '/immittance-at235.jpg';
const acousticVideo = '/acoustic-speaker-background.mp4';
const clinicPhones = ['9849848516', '9032389666', '7032054275'];
const clinicPhone = clinicPhones[0];
const whatsappNumbers = clinicPhones.map((p) => `91${p}`);
const primaryWhatsappNumber = whatsappNumbers[0];
const email = 'srirudraspeechandhearing@gmail.com';
const whatsappMessage = encodeURIComponent('Hello, I would like to book a consultation at Sri Rudra Speech & Hearing Clinic.');
const address =
  'Flat No. 211 & 212, HIG-207/4, Second Floor, Beside Kotak Mahindra Bank, Bhavana Heights, MVP Double Road, Visakhapatnam-530017, Andhra Pradesh.';
const addressTe =
  'ఫ్లాట్ నెం. 211 & 212, HIG-207/4, రెండవ అంతస్తు, కోటక్ మహీంద్ర బ్యాంక్ పక్కన, భావన హైట్స్, MVP డబుల్ రోడ్, విశాఖపట్నం-530017, ఆంధ్రప్రదేశ్.';
const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

const navLinks = [
  ['Home', '#home'],
  ['Services', '#services'],
  ['Therapy Rooms', '#session-video'],
  ['Facilities', '#facilities'],
  ['Your Visit', '#visit-flow'],
  ['Gallery', '#gallery'],
  ['Booking', '#booking'],
  ['Contact', '#contact'],
];

const services = [
  {
    icon: Activity,
    title: 'Diagnostic Audiology',
    te: 'ఆడియాలజీ పరీక్షలు',
    text: 'Pure tone and speech audiometry, tympanometry with reflexes, OAE screening for newborns and children, and tinnitus consultation — performed in a sound-treated room with calibrated equipment.',
    image: audiometerImage,
    images: [
      { src: audiometerImage, label: 'Audiometer (AD629)', te: 'ఆడియోమీటర్' },
      { src: immittanceImage, label: 'Impedance / Tympanometer (AT235)', te: 'ఇంపీడెన్స్ యంత్రం' },
    ],
  },
  {
    icon: Headphones,
    title: 'Hearing Aid Services',
    te: 'వినికిడి యంత్ర సేవలు',
    text: 'Trial fittings across leading brands (Phonak, Signia, Widex, Resound, Starkey), real-ear programming, custom ear-mould impressions, and lifetime follow-up tuning.',
    image: hearingAssessmentImage,
    images: [
      { src: hearingAssessmentImage, label: 'Hearing assessment', te: 'వినికిడి పరీక్ష' },
      { src: immittanceImage, label: 'Fitting support', te: 'వినికిడి యంత్ర అమరిక' },
    ],
  },
  {
    icon: Baby,
    title: 'Pediatric Speech Therapy',
    te: 'పిల్లల స్పీచ్ థెరపీ',
    text: 'Help for late talkers, articulation errors, stammering, autism-related communication, and school-readiness — with structured home-practice plans for parents.',
    image: pediatricSensoryImage,
  },
  {
    icon: MicVocal,
    title: 'Adult Rehabilitation',
    te: 'పెద్దల పునరావాసం',
    text: 'Post-stroke aphasia, dysarthria, voice disorders, stammering, and swallowing concerns — rehabilitation paced around daily-life communication needs.',
    image: clinicImage,
  },
];

const facilities = [
  {
    icon: ClipboardCheck,
    title: 'Audiology Facilities',
    te: 'ఆడియాలజీ సదుపాయాలు',
    items: [
      ['Pure Tone Audiometry (PTA)', 'ప్యూర్ టోన్ ఆడియోమెట్రీ'],
      ['Speech Audiometry', 'స్పీచ్ ఆడియోమెట్రీ'],
      ['Impedance / Tympanometry', 'టింపనోమెట్రీ'],
      ['OAE Newborn Screening', 'శిశు OAE స్క్రీనింగ్'],
      ['Tinnitus Evaluation & Counseling', 'టిన్నిటస్ మూల్యాంకనం'],
      ['Hearing Aid Trial & Fitting', 'వినికిడి యంత్ర అమరిక'],
    ],
  },
  {
    icon: Volume2,
    title: 'Speech-Language Pathology',
    te: 'స్పీచ్-లాంగ్వేజ్ పాథాలజీ',
    items: [
      ['Speech & Language Assessment', 'మాట, భాషా మూల్యాంకనం'],
      ['Articulation Therapy', 'ఉచ్చారణ చికిత్స'],
      ['Stammering / Fluency Therapy', 'నత్తి (స్టామరింగ్) చికిత్స'],
      ['Voice Therapy', 'స్వర చికిత్స'],
      ['Autism Communication Therapy', 'ఆటిజం కమ్యూనికేషన్ థెరపీ'],
      ['Adult Neuro Rehabilitation', 'పెద్దల న్యూరో పునరావాసం'],
    ],
  },
  {
    icon: UsersRound,
    title: 'Allied Team Support',
    te: 'సహాయక బృంద సేవలు',
    items: [
      ['Clinical Psychology', 'క్లినికల్ సైకాలజీ'],
      ['Occupational Therapy', 'ఆక్యుపేషనల్ థెరపీ'],
      ['Physiotherapy', 'ఫిజియోథెరపీ'],
      ['Special Education', 'ప్రత్యేక విద్య'],
      ['Parent Counseling & Training', 'తల్లిదండ్రుల కౌన్సిలింగ్'],
      ['ENT & Pediatrician Referrals', 'ENT, పీడియాట్రిషియన్ రిఫరల్'],
    ],
  },
];

const allies = [
  [Brain, 'Clinical Psychology'],
  [HandHeart, 'Occupational Therapy'],
  [Dumbbell, 'Physiotherapy'],
  [Waves, 'Sensory-Motor Support'],
];

const flowDiagnostics = [
  {
    label: 'Diagnostic Audiology',
    title: 'Hearing tested in a sound-treated room',
    text: 'Pure-tone and speech audiometry, tympanometry with acoustic reflexes, and OAE screening — all done in one visit. Findings are explained to you (and in Telugu when you prefer) before any aid or treatment is recommended.',
  },
  {
    label: 'Speech-Language Evaluation',
    title: 'A clear plan for the child or adult in front of us',
    text: 'Whether it is a 2-year-old not babbling, a school child who stammers, or an adult after a stroke — the evaluation ends with goals, a session schedule, and home-practice steps the family can actually carry out.',
  },
];

const resources = [
  ['CDC Milestones', 'Developmental milestone tracking for parents and caregivers.', 'https://www.cdc.gov/ncbddd/actearly/milestones/index.html'],
  ['ASHA Public Resources', 'Speech, language, hearing, and balance information for families.', 'https://www.asha.org/public/'],
  ['Action For Autism', 'India-based parent support and neurodevelopmental disability resources.', 'https://www.autism-india.org/'],
];

const testimonials = [
  {
    name: 'Lakshmi Priya',
    role: 'Mother of 4-year-old, MVP Colony',
    quote:
      'My son was not speaking properly at age 3 and we were very worried. After six months of therapy here, he now talks in full sentences and even tells stories at school. The therapist explained everything in Telugu and showed us exactly what to practice at home.',
  },
  {
    name: 'Ramesh K.',
    role: 'Retired teacher, age 68',
    quote:
      "I had been avoiding family gatherings because I couldn't follow conversations. The audiologist took time to test both ears properly, let me try three different hearing aids over two weeks, and adjusted them until they felt right. I attended my grand-daughter's wedding without missing a word.",
  },
  {
    name: 'Sailaja Devi',
    role: 'Parent of child with autism',
    quote:
      'We had visited two other places before coming here. What was different was the patience — the sessions were never rushed, and the therapist worked with my daughter at her pace. Her eye contact and single-word requests have clearly improved.',
  },
  {
    name: 'Naveen Varma',
    role: 'Stroke recovery, age 54',
    quote:
      'After my stroke I had trouble speaking clearly. The speech therapy here brought back my confidence step by step. I am now back at my shop and able to talk with customers normally.',
  },
];

const faqs = [
  ['Do I need an appointment?', 'Yes, an appointment is preferred so we can keep your 45-minute slot fully reserved. Use the booking form, WhatsApp, or call 9849848516 / 9032389666 / 7032054275. Walk-ins are accepted if a slot is open.'],
  ['What does a hearing test cost and how long does it take?', 'A full audiology workup (pure-tone audiometry, speech audiometry, and tympanometry) takes about 45 minutes. Charges are explained on the call before you visit so there are no surprises.'],
  ['My child is not speaking — at what age should I bring him/her?', 'If your child is not babbling by 12 months, not using single words by 18 months, or not joining two words by 24 months, please come for an evaluation. Earlier is always better — therapy is most effective in the 0–5 age window.'],
  ['Which hearing aid brands do you fit?', 'We fit and service all major brands — Phonak, Signia (Siemens), Widex, ReSound, Starkey and Oticon — across price points from basic to premium rechargeable models. A two-week trial is offered before purchase.'],
  ['Do you handle insurance or government schemes?', 'We provide proper invoices and audiology reports that you can submit for reimbursement (ESI, CGHS, private insurance, ADIP scheme for hearing aids). Please ask at the time of booking.'],
  ['Is the clinic accessible for elderly patients?', 'Yes. The clinic is on the second floor of Bhavana Heights with lift access. There is no step at the entrance and the consultation rooms are wheelchair-friendly.'],
];

const slotDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const slotTimes = {
  Morning: ['10:00 AM', '10:45 AM', '11:30 AM', '12:15 PM'],
  Evening: ['4:30 PM', '5:15 PM', '6:00 PM', '6:45 PM', '7:30 PM', '8:15 PM'],
};
const slotDuration = '45 minutes';
const visitProcess = [
  {
    no: 'I',
    title: 'History and concern (we listen first)',
    text: 'You tell us what is happening — when it started, what the doctor said, what the family has noticed. We take notes and ask the right follow-up questions before any equipment comes out.',
    time: '10 min',
  },
  {
    no: 'II',
    title: 'Hearing and / or speech assessment',
    text: 'Audiometry in the sound-treated room, immittance, OAE, or speech-language evaluation — whichever the case needs. The patient is never rushed and breaks are allowed.',
    time: '30–45 min',
  },
  {
    no: 'III',
    title: 'Findings explained, plan agreed',
    text: 'You see the report, understand what it means, and decide together — hearing aid trial, therapy schedule, ENT referral, or simple home steps. Telugu explanation provided whenever helpful.',
    time: '15 min',
  },
  {
    no: 'IV',
    title: 'Therapy, fitting, and review',
    text: 'Therapy sessions, hearing-aid programming, and review visits continue at agreed intervals — usually weekly or fortnightly — until goals are met.',
    time: 'Ongoing',
  },
];
const tickerItems = [
  [MicVocal, 'Did you know?', 'Early speech therapy improves communication outcomes significantly.'],
  [Baby, 'Child development', 'Hearing loss in children can affect speech development if untreated.'],
  [Ear, 'Hearing health', 'Routine hearing screening helps detect issues early.'],
  [Brain, 'Parent note', 'Speech delay does not always mean low intelligence.'],
  [Headphones, 'Technology update', 'Modern hearing aids are discreet and highly advanced.'],
  [ShieldCheck, 'Early care', 'Early intervention is key for language development.'],
  [CalendarCheck, 'Clinic update', 'Sunday visits are available on a prior-call basis.'],
  [Clock3, 'Appointment reminder', 'Mon-Sat consultations are available from 10:00 AM to 9:00 PM.'],
];
const proofTickerItems = [
  [CheckCircle2, 'AIISH-trained clinicians'],
  [ShieldCheck, 'Calibrated clinical equipment'],
  [Star, 'Speech, hearing & therapy support'],
  [CalendarCheck, 'Mon-Sat 10 AM - 9 PM'],
  [Headphones, 'Multi-brand hearing aid fitting'],
  [Sparkles, 'Telugu explanations available'],
];
const galleryItems = [
  {
    src: heroImage,
    title: 'Sound-Treated Audiometry Booth',
    te: 'ధ్వని-నియంత్రిత ఆడియోమెట్రీ గది',
    text: 'A calibrated, acoustically treated booth where pure-tone, speech and bone-conduction testing is carried out.',
    className: 'md:col-span-2 md:row-span-2',
    grade: 'brightness-[1.06] contrast-[1.04] saturate-[0.98]',
  },
  {
    src: audiometryEquipment,
    title: 'Audiology Test Equipment',
    te: 'ఆడియోమెట్రీ పరికరాలు',
    text: 'Clinical-grade audiometer, bone vibrator (Radioear B71), tuning forks, and calibrated free-field speakers.',
    className: '',
    grade: 'brightness-[1.05] contrast-[1.03]',
  },
  {
    src: soundBooth,
    title: 'Audiometer Console',
    te: 'ఆడియోమీటర్ కన్సోల్',
    text: 'Two-channel diagnostic audiometer with insert earphones, used by the audiologist during the test.',
    className: '',
    grade: 'brightness-[1.04] contrast-[1.04]',
  },
  {
    src: otRoomImage,
    title: 'Occupational & Physiotherapy Room',
    te: 'ఆక్యుపేషనల్ & ఫిజియోథెరపీ గది',
    text: 'Sensory-motor space with soft mats, climbing frame, exercise balls and balance equipment for children and adults.',
    className: 'md:col-span-2',
    grade: 'brightness-[1.05] contrast-[1.04] saturate-[1.05]',
  },
  {
    src: pediatricSensoryImage,
    title: 'Sensory Play Station',
    te: 'ఇంద్రియ ఆట గది',
    text: 'A sensory exploration table used in early-intervention sessions with toddlers and children on the spectrum.',
    className: '',
    grade: 'brightness-[1.06] contrast-[1.03] saturate-[1.04]',
  },
  {
    src: motorSkillsImage,
    title: 'Motor Skills Wall',
    te: 'మోటార్ నైపుణ్యాల గోడ',
    text: 'Climbing wall and obstacle hoops for fine- and gross-motor practice during paediatric therapy.',
    className: '',
    grade: 'brightness-[1.05] contrast-[1.05] saturate-[1.06]',
  },
  {
    src: clinicImage,
    title: 'Consultation & Counseling Room',
    te: 'సంప్రదింపు గది',
    text: 'A bright, calm room where findings are explained, hearing aids are demonstrated, and the family plans the next step together.',
    className: 'md:col-span-2',
    grade: 'brightness-[1.05] contrast-[1.04]',
  },
  {
    src: hearingAssessmentImage,
    title: 'Hearing Aid Fitting Desk',
    te: 'వినికిడి యంత్ర అమరిక',
    text: 'Real-ear measurement, programming and custom ear-mould impressions are completed at this fitting bench.',
    className: 'md:col-span-3',
    grade: 'brightness-[1.05] contrast-[1.04]',
  },
];

const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.68, ease },
};

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'system';
    return localStorage.getItem('clinic-theme') || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effective = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
    root.classList.toggle('dark', effective === 'dark');
    root.setAttribute('data-theme', effective);
    if (theme === 'system') {
      localStorage.removeItem('clinic-theme');
    } else {
      localStorage.setItem('clinic-theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const cycle = () => setTheme((t) => (t === 'light' ? 'dark' : t === 'dark' ? 'system' : 'light'));
  return { theme, cycle };
}

function ThemeToggle() {
  const { theme, cycle } = useTheme();
  const label =
    theme === 'light' ? 'Switch to dark mode' : theme === 'dark' ? 'Switch to system theme' : 'Switch to light mode';
  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Sun;
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={`Theme: ${theme}`}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-clinic-sand bg-clinic-porcelain text-clinic-rudraksha shadow-sm transition hover:bg-clinic-saffronSoft dark:border-white/10 dark:bg-white/5 dark:text-clinic-saffronSoft dark:hover:bg-white/10"
    >
      <Icon className="h-4 w-4" strokeWidth={1.8} />
    </button>
  );
}

// Content edited by staff in the admin portal (announcement, timings, service text).
// If the server is unreachable the built-in text below is used.
const SiteContentContext = createContext({});
const useSiteContent = () => useContext(SiteContentContext);

function useRemoteSiteContent() {
  const [content, setContent] = useState({});
  useEffect(() => {
    fetch('/api/public/content')
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => setContent(data && typeof data === 'object' ? data : {}))
      .catch(() => {});
  }, []);
  return content;
}

function hoursLine(content) {
  const h = content.hours || {};
  return `Monday to Saturday: ${h.weekdays || '10:00 AM – 9:00 PM'}. Sunday: ${h.sunday || 'Prior-call basis only'}.`;
}

function toISODate(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function AnnouncementBar() {
  const { announcement } = useSiteContent();
  if (!announcement?.active || !(announcement.text || announcement.text_te)) return null;
  return (
    <div role="status" className="bg-clinic-saffron px-4 py-2 text-center text-sm font-semibold text-clinic-ink">
      {announcement.text}
      {announcement.text && announcement.text_te && <span className="mx-2 opacity-60">•</span>}
      {announcement.text_te}
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const siteContent = useRemoteSiteContent();

  return (
    <SiteContentContext.Provider value={siteContent}>
    <div className="min-h-screen bg-clinic-ivory text-clinic-ink selection:bg-clinic-saffronSoft selection:text-clinic-ink">
      <AnnouncementBar />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero />
        <InfoTicker />
        <CareFlow />
        <Services />
        <SessionVideo />
        <Facilities />
        <Team />
        <TherapyShowcase />
        <Process />
        <PullQuote />
        <Gallery />
        <Booking selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} />
        <Resources />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsapp />
    </div>
    </SiteContentContext.Provider>
  );
}

function Header({ menuOpen, setMenuOpen }) {
  return (
    <header className="sticky top-0 z-50 border-b border-clinic-sand/80 bg-clinic-porcelain/88 shadow-[0_12px_40px_-32px_rgba(74,41,27,0.45)] backdrop-blur-xl">
      <nav className="section-shell flex min-h-[4.25rem] items-center justify-between gap-3 py-2">
        <a href="#home" className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-clinic-sand bg-clinic-porcelain p-0.5">
            <img src={logoImage} alt="" className="h-full w-full rounded-lg object-contain" decoding="async" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-sm font-semibold text-clinic-ink">Sri Rudra</span>
            <span className="block text-[11px] text-clinic-clay">Speech &amp; Hearing</span>
          </span>
        </a>

        <div className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map(([label, href]) => (
            <a key={href} href={href} className="rounded-full px-2.5 py-2 text-[13px] font-semibold text-clinic-umber transition hover:bg-clinic-parchment hover:text-clinic-maroon">
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#booking" className="hidden min-h-10 items-center gap-2 rounded-full bg-clinic-maroon px-4 text-sm font-semibold text-clinic-ivory shadow-sm transition hover:bg-clinic-maroonDeep sm:inline-flex">
            Plan a visit
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-clinic-sand bg-clinic-porcelain text-clinic-rudraksha lg:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="border-t border-clinic-sand bg-clinic-porcelain lg:hidden">
          <div className="section-shell grid gap-1 py-3">
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-semibold text-clinic-ink hover:bg-clinic-parchment"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-clinic-ivory">
      <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-clinic-saffron/20 blur-3xl" aria-hidden="true" />
      <div className="section-shell grid items-center gap-10 py-10 lg:grid-cols-[1.12fr_0.88fr] lg:py-16">
        <div>
          <Kicker>Visakhapatnam · MVP Double Road</Kicker>
          <h1 className="mt-4 max-w-3xl text-balance font-heading text-fluid-5xl font-semibold text-clinic-ink">
            Hearing and speech care for every age, under one roof.
          </h1>
          <p className="mt-4 max-w-2xl font-heading text-lg font-medium text-clinic-maroon sm:text-xl">
            అన్ని వయసుల వారికి వినికిడి మరియు మాట సంరక్షణ — ఒకే చోట.
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-clinic-umber">
            Full-range hearing tests, multi-brand hearing aid fitting, speech and language therapy for children and adults, and on-call allied team support — delivered by AIISH-trained clinicians.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#booking" className="btn-primary">
              Plan a visit <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/${primaryWhatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp the clinic
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Clinic assurances">
            {proofTickerItems.map(([Icon, text]) => (
              <li key={text} className="inline-flex items-center gap-2 rounded-full border border-clinic-sand bg-clinic-porcelain px-3 py-1.5 text-xs font-semibold text-clinic-umber">
                <Icon className="h-3.5 w-3.5 text-clinic-maroon" strokeWidth={1.8} />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative">
          <img
            src={heroImage}
            alt="Sound-treated audiology booth at Sri Rudra Speech and Hearing Clinic"
            className="aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-soft sm:aspect-[5/4] lg:aspect-[4/5]"
            decoding="async"
            fetchPriority="high"
          />
          <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-clinic-maroonDeep/92 p-4 text-clinic-ivory shadow-card ring-1 ring-white/10 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-clinic-saffronSoft">Visit window</p>
            <p className="mt-1 font-heading text-2xl font-semibold">Mon–Sat · 10 AM – 9 PM</p>
            <p className="mt-1 text-sm text-clinic-ivory/75">Sunday on prior call · second floor, beside Kotak Mahindra Bank</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function InfoTicker() {
  const loopItems = [...tickerItems, ...tickerItems];

  return (
    <motion.section
      initial={false}
      aria-label="Clinic awareness updates and hearing health tips"
      className="bg-clinic-ivory pb-6 sm:pb-10"
    >
      <div className="section-shell">
        <div className="ticker-frame relative overflow-hidden rounded-[1.75rem] border border-clinic-maroon/15 bg-clinic-maroon shadow-card">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-clinic-maroon to-transparent sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-clinic-maroon to-transparent sm:w-28" />
          <div className="ticker-track flex w-max items-center gap-8 py-4 will-change-transform sm:gap-10 sm:py-5">
            {loopItems.map(([Icon, label, text], index) => (
              <div key={`${label}-${index}`} className="flex min-w-max items-center gap-4 px-1">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-clinic-ivory/10 text-clinic-saffronSoft ring-1 ring-inset ring-clinic-ivory/15">
                  <Icon className="h-4 w-4" strokeWidth={1.7} />
                </span>
                <p className="text-sm leading-6 text-clinic-ivory/90 sm:text-[15px]">
                  <span className="font-semibold text-clinic-saffronSoft">{label}</span>
                  <span className="mx-2 text-clinic-ivory/35">-</span>
                  <span>{text}</span>
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-clinic-saffron/70" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
        <ul className="sr-only">
          {tickerItems.map(([, label, text]) => (
            <li key={`${label}-${text}`}>{`${label}: ${text}`}</li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}

function CareFlow() {
  return (
    <section id="care-flow" className="bg-clinic-ivory py-20 sm:py-28">
      <div className="section-shell">
        <motion.div {...fadeUp} className="grid gap-8 border-y border-clinic-sand py-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <Ornament />
            <Kicker>Care Flow</Kicker>
            <h2 className="mt-5 max-w-3xl text-balance text-5xl font-semibold leading-[1.03] text-clinic-ink sm:text-6xl">
              From the first concern to a clear care plan.
            </h2>
            <p className="mt-3 text-base font-medium text-clinic-clay">మొదటి సమస్య నుండి స్పష్టమైన చికిత్స ప్రణాళిక వరకు.</p>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-clinic-umber">
            Every visit at Sri Rudra follows the same calm path — listen to the family, test what needs testing, explain findings in plain language, and agree on what to do next. No rushed labels, no unnecessary referrals.
          </p>
        </motion.div>

        <div className="grid gap-5 py-10 lg:grid-cols-2">
          {flowDiagnostics.map(({ label, title, text }, index) => (
            <motion.article key={title} {...fadeUp} className="relative overflow-hidden rounded-[2rem] border border-clinic-sand bg-clinic-porcelain p-8 shadow-card">
              <span className="absolute right-6 top-5 font-heading text-7xl font-semibold leading-none text-clinic-maroon/[0.06]" aria-hidden="true">
                0{index + 1}
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-clinic-maroon">{label}</p>
              <h3 className="mt-12 max-w-xl text-4xl font-semibold leading-tight text-clinic-ink">{title}</h3>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-clinic-umber">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const overrides = useSiteContent().services || {};
  const spans = ['md:col-span-4', 'md:col-span-2', 'md:col-span-3', 'md:col-span-3'];
  return (
    <Section id="services" eyebrow="Services • సేవలు" title="Four care paths under one roof." description="Hearing testing, hearing aid services, paediatric speech therapy, and adult rehabilitation — each delivered by qualified audiologists and speech-language pathologists.">
      <div className="grid gap-4 md:grid-cols-6">
        {services.map(({ icon: Icon, title, te, text: defaultText, image, images }, index) => {
          const text = overrides[title] || defaultText;
          const photo = images?.[0]?.src || image;
          return (
            <motion.article key={title} {...fadeUp} className={`premium-card group flex h-full flex-col overflow-hidden ${spans[index] || ''}`}>
              <div className="relative h-44 overflow-hidden sm:h-52">
                <img src={photo} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" loading="lazy" />
                {images && images.length > 1 && (
                  <p className="absolute bottom-3 left-3 rounded-full bg-clinic-maroonDeep/85 px-3 py-1 text-[11px] font-semibold text-clinic-ivory">
                    {images.map((img) => img.label).join(' · ')}
                  </p>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="warm-icon">
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <h3 className="mt-4 font-heading text-2xl font-semibold text-clinic-ink">{title}</h3>
                <p className="mt-1 text-xs font-semibold text-clinic-clay">{te}</p>
                <p className="mt-3 text-[15px] leading-7 text-clinic-umber">{text}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}

function SessionVideo() {
  return (
    <section id="session-video" className="bg-clinic-ivory py-20 sm:py-28">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <motion.div {...fadeUp}>
          <Kicker>Therapy Rooms</Kicker>
          <h2 className="mt-5 max-w-2xl text-balance text-5xl font-semibold leading-[1.03] text-clinic-ink sm:text-6xl">
            OT, physiotherapy, and speech support in real clinic rooms.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-clinic-umber">
            A clearer look at the therapy setup families actually use: OT and physiotherapy space, sensory-motor work, speech goals, and comfortable parent observation.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-clinic-sand bg-clinic-porcelain p-4 text-sm font-semibold text-clinic-rudraksha shadow-sm">
            <PlayCircle className="h-5 w-5 text-clinic-maroon" strokeWidth={1.7} />
            Therapy support is paced around each child's goals.
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.75, delay: 0.08, ease }}>
          <div className="premium-card grid gap-3 overflow-hidden p-3 sm:grid-cols-[1.25fr_0.75fr]">
            <figure className="relative overflow-hidden rounded-[1.75rem] bg-clinic-maroonDeep">
              <img
                src={otRoomImage}
                alt="Occupational and physiotherapy room at Sri Rudra Clinic"
                className="aspect-video h-full w-full object-cover brightness-[1.04] contrast-[1.05] saturate-[1.04]"
                loading="lazy"
              />
              <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-clinic-maroonDeep/88 px-4 py-3 text-sm font-semibold text-clinic-ivory shadow-card ring-1 ring-clinic-saffron/35">
                OT and physiotherapy room
              </figcaption>
            </figure>
            <figure className="relative overflow-hidden rounded-[1.75rem] bg-clinic-maroonDeep">
              <img
                src={motorSkillsImage}
                alt="Motor skills therapy wall at Sri Rudra Clinic"
                className="aspect-video h-full w-full object-cover brightness-[1.04] contrast-[1.05] saturate-[1.06] sm:aspect-auto"
                loading="lazy"
              />
              <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-clinic-maroonDeep/88 px-4 py-3 text-sm font-semibold text-clinic-ivory shadow-card ring-1 ring-clinic-saffron/35">
                Sensory-motor practice
              </figcaption>
            </figure>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Facilities() {
  return (
    <section id="facilities" className="relative overflow-hidden bg-clinic-maroon py-20 text-clinic-ivory sm:py-28">
      <video
        className="ambient-video absolute inset-0 h-full w-full object-cover opacity-28 mix-blend-screen"
        src={acousticVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-clinic-maroon/88" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(219,151,71,0.24),transparent_32%),linear-gradient(90deg,rgba(67,16,24,0.96),rgba(67,16,24,0.78)_48%,rgba(67,16,24,0.94))]" aria-hidden="true" />

      <div className="section-shell relative">
        <motion.div {...fadeUp} className="mb-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clinic-saffronSoft">Clinical Facilities • సేవల వివరాలు</p>
          <h2 className="mt-5 text-balance text-5xl font-semibold leading-[1.03] text-clinic-ivory sm:text-6xl">
            Everything we offer, in one place.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-clinic-ivory/76">
            Below is the complete list of audiology tests, speech-language services and allied team referrals available at the clinic — also written in Telugu for parents and patients who prefer it.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {facilities.map(({ icon: Icon, title, te, items }) => (
            <motion.div key={title} {...fadeUp}>
              <Card className="h-full rounded-3xl border border-clinic-ivory/35 !bg-clinic-porcelain text-clinic-ink shadow-card">
                <CardHeader className="p-8">
                  <span className="warm-icon mb-6">
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <CardTitle className="text-3xl font-semibold text-clinic-ink">{title}</CardTitle>
                  <p className="mt-1 text-sm font-medium text-clinic-clay">{te}</p>
                </CardHeader>
                <CardContent className="grid gap-2 px-8 pb-8">
                  {items.map(([en, te]) => (
                    <div key={en} className="flex items-start gap-3 rounded-2xl bg-clinic-ivory px-4 py-3 text-sm font-medium text-clinic-umber">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-clinic-saffron" strokeWidth={1.8} />
                      <span>
                        <span className="block leading-snug">{en}</span>
                        <span className="mt-0.5 block text-[12.5px] font-normal text-clinic-clay">{te}</span>
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="bg-clinic-ivory py-20 sm:py-28">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div {...fadeUp} className="premium-card p-3">
          <img src={otRoomImage} alt="Occupational and physiotherapy room at Sri Rudra Clinic" className="aspect-[4/3] w-full rounded-[1.75rem] object-cover brightness-[1.05] contrast-[1.04] saturate-[1.04]" loading="lazy" />
        </motion.div>
        <motion.div {...fadeUp}>
          <Kicker>Team approach</Kicker>
          <h2 className="mt-5 max-w-2xl text-balance text-5xl font-semibold leading-[1.02] text-clinic-ink sm:text-6xl">
            Support that widens when development, behavior, or movement overlap.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-clinic-umber">
            Clinical psychology, occupational therapy, and physiotherapy support can be coordinated on an appointment basis when clinically appropriate.
          </p>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {allies.map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-clinic-sand bg-clinic-porcelain p-4 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-clinic-saffronSoft text-clinic-maroon">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <span className="font-semibold text-clinic-rudraksha">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TherapyShowcase() {
  const tiles = [
    {
      src: motorSkillsImage,
      eyebrow: 'Sensory-motor',
      title: 'A wall for climbing, balance, and coordination',
      te: 'మోటార్ నైపుణ్యాలు',
      text: 'Children with developmental delay or sensory processing concerns work on coordination, planning, and confidence — guided by trained therapists.',
    },
    {
      src: pediatricSensoryImage,
      eyebrow: 'Sensory play',
      title: 'Hands-on tactile exploration',
      te: 'ఇంద్రియ ఆట',
      text: 'A sensory station for early-intervention sessions — used to build attention, joint engagement, and language opportunities through play.',
    },
    {
      src: audiometryEquipment,
      eyebrow: 'Audiology',
      title: 'Calibrated diagnostic equipment',
      te: 'ఆడియాలజీ పరికరాలు',
      text: 'Bone-conduction vibrators, tuning forks, and free-field speakers — the same toolset used by tertiary hospitals, kept in calibration.',
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-clinic-ink py-20 text-clinic-ivory sm:py-28">
      <div
        className="absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 10%, rgba(217,140,43,0.35), transparent 40%), radial-gradient(circle at 80% 80%, rgba(107,31,42,0.45), transparent 45%)`,
        }}
        aria-hidden="true"
      />
      <div className="section-shell">
        <motion.div {...fadeUp} className="mb-12 max-w-3xl">
          <Kicker>
            <span className="text-clinic-saffronSoft">In session • సెషన్ లోపల</span>
          </Kicker>
          <h2 className="mt-5 text-fluid-5xl font-semibold text-clinic-ivory">
            Real rooms, real equipment, real therapy.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-clinic-ivory/72">
            What sits behind the consultation door — the actual spaces where audiology testing, paediatric therapy, and motor-skill work happens day after day.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiles.map(({ src, eyebrow, title, te, text }) => (
            <motion.figure key={title} {...fadeUp} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-clinic-maroonDeep">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={src}
                  alt={title}
                  loading="lazy"
                  className="h-full w-full object-cover brightness-[0.92] contrast-[1.05] saturate-[1.05] transition duration-700 group-hover:scale-[1.04] group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-clinic-ink via-clinic-ink/55 to-transparent" aria-hidden="true" />
              </div>
              <figcaption className="absolute inset-x-5 bottom-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-clinic-saffronSoft">{eyebrow}</p>
                <p className="mt-2 font-heading text-2xl font-semibold leading-tight text-clinic-ivory">{title}</p>
                <p className="mt-1 text-sm text-clinic-saffronSoft/90">{te}</p>
                <p className="mt-3 text-sm leading-6 text-clinic-ivory/75">{text}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="visit-flow" className="bg-clinic-parchment/65 py-20 sm:py-28">
      <div className="section-shell">
        <motion.div {...fadeUp} className="mb-12 max-w-3xl">
          <Ornament />
          <Kicker>Your Visit • మీ సందర్శన</Kicker>
          <h2 className="mt-5 text-balance text-5xl font-semibold leading-[1.03] text-clinic-ink sm:text-6xl">
            What to expect at your appointment.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-clinic-umber">
            A typical first visit takes about one hour. Most patients walk out with their report, a plan, and a clear answer to "what do we do next?".
          </p>
        </motion.div>

        <PaperVisit steps={visitProcess} />
        <ShareClinic clinicName={clinicName} address={address} phone={clinicPhone} />
      </div>
    </section>
  );
}

function PullQuote() {
  return (
    <section className="bg-clinic-maroonDeep py-16 text-clinic-ivory sm:py-24" aria-label="Clinic care philosophy">
      <div className="section-shell">
        <motion.div {...fadeUp} className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-9 h-px w-32 bg-clinic-saffron" aria-hidden="true" />
          <p className="font-heading text-4xl italic leading-tight text-clinic-ivory sm:text-6xl">
            "We do not rush a diagnosis. We slow the visit down until the next step is clear."
          </p>
          <div className="mx-auto mt-9 h-px w-32 bg-clinic-saffron" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <Section
      id="gallery"
      muted
      eyebrow="Gallery • క్లినిక్ చూపు"
      title="A walk through the clinic."
      description="Each photo shows a real room in the clinic, labelled with what happens there — so you know what to expect before you visit."
    >
      <div className="grid auto-rows-[260px] gap-5 md:grid-cols-3">
        {galleryItems.map(({ src, title, te, text, className, grade }) => (
          <motion.figure key={title} {...fadeUp} className={`group relative overflow-hidden rounded-3xl border border-clinic-sand bg-clinic-cream shadow-card ${className}`}>
            <img src={src} alt={title} className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${grade}`} loading="lazy" />
            <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl border border-clinic-ivory/65 bg-clinic-porcelain/90 p-4 shadow-card backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-clinic-saffronSoft text-clinic-maroon">
                  <Image className="h-4 w-4" strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block font-semibold text-clinic-ink">{title}</span>
                  {te && <span className="block text-xs font-medium text-clinic-clay">{te}</span>}
                  <span className="mt-1 block text-sm leading-6 text-clinic-umber">{text}</span>
                </span>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}

function formatSlotLabel(date, time) {
  if (!date) return '';
  const weekday = date.toLocaleDateString('en-IN', { weekday: 'short' });
  const day = date.getDate();
  const month = date.toLocaleDateString('en-IN', { month: 'short' });
  const year = date.getFullYear();
  const base = `${weekday}, ${day} ${month} ${year}`;
  return time ? `${base} at ${time}` : base;
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDay(d) {
  const nd = new Date(d);
  nd.setHours(0, 0, 0, 0);
  return nd;
}

function MonthCalendar({ selectedDate, onSelect }) {
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const monthLabel = viewMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const firstWeekday = viewMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  // Limit navigation: don't allow going before current month, allow up to 3 months ahead.
  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);
  const canPrev = viewMonth > minMonth;
  const canNext = viewMonth < maxMonth;

  const goPrev = () => canPrev && setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  const goNext = () => canNext && setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Previous month"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-clinic-sand bg-clinic-ivory text-clinic-maroon shadow-sm transition hover:bg-clinic-saffronSoft disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-heading text-xl font-semibold text-clinic-ink">{monthLabel}</p>
        <button
          type="button"
          onClick={goNext}
          disabled={!canNext}
          aria-label="Next month"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-clinic-sand bg-clinic-ivory text-clinic-maroon shadow-sm transition hover:bg-clinic-saffronSoft disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-clinic-clay">
        {weekdayLabels.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => {
          if (!d) return <span key={i} aria-hidden="true" />;
          const isPast = d < today;
          const isToday = isSameDay(d, today);
          const isSunday = d.getDay() === 0;
          const isSelected = isSameDay(d, selectedDate);
          const disabled = isPast;
          return (
            <button
              type="button"
              key={d.toISOString()}
              onClick={() => !disabled && onSelect(d)}
              disabled={disabled}
              className={[
                'relative aspect-square rounded-xl text-sm font-semibold transition',
                disabled
                  ? 'cursor-not-allowed text-clinic-clay/40'
                  : 'text-clinic-ink hover:bg-clinic-saffronSoft',
                isSelected ? 'bg-clinic-maroon text-clinic-ivory shadow-card hover:bg-clinic-maroonDeep' : '',
                isToday && !isSelected ? 'ring-1 ring-clinic-saffron' : '',
                isSunday && !disabled && !isSelected ? 'text-clinic-maroon/70' : '',
              ].join(' ')}
            >
              {d.getDate()}
              {isSunday && !disabled && !isSelected && (
                <span aria-hidden="true" className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-clinic-maroon/60" />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-clinic-clay">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full ring-1 ring-clinic-saffron" /> Today</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-clinic-maroon/60" /> Sunday — prior call only</span>
      </div>
    </div>
  );
}

function Booking({ selectedSlot, setSelectedSlot }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const t = startOfDay(new Date());
    return t.getDay() === 0 ? new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1) : t;
  });
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [form, setForm] = useState({
    name: '',
    age: '',
    phone: '',
    service: 'Diagnostic Audiology',
    concern: '',
    website: '', // hidden anti-spam field; real visitors leave it empty
  });
  const [errors, setErrors] = useState({});
  const siteContent = useSiteContent();

  // Keep the human-readable slot label in sync with date + time.
  useEffect(() => {
    if (!selectedDate) return;
    setSelectedSlot(formatSlotLabel(selectedDate, selectedTime));
  }, [selectedDate, selectedTime, setSelectedSlot]);

  const isSunday = selectedDate && selectedDate.getDay() === 0;

  const handleDateSelect = (d) => {
    setSelectedDate(d);
    if (d.getDay() === 0) setSelectedTime(null);
    else if (!selectedTime) setSelectedTime('10:00 AM');
  };

  const updateField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter the patient name.';
    if (!form.phone.trim() || !/^[0-9+\-\s]{10,15}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number.';
    if (!selectedDate) next.slot = 'Please pick a date.';
    else if (!isSunday && !selectedTime) next.slot = 'Please pick a time slot.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    const slotLine = isSunday
      ? `Preferred date: ${formatSlotLabel(selectedDate, null)} (Sunday — please confirm a time on call)`
      : `Preferred slot: ${formatSlotLabel(selectedDate, selectedTime)} (${slotDuration})`;
    const message = [
      'Hello Sri Rudra Speech & Hearing Clinic,',
      '',
      'I would like to book a consultation.',
      '',
      `Name: ${form.name}`,
      form.age ? `Age: ${form.age}` : null,
      `Phone: ${form.phone}`,
      `Service needed: ${form.service}`,
      slotLine,
      form.concern ? `Concern / notes: ${form.concern}` : null,
      '',
      'Please confirm the appointment. Thank you.',
    ]
      .filter(Boolean)
      .join('\n');
    const url = `https://wa.me/${primaryWhatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    // Also save the request to the staff portal. WhatsApp stays the main channel, so failures are ignored.
    fetch('/api/public/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        name: form.name,
        age: form.age,
        phone: form.phone,
        service: form.service,
        concern: form.concern,
        date: toISODate(selectedDate),
        time: isSunday ? null : selectedTime,
        website: form.website,
      }),
    }).catch(() => {});
  };

  const callBackHref = `tel:${clinicPhone}`;

  const inputClass =
    'min-h-12 w-full rounded-2xl border border-clinic-sand bg-clinic-ivory px-4 text-[15px] text-clinic-ink shadow-inner placeholder:text-clinic-clay focus:border-clinic-maroon focus:outline-none focus:ring-2 focus:ring-clinic-saffron/40';

  const slotHeadline = selectedSlot || 'Pick a date →';

  return (
    <Section
      id="booking"
      eyebrow="Booking • అపాయింట్‌మెంట్"
      title="Book a 45-minute consultation."
      description="Pick any open date in the calendar, choose a time, and submit — your booking opens WhatsApp pre-filled and reaches the clinic for confirmation."
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-3xl border-clinic-maroon/20 bg-clinic-maroon p-8 text-clinic-ivory shadow-soft">
          <CalendarCheck className="h-10 w-10 text-clinic-saffronSoft" strokeWidth={1.6} />
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-clinic-saffronSoft">Your selected slot</p>
          <h3 className="mt-3 text-3xl font-semibold leading-tight">{slotHeadline}</h3>
          <p className="mt-2 text-sm text-clinic-saffronSoft/80">
            {isSunday ? 'Sunday — final time on call' : `Duration: ${slotDuration}`}
          </p>
          <p className="mt-4 leading-7 text-clinic-ivory/72">{hoursLine(siteContent)}</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <input type="text" name="website" value={form.website} onChange={updateField('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-clinic-saffronSoft">Patient name *</label>
              <input className={`mt-2 ${inputClass}`} type="text" value={form.name} onChange={updateField('name')} placeholder="Full name" />
              {errors.name && <p className="mt-1 text-xs text-clinic-saffronSoft">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-clinic-saffronSoft">Age</label>
                <input className={`mt-2 ${inputClass}`} type="text" inputMode="numeric" value={form.age} onChange={updateField('age')} placeholder="e.g. 4 / 32" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-clinic-saffronSoft">Phone *</label>
                <input className={`mt-2 ${inputClass}`} type="tel" value={form.phone} onChange={updateField('phone')} placeholder="10-digit mobile" />
                {errors.phone && <p className="mt-1 text-xs text-clinic-saffronSoft">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-clinic-saffronSoft">Service needed</label>
              <select className={`mt-2 ${inputClass}`} value={form.service} onChange={updateField('service')}>
                {services.map((s) => (
                  <option key={s.title} value={s.title}>{s.title}</option>
                ))}
                <option value="Not sure - please advise">Not sure — please advise</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-clinic-saffronSoft">Concern / notes</label>
              <textarea className={`mt-2 min-h-24 ${inputClass} py-3`} value={form.concern} onChange={updateField('concern')} placeholder="e.g. child not speaking clearly since age 2, or hearing difficulty for 6 months" />
            </div>
            {errors.slot && <p className="text-xs text-clinic-saffronSoft">{errors.slot}</p>}
            <button type="submit" className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-clinic-ivory px-6 font-semibold text-clinic-maroon transition hover:bg-clinic-saffronSoft">
              <MessageCircle className="h-5 w-5" />
              Send booking on WhatsApp
            </button>
            <a href={callBackHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-clinic-ivory/30 px-6 font-semibold text-clinic-ivory transition hover:bg-clinic-ivory/10">
              <Phone className="h-5 w-5" /> Or call {clinicPhone}
            </a>
          </form>
        </Card>

        <Card className="overflow-hidden rounded-3xl border border-clinic-sand/80 bg-clinic-porcelain shadow-card">
          <div className="border-b border-clinic-sand px-6 py-5 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-clinic-maroon">Consultation calendar</p>
            <h3 className="mt-2 text-3xl font-semibold text-clinic-ink">Pick a date</h3>
            <p className="mt-1 text-sm text-clinic-umber">Choose any date — current or next 3 months. Sundays are bookable on a prior-call basis.</p>
          </div>
          <div className="px-6 py-6 sm:px-8">
            <MonthCalendar selectedDate={selectedDate} onSelect={handleDateSelect} />
          </div>
          <div className="grid gap-6 border-t border-clinic-sand px-6 py-6 sm:px-8">
            {isSunday ? (
              <div className="rounded-2xl bg-clinic-cream px-4 py-4 text-sm leading-6 text-clinic-umber">
                <p className="font-semibold text-clinic-maroon">Sunday — prior-call basis</p>
                <p className="mt-1">
                  Sunday consultations are arranged after a call to <span className="font-semibold">{clinicPhone}</span>. Submit this form and we'll confirm a time with you.
                </p>
              </div>
            ) : (
              Object.entries(slotTimes).map(([window, times]) => (
                <div key={window}>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-clinic-maroon">{window}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {times.map((time) => {
                      const active = selectedTime === time;
                      return (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`min-h-12 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                            active
                              ? 'border-clinic-maroon bg-clinic-maroon text-clinic-ivory shadow-card'
                              : 'border-clinic-sand bg-clinic-ivory text-clinic-umber hover:border-clinic-saffron hover:text-clinic-maroon'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
            <p className="rounded-2xl bg-clinic-cream px-4 py-3 text-xs leading-6 text-clinic-umber">
              Each appointment is reserved for <strong>{slotDuration}</strong>, allowing unhurried history, assessment, and counseling. Final confirmation comes from the clinic over WhatsApp or call.
            </p>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function Resources() {
  return (
    <Section id="resources" muted eyebrow="Resources" title="Clinical resources for informed families." description="Selected public references for developmental milestones, communication health, and parent support.">
      <div className="grid gap-5 md:grid-cols-3">
        {resources.map(([title, text, href]) => (
          <Card key={title} className="premium-card p-7 transition duration-300 hover:-translate-y-1 hover:border-clinic-saffron/60 hover:shadow-soft">
            <ExternalLink className="h-6 w-6 text-clinic-maroon" strokeWidth={1.6} />
            <h3 className="mt-6 text-2xl font-semibold text-clinic-ink">{title}</h3>
            <p className="mt-3 text-[15px] leading-7 text-clinic-umber">{text}</p>
            <a href={href} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-clinic-maroon hover:text-clinic-saffron">
              Open resource <ArrowRight className="h-4 w-4" />
            </a>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Testimonials() {
  return (
    <Section eyebrow="Testimonials • సాక్ష్యాలు" title="In the words of the families we have cared for." description="Real reflections shared by parents and patients after their journey with us.">
      <div className="grid gap-5 md:grid-cols-2">
        {testimonials.map(({ name, role, quote }) => (
          <Card key={name} className="premium-card p-8">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-clinic-saffronSoft font-semibold text-clinic-maroon">{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-clinic-rudraksha">{name}</p>
                <p className="text-xs text-clinic-clay">{role}</p>
              </div>
            </div>
            <p className="mt-6 text-[15px] leading-7 text-clinic-umber">"{quote}"</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function FAQ() {
  return (
    <Section id="faq" muted eyebrow="FAQ • తరచుగా అడిగే ప్రశ్నలు" title="Questions families ask before coming in." description="Practical answers about appointments, costs, age cut-offs, hearing aid brands and insurance — so you arrive prepared.">
      <Accordion type="single" collapsible className="mx-auto max-w-3xl rounded-3xl border border-clinic-sand bg-clinic-porcelain px-6 shadow-card">
        {faqs.map(([question, answer], index) => (
          <AccordionItem key={question} value={`item-${index}`} className="border-clinic-sand">
            <AccordionTrigger className="py-6 text-left font-heading text-2xl font-semibold text-clinic-ink hover:no-underline">{question}</AccordionTrigger>
            <AccordionContent className="pb-6 text-[15px] leading-7 text-clinic-umber">{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}

function Contact() {
  const siteContent = useSiteContent();
  const contactRows = [
    [Phone, `Clinic calls: ${clinicPhones.join(' / ')}`],
    [MessageCircle, `WhatsApp: +${whatsappNumbers.join(' / +')}`],
    [Mail, email],
    [MapPin, `${address}\n${addressTe}`],
    [Clock3, hoursLine(siteContent)],
  ];

  return (
    <Section id="contact" eyebrow="Contact • సంప్రదించండి" title="Visit us at MVP Double Road, Visakhapatnam." description="Call any of our numbers, message on WhatsApp, or use the map for directions. We are easy to find — second floor, beside Kotak Mahindra Bank.">
      <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
        <Card className="premium-card p-8">
          <div className="grid gap-6">
            {contactRows.map(([Icon, text]) => (
              <div key={text} className="flex gap-4">
                <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-clinic-saffronSoft text-clinic-maroon">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <p className="whitespace-pre-line text-[15px] leading-7 text-clinic-umber">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col flex-wrap gap-3 sm:flex-row">
            <a href={`tel:${clinicPhone}`} className="btn-primary"><Phone className="h-5 w-5" />Call Clinic</a>
            <a href={`https://wa.me/${primaryWhatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="btn-secondary"><MessageCircle className="h-5 w-5 text-clinic-saffron" />WhatsApp</a>
            <a href={`mailto:${email}`} className="btn-secondary"><Mail className="h-5 w-5 text-clinic-saffron" />Email</a>
            <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn-secondary"><MapPin className="h-5 w-5 text-clinic-saffron" />Directions</a>
          </div>
        </Card>
        <div className="min-h-[420px] overflow-hidden rounded-3xl border border-clinic-sand bg-clinic-parchment shadow-card">
          <iframe title="Sri Rudra Speech & Hearing Clinic map" src={mapEmbedUrl} className="h-full min-h-[420px] w-full sepia-[0.12] saturate-[0.86]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </Section>
  );
}

function Section({ id, eyebrow, title, description, children, muted = false }) {
  return (
    <section id={id} className={`${muted ? 'bg-clinic-parchment/65' : 'bg-clinic-ivory'} py-20 sm:py-28`}>
      <div className="section-shell">
        <motion.div {...fadeUp} className="mb-12 max-w-3xl">
          <Ornament />
          <Kicker>{eyebrow}</Kicker>
          <h2 className="mt-5 text-balance text-5xl font-semibold leading-[1.03] text-clinic-ink sm:text-6xl">{title}</h2>
          {description && <p className="mt-6 max-w-2xl text-lg leading-8 text-clinic-umber">{description}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function Ornament() {
  return (
    <div className="mb-5 flex w-32 items-center gap-3 text-clinic-saffron" aria-hidden="true">
      <span className="h-px flex-1 bg-current opacity-70" />
      <span className="h-2 w-2 rotate-45 border border-current bg-clinic-saffronSoft" />
      <span className="h-px flex-1 bg-current opacity-70" />
    </div>
  );
}

function Kicker({ children }) {
  return <p className="text-xs font-bold uppercase tracking-[0.24em] text-clinic-maroon">{children}</p>;
}

function Footer() {
  const { hours = {} } = useSiteContent();
  return (
    <footer className="bg-clinic-maroonDeep py-14 text-clinic-ivory">
      <div className="section-shell grid gap-10 md:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="" className="h-14 w-14 rounded-2xl bg-clinic-ivory object-contain p-1" />
            <div>
              <p className="font-semibold">{clinicName}</p>
              <p className="text-sm text-clinic-ivory/55">{clinicNameTe}</p>
            </div>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-7 text-clinic-ivory/65">{address}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-clinic-ivory/55">{addressTe}</p>
          <div className="mt-5 grid gap-2 text-sm text-clinic-ivory/70">
            <p><span className="font-semibold text-clinic-saffronSoft">Call / WhatsApp:</span> {clinicPhones.join(' • ')}</p>
            <p><span className="font-semibold text-clinic-saffronSoft">Email:</span> {email}</p>
            <p><span className="font-semibold text-clinic-saffronSoft">Hours:</span> Mon–Sat {hours.weekdays || '10:00 AM – 9:00 PM'} • Sunday {hours.sunday || 'on prior call'}</p>
            <p className="text-clinic-ivory/55">{hours.te || 'సోమ – శని: ఉ. 10 నుండి రా. 9 వరకు • ఆదివారం ముందస్తు కాల్‌తో'}</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clinic-saffronSoft">Quick links</p>
          <div className="mt-4 grid gap-3">
            {navLinks.slice(0, 4).map(([label, href]) => (
              <a key={href} href={href} className="inline-flex items-center gap-2 text-sm text-clinic-ivory/70 hover:text-clinic-ivory">
                <ChevronRight className="h-4 w-4 text-clinic-saffron" />
                {label}
              </a>
            ))}
            <a href="#resources" className="inline-flex items-center gap-2 text-sm text-clinic-ivory/70 hover:text-clinic-ivory">
              <ChevronRight className="h-4 w-4 text-clinic-saffron" />
              Privacy Policy
            </a>
            <a href="https://admin.srirudraspeechandhearing.com/login" rel="nofollow" className="inline-flex items-center gap-2 text-sm text-clinic-ivory/70 hover:text-clinic-ivory">
              <ChevronRight className="h-4 w-4 text-clinic-saffron" />
              Staff login
            </a>
            <a href="/desk.html" className="inline-flex items-center gap-2 text-sm text-clinic-ivory/70 hover:text-clinic-ivory">
              <ChevronRight className="h-4 w-4 text-clinic-saffron" />
              Offline clinic desk
            </a>
          </div>
        </div>
      </div>
      <div className="section-shell mt-10 border-t border-clinic-ivory/10 pt-6 text-xs text-clinic-ivory/45">Copyright (c) 2026 Sri Rudra Speech & Hearing Clinic.</div>
    </footer>
  );
}

function FloatingWhatsapp() {
  return (
    <a
      href={`https://wa.me/${primaryWhatsappNumber}?text=${whatsappMessage}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Sri Rudra Clinic on WhatsApp"
      className="fixed bottom-5 right-5 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-clinic-maroon text-clinic-ivory shadow-soft ring-4 ring-clinic-ivory transition hover:bg-clinic-maroonDeep sm:flex"
    >
      <MessageCircle className="h-7 w-7" strokeWidth={1.7} />
    </a>
  );
}

export default App;
