/* December 2026 self-study quest.
   Built from CoE notification YU/COE/Exam/Notification 1/Dec/2026
   (dated 06.11.2026): theory exams for I, III and V semester B.ASLP
   commence 11 December 2026. The paper-wise timetable is not out yet,
   so each campaign is a preparation rotation, not the exam order.
   Topics follow the RCI 2024-25 curriculum already on this portal. */
const STUDY_PLAN = {
  "notice": {
    "ref": "YU/COE/Exam/Notification 1/Dec/2026",
    "dated": "06.11.2026",
    "starts": "11 December 2026",
    "semesters": "I, III and V"
  },
  "pdf": "assets/docs/BASLP_Self_Study_Plan_December_2026.pdf",
  "rules": [
    "The Controller of Examinations has not published the paper-wise timetable. Keep this rotation, then shift the last four camp days to match the order once it is announced.",
    "University theory is one component. You also need 50% in internal assessment, practicals and the clinical examination, or you cannot sit the University theory papers.",
    "Do not skip a clinical posting to study. Attendance stays 80% in theory and 90% in clinicals, in every subject.",
    "On a class day the quest is an evening block, 6:30 to 9:05 pm. Sundays and the final camp are longer. Kanakadasa Jayanti, 27 November 2026, is a Karnataka general holiday; confirm it on the University list before treating it as a free day.",
    "Stop new topics at 6:00 pm on 10 December. Pack your hall ticket, identity card, pens and water, and sleep."
  ],
  "rhythms": {
    "evening": [
      ["6:30–6:50 pm", "Closed book: write what you remember from the previous level."],
      ["6:50–8:20 pm", "Today's unit, in your own words, with one diagram or table."],
      ["8:20–8:35 pm", "Break. Stand up. No phone."],
      ["8:35–9:05 pm", "Eight short answers. Tick the level only if the recall line is done."]
    ],
    "boss": [
      ["8:30–11:00 am", "First paper, notes allowed for the first hour only."],
      ["11:15 am–1:15 pm", "Second paper, same rule."],
      ["2:30–4:15 pm", "Mixed recall. Book closed."],
      ["4:15–4:30 pm", "Error log: three points you will redo, then tick the level."]
    ],
    "holiday": [
      ["9:00 am–12:00 pm", "One deep pass of today's paper. Diagrams first."],
      ["12:00–2:00 pm", "Rest and a meal. This is a holiday, not a night shift."],
      ["2:00–4:30 pm", "Questions and one timed set. Tick the level."]
    ],
    "camp": [
      ["8:30 am–12:30 pm", "Full pass of the camp paper. Mark only the gaps."],
      ["2:00–4:30 pm", "Recall set on the gaps. No new reading after this."],
      ["7:30–8:30 pm", "Light review of the error log, then stop."]
    ]
  },
  "badges": [
    { "id": "first", "name": "First step", "need": 1, "text": "Clear 1 level" },
    { "id": "week", "name": "Week cleared", "need": 7, "text": "Clear 7 levels" },
    { "id": "half", "name": "Halfway", "need": 15, "text": "Clear 15 levels" },
    { "id": "boss", "name": "Boss route", "need": "bosses", "text": "Clear every Sunday boss" },
    { "id": "eve", "name": "Exam eve", "need": 29, "text": "Clear all 29 levels" }
  ],
  "campaigns": []
};

(function buildCampaigns() {
  const days = [
    ["2026-11-12", "Thu 12 Nov", "evening"],
    ["2026-11-13", "Fri 13 Nov", "evening"],
    ["2026-11-14", "Sat 14 Nov", "evening"],
    ["2026-11-15", "Sun 15 Nov", "boss"],
    ["2026-11-16", "Mon 16 Nov", "evening"],
    ["2026-11-17", "Tue 17 Nov", "evening"],
    ["2026-11-18", "Wed 18 Nov", "evening"],
    ["2026-11-19", "Thu 19 Nov", "evening"],
    ["2026-11-20", "Fri 20 Nov", "evening"],
    ["2026-11-21", "Sat 21 Nov", "evening"],
    ["2026-11-22", "Sun 22 Nov", "boss"],
    ["2026-11-23", "Mon 23 Nov", "evening"],
    ["2026-11-24", "Tue 24 Nov", "evening"],
    ["2026-11-25", "Wed 25 Nov", "evening"],
    ["2026-11-26", "Thu 26 Nov", "evening"],
    ["2026-11-27", "Fri 27 Nov", "holiday"],
    ["2026-11-28", "Sat 28 Nov", "evening"],
    ["2026-11-29", "Sun 29 Nov", "boss"],
    ["2026-11-30", "Mon 30 Nov", "evening"],
    ["2026-12-01", "Tue 1 Dec", "evening"],
    ["2026-12-02", "Wed 2 Dec", "evening"],
    ["2026-12-03", "Thu 3 Dec", "evening"],
    ["2026-12-04", "Fri 4 Dec", "evening"],
    ["2026-12-05", "Sat 5 Dec", "evening"],
    ["2026-12-06", "Sun 6 Dec", "boss"],
    ["2026-12-07", "Mon 7 Dec", "camp"],
    ["2026-12-08", "Tue 8 Dec", "camp"],
    ["2026-12-09", "Wed 9 Dec", "camp"],
    ["2026-12-10", "Thu 10 Dec", "camp"]
  ];

  const xp = { evening: 100, boss: 160, holiday: 140, camp: 200 };
  const kindName = {
    evening: "Evening quest",
    boss: "Sunday boss",
    holiday: "Holiday long quest",
    camp: "Final camp"
  };

  function campaign(spec) {
    return {
      id: spec.id,
      semester: spec.semester,
      name: spec.name,
      short: spec.short,
      blurb: spec.blurb,
      papers: spec.papers,
      levels: spec.rows.map((row, i) => {
        const [iso, label, kind] = days[i];
        return {
          iso: iso,
          label: label,
          kind: kind,
          kindName: kindName[kind],
          xp: xp[kind],
          paper: row[0],
          title: row[1],
          focus: row[2],
          recall: row[3]
        };
      })
    };
  }

  STUDY_PLAN.campaigns = [
    campaign({
      id: "sem1",
      semester: 1,
      name: "Semester I",
      short: "Sem I",
      blurb: "The Precision Clinicians, first year. Four theory papers: B1.1 to B1.4. B1.5 and B1.6 are practicals and stay on the clinical timetable.",
      papers: [
        ["B1.1", "Introduction to Speech-language Pathology", "Theory 50 + IA 25"],
        ["B1.2", "Introduction to Audiology", "Theory 50 + IA 25"],
        ["B1.3", "Anatomy and Physiology of Speech and Swallowing", "Theory 50 + IA 25"],
        ["B1.4", "Anatomy and Physiology of Hearing", "Theory 50 + IA 25"]
      ],
      rows: [
        ["B1.1", "Speech chain and the bases of speech", ["Speech, language and communication, and how they differ.", "Servo system, Shannon-Weaver, Lasswell and Berlo, drawn once each.", "Speech chain and speech as an overlaid function."], "Define speech, language and communication, then draw the speech chain with no notes."],
        ["B1.2", "Decibels, hearing range and the JND", ["Absolute and relative units, and why the decibel is used.", "MAP and MAF, and the human hearing range.", "Just noticeable difference for intensity, frequency and time."], "Explain MAP versus MAF in four lines, and give one clinical use of the JND."],
        ["B1.3", "Planes, larynx and the articulators", ["Anatomical terms, positions and planes.", "Development of the larynx and respiratory structures.", "Respiratory structures, oral articulators and the resonators."], "Label a blank larynx: cartilages, folds and one intrinsic muscle, from memory."],
        ["B1.1 + B1.2", "Boss: chain and the audiogram key", ["Morning: speech chain and one model, closed book after 9:30.", "Midday: hearing-loss words you already know, plus dB and range.", "Afternoon: list ten terms you could not retrieve."], "Write the speech chain and the air-bone symbol key without opening a book."],
        ["B1.4", "Pinna, canal and head shadow", ["Development of the external, middle and inner ear, in one page.", "Pinna and external canal: auditory and non-auditory jobs.", "Head shadow, interaural intensity difference and interaural time difference."], "Explain, with a sketch, why a high-frequency sound is shadowed by the head."],
        ["B1.1", "Development and how therapy is planned", ["Stages of speech and language development, and what changes them.", "Formal, informal and eclectic approaches.", "Goals, steps, procedures, and schedules of reinforcement."], "Plan a three-step therapy goal for a late talker, using one reinforcement schedule."],
        ["B1.2", "Types and causes of hearing loss", ["Conductive, sensorineural, mixed and central: one feature each.", "Congenital and acquired; prenatal, perinatal and postnatal causes.", "How the same cause can look different in a child and an adult."], "Sort eight causes into conductive or sensorineural without looking back."],
        ["B1.3", "How speech is produced", ["Quiet breathing versus speech breathing, and posture.", "Role of the larynx and the mechanism of phonation.", "How speech sounds and resonance are produced."], "Trace one oral vowel from lung to lips, naming the valve at each stage."],
        ["B1.4", "Middle ear transformer", ["Tympanic membrane and the ossicular chain.", "Areal and lever ratios, in plain language.", "Eustachian tube: what it does, and what fails when it does not."], "Explain the transformer action to a classmate in under two minutes."],
        ["B1.1", "Speech disorders and swallowing, in overview", ["Fluency, voice and phonological disorders: one definition each.", "Feeding and swallowing disorders, at introduction level.", "What assessment and management look like, without the later-semester detail."], "Give one assessment clue and one management idea for fluency, voice and phonology."],
        ["B1.3 + B1.4", "Boss: larynx and cochlea", ["Draw the larynx and name the phonation steps.", "Draw the cochlea in cross-section: scalae, basilar membrane, organ of Corti.", "One function sentence under each label."], "Both drawings, closed book, with at least eight correct labels each."],
        ["B1.2", "Case history and tuning forks", ["What must be in an adult history and a child history.", "Rinne, Weber, Schwabach and ABC: procedure and reading.", "Advantages and limits of tuning-fork tests."], "A Rinne-negative ear: say what you expect on Weber, and what it does not prove."],
        ["B1.3", "Swallowing structures and stages", ["Oral cavity structures used for the swallow.", "Pharynx and esophagus.", "Oral, pharyngeal and esophageal stages, in order."], "List the stages of the swallow and one structure that must work in each."],
        ["B1.4", "Labyrinth and the travelling wave", ["Bony and membranous labyrinth.", "Cochlear fluids, hair cells, innervation and blood supply.", "Travelling wave and place: base versus apex."], "Explain why a high-frequency tone peaks toward the base."],
        ["B1.1", "Language disorders and early identification", ["Child, adult and neurogenic language: how the overview differs.", "Causes, and the bilingualism points in this paper.", "Early identification and prevention."], "Name two reasons a bilingual child can be over-identified, from this unit."],
        ["B1.2", "Pure-tone method, on a holiday", ["Kanakadasa Jayanti is a Karnataka general holiday. Confirm the University list before skipping class.", "If it is a holiday: audiometer parts, symbols, Hughson-Westlake, factors affecting AC and BC.", "If class is held: do the evening rhythm after college."], "Plot a sketched audiogram and name the symbols for AC, BC, masked and no-response."],
        ["B1.3", "Close the anatomy gaps", ["Five embryonic anomalies that affect speech or swallowing.", "Fluency, voice, articulatory and resonatory disorders, as examples only.", "Redo any larynx or swallow label you missed on 22 November."], "Five anomalies, each with the structure it affects."],
        ["All four", "Boss: twenty definitions", ["Five terms from each theory paper.", "Write the definition first, then check.", "Star the ones you missed. They become 3 December."], "Twenty definitions, book closed, at least fifteen correct."],
        ["B1.2", "Speech audiometry", ["Why speech audiometry is done, and which materials exist.", "SRT and word-recognition score: procedure and use.", "SDT, MCL and UCL."], "State what SRT and WRS each tell you that the pure-tone average does not."],
        ["B1.1", "The profession", ["Code of conduct and the interdisciplinary team.", "Diagnostic, therapy and referral notes: what each must contain.", "Evidence-based practice, follow-up, CBR, and facilities for persons with disability."], "List five headings you would put on a therapy note."],
        ["B1.4", "Auditory nerve and the pathway", ["Auditory nerve: anatomy and what it carries.", "The central pathway, station by station.", "One job of each station, in a single clause."], "Recite the pathway from spiral ganglion to cortex, in order."],
        ["Weak units", "Redo the red marks", ["Open the error log from the Sunday bosses.", "One weak unit from each paper. No new chapter.", "Rewrite the diagram you keep getting wrong."], "Teach one red unit aloud for five minutes with the book shut."],
        ["B1.2", "Forks and the listening check", ["Three tuning-fork patterns, written as mini cases.", "Subjective calibration and the daily listening check.", "What you must not claim from a tuning-fork test alone."], "Write the daily listening check as a five-step list."],
        ["B1.1 + B1.3", "Put the chain on the body", ["Speech chain stages mapped onto respiratory, laryngeal and articulatory anatomy.", "One disorder example beside the stage it breaks.", "Leave B1.2 and B1.4 for the camp."], "Point to the anatomical structure for each box of the speech chain."],
        ["Two papers", "Boss: a timed short-note set", ["Pick the two papers you trust least.", "Ten short notes, 90 minutes, closed book.", "Mark them against your own notes afterwards."], "Finish the ten notes. Score them honestly."],
        ["B1.1", "Camp: whole of speech-language pathology", ["All five units, gaps only.", "Two diagrams: speech chain, and a therapy-plan skeleton.", "Fifteen closed-book recalls at the end of the afternoon."], "Fifteen recalls, with the unit named beside each answer."],
        ["B1.2", "Camp: whole of introduction to audiology", ["History and scope, only as a one-page map.", "Hearing loss, forks, pure tone and speech audiometry are the weight.", "One sketched audiogram and one case history."], "Interpret one audiogram sketch: type, and the next test you would do."],
        ["B1.3 + B1.4", "Camp: both anatomy papers", ["Morning: speech and swallowing diagrams.", "Afternoon: external, middle, inner ear and the pathway.", "Functions written under the drawings, not a new textbook chapter."], "Four drawings: larynx, swallow stages, middle ear, cochlea."],
        ["All four", "Exam eve: mixed sets, then stop", ["Four sets of 40 minutes, one paper each.", "No new topics after 6:00 pm.", "Hall ticket, ID, pens, water, and a sleep time you will keep."]
        , "Pack the kit. Write tomorrow's wake-up time. Close the books."]
      ]
    }),
    campaign({
      id: "sem3",
      semester: 3,
      name: "Semester III",
      short: "Sem III",
      blurb: "Second-year theory papers B3.1 to B3.4. B3.5 is the minor optional and is examined by the institution. B3.6 and B3.7 are clinicals.",
      papers: [
        ["B3.1", "Child Language Disorders", "Practical 25 + IA 25 + Theory 50"],
        ["B3.2", "Amplification Devices", "Practical 25 + IA 25 + Theory 50"],
        ["B3.3", "Electronics and Acoustics", "IA 25 + Theory 50"],
        ["B3.4", "Psychology for Speech and Hearing", "IA 25 + Theory 50"]
      ],
      rows: [
        ["B3.1", "How children come to language", ["Biological, cognitive and linguistic accounts, in one paragraph each.", "Birth to two years: prelinguistic to symbolic.", "Bilingual acquisition and the factors that change the rate."], "Contrast two theories of acquisition with one example each."],
        ["B3.2", "Hearing-aid types", ["Microphone, amplifier, receiver, battery.", "Body, BTE, RIC, ITE, ITC, CIC, IIC.", "Hard-wired, loop, FM and infrared group systems."], "Classify six aids by where they sit, and name one group system."],
        ["B3.3", "Signals and basic electronics", ["Charge, current, voltage and a simple signal.", "What a transducer does in a speech or hearing instrument.", "One sketch of a signal path from microphone to output."], "Draw a signal path and name the quantity at each stage."],
        ["B3.1 + B3.2", "Boss: theory of acquisition, and the aid family", ["One acquisition theory, taught aloud.", "A table of hearing-aid styles with one use and one limit.", "Five terms you missed, into the error log."], "Fill the aid table from memory, then state one acquisition theory."],
        ["B3.4", "What psychology is doing in this course", ["Scope of psychology and of clinical psychology.", "Why speech and hearing practice needs both.", "Terms you will meet again in assessment and learning."], "Give two reasons a clinician needs a psychological frame, with examples."],
        ["B3.1", "How language disorders present", ["DSM-5 and ICD-10 as classification frames.", "Characteristics, language features, causes and comorbidities.", "Keep the conditions in a comparison table, not a paragraph."], "Complete a four-column table for two conditions, book closed."],
        ["B3.2", "Compression and signal processing", ["Peak clipping versus compression.", "BILL, TILL, PILL, WDRC and syllabic compression.", "Directionality, noise reduction, frequency lowering."], "Say what WDRC changes, and one listening problem it is meant to ease."],
        ["B3.3", "Acoustics you will be asked to define", ["Frequency, intensity, wavelength and resonance.", "Filters: what they pass and what they stop.", "One speech-acoustic example for each term."], "Define resonance and give one speech example."],
        ["B3.4", "How a psychological assessment starts", ["Case history and mental-status examination.", "Clinical interview and clinical observation.", "What you may and may not conclude from a single sitting."], "List the headings of a mental-status examination."],
        ["B3.1", "Language sample and informal assessment", ["Formal versus informal tools.", "Play, mother-child interaction and the language sample.", "Analysis of phonology, morphology, syntax and pragmatics."], "Write five rules you will follow while collecting a language sample."],
        ["B3.3 + B3.4", "Boss: signal chain and one learning idea", ["A block diagram of a recording chain.", "One principle of learning you could use in therapy.", "Error log from both papers."], "Draw the chain, then state one learning principle in a therapy sentence."],
        ["B3.2", "Electroacoustic measures", ["Why EAM is done, and the bench setup.", "OSPL90, gain, full-on gain, frequency range, distortion.", "What changes the numbers, including a digital aid."], "Define OSPL90 and say why a clinician looks at it before a fitting."],
        ["B3.1", "Intervention techniques", ["Purpose, goals and the choice of language.", "Incidental teaching, self-talk, parallel talk.", "Multicultural care in the activity, not as a slogan."], "Script a six-line incidental-teaching episode."],
        ["B3.3", "Recording and digital signals", ["Sampling and why the rate matters.", "What a digital signal keeps and what it can lose.", "Storage of clinical recordings: principle, not a product manual."], "Explain sampling rate with a one-line consequence of setting it too low."],
        ["B3.4", "Development that language sits on", ["Cognitive and emotional development at the ages you assess.", "What a delay in that domain does to a language session.", "One milestone table, birth to school age."], "Name one cognitive and one emotional milestone you would ask about at age 3."],
        ["B3.2", "Selection, programming and couplers", ["Kanakadasa Jayanti: confirm the University holiday list.", "If it is free: candidacy, programming targets, and ear-mould acoustics.", "If class is held: evening rhythm on the same topics."], "Give one reason to change an ear mould, and one programming choice that follows."],
        ["B3.1", "AAC, the team and the family", ["Aided and unaided AAC, and when each is considered.", "Medical, physio, occupational therapy and education on the team.", "Caregivers, rights and concessions."], "Name three team members and the question you would ask each."],
        ["All four", "Boss: twenty definitions", ["Five terms from each theory paper.", "Closed book first, then mark.", "Misses go to 3 December."], "Twenty definitions, at least fifteen correct."],
        ["B3.2", "Programming choices", ["What you match to the audiogram and to the patient's report.", "One feature you would verify, not just enable.", "A sentence of counselling that matches the feature."], "Write a four-line fitting note: audiogram, feature, verification, counsel."],
        ["B3.3", "Information technology in the clinic", ["What a clinical record must keep: identity, date, stimulus, response.", "Backup and privacy, in principle.", "One way IT changes audiometry or speech analysis."], "List five fields a clinical recording file must contain."],
        ["B3.4", "Learning and behaviour", ["Classical and operant conditioning, with one clinic example each.", "Acquisition, extinction and maintenance.", "Problem-behaviour assessment versus skill assessment."], "Give one operant procedure you could use for a therapy target, and its risk."],
        ["Weak units", "Redo the red marks", ["One weak unit from each paper.", "No new chapter.", "One diagram or table redrawn."], "Teach the weakest unit aloud for five minutes."],
        ["B3.3", "Instruments you must recognise", ["Microphones, speakers, audiometers and analysers, as blocks.", "What each block measures.", "One artefact that ruins the measure."], "Name the instrument, the quantity, and one artefact, for three tests."],
        ["B3.4", "Neuropsychology and counselling", ["What a neuropsychological screen is for, and what it is not.", "Guidance, counselling and psychotherapy: the difference.", "One counselling skill you can use this semester."], "Contrast guidance and counselling with one clinic example."],
        ["Two papers", "Boss: timed short notes", ["The two papers you trust least.", "Ten short notes, 90 minutes.", "Mark against your notes."], "Finish and score the ten notes."],
        ["B3.1", "Camp: child language", ["Bases, characteristics, assessment, intervention, AAC.", "One language-sample plan and one technique script.", "Gaps only. No new textbook."], "A closed-book outline of assessment, then of one technique."],
        ["B3.2", "Camp: hearing aids", ["Types, processing, EAM, selection, ear moulds.", "One comparison table and one EAM definition set.", "A four-line fitting note from a sketched audiogram."], "OSPL90, one compression type, and one mould choice, from memory."],
        ["B3.3", "Camp: electronics and acoustics", ["Signal path, acoustic definitions, sampling, instrumentation.", "Three block diagrams.", "A glossary of fifteen terms."], "Three diagrams, labelled, book closed."],
        ["B3.4", "Exam eve: psychology, then stop", ["A full pass of the five units before 4:30 pm.", "One mixed set from B3.1 to B3.3 only if time remains.", "No new topics after 6:00 pm. Pack the kit and sleep."]
        , "Close the books at 6:00 pm. Write the wake-up time."]
      ]
    }),
    campaign({
      id: "sem5",
      semester: 5,
      name: "Semester V",
      short: "Sem V",
      blurb: "Third-year theory papers B5.1 to B5.4. B5.5 is the minor optional. B5.6 and B5.7 are clinicals and stay on the posting roster.",
      papers: [
        ["B5.1", "Voice Disorders and Laryngectomy", "Practical 25 + IA 25 + Theory 50"],
        ["B5.2", "Motor Speech Disorders in Children", "Practical 25 + IA 25 + Theory 50"],
        ["B5.3", "Paediatric Audiology", "Practical 25 + IA 25 + Theory 50"],
        ["B5.4", "Aural Rehabilitation", "Practical 25 + IA 25 + Theory 50"]
      ],
      rows: [
        ["B5.1", "Voice parameters and the mechanism", ["Parameters of voice, and the respiratory-laryngeal frame.", "Pitch and loudness change, registers, quality and resonance.", "One physiologic, one acoustic and one aerodynamic correlate."], "Define pitch, loudness and quality, and name the mechanism that changes each."],
        ["B5.2", "Childhood dysarthria and apraxia, apart", ["Neural maturation and sensorimotor integration, in brief.", "Childhood dysarthria, including cerebral palsy types at definition level.", "Childhood apraxia of speech: definition and characteristics."], "Three points that separate childhood dysarthria from childhood apraxia."],
        ["B5.3", "How hearing behaviour develops", ["Embryology of the auditory system, clinical relevance only.", "Maturation and neuroplasticity.", "Prenatal, newborn, infant and toddler auditory behaviour."], "Describe one auditory behaviour at birth and one at six months."],
        ["B5.1 + B5.2", "Boss: a voice scale and a differential", ["GRBAS: one line on each letter.", "A differential list: dysarthria, apraxia, phonological disorder.", "Error log."], "Score a described voice on GRBAS, and give the differential in three lines."],
        ["B5.4", "What hearing loss does to communication", ["Sensitive period for auditory development.", "Impact on spoken language, parent-child talk and quality of life.", "Education, employment and cost, at the level of this unit."], "Give three impacts of early hearing loss, each in a different domain."],
        ["B5.1", "Causes and voice-disorder groups", ["Phonotrauma, medical causes and primary disorder.", "Functional and psychogenic presentations.", "Congenital voice disorders, as a short list."], "Sort six causes into organic or functional, and justify two of them."],
        ["B5.2", "Assessing the motor speech system", ["Case history and developmental neurological signs.", "Respiration, phonation, resonance and articulation: what you watch.", "Cognitive-linguistic and language checks that travel with the motor exam."], "List the speech subsystems and one task for each."],
        ["B5.3", "Early hearing detection", ["Incidence, and congenital versus acquired.", "Principles of early hearing detection and intervention.", "Joint Committee position statements: what changed, in outline."], "State three principles of early hearing detection and intervention."],
        ["B5.4", "Communication options", ["Parent counselling before the choice.", "Oral, manual, cued speech and total communication.", "Auditory-oral and auditory-verbal: the difference."], "Contrast auditory-verbal therapy with a total-communication approach in five lines."],
        ["B5.1", "Voice assessment", ["Referral, medical examination and the team.", "ICF and a clinical voice protocol.", "GRBAS and CAPE-V. Instrumental measures in principle, not as a brand."], "List the components of a voice assessment protocol in order."],
        ["B5.3 + B5.4", "Boss: screening versus teaching listening", ["One screening test and what a pass does not mean.", "One point you would tell a parent this week.", "Error log."], "Explain a refer result to a parent, without promising a diagnosis."],
        ["B5.2", "Managing childhood dysarthria", ["Team, then the subsystems.", "Prosthetic help and AAC.", "One goal written so a parent can see it."], "Write one subsystem goal with the task, the cue and the success mark."],
        ["B5.1", "Voice therapy", ["Goals and approaches.", "Vocal hygiene.", "Symptomatic and psychological approaches, and when each leads."], "Write a five-point vocal-hygiene counsel for a teacher."],
        ["B5.3", "Newborn and infant screening", ["Behavioural observation and its limits.", "Objective screens, including OAE and ABR as screens.", "Universal newborn hearing screening: India and the global picture."], "Give one strength and one limit of OAE as a newborn screen."],
        ["B5.4", "Auditory learning", ["Auditory training and auditory-verbal therapy, as terms.", "Home and classroom listening conditions.", "Factors that change the outcome."], "List four changes that make a classroom easier to listen in."],
        ["B5.1", "Laryngectomy, on the holiday", ["Confirm Kanakadasa Jayanti against the University list.", "Causes, surgery types, and the team.", "Pre- and post-operative communication assessment, and alaryngeal options."], "Compare two alaryngeal speech options on voice source, training and a limit."],
        ["B5.2", "Treating childhood apraxia", ["Principles of motor learning.", "Dynamic temporal and tactile cueing.", "PROMPT, signed cues and cued speech, at introduction level."], "State three principles of motor learning and one therapy step that uses them."],
        ["All four", "Boss: twenty definitions", ["Five terms from each paper.", "Closed book, then mark.", "Misses feed 3 December."], "Twenty definitions, at least fifteen correct."],
        ["B5.3", "Paediatric assessment battery", ["Behavioural observation, visual reinforcement and play audiometry.", "Speech audiometry modifications for children.", "Immittance, high-frequency probe tone, and the cross-check."], "Pick a test battery for a two-year-old and say why each test is there."],
        ["B5.2", "Feeding and swallowing in children", ["Phases, neural control and the related reflexes.", "Signs of paediatric dysphagia.", "Assessment and the treatment frame: position, oral-motor, non-oral feeding."], "List the swallow phases and one paediatric red flag."],
        ["B5.4", "Speech reading", ["Why it is needed, and how visible speech sounds differ.", "Analytic and synthetic tests and training.", "Adults and children: what you change."], "Contrast analytic and synthetic speech-reading practice with one task each."],
        ["Weak units", "Redo the red marks", ["One weak unit from each paper.", "No new chapter.", "One protocol or diagram redrawn."], "Teach the weakest unit aloud for five minutes."],
        ["B5.3", "Special populations", ["Auditory neuropathy spectrum disorder.", "Additional needs, central auditory processing, and functional hearing loss.", "What the cross-check changes in each."], "Give the cross-check pattern you expect in auditory neuropathy."],
        ["B5.4", "Additional needs", ["Hearing loss with blindness or cognitive disability.", "Management frames for auditory neuropathy and central auditory processing.", "Tinnitus and hyperacusis, at the level of this unit."], "Name one change in management when hearing loss is not the only disability."],
        ["Two papers", "Boss: timed short notes", ["The two papers you trust least.", "Ten short notes, 90 minutes.", "Mark them yourself."], "Finish and score the ten notes."],
        ["B5.1", "Camp: voice and laryngectomy", ["Mechanism, disorders, assessment, therapy, laryngectomy.", "One GRBAS practice and one alaryngeal comparison.", "Gaps only."], "A closed-book voice protocol, then two alaryngeal options."],
        ["B5.2", "Camp: motor speech in children", ["Differential diagnosis, assessment, dysarthria, apraxia, swallow.", "One subsystem plan and one motor-learning step.", "A feeding red-flag list."], "Differential diagnosis in six lines, book closed."],
        ["B5.3", "Camp: paediatric audiology", ["Development, early identification, screening, assessment, special populations.", "One age-wise test table.", "One parent explanation of a refer."], "The age-wise table, from memory."],
        ["B5.4", "Exam eve: aural rehabilitation, then stop", ["Communication options, auditory learning, speech reading, additional needs.", "A mixed 40-minute set from the other three papers only if the B5.4 pass is done.", "No new topics after 6:00 pm."]
        , "Stop at 6:00 pm. Pack the kit. Set the alarm."]
      ]
    })
  ];
})();
