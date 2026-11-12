/* ============================================================
   B.ASLP PORTAL - CONTENT DATA
   Department of Audiology & Speech-Language Pathology
   Yenepoya (Deemed to be University), Mangaluru
   Batch: The Precision Clinicians (TPC 2026)
   ============================================================

   SOURCE DOCUMENTS - every array below is transcribed from an
   official document held by the department:

   1. COURSES, EXAM_SCHEME, CREDIT_STRUCTURE, MINOR_OPTIONS,
      REGULATIONS, INTERNSHIP
        -> "B.ASLP Norms, Regulations & Curriculum Framework",
           Rehabilitation Council of India, effective 2024-25
           (Classes Schedule/Disciplinary Files_Regulations_Syllabus/Syllabus.pdf)

   2. CONDUCT
        -> "Student Code of Conduct & Disciplinary Handbook",
           Yenepoya (Deemed to be University), AY 2026-27

   3. CALENDAR, CALENDAR_NOTES
        -> "Master Academic Calendar", Batch 2026-27

   4. TIMETABLE
        -> "BASLP First Semester Weekly Timetable", TPC 2026

   4b. DEPARTMENT, FACULTY
        -> "Introduction to the Department & Faculty", presented by
           Ms. Pavana M J, Deeksharambh '26 (20 July 2026)

   5. TRANSPORT
        -> Department bus/shuttle timings between Your Space Hostel,
           Kuthar and the Yenepoya Medical College campus

   HOW TO UPDATE
   Edit the arrays below and refresh the page - no HTML changes
   are needed. To publish the source PDFs for download, copy them
   into assets/docs/ using the file names listed in DOCS.
   ============================================================ */

/* All 43 papers of the 4-year program, parsed from the RCI curriculum. Each course carries its objectives, units/topics, clinical competencies (Know / Know-how / Show / Do) and recommended reading. */
const COURSES = [
  {
    "code": "B1.1",
    "type": "M",
    "semester": 1,
    "title": "Introduction to Speech-language Pathology",
    "hours": "45",
    "marks": 75,
    "credits": "3",
    "objectives": [
      "have the basic concepts of speech, language and communication, and the relationship between them",
      "know the physical, biological, social, psychological and linguistic bases of speech",
      "will be able to trace out the stages of normal development of speech and language",
      "will have the basic skills of assessment and evaluation of speech, language and swallowing disorders, and",
      "know the nature and scope of the field of speech-language pathology."
    ],
    "units": [
      {
        "title": "Introduction to Speech-language Pathology",
        "topics": [
          "History and development of speech-language pathology in Indian and Global context.",
          "Definition and functions of speech, language, communication, and their components",
          "Basic models of speech communication : Speech and hearing as a servo system, Shannon-Weaver model, Lasswell model, and Berlo model",
          "Speech chain and Speech as an overlaid function",
          "Bases of speech and language - anatomical, physiological, neurological, physical, aerodynamic, linguistic, psychological, socio-cultural and genetic",
          "Introduction to Speech-Language Disorders",
          "Incidence and prevalence of speech and language disorders",
          "Definition and descriptions of delay, deviancy, and disorders; impairment, disability and handicap"
        ]
      },
      {
        "title": "Normal Development of Speech-language and Basics of Management",
        "topics": [
          "Development of speech-language",
          "Pre-requisites and factors affecting speech-language development",
          "Basic concepts and terminologies in speech therapeutics",
          "General principles of speech and language therapy",
          "Individual and group therapy",
          "Approaches to speech-language therapy - formal, informal, and eclectic approaches",
          "Planning for speech and language therapy - goals, steps, procedures, and activities",
          "Importance of reinforcement principles and strategies in speech and language therapy, types and schedules of rewards and punishment"
        ]
      },
      {
        "title": "Assessment and Management of Speech-language and Swallowing Disorders",
        "topics": [
          "Causes of speech-language disorders",
          "Speech disorders - Fluency disorders, Voice disorders, Phonological disorders",
          "Feeding and swallowing disorders",
          "Overview of assessment procedures for voice disorders; articulation and phonological disorders; and fluency disorders",
          "Overview of management procedures for voice disorders; articulation and phonological disorders; and fluency disorders",
          "Basic concepts in assessment and management of swallowing disorders"
        ]
      },
      {
        "title": "Assessment and Management of Language Disorders",
        "topics": [
          "Types, characteristics and classification of language disorders",
          "Causes of language disorders",
          "Overview of assessment procedures for child language disorders; adult language disorders; and neurogenic language disorders",
          "Overview of management procedures for child language disorders; adult language disorders; and neurogenic language disorders",
          "Issues related to bi/multilingualism",
          "Early identification and prevention of speech and language disorders"
        ]
      },
      {
        "title": "Speech-language Pathology as a Profession",
        "topics": [
          "Professional code of conduct - social, cultural and other ethical issues",
          "Interdisciplinary nature and scope of practice in speech-language pathology",
          "Documentation of diagnostic, therapeutic and referral reports",
          "Evaluation of therapy outcome and follow up",
          "Evidence-based practice",
          "Community-based rehabilitation",
          "Role of itinerant speech therapist, Anganwadis, and resource teachers",
          "Facilities and concessions available for speech and hearing disabled"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Brookshire, R. H. (2003). Introduction to neurogenic communication disorders (6th ed.). St. Louis, Mo: Mosby.",
      "Hegde, M. N., & Davis, D. (2005). Clinical methods and practicum in speech- language pathology (4th ed.). Australia; Clifton Park, NY: Thomson Delmar Learning.",
      "Hulit, L.M., Marle. R., Kathleen, R. H., & Fowey (2010). Born to Talk. Pearson Communication Science and Disorders Series 5th Ed.",
      "Owens. Jr, Kimberly, A. Metz, F.E. (2014). 5th Ed. Introduction to Communication Disorders: A life span based Perspective. Pearson Communication Science and Disorders Series.",
      "Roth, F. P., & Worthington, C. K. (2005). Treatment resource manual for speech language pathology (3rd ed.). Australia; Clifton Park, NY: Thomson Delmar Learning.",
      "S R Savithri, (2019) Introduction to Communication Sciences, Nova Science Publishers.",
      "Shipley, K. G., & McAfee, J. G. (2004). Assessment in speech-language pathology: A resource manual (3rd ed.). Australia; Clifton Park, NY: Delmar Learning.",
      "Shipley, K. G., & Roseberry -McKibbin, C. (2006). Interviewing and counselling in communicative disorders : Principles and procedures (3rd ed.). Austin, Tex: Pro-Ed."
    ],
    "stream": "SLP",
    "kind": "Theory"
  },
  {
    "code": "B1.2",
    "type": "M",
    "semester": 1,
    "title": "Introduction to Audiology",
    "hours": "45",
    "marks": 75,
    "credits": "3",
    "objectives": [
      "describe the basic concepts of hearing sensitivity and acoustics",
      "describe the characteristics and causes for different types of hearing loss",
      "take case history, administer and interpret tuning fork tests",
      "carry out pure tone and speech audiometry on clinical population",
      "carryout subjective calibration and daily listening checks of the audiometer, and",
      "explain the theoretical basis of objective calibration of audiometers"
    ],
    "units": [
      {
        "title": "Historical Aspects of Audiology and Scope of Audiology",
        "topics": [
          "History of Audiology, development of instrumentation in audiology",
          "Development of the field of audiology: Indian and global context",
          "Branches of audiology and scope of audiology",
          "Multidisciplinary inputs to audiology"
        ]
      },
      {
        "title": "Normal Aspects of Hearing",
        "topics": [
          "Sound intensity and concept of decibel; Acoustic energy and power, absolute and relative units - importance of reference: Sound intensity and intensity levels - absolute and relative measurements: Bel - decibels and its application: relationship between intensity and pressure",
          "Audibility and hearing: Hearing range - intensity and frequency: Minimum audible pressure and field: Estimation of minimum audible levels: Missing six dB: Reference equivalent threshold sound pressure levels and hearing levels: Sensation levels, threshold of pain, most comfortable levels",
          "Differential sensitivity: Concept of just noticeable difference and its applications: Intensity, frequency and duration discrimination: Magnitude estimation and production: Loudness - equal loudness level contours and its application: Scales of pitch and loudness scales"
        ]
      },
      {
        "title": "Hearing Loss",
        "topics": [
          "Hearing loss and related terminologies",
          "Classification of hearing loss: conductive, sensori-neural, mixed and central",
          "Characteristics of different types of hearing loss",
          "Causes of different types of hearing loss: Adult and children: Congenital and acquired: Pre-natal, natal and post-natal causes: Genetic and environmental causes"
        ]
      },
      {
        "title": "Case History and Tuning Fork Tests",
        "topics": [
          "Importance of case history taking in audiology practice",
          "Essential factors to be included in case history for adults and children",
          "Interpretation of case history information",
          "Principles, procedure, interpretation, advantages and disadvantages of different tuning fork tests - Rinne, Schwabach, Weber and Bing tests",
          "Audiometric version of Weber and Bing test"
        ]
      },
      {
        "title": "Pure Tone Audiometry",
        "topics": [
          "Classification of audiometers, Parts of an audiometer, characteristics and specifications of transducers used (earphones, bone vibrators, loud speakers)",
          "Audiogram- concept and symbols used",
          "Clinical method of threshold estimation",
          "Factors affecting air conduction threshold",
          "Bone conduction thresholds- measurements, factors effecting; SAL.",
          "Permissible noise levels in the audiometric room"
        ]
      },
      {
        "title": "Speech Audiometry",
        "topics": [
          "Terminology, need for speech audiometry and types of stimuli used in speech audiometry, Test materials available in Indian languages",
          "Speech reception thresholds - procedures and application",
          "Word recognition scores -procedure and applications",
          "Other measures of speech audiometry: Speech detection threshold, most comfortable level, uncomfortable level",
          "PIPB function - procedure and applications",
          "Factors affecting speech audiometry, Bone conduction speech audiometry Recommended reading",
          "Speaks, C. E. (2017). Introduction to Sound: Acoustics for the Hearing and Speech Sciences (4th Edition). Plural Publishing Inc.",
          "Martin, F. N., & Clark, J. G. (2018). Introduction to Audiology. 13th Edition. Boston: Pearson.",
          "Gelfand, S. A. (2017). Hearing: An Introduction to Psychological and Physiological Acoustics (6th edition.). London: CRC Press.",
          "Durrant, J. D., & Feth, L. L. (2012). Hearing Sciences: A Foundational Approach (1 Edition.). Boston: Pearson.",
          "Katz, J. (2014). Handbook of Clinical Audiology (7th International edition.). Lippincott Williams and Wilkins.",
          "Silman, S., & Silverman, C. A. (1997). Auditory Diagnosis: Principles and Applications (Reissue Edition.). San Diego: Singular Publishing Group"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Speaks, C. E. (2017). Introduction to Sound: Acoustics for the Hearing and Speech Sciences (4th Edition). Plural Publishing Inc.",
      "Martin, F. N., & Clark, J. G. (2018). Introduction to Audiology. 13th Edition. Boston: Pearson.",
      "Gelfand, S. A. (2017). Hearing: An Introduction to Psychological and Physiological Acoustics (6th edition.). London: CRC Press.",
      "Durrant, J. D., & Feth, L. L. (2012). Hearing Sciences: A Foundational Approach (1 Edition.). Boston: Pearson.",
      "Katz, J. (2014). Handbook of Clinical Audiology (7th International edition.). Lippincott Williams and Wilkins.",
      "Silman, S., & Silverman, C. A. (1997). Auditory Diagnosis: Principles and Applications (Reissue Edition.). San Diego: Singular Publishing Group",
      "Stach, B. A. (2021). Clinical Audiology: An Introduction (3rd Edition). Plural Publishing Inc.",
      "Gelfand, S. A. (2017). Essentials of Audiology (4th Edition). Thieme Publishers."
    ],
    "stream": "Audiology",
    "kind": "Theory"
  },
  {
    "code": "B1.3",
    "type": "MC",
    "semester": 1,
    "title": "Anatomy and Physiology of Speech & Swallowing",
    "hours": "30",
    "marks": 75,
    "credits": "2",
    "objectives": [
      "describe the embryonic development of structures subserving speech and swallowing",
      "describe the anatomy of the structures involved in speech production",
      "describe the process of speech production including voice, and the underlying mechanism including neural control",
      "explain the anatomy and physiology of swallowing mechanism"
    ],
    "units": [
      {
        "title": "Introduction",
        "topics": [
          "Anatomical terms, positions, and planes of reference",
          "Cells and tissues of the body",
          "Basic terminology related to embryology",
          "Development of larynx and respiratory structures",
          "Development of structures in the oral cavity"
        ]
      },
      {
        "title": "Anatomy of Speech Production",
        "topics": [
          "Anatomy of respiratory structures including larynx",
          "Structure of articulators in the oral cavity",
          "Structures of the resonatory mechanism",
          "Neural structures subserving speech production"
        ]
      },
      {
        "title": "Physiology of Speech Production",
        "topics": [
          "Breathing, speech-breathing, and posture",
          "Role of larynx in voice-speech production",
          "Mechanism of phonation",
          "Mechanism of production of speech sounds",
          "Resonatory mechanisms and their contribution to speech"
        ]
      },
      {
        "title": "Anatomy and Physiology of Swallowing",
        "topics": [
          "Structure of the oral cavity for swallowing",
          "Anatomy of pharynx and esophagus",
          "Stages and processes of swallowing"
        ]
      },
      {
        "title": "Disorders of Speech and Swallowing",
        "topics": [
          "Five examples of embryonic anomalies affecting speech and language",
          "Speech disorders: fluency disorders, voice disorders, articulatory and resonatory disorders",
          "Feeding and swallowing disorders"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Bernard Rousseau., & Ryan C. Branski. (2018). Anatomy and Physiology of Speech and Hearing. Thieme Medical Publishers, Inc. New York.",
      "Chaurasia, B.D (2022). Human Anatomy, vol 3. Head Neck and vol 4. Brain (9th Edition) CBS Publishers and Distributors, New Delhi. ISBN 81-239-1157-2.",
      "Gelfand, S. A. (2017). Hearing: An Introduction to Psychological and Physiological Acoustics (6th edition.). London: CRC Press.",
      "Hixon, T J., Weismer G & Hoit J D (2020). Pre -clinical speech science - Anatomy, Physiology, Acoustics and Perception (3rd edition). Plural Publishing",
      "Hoit, J D., & Weismer G. (2017). Foundations of speech and hearing: anatomy and physiology. Plural Publishing, Inc",
      "Kelley, M., Wu, D., & Fay, R. R. (Eds.). (2010). Development of the Inner Ear. New York: Springer.",
      "Seikel, J. A., King, D. W., & Drumright, D. G., & Hudock D. J. (2019). Anatomy & Physiology of Speech, Language, and Hearing (6th edition). Plural publishing, Inc. NY .",
      "Zemlin, W. R. (2010). Speech and Hearing Science: Anatomy and Physiology: . International Edition (4 edition.). Boston: Pearson."
    ],
    "stream": "Allied",
    "kind": "Theory"
  },
  {
    "code": "B1.4",
    "type": "MC",
    "semester": 1,
    "title": "Anatomy and Physiology of Hearing",
    "hours": "30",
    "marks": 75,
    "credits": "2",
    "objectives": [
      "understand the evolution and anatomy of the auditory system including neural supply",
      "describe the anatomy and functioning of external ear",
      "describe the anatomy and functioning of middle ear system",
      "describe the anatomy and functioning of labyrinth",
      "describe the functional anatomy of the central auditory pathway"
    ],
    "units": [
      {
        "title": "Introduction to general anatomy and embryology",
        "topics": [
          "General anatomical terms",
          "Development of external",
          "Development of middle ear",
          "Development of inner ear",
          "Five examples of embryonic anomalies affecting auditory system"
        ]
      },
      {
        "title": "Anatomy and physiology of External ear",
        "topics": [
          "Anatomy of pinna and external auditory canal",
          "Auditory and non-auditory functions of external ear including localization",
          "Head shadow effect, inter-aural intensity and time differences",
          "Brief anatomy of the temporal bone"
        ]
      },
      {
        "title": "Anatomy and physiology of middle ear",
        "topics": [
          "Anatomy of middle ear including tympanic membrane",
          "Auditory and non-auditory functions of the middle ear",
          "Middle ear transformer action",
          "Anatomy and physiology of Eustachian tube"
        ]
      },
      {
        "title": "Anatomy and physiology of labyrinth",
        "topics": [
          "Anatomy of the bony and membranous labyrinth",
          "Micro and macro anatomy of cochlea",
          "Innervations and blood supply to cochlea",
          "Physiology of cochlea",
          "Electrical potentials of the cochlea",
          "Hearing through bone conduction",
          "Overview to physiology of balancing mechanisms"
        ]
      },
      {
        "title": "Auditory Nerve and Central auditory pathway",
        "topics": [
          "Anatomy and Physiology of the Auditory nerve",
          "Functional anatomy of the central auditory pathway and its physiology"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Seikel, J. A., King, D. W., & Drumright, D. G., & Hudock D. J. (2019). Anatomy & Physiology of Speech, Language, and Hearing (6th edition). Plural publishing, Inc. NY .",
      "Zemlin, W. R. (2010). Speech and Hearing Science: Anatomy and Physiology:",
      "International Edition (4 edition.). Boston: Pearson.",
      "Gelfand, S. A. (2017). Hearing: An Introduction to Psychological and Physiological Acoustics (6th edition.). London: CRC Press.",
      "Chaurasia, B.D (2022). Human Anatomy, vol 3. Head Neck and vol 4. Brain (9th Edition) CBS Publishers and Distributors, New Delhi. ISBN 81-239-1157-2.",
      "Kelley, M., Wu, D., & Fay, R. R. (Eds.). (2010). Development of the Inner Ear. New York: Springer.",
      "Hoit, J D., & Weismer G. (2017). Foundations of speech and hearing: anatomy and physiology. Plural publishing, Inc.",
      "Bernard Rousseau., & Ryan C. Branski. (2018). Anatomy and Physiology of Speech and Hearing. Thieme Medical Publishers, Inc. New York."
    ],
    "stream": "Allied",
    "kind": "Theory"
  },
  {
    "code": "B1.5",
    "type": "M",
    "semester": 1,
    "title": "Practicals: Speech-language Pathology",
    "hours": "30",
    "marks": 50,
    "credits": "1",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "Perform",
        "items": [
          "List the available clinical facilities and clinical activities of the department/institute.",
          "List the sources of referral for speech and language disorders (to and from the department).",
          "List various public education materials/ videos that are available in the department.",
          "List various assessment materials available for the evaluation of speech -language disorders.",
          "Prepare a chart and show the developmental stages of speech and language behavior.",
          "Compile the normative data available in Indian languages with reference to speech sound acquisition",
          "Prepare a report on the available clinical facilities and clinical activities of your institute.",
          "Use IPA to transcribe spoken language sample. Standard passage may be used. Identify the number of phonemes and syllables in a list of words/passage.",
          "Record a speech sample and analyse the parameters (voice, articulation, fluency, stress, rhythm, resonance).",
          "Record a neurotypical child’s language sample and analyse various parameters of language.",
          "Measure the following: Habitual frequency, Frequency range, Intensity, Intensity range, Phonation duration, Rate of speech, Alternate Motion Rates, Sequential Motion Rates, s/z ratio.",
          "List the available test material in the clinic for assessing various parameters of speech and language. Familiarize with three commonly used language test materials at the institute - Ex: Assessment of Language Development, ComDEALL Developmental Checklist (CDDC), Language Assessment Tool (LAT). Administer on one typically developing child and one child with language disorder.",
          "List and demonstrate components of case history for communication disorders.",
          "Perform oral mechanism examination on two neurotypical children and adults."
        ]
      }
    ],
    "reading": [],
    "stream": "SLP",
    "kind": "Practical"
  },
  {
    "code": "B1.6",
    "type": "M",
    "semester": 1,
    "title": "Practicals - Audiology",
    "hours": "30",
    "marks": 50,
    "credits": "1",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "Practical Tasks",
        "items": [
          "Daily listening check and trouble shoot of different clinical audiometers",
          "Preparation of correction factor chart after biological calibration on individuals with normal hearing",
          "Getting familiar with different clinical audiometers, parts of audiometers and their functions",
          "Familiarization with different types of transducers - earphones/ear cushion combination, speakers, insert earphones, bone vibrators",
          "Appropriate placement of various transducers on clients during Audiometry including masking",
          "Get familiar with instructions for carrying out pure tone audiometry, Speech audiometry and masking in 5 different languages at least",
          "Familiarization with different types of stimuli used in audiometry",
          "Establishment of PT thresholds (AC & BC) using ascending, descending and modified Hughson Westlake procedures in 5 individuals with normal hearing",
          "Estimation of bone conduction threshold with forehead and mastoid placements in 5 individuals with normal hearing",
          "Familiarization with different symbols used on audiogram for unmasked and masked AC, BC, SRT, and SIS for different transducers for right and left ear.",
          "Familiarization with materials used for speech audiometry in different Indian languages and English for adults and children",
          "To observe the counselling before and after audiological testing",
          "Establishing UCL, MCL, DR, SRT, SDT & SIS on 5 individuals with normal hearing",
          "Administration of clinical masking on 5 individuals with normal hearing",
          "Familiarization with different equipment used for objective calibration of audiometers",
          "Observation of objective calibration procedure for audiometers as per standards",
          "Administration of SAL and Rainville on 5 individuals with normal hearing Semester 2"
        ]
      }
    ],
    "reading": [],
    "stream": "Audiology",
    "kind": "Practical"
  },
  {
    "code": "B2.1",
    "type": "M",
    "semester": 2,
    "title": "Fluency and its Disorders",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "identify the normal aspects of fluency, its variability, and factors influencing its development",
      "describe the terminologies, classification and characteristics of stuttering and other fluency disorders",
      "assess fluency and dysfluency, and differentiate different variations of fluency disorders (stuttering, neurogenic stuttering, cluttering)",
      "plan and serve management strategies for persons with fluency disorders",
      "plan strategies and aspects to prevent development and relapse of stuttering, and",
      "counsel persons affected as well as their family members."
    ],
    "units": [
      {
        "title": "Fluency",
        "topics": [
          "Definition of fluency and dimensions of fluency",
          "Factors influencing fluency of speech",
          "Definition and characteristics of suprasegmentals in speech",
          "Development of fluency and its components",
          "Variables affecting development of fluency",
          "Typical disfluency, characteristics"
        ]
      },
      {
        "title": "Stuttering and Other Fluency Disorders",
        "topics": [
          "Developmental stuttering - Definition, core and secondary characteristics, attitudes and anxiety issues in adults and children who stutter: • Development of stuttering: from onset to adulthood (Bloodstein’s phases, VanRiper’s tracks, Conture’s classification, Guitar’s classification",
          "Nature of stuttering - prevalence and incidence, gender ratio, variability, recovery, fluency inducing conditions, adaptation effect, multilingual issues",
          "Cause(s) of stuttering - introduction to theories of stuttering • Learning and Psychological theories: Diagnosogenic theory, Classical and operant conditioning, Personal Construct Theory, Anticipatory Struggle Hypothesis, Breakdown Hypothesis, Repressed Need Hypothesis • Organic Theories: Cerebral dominance, Genetic basis of Stuttering • Speech Motor Control Theories: Zimmerman’s Model, Cyber kinetic or servo system Model, Interhemispheric inference Model, The variability Model, DIVA and GODIVA Model • Psycholinguistic Theories: Covert Repair hypothesis, EXPLAN theory, Fault-line Hypothesis • Multifactorial Models: Demands -capacities model, Neurophysiological Model, CALMS Model, Communication -Emotional model, Dual -diathesis stressor Model",
          "Acquired stuttering (neurogenic stuttering, psychogenic stuttering), Cluttering"
        ]
      },
      {
        "title": "Assessment and Differential Diagnosis of Fluency Disorders",
        "topics": [
          "Case History for Preschool, School-age, adolescents, and adults • Speech sample recording • Speech sample transcription",
          "Assessment of core and secondary behaviours • Tools for quantification of core and secondary behaviours • Assessment of Speech naturalness • Assessment of feelings and attitudes accompanying stuttering • Assessment of the impact of stuttering",
          "Closing interview",
          "Differential diagnosis of fluency disorders (stuttering, cluttering, neurogenic stuttering and typical dysfluency)",
          "Mobile applications related to assessment of stuttering"
        ]
      },
      {
        "title": "Management of stuttering",
        "topics": [
          "Counselling, Prevention and early identification of stuttering",
          "Management of stuttering - approaches and rationale",
          "Management of Children with stuttering: preschool and school -age children (Direct vs. Indirect Approaches • Indirect approaches (Parent-child interaction Therapy) • Direct Approaches (LIDCOMBE Program, Westmead Program, Response Cost, RESTART-DCM • Evidence in Indian context • Analogies",
          "Management of Adults with stuttering: Treatment goals • Fluency shaping vs stuttering modification approaches • Fluency shaping • Prolonged Speech • Shadowing • Habit rehearsal Techniques • Light Articulatory Contact • Flow and Slow Method / Modified airflow Technique • Comprehensive Stuttering Program • Camperdown Program • Successful Stuttering Management Program • Cognitive Behavior Therapy • Group therapy • Measurement of therapy progress and naturalness rating",
          "Issues of speech naturalness in stuttering",
          "Relapse and recovery from stuttering",
          "Instrumental approaches for the management of stuttering: DAF, mobile applications related to management of stuttering"
        ]
      },
      {
        "title": "Management of Fluency-related Entities",
        "topics": [
          "Management of stuttering - its rationale, techniques and strategies in • Children with stuttering • Adults with stuttering • Neurogenic stuttering • Cluttering",
          "Relapse and recovery in neurogenic stuttering and cluttering",
          "Counselling",
          "Prevention and early identification of stuttering and cluttering"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Bloodstein, O., Ratner, N. B. & Brundage, S. B. (2021). A Handbook on Stuttering (7th Ed.). USA: Plural Publishing Inc.",
      "Guitar, B. (2019). Stuttering -An Integrated Approach to its Nature and Treatment. (5th Ed.). Baltimore, Lippincott Williams & Wilkins.",
      "Guitar, B. (2024). Stuttering -An Integrated Approach to its Nature and Treatment. (6th Ed.). Baltimore, Lippincott Williams & Wilkins. (available online)",
      "Hegde, M. N. (2007). Treatment Protocols for Stuttering. CA Plural Publishing.",
      "Howell, P. (2011). Recovery from Stuttering. New York, Psychology Press.",
      "Logan K.J. (2015). Fluency disorders. San Deigo: Plural publishing.",
      "Maruthy, S., & Kelkar, P. (Eds.). (2023). Understanding and Managing Fluency Disorders: From Theory to Practice. Taylor & Francis.",
      "Rentschler, G. J. (2012). Here`s How to Do: Stuttering Therapy. San Diego, PluralPublishing."
    ],
    "stream": "SLP",
    "kind": "Theory"
  },
  {
    "code": "B2.2",
    "type": "M",
    "semester": 2,
    "title": "Diagnostic Audiology- Basic",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4",
    "objectives": [
      "explain masking and carryout audiometry with masking",
      "carryout subjective calibration and daily listening checks of the audiometer",
      "explain the theoretical basis of objective calibration of audiometers",
      "apply appropriate test battery of behavioural tests to differentially diagnose cochlear and retrocochlear pathology",
      "apply appropriate test battery of behavioural tests to identify functional hearing loss",
      "explain the origin of otoacoustic emissions and record the same in adults and children"
    ],
    "units": [
      {
        "title": "Clinical Masking & Calibration",
        "topics": [
          "Purpose and rationale of clinical masking: Interaural attenuation and factors affecting interaural attenuation",
          "Different types of stimulus employed in clinical masking, minimum and maximum masking level for masking",
          "Different procedures for masking during pure tone audiometry, speech audiometry",
          "Definition and purpose of calibration, Daily listening checks and subjective calibration",
          "Objective calibration of intensity through different transducers (air conduction, bone conduction, sound field)",
          "Objective calibration of frequency and distortion"
        ]
      },
      {
        "title": "Introduction to Diagnostic Audiology",
        "topics": [
          "Concept of clinical decision analysis (sensitivity, specificity, true positive, true negative, false positive, false negative and hit rate)",
          "Screening tests for hearing loss, difference between screening and diagnostic test",
          "Characteristics of a good diagnostic test: behavioural and physiological",
          "Need for test battery approach in auditory diagnosis and integration of the audiological tests results, Cross-check principle",
          "Communicating results of screening and diagnostic tests to clients/caretakers and making appropriate referrals"
        ]
      },
      {
        "title": "Behavioural Tests to Diagnose Cochlear Pathology and Retro-cochlear Pathology",
        "topics": [
          "Behavioral and Clinical indications for cochlear pathology, retro-cochlear pathology",
          "Physiological bases of recruitment/softness imperception and adaptation",
          "Behavioural tests of recruitment/softness imperception: ABLB, MLB, dynamic range",
          "Tests of adaptation, SISI",
          "PIPB function, Brief tone audiometry, Bekesy audiometry",
          "Test to identify dead regions of cochlea."
        ]
      },
      {
        "title": "Behavioural Tests to Diagnose Cochlear Pathology, Retro -Cochlear Pathology",
        "topics": [
          "Functional Hearing Loss",
          "Behavioural and clinical indicators of functional hearing loss",
          "Pure tone tests including tone in noise test, Stenger test, Bekesy audiometry, Brief tone audiometry, pure tone DAF",
          "Speech tests including Lombard test, Stenger test, lip -reading test, Doerfler -Stewert test, Low level PB word test, Yes-No test, DAF test",
          "Identification of functional hearing loss in children: Swinging story test, Pulse tone methods",
          "Counselling clients with functional hearing loss"
        ]
      },
      {
        "title": "Otoacoustic Emissions",
        "topics": [
          "Origin and classification of OAEs",
          "Principle of instrumentation used for recording OAEs",
          "Recording and interpretation of OAEs: SOAE, TEOAEs, and DPOAEs",
          "Clinical applications of OAEs: SOAE, TEOAEs, and DPOAEs",
          "Contralateral suppression of OAEs and its clinical implications"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "DeRuiter, M. & Ramachandran, V. (2016). Basic Audiometry Learning Manual (3rd edition). Plural Publishing, Inc.",
      "Dhar, S., & Hall, J.W. (2018). Otoacoustic Emissions: Principles, Procedures, and Protocols. (2nd edition). Thieme.",
      "Gelfand, S. A. (2022). Essentials of Audiology. (5th edition). Thieme.",
      "Katz, J., Chasin, M., English, K., Hood, L.J & Tillery, K.L. (2019). Handbook of Clinical Audiology. (7th edition). Wolters Kluwer.",
      "Kramer, S., & Brown, D. K. (2021). Audiology: science to practice. (4th edition). Plural Publishing.",
      "Martin, F. N., & Clark, J. G. (2018). Introduction to audiology (13th edition). Pearson",
      "Oeding, K.A.M., Listenberger, J., Smith, S. (2016). The Audiogram Workbook. Thieme.",
      "Stach, B.A., & Ramchandran, V. (2021). Clinical Audiology: An Introduction. (3rd edition). Plural Publishing, Inc."
    ],
    "stream": "Audiology",
    "kind": "Theory"
  },
  {
    "code": "B2.3",
    "type": "MC",
    "semester": 2,
    "title": "Linguistics and Phonetics",
    "hours": "45",
    "marks": 75,
    "credits": "3",
    "objectives": [
      "different branches and aspects of linguistics",
      "characteristics and functions of language",
      "different branches of phonetics, applied linguistics, and phonology",
      "morphology, syntax, semantics, pragmatics",
      "acquisition of language and factors affecting it, and",
      "bi/multilingualism and related issues"
    ],
    "units": [
      {
        "title": "Introduction to Linguistics",
        "topics": [
          "Different branches of linguistics: Applied linguistics, sociolinguistics, psycholinguistics, neurolinguistics and clinical linguistics",
          "Language characteristics and functions. Difference between animal communication systems and human language",
          "Morphology - concepts of morph, allomorph, morpheme, bound free and compound forms, roots etc. Processes of word formation: Content and function words",
          "Endocentric and exocentric constructions",
          "Inflection and derivation, paradigmatic and syntagmatic relationship",
          "Concepts in linguistics: Competence vs. performance: Langue vs. parole etc."
        ]
      },
      {
        "title": "Phonetics and Phonology",
        "topics": [
          "Introduction to phonetics: Articulatory, acoustic, and auditory phonetic",
          "Articulatory classification of sounds - segmental and supra -segmental. Classification description and recognition of vowels and consonants",
          "Transcription systems with special emphasis on IPA.",
          "Introduction to phonology, classification of speech sounds on the basis of distinctive features",
          "Phonotactics: Phonotactic patterns of English and Indian languages",
          "Phonemic analysis - principles and practices",
          "Phonological processes"
        ]
      },
      {
        "title": "Morphology, syntax, semantics and applied linguistics",
        "topics": [
          "Morphology - concepts of morph, allomorph, morpheme, roots, compound forms - endocentric and exocentric constructions, free and bound morphemes, morphemic analysis - inflection and derivation",
          "Syntax - concepts of phrases and clauses, sentence and its types",
          "Different methods of syntactic analysis - Immediate constituent analysis, Phrase structure, grammar, transformational generative grammar - deep structure versus surface structure, acceptability versus grammaticality.",
          "Introduction to the major types of transformations",
          "Processes of word formation: Content and function words",
          "Semantics, semantic relations, semantic feature theory",
          "Pragmatics and discourse"
        ]
      },
      {
        "title": "Language acquisition",
        "topics": [
          "Issues in first language acquisition: Pre-linguistic stages, linguistic stages",
          "Acquisition of phonology, morphology, syntax, semantics, and pragmatics",
          "Language and cognition",
          "Applied linguistics with special reference to communication disorders",
          "Usefulness of morphemic and syntactic analysis in planning speech-language therapy"
        ]
      },
      {
        "title": "Bi/multilingualism",
        "topics": [
          "Introduction to the language families of India",
          "Issues related to second language acquisition and factors influencing it",
          "Inter-language theory, language transfer and linguistic interference",
          "Differences between first and second language acquisition/learning",
          "Bilingualism/Multilingualism",
          "Indian writing systems"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Allwright, Dick: Hanks, Judith (2009). The Developing Language Learning: An Introduction to Exploratory Practice. Basingstoke: Palgrave MacMillan.",
      "Ball & Martin (1995). Phonetics for Speech Pathology. Delhi: AITBS Publishes",
      "Ball, Rahilly & Tench (1996). The phonetic transcription of disordered speech. San Diego: Singular Publishing Group Inc.",
      "Berk. Laura E. (2009). Language Development. Boston: Pearson Education/Allyn & Bacon.",
      "Bhatia, Tej K., and William C. Ritchie (eds.) (2006). Bilingualism in South Asia. In: Buch. A., Erschler, D. BJäger, G. Lupas, A (2013). Towards automated language classification: A clustering approach.",
      "Foster-Cohen, S. (2009): Language acquisition. London: Palgrave Macmillan.",
      "Sousa. David, A. (2011). Handbook of Bilingualism. Oxford: Blackwell Publishing.",
      "Kennison. S. (2013). Introduction to language development. Los Angeles. CA: Sage."
    ],
    "stream": "Allied",
    "kind": "Theory"
  },
  {
    "code": "B2.4",
    "type": "MC",
    "semester": 2,
    "title": "Otolaryngology",
    "hours": "45",
    "marks": 75,
    "credits": "3",
    "objectives": [
      "identify the causes and signs/symptoms of different pathological conditions of the ear leading to hearing loss",
      "understand the principles of management of diseases of pathological conditions of the ear leading to hearing loss",
      "identify the causes and signs/symptoms of different pathological conditions of the laryngeal system leading to voice disorders."
    ],
    "units": [
      {
        "title": "External and Middle Ear and Their Disorders",
        "topics": [
          "Clinical anatomy of external and middle ear",
          "Congenital anomalies of the ear",
          "Diseases of the external ear - tumors, perforation and ruptures of the tympanic membrane, and Eustachian tube dysfunction",
          "Otitis media with effusion",
          "Cholesteatoma and chronic suppurative otitis media",
          "Otosclerosis",
          "Trauma to the temporal bone",
          "Facial nerve and its disorder"
        ]
      },
      {
        "title": "Inner Ear and its Disorders",
        "topics": [
          "Clinical anatomy of inner ear",
          "Congenital anomalies",
          "Meniere’s Disorder",
          "Ototoxicity",
          "Presbycusis",
          "Disorders of the vestibular system including vestibular Schwannoma",
          "Tinnitus and medical line of treatment",
          "Overview of surgical techniques for restoration and preservation of hearing"
        ]
      },
      {
        "title": "Oral Cavity and its Disorders",
        "topics": [
          "Anatomy and physiology of the oral cavity",
          "Malformation and inflammations of lip and oral cavity",
          "Benign, premalignant, and malignant tumors of the oral cavity",
          "Clinical anatomy and physiology of pharynx",
          "Inflammatory conditions of the pharynx, tonsils and adenoids",
          "Benign, premalignant, and malignant tumors of the pharynx"
        ]
      },
      {
        "title": "Larynx and its Disorders",
        "topics": [
          "Clinical anatomy and physiology of larynx",
          "Clinical examination of larynx",
          "Stroboscopy - technique, procedure, interpretation and precautions",
          "Congenital laryngeal pathologies",
          "Inflammatory conditions of the larynx",
          "Benign and malignant tumors of the larynx",
          "Laryngectomy - overview of surgical procedure",
          "Phonosurgery and other voice restoration surgeries",
          "Airway management procedures"
        ]
      },
      {
        "title": "Esophagus and its Disorders",
        "topics": [
          "Clinical anatomy and physiology of esophagus",
          "Clinical examination of esophagus",
          "Congenital anomalies of esophagus",
          "Inflammatory conditions of esophagus",
          "Benign and malignant tumors of esophagus",
          "Medical management of these pathological conditions"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Clarke, R. W. (2022). Diseases of the Ear, Nose & Throat in Children: An Introduction and Practical Guide. CRC Press.",
      "Dhingra, P. L. & Dhingra, S. (2017). Diseases of Ear, Nose and Throat (Seventh edition). Elsevier.",
      "Maqbool, M., & Maqbool, S. (2013). Textbook of Ear, Nose and Throat Diseases (1st edition). Jaypee Brothers Medical Publishers.",
      "Nawka, T., & Hosemann, W. (2005). Surgical procedures for voice restoration. GMS current topics in otorhinolaryngology, head and neck surgery, 4.",
      "Probst. R., Grevers, G., & Iro. H. (2006). Basic Otolaryngology: A Step -By-Step Learning Guide. Thieme.",
      "Rosen, C. A. (2005). Stroboscopy as a research instrument: development of a perceptual evaluation tool. The Laryngoscope, 115(3), 423-428."
    ],
    "stream": "Allied",
    "kind": "Theory"
  },
  {
    "code": "B2.5",
    "type": "MO",
    "semester": 2,
    "title": "Optional Minor - 1",
    "hours": "15",
    "marks": 50,
    "credits": "1",
    "objectives": [],
    "units": [],
    "competencies": [],
    "reading": [],
    "stream": "Allied",
    "kind": "Optional Minor"
  },
  {
    "code": "B2.6",
    "type": "M",
    "semester": 2,
    "title": "Clinicals in Speech-language Pathology",
    "hours": "30+",
    "marks": 75,
    "credits": "1",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "Know",
        "items": [
          "study normative data (Indian / Western) relating to phonology, semantics, syntax, morphology, pragmatics, voice, articulation, fluency and prosody, and relate them to clinical population",
          "record case history of a minimum of four affected persons and compare it with that of normal persons",
          "transcribe speech samples and identify instances of deviance with reference to speech samples of normal persons",
          "list various speech & language stimulation techniques with descriptions and illustrations",
          "observe and learn evaluation/assessment process and counseling of at least three children and adults with fluency disorders",
          "observe and document the results of assessment of speech fluency through standardized tests",
          "record speech samples from persons with stuttering and identify stuttering instances and measure rate of speech",
          "observe management / therapeutic procedures with children and adults with speech and language disorders.",
          "prepare a diagnostic and therapy kit for a person with stuttering or delayed speech - language development",
          "familiarize with the basics of counseling procedures - client as well as parents. Knowhow",
          "Count the number of phonemes and syllables and identify the class of words, phrases, syllable structure, and syntactic structure in a recorded standard passage (native language and English)",
          "Determine the speech and language skills of individuals with and without speech and language disorders and perceptually analyse the variations in these skills across age and gender.",
          "Differentiate the speech characteristics between normal non -fluency and developmental stuttering by observing audio-video samples.",
          "Differentiate the speech characteristics between developmental, neurogenic, and psychogenic stuttering by observing audio-video samples."
        ]
      },
      {
        "level": "Show",
        "items": [
          "Perform transcription of recorded speech samples in native language and English.",
          "Demonstrate how to perform a detailed interview for individuals with fluency disorders.",
          "Analyze and document the core and secondary features of stuttering, adaptation effect and individual and situational variations in individuals with stuttering.",
          "Analyze and document the speech characteristics of individuals with cluttering.",
          "Demonstrate stress, intonation and variations in rate of speech and analyze perceptually variations in prosody in different recorded samples of typical individuals in different age and gender.",
          "Record audio-visual speech samples of children and adults with and without fluency disorders and analyze and compare dysfluencies, secondary behaviors (if any), rate of speech, articulatory rate.",
          "Diagnose cluttering using available screening/ diagnostic tool(s).",
          "Administer, interpret, and diagnose stuttering using standardized test material in children and adults.",
          "Administer 9 -point speech naturalness rating scale on individuals with and without stuttering.",
          "Administer and interpret the results of quality -of-life questionnaire on individuals with fluency disorders.",
          "Record speech samples of individuals with and without fluency disorders and with delay in auditory feedback: analyze and compare the results.",
          "Demonstrate therapy techniques used for management of fluency disorders in children and adults."
        ]
      },
      {
        "level": "Do",
        "items": [
          "Perform case history for children and adults with speech-language disorders.",
          "Prepare a diagnostic kit used for the assessment of speech-language disorders.",
          "Prepare a therapy kit used for speech-language therapy."
        ]
      }
    ],
    "reading": [],
    "stream": "SLP",
    "kind": "Clinical"
  },
  {
    "code": "B2.7",
    "type": "M",
    "semester": 2,
    "title": "Clinicals in Audiology",
    "hours": "30+",
    "marks": 75,
    "credits": "1",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "Know",
        "items": [
          "Methods to calibrate audiometer.",
          "Materials commonly employed in speech audiometry.",
          "Calculation pure tone average, % of hearing loss, minimum and maximum masking levels.",
          "Different types of hearing loss and its common causes Knowhow",
          "To obtain detailed case history from clients or parents/guardians.",
          "To carryout commonly used tuning fork tests.",
          "To administer pure tone audiometry including appropriate masking techniques on adults",
          "To administer tests to find out speech reception threshold, speech identification scores, most comfortable and uncomfortable levels on adults."
        ]
      },
      {
        "level": "Show",
        "items": [
          "Plotting of audiograms with different degree and type with appropriate symbols - 2 audiograms per degree and type",
          "Detailed case history taken and its analysis",
          "Calculation degree, type and percentage of hearing loss on 5 sample conditions"
        ]
      },
      {
        "level": "Do",
        "items": [
          "Case history on at least 5 adults and 3 children with hearing disorders",
          "Tuning fork test on at least 5 individuals with conductive and 5 individuals with sensori-neural hearing loss",
          "Pure tone audiometry with appropriate masking on 5 individuals with conductive, 5 individuals SN hearing loss and 3 individuals with unilateral/asymmetric hearing loss",
          "Speech audiometry on 5 individual with conductive, 5 individuals SN hearing loss and 3 individuals with unilateral/asymmetric hearing loss ✓ Internal evaluation shall be based on attendance, clinical diary, log book and learning conference. ✓ External evaluation: Spot test, OSCE, Record, Viva-voce, case work Semester 3"
        ]
      }
    ],
    "reading": [],
    "stream": "Audiology",
    "kind": "Clinical"
  },
  {
    "code": "B3.1",
    "type": "M",
    "semester": 3,
    "title": "Child Language Disorders",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "explain the process of acquisition of language and factors that influence its development in children",
      "identify and assess language delay and deviance in children",
      "select appropriate strategies for intervention",
      "counsel and provide guidance to parents/caregivers of children with language disorders, and",
      "initiate advocacy programs for children with language disorders"
    ],
    "units": [
      {
        "title": "Bases of Language Acquisition and Development",
        "topics": [
          "Theories of language acquisition in children - biological maturation, cognitive theories, linguistic theories, information processing theories, behavior theories, social interaction theories, pragmatic/ discourse theories",
          "Development of components of language from birth to two years (pre - linguistic/presymbolic to symbolic) Development of components of language during preschool period Development of components of language during early school age and beyond",
          "Language acquisition including bilinguals/ multilinguals - types (based on age, manner of acquisition, factors affecting language acquisition).",
          "Factors affecting language development in children including environmental factors like language environment and effects of neglect and abuse, socioeconomic status and biological factors like twins and multiple pregnancies, genetic factors etc."
        ]
      },
      {
        "title": "Language Disorders and their Characteristics",
        "topics": [
          "DSM 5 and ICD 10 classification of language disorders",
          "Definition, General characteristics, language characteristics, causes and co morbidities in the following conditions: • Hearing impairment • Intellectual disability • Syndromes associated with child language disorders - Down Syndrome, Fragile-X Syndrome, William’s Syndrome, Klinefelter’s Syndrome, • Autism Spectrum Disorders, • Specific language impairment/developmental language disorders, attention deficit hyperactive disorder • Acquired Childhood Aphasia • Learning disability • Other developmental disabilities: deaf -blind, cerebral palsy and multiple disabilities."
        ]
      },
      {
        "title": "Assessment of Children with Language Disorders",
        "topics": [
          "Preliminary components of assessment: Case history, screening, evaluation of environmental, linguistic & cultural variables.",
          "Methods to assess children with language disorder: Formal versus informal assessment; types of assessment materials: assessment scales, observational checklists, developmental scales; standardization, reliability, validity, sensitivity and specificity of test materials.",
          "Informal assessment-pre-linguistic behavior, play, mother -child interaction, language sampling: planning and collecting representative sample; strategies to collecting language sample, audio-video recording, transcription",
          "Analysis of language sample: Specific to various components of language such as phonology, morphology, syntax, semantics and pragmatics.",
          "Test materials for assessing language skills in English and Indian language, Assessment of Language Development, 3D Language Assessment Test, Linguistic Profile Test, Com-DEALL checklist",
          "Overview of tests used by psychologists for assessment of children with developmental delay and intellectual disability: e.g Madras Developmental Program Scale, Bayley’s Scale for infant and toddler development and others",
          "Overview of tests used by psychologists/ developmental and behavioral pediatricians for assessment and diagnosis of children with autism spectrum disorder: Modified - Checklist for Assessment of Autism in Toddlers, Indian Scale for Assessment of Autism (ISAA), INCLEN Diagnostic Tool, Autism Diagnostic Observation Schedule (ADOS)",
          "Overview of tests used by psychologists/ Developmental & Behavioral pediatricians for children with ADHD - DSM 5 checklist, Connors Rating scales and others",
          "Overview of tests for assessment of language for children with Acquired childhood aphasia (CAAST)",
          "Overview of tests for assessment of language and literacy for children with learning disability (Early Reading skills, Early Literacy Screening Test, NIMH battery for assessment of Learning Disability and others). Dyslexia assessment for languages in India (DALI) and others",
          "Documenting assessment results: diagnostic report, summary report and referral report specific to disorder.",
          "Differential diagnosis of language disorders in children."
        ]
      },
      {
        "title": "Management of Language Disorders in Children - I",
        "topics": [
          "General principles and strategies of intervention in children with language impairment-purpose of intervention, basic approaches to language intervention (developmental or normative approach, functional approach).",
          "Choice of language for intervention, incorporating principles of multiculturalism into treatment activities.",
          "Overview of approaches and techniques of intervention for to address language disorders in children with different developmental disorders",
          "Description and steps involved in specific language intervention techniques: Incidental teaching, self -talk, parallel talk, expansion, extension, recasting, joint routines, joint book reading, whole language, modifying linguistic input, communicative temptations drill, modeling, Focused stimulation, vertical structuring, milieu teaching, Redundancy, chunking."
        ]
      },
      {
        "title": "Management of Language Disorders in Children - II",
        "topics": [
          "Overview of Augmentative and alternative communication-types (aided and unaided) and application in child language disorders.",
          "Importance of team approach - Functions of professional team members like medical/ surgical/ Physiotherapy/ Occupational therapy/ psychologists etc.",
          "Importance and role of caregivers and family in intervention",
          "Benefits, concessions and rights for children with language disorders",
          "Use of technology and tele-rehabilitation in language intervention"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Bhatia, T. K. & Ritchie,W. C. (2014).Handbook of Bilingualism and multilingualism. 2nd Ed. East Sussex, Wiley Blackwell.",
      "Hegde, M. N. (2017). Assessment of Communication Disorders in Children: Resources and Protocols (3rd ed.). San Diego: Plural Publishing Group.",
      "Hegde, M.N. (2005). Treatment protocols for language disorders in children -V ol. 1 &2. San Diego: Plural Publishing",
      "Kaderavek, J. N. (2015). Language disorders in children: Fundamental concepts of assessment and intervention. 2nd Ed. USA: Pearson Education Inc.",
      "Norbury, P. R. & Courtenay F. (2012). Language Disorders from Infancy through Adolescence: Listening, Speaking, Reading, Writing, and Communicating. Missouri: Elsevier Mosby.",
      "Owens, R.E. (2008).Language development: An introduction (7th ed.).Boston: Pearsons.",
      "Paul, R., Norbury, C., & Gosse, C. (2018). Language disorders from infancy through adolescence: Listening, speaking, reading, writing, and communicating (5th ed.). St.Louis, MO: Mosby.",
      "Rout, N & Kamraj, P. (2014). Developing Communication -An Activity Book. A publication by NIEPMED, Chennai. Freelydownloadablefromhttp://niepmd.tn.nic.in/publication.php. ISBN 978 -81- 928032-41."
    ],
    "stream": "SLP",
    "kind": "Theory"
  },
  {
    "code": "B3.2",
    "type": "M",
    "semester": 3,
    "title": "Amplification Devices",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "assess candidacy for hearing aids and counsel accordingly",
      "evaluate the listening needs and select appropriate hearing aid",
      "program digital hearing aids as per the listening needs of the client",
      "assess the benefit from the hearing aid using subjective and objective methods",
      "take ear impression and prepare appropriate earmold",
      "counsel the parents/care givers at all stages, and",
      "make appropriate selection of assistive listening devices and advise the clients"
    ],
    "units": [
      {
        "title": "Types of Hearing Aids",
        "topics": [
          "Historical development of hearing aids: A brief overview",
          "Review of basic elements of hearing aids: Microphone, Amplifier, Receiver/vibrator, Cords, Batteries.",
          "Classification and Types of hearing aids: • Body level, Ear level, RIC, ITC, CIC, IIC, • Binaural, pseudo binaural, monaural • Analog, Programmable, trimmer digital and digital hearing aids • CROS hearing aids",
          "Group amplification: hard wired, induction loop, FM, infrared",
          "Assistive listening devices"
        ]
      },
      {
        "title": "Technological Aspects in Hearing Aids",
        "topics": [
          "Output limiting and issues related to them: peak clipping, compression",
          "Concept and use of compression in hearing aids: BILL, TILL, PILL, Wide Dynamic Range Compression, Syllabic Compression, Dual Compression",
          "Signal processing in hearing aids: Speech enhancing technology, Microphone directionality, Noise reduction algorithms",
          "Extended low frequency amplification, frequency lowering technology (transposition, compression).",
          "Digital wireless technologies & its application in hearing aids",
          "Recent advances in hearing aids"
        ]
      },
      {
        "title": "Electro-acoustic Measurements for Hearing Aids",
        "topics": [
          "Need for Electro-acoustic measurements",
          "Instrumentation of electro-acoustic measurements, Environmental tests",
          "Purpose and Parameters to be considered: OSPL90, SSPL90, HFA SSPL90, Gain, Full on Gain, HFA Full on Gain, Reference test Gain, Basic Frequency Response, Total Harmonic distortion, Intermodulation Distortion, input Output functions, instrumentation, procedure",
          "Variables affecting EAM, EAM of digital hearing aids",
          "National and International standards for hearing aids: BIS, IEC and ANSI"
        ]
      },
      {
        "title": "Selection and Programming of Hearing Aids",
        "topics": [
          "Pre-selection factors",
          "Selecting linear and nonlinear digital hearing aids",
          "Hearing aid selection using prescriptive procedures",
          "Hearing aid selection using comparative procedures",
          "Programming of hearing aids",
          "Over the counter hearing aids",
          "Care, maintenance and troubleshooting of hearing aids",
          "Counselling and orienting the hearing aid user and significant others"
        ]
      },
      {
        "title": "Mechano-acoustic Couplers (Ear moulds)",
        "topics": [
          "Different types of earmold",
          "Procedure for making hard moulds and soft mould.",
          "Applications of laser and 3d-printing for ear moulds, UV curing methods.",
          "Special modifications in the ear moulds: Vents (diagonal and parallel), deep canal moulds, short canal, horns, Libby horn, reverse horn, acoustic modifier.",
          "Effects of mechano-acoustic couplers on the hearing aid output."
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Dillon. (2012). Hearing Aids (2 edition). Thieme Medical and Scientific Publisher.",
      "Hall, J. W., & Mueller, H. G. (1998). Audiologists’ Desk Reference: Audiologic management, rehabilitation, and terminology. Singular Publishing Group.",
      "Kates, J. M. (2008). Digital Hearing Aids (1 edition). San Diego: Plural Publishing Inc.",
      "Metz, M. J. (2014). Sandlin’s Textbook of Hearing Aid Amplification: Technical and Clinical Considerations. Plural Publishing.",
      "Mueller, H. G., Hawkins, D. B., & Northern, J. L. (1992). Probe Microphone Measurements: Hearing Aid Selection and Assessment. Singular Publishing Group.",
      "Mueller, H. G., Ricketts, T. A., & Bentler, R. A. (2014). Modern Hearing Aids: Prefitting Testing and Selection Considerations. San Diego, CA: Plural Publishing Inc.",
      "Sandlin, R. E. (Ed.). (1989). Handbook of Hearing Aid Amplification: Clinical Considerations and Fitting Practices v. 2. Boston: Singular Publishing Group.",
      "Sandlin, R. E. (Ed.). (1993). Understanding Digitally Programmable Hearing AIDS. Boston: Allyn & Bacon."
    ],
    "stream": "Audiology",
    "kind": "Theory"
  },
  {
    "code": "B3.3",
    "type": "MC",
    "semester": 3,
    "title": "Electronics and Acoustics",
    "hours": "45",
    "marks": 75,
    "credits": "3",
    "objectives": [
      "identify the types of power supply for clinics and biomedical instruments",
      "understand the basic aspects of digital signal processing and speech processing",
      "state the theoretical basis of acoustics required for audiologists",
      "understand the basic aspects of information technology, and",
      "analyze the principles of working of major instruments used in assessment"
    ],
    "units": [
      {
        "title": "Introduction to Electronics and Signals",
        "topics": [
          "Basic principle of operation and working of • Variable resistors, digital potentiometers • Inductors, transformers • Amplifiers -concept of gain, Frequency response and bandwidth",
          "Power supply • DC power supply - block diagram description and working • AC power supply, earthing, isolation transformers • UPS",
          "Analog and digital signal • Decimal and Binary number system, conversion of decimal number to binary number, conversion of binary number to decimal number • Analog signal & digital signal-Representation and comparison • Converting analog signal to digital signal and digital to analog signal"
        ]
      },
      {
        "title": "Introduction to Acoustics",
        "topics": [
          "Physics of Sound • Nature and Propagation of sound • Frequency, wavelength, amplitude, velocity • Sound pressure level • Loudness, Phon, equal loudness contour",
          "Sound propagation in closed rooms • Reflection, transmission and absorption, absorption coefficient • Reverberation, reverberation time, Sabine’s formula, techniques to reduce reverberation time • Sources of background noise in a room, speech to noise ratio • Acoustically treated rooms - Basic requirements, concept and structure of rooms for hearing testing and sound recording.",
          "Transducers • Microphones- moving coil, condenser, electret etc • Loudspeakers, headphones, receivers - moving coil and balanced armature"
        ]
      },
      {
        "title": "Basics of Sound Recording, Signal Representation and Digital Signal Processing",
        "topics": [
          "Representation of sound signal and sound recording • Time domain • Frequency domain • Spectrogram • System and software for sound recording",
          "Fundamentals of digital signal processing (DSP) • Basic structure of a digital processing system • Analog signal processing vs. digital signal processing - Comparison, merits and demerits • Applications of DSP in communication sciences and disorder.",
          "Speech Processing • Time domain methods of speech processing • Frequency domain methods of speech processing"
        ]
      },
      {
        "title": "Introduction to Information Technology",
        "topics": [
          "Computer hardware • Processor, mother board, hard disk, RAM • Specification of personal computers and laptops",
          "Software • Operating systems-Types, comparison and functioning • Application software used in Communication Sciences and disorder • Mobile Apps-concept & functioning",
          "Computer networking • Structure of internet and worldwide web • Local Area Network -structure and components • Tele diagnosis & Tele rehabilitation"
        ]
      },
      {
        "title": "Instrumentation in Speech and Hearing",
        "topics": [
          "Common elements in instruments • Pre-amplifiers and Power amplifiers • Filters-role in signal processing, different types and their frequency response",
          "Principle of operation, technology of • Digital hearing aids • Group amplification and Assistive Listening Devices • Audiometers • Middle ear analyzers • Systems for speech and voice analysis",
          "Calibration of audiometers • Equipment for calibration - sound level meter, artificial ear, artificial mastoid, couplers • Equipment setup and procedure for output calibration of pure tone audiometer in AC and BC mode."
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Crocker, M. J. (1998) Handbook of Acoustics, John Wiley and sons Inc., New York, USA",
      "Dillon, H. (2012) Hearing Aids (2nd Edn), Thieme Publishers Inc., New York, USA",
      "http://niepmd.tn.nic.in/publication.php. ISBN 978-81-928032-1-0.",
      "Malvino. A., & Bates. D. (2015): Electronics principle (8th Edn): Mc Graw -Hill education.",
      "Moser, P. (2015). Electronics and Instrumentation for Audiologists. Psychology Press.",
      "Rout, N and Rajendran, S. (2014). Hearing aid trouble shooting and Maintenance, Published by National Institute for Empowerment of Persons with Multiple Disabilities, Chennai. Freely downloadable from",
      "Speaks, C. E. (1999). Introduction to Sound: Acoustics for the Hearing and Speech Sciences (3 edition.). San Diego: Cengage Learning.",
      "Udayashankara, V . (2022) Speech Signal Processing, I.K. International Pvt. Ltd. New Delhi"
    ],
    "stream": "Allied",
    "kind": "Theory"
  },
  {
    "code": "B3.4",
    "type": "MC",
    "semester": 3,
    "title": "Psychology for Speech and Hearing",
    "hours": "45",
    "marks": 75,
    "credits": "3",
    "objectives": [
      "explain the scope of clinical psychology and its significance for speech and hearing",
      "apply the concept of normality and abnormality to communication disorders",
      "describe the cognitive, motor, emotional and social development",
      "apply theories of learning and therapy techniques based on learning principles to communication problems",
      "understand the principles of neuropsychological assessment, and",
      "get exposed to the basics of counseling."
    ],
    "units": [
      {
        "title": "Introduction to Psychology and Clinical Psychology",
        "topics": [
          "Introduction, definition, history, schools and branches of psychology.",
          "Introduction to clinical psychology: Scope and meaning",
          "Historical development: Modern clinical psychology",
          "Scope and role of clinical psychology in communication sciences and disorders",
          "Criteria of normality and abnormality",
          "Models of mental disorders: biological, psychological social models"
        ]
      },
      {
        "title": "Assessment Procedures in Clinical Psychology",
        "topics": [
          "Case history and mental status examination - Summary of case history, diagnostic formulation and Diagnosis. Clinical interviewing. Clinical observation",
          "Introduction to psychological assessment and psychological testing - definition, differences and similarities.",
          "Types of psychological assessment.",
          "Assessment of cognitive and adaptive functions, personality: Behavioral and vocational assessment",
          "Classification of abnormal behavior: history, need and rationale of classification. Current classificatory system: DSM and ICD"
        ]
      },
      {
        "title": "Developmental psychology",
        "topics": [
          "Child and developmental psychology: definition and scope: Meaning of growth, development and maturation: Principles and stages of development",
          "Motor development: definition, principles, importance: Stages in motor development - early motor development, development during later childhood and adolescence, decline with age: Handedness",
          "Cognitive development: Piaget’s theory of cognitive development. Intelligence - evolutionary development of intelligence. Development of intelligence from early childhood to adolescence - decline with age.",
          "Emotional development - components of emotions, characteristics of emotional behaviors, Beginning and development of emotional behavior and patterns. Emotional changes through the life span.",
          "Social development - Definition of Social development, Socialization - meaning. Pattern of social development. Development and characteristic of social behavior and factors influencing it."
        ]
      },
      {
        "title": "Principles of Learning and Behavior Modification",
        "topics": [
          "Learning - definition and characteristics. Theories of learning: introduction, types - S-R theories, cognitive theories and mixed theories. Pavlov’s classical conditioning.",
          "Basic principles of learning - acquisition of CR, Extinction of CR, second order and higher order conditioning, generalization and discrimination Additional principles - Experimental neurosis, counter conditioning and cerebral conditioning",
          "Skinner’s operant conditioning - basics. Principles of operant conditioning - acquisition, elimination, maintenance of responses - operant generalization and discrimination. Factors influencing operant conditioning. Application of operant learning principles.",
          "Behavioral assessment and diagnosis - problem behavior assessment and skill behavior assessment.",
          "Therapeutic techniques based on learning principles. Skill behavior management. Problem behavior management"
        ]
      },
      {
        "title": "Neuropsychology and Counseling",
        "topics": [
          "Neuropsychology - scope. Neuropsychological tests and assessment",
          "Neuropsychological management - theories and types of neuropsychological rehabilitation.",
          "Application of neuropsychology in the field of speech and hearing",
          "Counseling: Differences and similarities between guidance, counseling, and psychotherapy",
          "Types of counseling: directive, non-directive, and eclectic counseling",
          "Characteristics of a good counselor. Do’s and don’ts in counseling"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Anastasi, A. (1999). Psychological testing, London: Freeman",
      "Baura, M (2004). Human Development and Psychology, Rehabilitation Council of India, New Delhi. ISBN: 81-7391-868-6",
      "Coleman J.C. Abnormal psychology and modern life, Taraporevala Sons and Co.",
      "Hurlock, E.B. (1981). Child development (VI Ed.). McGraw Hill International Book",
      "Kline, P. (1993). The Handbook of Psychological Testing. Routledge",
      "Lezak, M., Loring, D.W., and Hannay, H.J. (2004). Neuropsychological Assessment. Fourth Edition. New York: Oxford University Press",
      "Morgon C.T., King R.A., Robinson N.M. Introduction to Psychology. Tata McGraw Hill Publishing Co.",
      "Siegal M.G. (Ed). (1987). Psychological testing from early childhood through adolescence. International Universities Press."
    ],
    "stream": "Allied",
    "kind": "Theory"
  },
  {
    "code": "B3.5",
    "type": "MO",
    "semester": 3,
    "title": "Optional Minor 2",
    "hours": "15",
    "marks": 50,
    "credits": "1",
    "objectives": [],
    "units": [],
    "competencies": [],
    "reading": [],
    "stream": "Allied",
    "kind": "Optional Minor"
  },
  {
    "code": "B3.6",
    "type": "M",
    "semester": 3,
    "title": "Clinicals in Speech-language Pathology",
    "hours": "90+",
    "marks": 75,
    "credits": "3",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "Know",
        "items": [
          "Procedures to obtain a speech language sample for speech and language assessment from children of different age groups such as preschoolers, primary school and older age groups.",
          "Methods to examine the structures of the oral cavity/organs of speech.",
          "The tools to assess language impairment in children (with hearing impairment, specific language impairment, Intellectual disabilities, Autism Spectrum Disorders).",
          "Document test materials (Indian/ Western) used in the assessment of child language disorders."
        ]
      },
      {
        "level": "Know-how",
        "items": [
          "To evaluate speech and language components using informal assessment methods.",
          "To administer at least two standard tests for childhood language disorders.",
          "Differentially diagnose SLI, ASD, ADHD, and IDD",
          "Evaluate speech and language characteristics of childhood aphasia using available test tools."
        ]
      },
      {
        "level": "Show",
        "items": [
          "Demonstrate on how to perform a detailed interview of children with language disorders and their parents",
          "Evaluate the speech and language skills of children with delay in speech and language development using standardized test material.",
          "Diagnose ADHD and ASD using a standardized test tool.",
          "Diagnose learning disability using an available screening/ diagnostic tool.",
          "Demonstrate speech- language stimulation techniques and other approaches used for management of child language disorders and discuss its clinical applications.",
          "Use at least one evidence -based intervention approach/technique (including speech and language stimulation techniques) used for the treatment of children with language disorders in your therapy session and document the outcome.",
          "Record a conversation sample of toddler (2 -3 years), preschool (3 -5 years), and school-age (5 -6 years) children. Perform a language transcription and analyse for form, content, and use.",
          "Record mother -child interaction of typically developing children of different age groups. Compare linguistically the outputs from mother and child across the age groups. Make inferences on the socio-cultural influences in these interactions.",
          "Make a list of loan words in 2 familiar languages based on interaction with typically developing children from 2 to 10 years. Discuss the influence of bilingualism or multilingualism on vocabulary.",
          "Assessment of pre-linguistic skills-minimum of two children"
        ]
      },
      {
        "level": "Do",
        "items": [
          "Case history-minimum of three children with speech and language disorders.",
          "Oral peripheral examination- minimum of three children",
          "Language evaluation report - minimum of three children",
          "Evaluate children and adults with fluency disorders using protocol at your department/ institute and document the same.",
          "Plan and take therapy for children and adult with fluency disorders.",
          "Plan and take therapy for children with language disorder.",
          "Plan and prepare a low tech AAC device for children with language disorder."
        ]
      }
    ],
    "reading": [],
    "stream": "SLP",
    "kind": "Clinical"
  },
  {
    "code": "B3.7",
    "type": "M",
    "semester": 3,
    "title": "Clinicals in Audiology",
    "hours": "90+",
    "marks": 75,
    "credits": "3",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "Know",
        "items": [
          "Indications to administer special tests",
          "Protocols for screening and diagnostic otoacoustic emissions and their interpretation",
          "Characteristics of a good diagnostic and screening test",
          "Role of various tests in the test battery Knowhow",
          "Administration of at least 1 test for adaptation, recruitment and functional hearing loss.",
          "Administration of speech audiometry using various test material in open set and closed set mode",
          "Knowledge to change protocol for OAE according to specific case"
        ]
      },
      {
        "level": "Show",
        "items": [
          "Ability/knowledge to perform tests for identifying recruitment and adaptation",
          "Skills to record and interpret OAE",
          "Skills to counsel clients with functional hearing loss, cochlear and retrocochlear pathology based on test findings"
        ]
      },
      {
        "level": "Do",
        "items": [
          "Tone decay test - 2 individuals with sensori-neural hearing loss",
          "Administer tests for recruitment SISI, ABLB, MLB on 2 individuals with sensorineural hearing loss",
          "Obtain PIPB function for 5 persons with normal hearing and 2 persons with hearing loss",
          "Administer tests of functional hearing loss, Stenger test, Lombard test, Doerfler Stewart test on 2 individuals",
          "Record OAEs (TEOAEs and DPOAEs) on 5 persons with normal hearing and 5 persons with hearing loss Semester 4"
        ]
      }
    ],
    "reading": [],
    "stream": "Audiology",
    "kind": "Clinical"
  },
  {
    "code": "B4.1",
    "type": "M",
    "semester": 4,
    "title": "Structural Anomalies and Speech Sound Disorders",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "trace out normal speech sound development and classify speech sound disorders.",
      "perform phonological analysis and assessment of speech sound disorders.",
      "plan intervention for individuals with speech sound disorders.",
      "identify the types of clefts, assess and manage speech sound errors and feeding difficulties in individuals with cleft lip and palate",
      "identify the structural disorders of the tongue, jaws and explain their associated problems after glossectomy and mandibulectomy, and",
      "advise parents on feeding related issues in children with cleft lip and palate."
    ],
    "units": [
      {
        "title": "Speech Sound Development and its Disorders",
        "topics": [
          "Speech sound acquisition, Phonology & theories of phonological development",
          "Fundamentals of articulatory phonetics - phonetic description of vowels and consonants, distinctive features, acoustic theory of speech production, acoustic characteristics of vowels and consonants, coarticulation",
          "Speech sound disorders - terminologies, Incidence and Prevalence, causes, classification",
          "Factors related to speech sound disorders - cognitive-linguistic, psychosocial, metalinguistic, oral stereognosis, and associated problems"
        ]
      },
      {
        "title": "Phonological Analysis and Assessment of speech sound disorders",
        "topics": [
          "Speech sound sampling and other procedures for phonological analysis, Transcription",
          "OPME, analysis of speech sound errors",
          "Screening tools, diagnostic tests and assessment of speech intelligibility, speech sound discrimination, test battery",
          "Determining need for intervention, prognosis and factors influencing target selection"
        ]
      },
      {
        "title": "Management of Speech Sound Disorders",
        "topics": [
          "Basic principles and stages in therapy - target selection, treatment continuum - establishment, maintenance, generalization and stabilization",
          "Therapy approaches- Traditional, Motor based and cognitive linguistic based therapy approaches - evidence-based approaches and models",
          "Use of technology for SSD intervention",
          "Adapting approaches to individuals from culturally and linguistically diverse backgrounds, Role of family in intervention"
        ]
      },
      {
        "title": "Speech Characteristics, Assessment and Management of Cleft Lip and Palate",
        "topics": [
          "Speech",
          "Types, characteristics and classification of cleft lip and palate, Causes of cleft lip and palate: genetic, syndrome and others",
          "Velopharyngeal inadequacy: types, causes and classification, associated problems in persons with cleft lip and palate: speech, language, feeding, dental and occlusion, hearing, psychological",
          "Team approach, Assessment of cleft speech, subjective assessment, speech intelligibility, Objective assessment of resonance and articulatory features and reporting test results using Universal Parameters",
          "Management of cleft lip and palate: Surgical and prosthetic management, Techniques and strategies to correct speech sound disorders, Techniques and strategies to improve feeding, counselling and guidance"
        ]
      },
      {
        "title": "Structural Anomalies of Tongue and Mandible - Characteristics, Assessment and",
        "topics": [
          "Management",
          "Types, classification and characteristics of structural anomalies of tongue and mandible, causes for structural anomalies of tongue and mandible",
          "Associated problems in persons with structural anomalies of tongue and mandible: Speech, Feeding, Dental and occlusion Psychological and others",
          "Team of professionals in assessment and management of persons with structural anomalies of tongue and mandible and their roles.",
          "Management of persons with structural anomalies of tongue and mandible: Surgical and prosthetic management, Techniques and strategies to improve speech intelligibility, Techniques and strategies to improve feeding, counselling and guidance"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Bauman-Waengler, J. (2016). Articulation and phonology in speech sound disorders (5thed.). Ocean View School District, Oxnard, California.",
      "Bauman-Wängler, J. A., & Garcia, D. (2020). Phonological treatment of speech sound disorders in children: A practical guide. Plural Publishing.Berkowitz. S. (2001). Cleft Lip and Palate: Perspectives in Management. V ol II. Singular Publishing Group. Inc.",
      "Bowen, C. (2014). Children's speech sound disorders (2nded.). Wiley-Blackwell.",
      "Ginette, P. (2014). Speech Therapy in Cleft Palate and Velopharyngeal Dysfunction. Guildford, J & R Press Ltd.",
      "Jaso Noemi., & Ana Maria D Cruz, ( 2013) . Cleft lip and Palate :Etilogy, Surgery and Repair and Sociological Consequences , Nova Science Publisher , Inc",
      "Kahn, A. (2000). Craniofacial Anomalies: A Beginner’s Guide For Speech Language Pathologists. Singular Publishing Group. California.",
      "Karlind, M. & Leslie, G. (2009). Cleft Lip and Palate: Interdisciplinary Issues and Treatment. Texas, Pro Ed.",
      "Kummer, A.W. (2014). Cleft Palate and Craniofacial Anomalies: The Effects on Speech and Resonance. Delmar, Cengage Learning."
    ],
    "stream": "SLP",
    "kind": "Theory"
  },
  {
    "code": "B4.2",
    "type": "M",
    "semester": 4,
    "title": "Diagnostic Audiology - Advanced",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "explain the concept of immittance and its clinical implications",
      "perform immittance evaluation",
      "describe the various auditory evoked potentials and record them",
      "explain central auditory processing and conduct tests to assess the same",
      "assess tinnitus and hyperacusis, and",
      "carry out screening for vestibular disorders"
    ],
    "units": [
      {
        "title": "Immittance Evaluation",
        "topics": [
          "Principle of immittance evaluation: Concept of impedance, admittance and their components",
          "Tympanometry: definition, measurement procedure, response parameters, their measurement and normative, classification of tympanogram, clinical significance of tympanometry",
          "Eustachian tube functioning tests of tympanometry: Principle and tests - Valsalva, Toynbee, William’s pressure swallow, inflation-deflation test.",
          "Overview of multicomponent and multi -frequency tympanometry, wide band reflectance and wide band tympanometry",
          "Reflexometry: definition, acoustic reflex pathway, measurement procedure, clinical applications of acoustic reflexes, special tests"
        ]
      },
      {
        "title": "Auditory Evoked Potentials (AEPs): Auditory Brainstem",
        "topics": [
          "Introduction and classification of AEPs",
          "Instrumentation and principles of AEP recording techniques",
          "Auditory brainstem response generators",
          "Protocol and procedure of recording auditory brainstem response",
          "Factors affecting auditory brainstem responses",
          "Clinical applications of ABR"
        ]
      },
      {
        "title": "Overview of other AEPs and their Clinical Applications",
        "topics": [
          "Electrocochleography (ECochG)",
          "Auditory Middle Latency Responses (AMLR)",
          "Auditory Long Latency Responses (Obligatory responses)",
          "Other long latency potentials such as P300, MMN, P600, N400, T-complex, CNV)",
          "Auditory Steady State Responses (ASSR)",
          "Brainstem responses to speech and other complex signals"
        ]
      },
      {
        "title": "Assessment of Central Auditory Processing Disorder (CAPD)",
        "topics": [
          "Definition of (CAPD, processes involved in auditory processing.",
          "Behavioral and clinical indicators of central auditory processing disorders",
          "Principles and rationale of test to identify central auditory processing disorders (concept of redundancy, bottleneck and subtlety principles",
          "Monaural low redundancy tests, Dichotic speech tests, Binaural interaction tests, Tests of Temporal processing, testing of binaural integration and binaural separation",
          "Interpretation of tests used for assessment of CAPD (site of lesion, processes involved), Team involved in assessment and management of CAPD"
        ]
      },
      {
        "title": "Test to Diagnose other Disorders: Tinnitus, Hyperacusis and Vestibular disorders",
        "topics": [
          "Overview on other systems involved in balance , Vestibular ocular reflex and vestibulo spinal reflex",
          "Signs and Symptoms of vestibular disorders, Team in the assessment and management of vestibular disorders",
          "Screening for vestibular disorders",
          "Overview of tests used for assessment of tinnitus - Pitch matching, loudness matching, residual inhibition, Feldman masking curves",
          "Assessment of hyperacusis and related disorders - questionnaires, Johnson Hyperacusis Dynamic Range Quotient"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Bellis, T.J. (2011). Assessment and Management of Central Auditory Processing Disorders in the Educational Setting: From Science to Practice. (2nd edition). Plural Publishing, Inc.",
      "Beukes, E.W., Andersson, G., Manchaiah, V ., & Kaldo, V . (2021). Cognitive Behavioral Therapy for Tinnitus. Plural Publishing, Inc.",
      "Deshpande, A.K., & Hall, J.W. (2022). Tinnitus: Advances in Prevention, Assessment, and Management. Plural Publishing, Inc.",
      "Durrant, J. D., Fowler, C. G., Ferraro, J. A., & Purdy, S. C. (2022). Basic Concepts of Clinical Electrophysiology in Audiology. Plural Publishing Inc.",
      "Hatzopoulos, S., Ciorba, A., & Krumm, M. (2020). Advances in audiology and hearing science. Apple Academic Press.",
      "Honaker, J.A. (2020). Diagnostic Vestibular Pocket Guide: Evaluation of Dizziness, Vertigo, and Imbalance. Plural Publishing Inc.",
      "Katz, J., Chasin, M., English, K., Hood, L.J & Tillery, K.L. (2019). Handbook of Clinical Audiology. (7th edition). Wolters Kluwer.",
      "Kimball, S.H., & Fagelson, M. (2022). Tinnitus and Sound Sensitivity Casebook. Thieme."
    ],
    "stream": "Audiology",
    "kind": "Theory"
  },
  {
    "code": "B4.3",
    "type": "MC",
    "semester": 4,
    "title": "Neurology",
    "hours": "45",
    "marks": 75,
    "credits": "3",
    "objectives": [
      "the basic concepts, functional anatomy and physiology of nervous system related to speech and hearing",
      "neural organization - different structures and functions of various systems",
      "neurosensory and neuromotor controls in speech, language and hearing mechanisms",
      "cerebral plasticity and dominance and its relevance for speech, language and hearing disorders",
      "various neural diseases, lesions, nutritional and metabolic conditions affecting speech, language and hearing",
      "basic principles and assessment procedures used in speech, language and hearing disorders associated with neurological conditions, and",
      "basic principles and management procedures used in speech, language and hearing disorders associated with neurological conditions"
    ],
    "units": [
      {
        "title": "Functional Anatomy of the Nervous System",
        "topics": [
          "General introduction to basic neurological concepts",
          "Organization of the neural system",
          "Central, peripheral and autonomic neural system",
          "Neural structures - applied anatomy and physiology",
          "Cranial nerves and those important for speech, language, hearing and balance",
          "Cerebral blood supply, nourishment and protection of the brain",
          "General principles of neural organization",
          "Transmission of information in neural system - nerve fibers, synaptic transmission, action potential, chemical transmission, excitatory and inhibitory potential & neuromuscular transmission",
          "Cerebral plasticity and development of neural plasticity and cerebral dominance"
        ]
      },
      {
        "title": "Neurophysiology of Speech and Hearing Processes",
        "topics": [
          "Neurosensory organization of speech and hearing",
          "Central auditory nervous system",
          "Anatomy of oral sensation and oral sensory receptors",
          "Neuromotor control of speech",
          "The pyramidal, extra-pyramidal system, basal ganglia and cerebellar system",
          "Lower and upper motor neuron, Alpha and gamma motor neurons",
          "Sensory and motor examination, oral, peripheral and other reflexes",
          "Swallowing mechanism and neural control",
          "Screening and bedside neurological examination"
        ]
      },
      {
        "title": "Neural Disorders Associated with speech and hearing disorders - I",
        "topics": [
          "Neural infections - meningitis, encephalitis",
          "Developmental anomalies - spinal cord defects, syringomalacia and bulbia, Arnold Chiari malformations",
          "Hydrocephalus - source and circulation of CSF, types and etiopathogenesis",
          "UMN lesions -spastic dysarthria",
          "LMN lesions -flaccid dysarthria",
          "Mixed lesions",
          "Extra pyramidal lesions - dyskinetic dysarthria",
          "Cerebellum and cerebellar pathway lesions - ataxic dysarthria",
          "Other diverse lesions and dysarthria"
        ]
      },
      {
        "title": "Neural Disorders Associated with Speech And Hearing Disorders - II",
        "topics": [
          "Cerebrovascular diseases - ischemic brain damage - hypoxic ischemic encephalopathy, cerebral infarction - intracranial hemorrhage - intracranial, subarachnoid",
          "Trauma to the CNS - subdural hematoma, epidural hematoma, parenchymal brain damages",
          "Demyelinating diseases - multiple sclerosis, perivenous encephalomyelitis, Dementia",
          "Degenerative, metabolic and nutritional disorders - Alzheimer’s disease, Parkinsonism",
          "Metabolic, hereditary, acquired, neuronal storage disorders",
          "Wilson’s disease, Phenylketonuria",
          "Nutritional - Wernicke’s encephalopathy, pellagra",
          "Alcoholic cerebellar degeneration",
          "Clinical-pathological methods and Neuro-imaging",
          "Tumors of the CNS - gliomas, embryonal tumors of meninges, metastasis, malignant tumors"
        ]
      },
      {
        "title": "Speech-language and Swallowing Disorders",
        "topics": [
          "Central language mechanism and its disorders",
          "Developmental motor speech disorders - cerebral palsy, muscular dystrophy",
          "Neurologic disorders with primitive reflexes, diagnosis and management",
          "Clinical neurological syndromes associated with speech and language disorders",
          "Childhood language disorders associated with neurologic disorders",
          "Dysphagia in neurogenic disorders and assessment of mastication and deglutition",
          "Agnosia and other conditions associated with speech and hearing disorders",
          "Cognitive disorders associated with neurologic disorders",
          "General management principles and options for childhood neurogenic speech, language and hearing disorders",
          "General management principles and options for adult neurogenic speech, language and hearing disorders"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Andreatta, Richard D., (2020). Neuroscience fundamentals for communication sciences and disorders. San Diego, CA: Plural Publishing",
      "Bhatnagar, S.C. (2012). Neuroscience for the Study of Communicative Disorders. Lippincott, Williams & Wilkins",
      "Blake, Margaret Lehman, Hoepner, Jerry K., (2023). Clinical neuroscience for communication disorders: Neuroanatomy and neurophysiology. San Diego, CA: Plural Publishing, Inc.",
      "Duffy, J. R. (2020). Motor Speech Disorders: Substrates, Differential Diagnosis, and Management (4th Ed.). University of Michigan, Elsevier Mosby.",
      "Leonard L. LaPointe, (2019). Atlas of Neuroanatomy for Communication Science and Disorders. Thieme Publishers New York.",
      "Robert H. Brookshire; Malcolm R. McNeil, (2014). Introduction to Neurogenic Communication Disorders. Elsevier Mosby.",
      "Ryan Splittgerber, (2019) Snell’s Clinical Neuroanatomy (8th Ed.). Wolters Kluwer.",
      "Seikel, John A., Konstantopoulos, Kostas, Drumright, David G., (2020). Neuro anatomy and Neurophysiology for Speech and Hearing Sciences. Plural Publishing, Inc."
    ],
    "stream": "Allied",
    "kind": "Theory"
  },
  {
    "code": "B4.4",
    "type": "MC",
    "semester": 4,
    "title": "Research Methods and Statistics",
    "hours": "45",
    "marks": 75,
    "credits": "3",
    "objectives": [
      "be able to understand the nature and importance of research in the field of audiology and speech-language pathology",
      "be exposed to the basics of design and execution of research",
      "learn the basic statistical tools, and",
      "understand the ethical guidelines for conducting research on humans"
    ],
    "units": [
      {
        "title": "Introduction to Research Methods",
        "topics": [
          "Meaning and purpose of research: meaning",
          "Need for research in audiology and speech-language pathology",
          "Funds/grants for research",
          "Steps in research: identification, selection",
          "Formulation of research questions: aims, objectives, statement of problem, hypothesis",
          "Types of variables; types of sampling procedures (random and non-random)",
          "Types/ methods of data collection and their advantages and disadvantages",
          "Reliability and validity (internal and external validity)"
        ]
      },
      {
        "title": "Research Design in Audiology and Speech-language Pathology",
        "topics": [
          "Types of research: survey, ex-post facto research, normative research, standard -group comparison",
          "Experimental and quasi experimental research: group design & single subject design",
          "Internal and external validity of research",
          "Between groups vs. repeated measures design",
          "Documentation of research: scientific report writing, different formats or styles (APA, AMA and MLA)",
          "Ethics of research"
        ]
      },
      {
        "title": "Introduction to Statistics and Data Collection",
        "topics": [
          "Application of statistics in the field of audiology and speech-language pathology.",
          "Scales of measurement: nominal, ordinal, interval, ratio",
          "Classification of data: class intervals, continuous and discrete measurement",
          "Normal distribution: general properties of normal distribution, theory of probability",
          "Variants from the normal distribution: skewness and kurtosis",
          "Measure of central tendency: mean, median, mode",
          "Measures of variability: range, deviation (average and standard deviation), variance"
        ]
      },
      {
        "title": "Statistics and Research Designs",
        "topics": [
          "Choosing statistics for different research designs",
          "Correlational techniques: Pearson’s Product Moment Correlation Coefficient; Spearman’s Rank order correlation coefficient",
          "Statistical inference: concept of standard error and its use; the significance of statistical measures; testing the significance of difference between two means z -test, t-test; analysis of variance, post hoc tests",
          "Non-parametric tests: Chi-square test, Wilcoxon test, Mann-Whitney U test",
          "Reliability and validity of test scores: reliability and validity, Item analysis",
          "Analysis of qualitative data",
          "Software for statistical analysis"
        ]
      },
      {
        "title": "Epidemiology",
        "topics": [
          "Basic epidemiologic concepts and principles",
          "Epidemiologic data sources and measurements",
          "Epidemiologic methods - questionnaire survey, screening, personal survey, testing",
          "Media - their advantages and disadvantages",
          "Incidence and prevalence of hearing, speech, language disorders as per different census (NSSO, WHO) Recommended reading",
          "Dane F. C. (2011). Sampling and Measurement. In Evaluating research: Methodology for people who need to read research. New Delhi: SAGE publication.",
          "David L. Irwin, Norman J. Lass, Mary Pannbacker, Mary Ellen Tekieli Koay, Jennifer S. Whited (2020). Clinical research methods in speech -language pathology and audiology (3rd Edition), San Diego, CA : Plural Publishing.",
          "Field, A. Discovering Statistics Using IBM SPSS (4th ed.). SAGE Publications.",
          "Hegde M. N. (2024). A course book on Scientific and professional writing for speech language pathology (6th Edition), San Diego, CA: Plural Publishing, Inc.",
          "Hegde, M. N. (2021). Clinical research in communicative disorders: Principles and strategies. (4th Edition), San Diego, CA: Plural Publishing.",
          "Hesse-Biber, S. N. & Leavy, P. (2011). The Ethics of social research. In the Practice of qualitative research. (2nd Edition), New Delhi: SAGE publication.",
          "Lauren K. Nelson, Jaimie L. Gilbert (2021). Research in Communication Sciences and Disorders: Methods for Systematic Inquiry. (4th Edition), San Diego, CA: Plural Publishing."
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Dane F. C. (2011). Sampling and Measurement. In Evaluating research: Methodology for people who need to read research. New Delhi: SAGE publication.",
      "David L. Irwin, Norman J. Lass, Mary Pannbacker, Mary Ellen Tekieli Koay, Jennifer S. Whited (2020). Clinical research methods in speech -language pathology and audiology (3rd Edition), San Diego, CA : Plural Publishing.",
      "Field, A. Discovering Statistics Using IBM SPSS (4th ed.). SAGE Publications.",
      "Hegde M. N. (2024). A course book on Scientific and professional writing for speech language pathology (6th Edition), San Diego, CA: Plural Publishing, Inc.",
      "Hegde, M. N. (2021). Clinical research in communicative disorders: Principles and strategies. (4th Edition), San Diego, CA: Plural Publishing.",
      "Hesse-Biber, S. N. & Leavy, P. (2011). The Ethics of social research. In the Practice of qualitative research. (2nd Edition), New Delhi: SAGE publication.",
      "Lauren K. Nelson, Jaimie L. Gilbert (2021). Research in Communication Sciences and Disorders: Methods for Systematic Inquiry. (4th Edition), San Diego, CA: Plural Publishing.",
      "Meline, T. (2010). A research primer for communication sciences and disorders. Singapore: Pearson publication."
    ],
    "stream": "Allied",
    "kind": "Theory"
  },
  {
    "code": "B4.5",
    "type": "MO",
    "semester": 4,
    "title": "Optional Minor 3",
    "hours": "15",
    "marks": 50,
    "credits": "1",
    "objectives": [],
    "units": [],
    "competencies": [],
    "reading": [],
    "stream": "Allied",
    "kind": "Optional Minor"
  },
  {
    "code": "B4.6",
    "type": "M",
    "semester": 4,
    "title": "Clinicals in Speech-language Pathology",
    "hours": "90+",
    "marks": 75,
    "credits": "3",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "Know",
        "items": [
          "Document the age of acquisition of speech sounds and phonological awareness skills in different languages.",
          "Document the patterns of phonological processes in various languages.",
          "Prepare a list of feeding postures and feeding appliances (illustrations and images) used for infants with cleft lip and palate.",
          "Prepare a list (with images) of various types of prosthesis used in the management of cleft of lip and palate.",
          "Document the government programs available for rehabilitation of children with cleft lip and palate."
        ]
      },
      {
        "level": "Know-how",
        "items": [
          "Administer and interpret deep test of articulation in different languages.",
          "Use software/ instruments used for assessment and management of speech sound disorders and structural anomalies.",
          "Differentially diagnose the speech characteristics of articulation disorder and phonological disorder.",
          "Differentially diagnose the speech of children with hearing impairment, cleft lip and palate, developmental apraxia of speech and developmental dysarthria.",
          "Differences in the speech characteristics of children with cleft of lip, cleft of palate, cleft of lip and palate and submucous cleft.",
          "Identify various compensatory and obligatory errors in recorded samples of individuals with cleft lip and palate.",
          "Identify the type of closure of velopharyngeal port for individuals with and without cleft lip and palate from videos of nasoendoscopy/ videofluroscopy.",
          "Identify the type of glossectomy from images."
        ]
      },
      {
        "level": "Show",
        "items": [
          "Demonstrate how to perform a detailed interview for individuals with speech sound disorders.",
          "Demonstrate how to perform a detailed interview for individuals with structural anomalies.",
          "Demonstrate the procedure for oral peripheral mechanism examination. Compare the differences in typical children and children with speech sound disorders.",
          "Perform independent analysis (consonant - vowel inventory, syllable word shapes inventory, and syllable stress patterns inventory) of speech samples of typically developing children of different ages (2-6 years).",
          "Perform relational analysis of speech samples of typically developing children of different ages (2-6 years).",
          "Administer and interpret the results of articulation test on children with speech sound disorders.",
          "Record a speech sample of typically developing children in the age group - birth to 1 year, 1 -2 years, 2 -3 years, 3 -4 years and 5 years and document the speech sound errors and phonological processes present in them.",
          "Assess oral mechanism, speech sound errors and speech intelligibility in children with speech sound errors and cleft lip and palate.",
          "Demonstrate phonetic placement for management of speech sound disorders.",
          "Demonstrate techniques for management of phonological disorders.",
          "Examine the oral structures of individuals with cleft lip and palate and document the structures using Modified Y-strip classification.",
          "Rate nasality, speech intelligibility, and document the articulatory errors from speech samples of individuals with cleft lip and palate.",
          "Use universal parameters to assess and document the speech characteristics of individuals with cleft lip and palate.",
          "Determine the acoustic characteristics of consonants and vowels using PRAAT and compare the differences in these features across these speech sounds."
        ]
      },
      {
        "level": "Do",
        "items": [
          "Record and transcribe speech samples of children with speech sound disorders and analyse the speech characteristics.",
          "Prepare an oromotor kit for oral peripheral mechanism examination.",
          "Evaluate children and adults with child language disorders using protocol at your department/ institute and document the same.",
          "Plan and provide speech therapy for children with speech sound disorders.",
          "Plan and provide speech therapy for children with cleft of lip and palate."
        ]
      }
    ],
    "reading": [],
    "stream": "SLP",
    "kind": "Clinical"
  },
  {
    "code": "B4.7",
    "type": "M",
    "semester": 4,
    "title": "Clinicals in Audiology",
    "hours": "90+",
    "marks": 75,
    "credits": "3",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "Know",
        "items": [
          "Types of hearing aids",
          "Procedures/protocol to assess listening needs",
          "National and international standards on electroacoustic characteristics of hearing aids Knowhow",
          "Skills to program digital hearing aids",
          "Counsel hearing aid user regarding the use and maintenance hearing aids",
          "Skills to troubleshoot hearing aids",
          "Skills to select different types of ear molds depending on the type of hearing aid, client, degree, type, and configuration of hearing loss"
        ]
      },
      {
        "level": "Show",
        "items": [
          "Electroacoustic measurement as per BIS standard on at least 2 hearing aids",
          "How to process 2 hard and 2 soft molds",
          "How to preselect hearing aid depending on listening needs and audiological findings on at least 5 clinical situations (case files)",
          "How select test battery depending on case history and basic audiological information"
        ]
      },
      {
        "level": "Do",
        "items": [
          "Trouble shooting and fine tuning of hearing aids on at least 5 older adults",
          "Counsel 3 hearing aid users/care takers regarding use, care and maintenance of hearing aids",
          "Programming of hearing aid on at least 5 clients",
          "Make Earmolds for at least 3 clients",
          "Assess benefit from hearing aids/assistive listening devices for 5 clients Semester 5"
        ]
      }
    ],
    "reading": [],
    "stream": "Audiology",
    "kind": "Clinical"
  },
  {
    "code": "B5.1",
    "type": "M",
    "semester": 5,
    "title": "Voice Disorders and Laryngectomy",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "explain the basic concepts of voice including classification of different voice disorders",
      "assess and diagnose different voice disorders",
      "manage voice disorders through therapy",
      "assess the needs of persons with laryngectomy and plan management strategies, and",
      "counsel persons with dysphonia and their family members"
    ],
    "units": [
      {
        "title": "Basic concepts in voice and its production",
        "topics": [
          "Definition and functions of voice; Parameters of voice",
          "Anatomy and physiology of respiratory system for phonation; Laryngeal anatomy - Structural support, muscles, vocal fold microstructure, blood supply, and innervations - Aerodynamic myo-elastic theory of voice production",
          "Voice mechanics - Physiologic, acoustic and aerodynamic correlates of voice",
          "Pitch and loudness changing mechanism, voice registers and voice quality; Vocal tract resonance and voice quality",
          "Development of voice: Birth to senescence"
        ]
      },
      {
        "title": "Characteristics and pathophysiology of voice disorders",
        "topics": [
          "Definition of voice disorder, pathologies of the laryngeal mechanism: classification of voice disorders, incidence, and prevalence",
          "Aetiology of voice disorders: Phonotraumatic vocal behaviours, medical related etiologies, primary disorder etiologies and personality related etiologies",
          "Non-organic voice disorders: functional disorders, psychosomatic- functional aphonia and physiological- Phonotrauma, puberphonia",
          "Congenital voice disorders",
          "Neurological voice disorders",
          "Voice problems in systemic illnesses and endocrine disorders",
          "Voice problems in transgenders and elderly",
          "Voice problems in professional voice users: teachers and singers"
        ]
      },
      {
        "title": "Assessment of voice disorders",
        "topics": [
          "Referral sources, medical examination and team approach",
          "Protocol for voice assessment: components and philosophies (ICF, ICD)",
          "Clinical voice laboratory: principles of instrumental measurements - recording of data and storage; patented soft wares, free wares",
          "Perceptual evaluation of voice: GRBAS, CAPE -V",
          "Visualization procedures- indirect laryngoscopy, video laryngoscopy, stroboscopy & high speed imaging",
          "Acoustic analysis of voice: F0 related measures, intensity related measures, quality related measures, phonetogram, DSI, non-linear analysis",
          "Electroglottography and inverse filtering procedures",
          "Aerodynamic analysis of voice",
          "Self-evaluation of voice: PROM, VHI, V-DOP, VFI",
          "Reporting of voice findings, normative comparisons, differential diagnosis"
        ]
      },
      {
        "title": "Management of voice disorders",
        "topics": [
          "Voice therapy orientation: Principles, goal setting and approaches",
          "Vocal hygiene and preventive counselling",
          "Symptomatic voice therapy",
          "Psychological approaches to voice therapy",
          "Physiological approach",
          "Holistic voice therapy approaches",
          "Eclectic voice therapy approach",
          "Medical and surgical treatment for voice disorders; Post-operative care",
          "Professional voice care"
        ]
      },
      {
        "title": "Laryngectomy",
        "topics": [
          "Causes, symptoms and classifications of laryngeal cancers",
          "Multidisciplinary team in the management of persons with laryngeal cancer",
          "Surgery for laryngeal cancers: types and outcome",
          "Assessment of speech and communication skills of laryngectomee individuals: Pre and post-operative considerations",
          "Esophageal speech: candidacy, types of air intake procedures, speech characteristics, complications and contraindications.",
          "Tracheoesophageal speech: candidacy, types of TEP, fitting of prosthesis, speech characteristics, complications and contraindications.",
          "Artificial larynx: types, factors for selection, output characteristics, techniques for efficient use of artificial larynx, complications and contraindications.",
          "Other remedial procedures: Pharyngeal speech, buccal speech, ASAI speech, gastric speech."
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Behrman, A., Haskell, J. (2019). Exercises for Voice Therapy: Third Edition. United States: Plural Publishing, Incorporated.",
      "Boone, D. R., McFarlane, S. C., V on Berg, S. L. & Zraick, R, I. (2014): The Voice and Voice Therapy. (9th Ed.). Englewood Cliffs, Prentice-Hall, Inc. New Jersy.",
      "Makiyama, K., & Hirano, S. (Eds.). (2017). Aging voice (No. 25703). Springer Singapore.",
      "Martin, S. (2017). Working with Voice Disorders: Theory and Practice. United Kingdom: Taylor & Francis.",
      "Rosen, D. C., Sataloff, J. B., Sataloff, R. T. (2020). Psychology of Voice Disorders. United States: Plural Publishing, Incorporated.",
      "Sapienza, C., Hoffman, B. (2020). Voice Disorders. United States: Plural Publishing, Incorporated.",
      "Sataloff, R. T. (2017). Treatment of Voice Disorders, Second Edition. United States: Plural Publishing, Incorporated.",
      "Stemple, J. C., Roy, N., & Klaben, B. (2020). Clinical Voice Pathology: Theory & Management (6th Ed.). San Diego: Plural publishers."
    ],
    "stream": "SLP",
    "kind": "Theory"
  },
  {
    "code": "B5.2",
    "type": "M",
    "semester": 5,
    "title": "Motor Speech Disorders in Children",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "identify neuro-developmental processes in speech production",
      "explain the terminologies, classification and characteristics of cerebral palsy and other motor speech disorders in children",
      "assess motor speech disorders in children, and differentiate it from other associated / related disorders",
      "plan management for the affected pediatric clinical population with dysarthria and apraxia of speech, and",
      "plan strategies to assess and manage feeding and swallowing problems in children"
    ],
    "units": [
      {
        "title": "Neuro-developmental processes in speech production and introduction to motor",
        "topics": [
          "speech disorders ` a) Development of neural pathways of speech motor control (brain maturation, reflexes, sensory and motor)",
          "Sensory-motor integration of speech production (Spatial -temporal planning, motor planning, and feedback)",
          "Dysarthria in children: Definition, etiology, characteristics, and associated problems • Cerebral palsy: Spastic, Flaccid, Hyperkinetic, Hypokinetic, and Ataxia • Lower motor neuron and other syndromes associated with motor speech disorders",
          "Childhood apraxia: Definition, etiology, types, and characteristics. • Childhood apraxia of speech • Nonverbal oral apraxia"
        ]
      },
      {
        "title": "Assessment of motor speech disorders in children",
        "topics": [
          "Case history, developmental neurological evaluation - primitive postural and oro - pharyngeal reflexes, cranial nerve examination, and oral peripheral mechanism examination",
          "Behavioral assessment - Tasks, observations, and measures of speech sub -systems (Respiration, phonation, articulation, speech intelligibility, comprehensibility, fluency, and prosody)",
          "Cognitive-linguistic assessment, assessment of language and speech skills with specific reference to Phonetic and phonemic inventory, phonotactics and syllable sequencing, variability of errors, speech intelligibility, and prosody. Formal protocols/checklists, screening tests/ protocols specific to Indian languages for childhood apraxia of speech",
          "Differential diagnosis- childhood dysarthria, childhood apraxia of speech, and other developmental disorders"
        ]
      },
      {
        "title": "Management of childhood dysarthria",
        "topics": [
          "Team approach in rehabilitation of motor speech disorders in children",
          "Behavioral management of speech subsystem- respiratory, phonatory, resonatory, and articulatory subsystems",
          "Prosthetic management in the treatment of childhood dysarthria",
          "AAC in the management of childhood dysarthria",
          "Case studies: Planning intervention for children with dysarthria including language intervention"
        ]
      },
      {
        "title": "Management of childhood apraxia of Speech",
        "topics": [
          "Principles of motor learning",
          "Integral stimulation - dynamic temporal cueing",
          "Multisensory and tactile cueing techniques (moto kinesthetic speech training, sensory- motor approach, PROMPTS, Touch cue method, and speech facilitation)",
          "Gestural cueing techniques (signed target phoneme therapy, adapted cueing techniques, cued speech, visual phonics, and Jordon’s gestures)",
          "Cognitive/conceptual/ linguistic /phonological remedial approaches - phonotactics",
          "Other approaches: melodic intonation therapy, multiple phonemic approaches, instrumental feedback, vowel and diphthong remediation techniques, and Nancy Kauffman’s speech praxis treatment kit",
          "AAC in the management of childhood apraxia of speech",
          "Case studies: Planning intervention for childhood apraxia of speech"
        ]
      },
      {
        "title": "Feeding and swallowing disorders in children",
        "topics": [
          "Phases of swallowing, neural control of swallowing, and reflexes related to swallowing",
          "Causes, signs, and symptoms of dysphagia in children",
          "Feeding and swallowing assessment -neural developmental assessment, cranial nerve examination, oral peripheral mechanism examination, clinical swallow examination, nutritive and non-nutritive assessment, and instrumental assessment.",
          "Feeding and swallowing treatment - positioning, oral -motor treatment, team approach, non-oral feeding, transitional feeding, and modifications in feeding."
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Arvedson, J. C., Lefton -Greif, M. A. (2017). Pediatric Swallowing and Feeding: Assessment and Management, Third Edition. United States: Plural Publishing, Incorporated.",
      "Cummings, L. (2016). Case Studies in Communication Disorders. United Kingdom: Cambridge University Press.",
      "Duffy, J. R. (2019). Motor Speech Disorders: Substrates, Differential Diagnosis and Management, Fourth Edition. E-Book. Elsevier Health Sciences.",
      "Fish, M. A. (2015). Here's How to Treat Childhood Apraxia of Speech, Second Edition. United States: Plural Publishing, Incorporated.",
      "Freed, D. B. (2023). Motor Speech Disorders: Diagnosis and Treatment, Fourth Edition. United States: Plural Publishing, Incorporated.",
      "Giannoni, P., & Zerbino, L. (Eds.). (2022). Cerebral Palsy: A Practical Guide for Rehabilitation Professionals. Springer Nature.",
      "Hegde, M. N., Pomaville, F. (2021). Assessment of Communication Disorders in Children: Resources and Protocols. United States: Plural Publishing, Incorporated.",
      "Lindsay, L. A. (2020). Speaking of Apraxia: A Parents' Guide to Childhood Apraxia of Speech. United States: Woodbine House."
    ],
    "stream": "SLP",
    "kind": "Theory"
  },
  {
    "code": "B5.3",
    "type": "M",
    "semester": 5,
    "title": "Paediatric Audiology",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "trace out auditory development in children",
      "describe embryological development of the auditory system",
      "justify, plan and execute programs for early identification of hearing loss in infants and children",
      "administer appropriate test battery (behavioral and physiological tests) for diagnosis of hearing loss in infants and children, and",
      "modify the test protocols/procedures, as appropriate, while testing difficult -to-test population"
    ],
    "units": [
      {
        "title": "Development of Auditory System",
        "topics": [
          "Overview of paediatric audiology and fundamental terminology",
          "Embryological development of auditory system and its relevance to clinical audiology",
          "Maturation of the auditory system and neuroplasticity",
          "Development of Auditory behaviour: prenatal hearing, newborn hearing, hearing in infants and toddlers"
        ]
      },
      {
        "title": "Early Identification of Hearing Loss",
        "topics": [
          "Incidence and prevalence of auditory disorders in children",
          "Principles of early hearing detection and intervention",
          "Need for early identification with reference to congenital versus acquired hearing loss, conductive and sensorineural hearing loss, mild hearing losses, sloping hearing losses, fluctuating hearing losses and unilateral hearing loss",
          "Recommendations of the Joint committee on infant screening - various position statements and the evolution",
          "High risk registers and their utilities in screening, sensitivity and specificity of high risk registers, relevance in Indian scenario"
        ]
      },
      {
        "title": "Paediatric Hearing Screening",
        "topics": [
          "Behavioral screening tests (behavioral observation audiometry), procedures, recording of response, interpretation of results.",
          "Objective screening tests (e.g., Cribogram, auditory cradle, reflex inhibition audiometry, immittance, reflexometry, wide -band reflectance, OAE, evoked potentials - AABR)",
          "Universal newborn hearing screening - concept, history, Indian and global scenario and challenges",
          "Hearing screening in infants and toddlers: Indian and global context",
          "Hearing screening in pre-schoolers and school-age children: Indian and global context"
        ]
      },
      {
        "title": "Assessment of Hearing Loss in Children",
        "topics": [
          "Behavioural assessment of hearing: Behavioural observation audiometry, conditioned orientation reflex audiometry, Visual reinforcement audiometry and its modifications, conditioned play audiometry",
          "Speech audiometry in children, material available, modifications required",
          "Physiological assessment of hearing: Immittance evaluation including high frequency probe-tone tympanometry, reflexometry, wide -band reflectance), otoacoustic emissions, auditory brainstem response, auditory steady state responses and other evoked potentials",
          "Test battery for diagnosing severity and type of hearing loss (conductive, cochlear pathology, auditory neuropathy spectrum disorder), factors affecting assessment of hearing in children",
          "Counseling parents/caregivers regarding diagnosis and management of children with hearing loss"
        ]
      },
      {
        "title": "Assessment of Special Population",
        "topics": [
          "Diagnosis of auditory neuropathy spectrum disorder",
          "Assessment of hearing children with multiple problems (additional needs)",
          "Assessment of central auditory processing in children",
          "Assessment of functional hearing loss in children",
          "Assessment of vestibular problems in children",
          "Assessment of tinnitus, hyperacusis and misophonia in children"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Anne, S., Lieu, J., & Kenna, M. (2018). Pediatric Sensorineural Hearing Loss: Clinical Diagnosis and Management. (1st edition). Plural Publishing, Inc.",
      "http://www.jcih.org/posstatemts.htm",
      "Madell, J.R., Flexer, C., Wolfe, J., & Schafer, E.C. (2019). Pediatric Audiology: Diagnosis, Technology, and Management (3rd edition). Thieme",
      "Madell, J.R., Flexer, C., Wolfe, J., & Schafer, E.C. (2020). Pediatric Audiology Casebook (2nd edition). Thieme.",
      "Northern, J.L. & Downs, M.P. (2014). Hearing in Children. (6th edition). Plural Publishing, Inc.",
      "Tharpe, A. M., & Seewald, R. (Eds.). (2016). Comprehensive Handbook of Pediatric Audiology. Plural Publishing. Practicum",
      "Observe infants with typical hearing abilities in the age range of 0 -1 years and 1 -2 years in their natural environments. Generate a report detailing their response to auditory stimuli.",
      "Monitor a child with hearing impairment within the age range of 0 -2 years in natural setting. Compile a report describing the child's responses to auditory stimuli both with and without the amplification device."
    ],
    "stream": "Audiology",
    "kind": "Theory"
  },
  {
    "code": "B5.4",
    "type": "M",
    "semester": 5,
    "title": "Aural Rehabilitation",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "describe the different communication options available for young children with hearing impairment",
      "explain the impact of hearing impairment on auditory development, spoken language communication and quality of life",
      "describe factors that affect acoustic accessibility and strategies to manage them at home, classroom and work environments",
      "identify components of aural rehabilitation program for adults and administer different tools for assessment of hearing handicap, attitudes and beliefs that can impact aural rehabilitation",
      "design activities for auditory training at different levels for children and adults"
    ],
    "units": [
      {
        "title": "Listening, spoken communication and acoustic accessibility",
        "topics": [
          "Sensitivity period for auditory development",
          "Impact of hearing impairment on auditory development, spoken language acquisition, parent child communication",
          "Psychological impact of hearing loss",
          "Impact of hearing loss on quality of life, education, employment and financial burden",
          "Hearing loss implications for speech perception: acoustics of speech",
          "Optimizing hearing potential through hearing devices in adults and children",
          "Barriers to acoustic accessibility: distance, signal to noise ratio, reverberation",
          "Signal to noise ratio enhancing technologies personal FM, loop systems, desktop group systems, blue tooth connectivity"
        ]
      },
      {
        "title": "Communication and Education options for children with hearing loss",
        "topics": [
          "Parent/care giver support counseling",
          "Choosing communication options: Manual vs. oral form of communication",
          "Different manual communication systems available",
          "Cued speech and total communication",
          "Educational placement of hearing impaired children: Preschool training, Integration, Partial integration, Segregation: day school vs. residential school, Inclusive vs. integrated school.",
          "Educational problems of the individuals with hearing impairment and the measures taken to overcome the problems in India",
          "Early intervention programs"
        ]
      },
      {
        "title": "Auditory learning",
        "topics": [
          "Terminology and historical backgrounds, auditory learning, auditory training, auditory verbal therapy",
          "Creating optimum listening and learning environment for children at home, classroom situations and for adults at work situations",
          "Factors affecting outcome of auditory learning",
          "Methods of learning spoken language through listening (auditory oral vs auditory verbal)",
          "Methods of auditory training in children and adults",
          "Computer/App based modules for auditory training.",
          "Unisensory vs multisensory approaches"
        ]
      },
      {
        "title": "Speech Reading and communication strategies",
        "topics": [
          "Definition and need",
          "Visibility of speech sounds and assessing auditory -visual perception and only auditory perception",
          "Overview of analytic and synthetic tests of speech reading for adults and children",
          "Analytic and synthetic methods of speech reading training in adults and children",
          "Factors influencing speech reading",
          "Facilitative communication strategies: Repair strategies, anticipatory strategies, Conversational styles",
          "Communication strategies training formal instruction, guided learning, real world practice"
        ]
      },
      {
        "title": "Managing children and adults with additional needs",
        "topics": [
          "Management of hearing loss associated with additional problems such as blindness, cognitive problems",
          "Management of auditory neuropathy spectrum disorders",
          "Management of central auditory processing disorders",
          "Management of tinnitus and hyperacusis",
          "Aural rehabilitation of older adults"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Fitzpatrick, E.M., and Doucet S.P. (2013) (Eds). Paediatric Audiologic",
      "Hosford-Dumm, H., Roser, R., & Valente, M. (2007). Audiology Practice Management (2nd edition edition). New York: Thieme.",
      "Hull, R. H., (2014) ed. Introduction to Aural Rehabilitation 2nd edition Plural Publishing, San Diego Chapters 1, 2, 11 to 20",
      "Manual, A publication of NIPMED, Chennai. Freely downloadable from http://niepmd.tn.nic.in/publication.php. ISBN 978-81-928032-5-8.",
      "Mardell, J., & Flexer, C. (2013). Pediatric Audiology: Diagnosis, Technology, and Management (2nd ed.). New York, NY: Thieme.",
      "Rehabilitation. Thieme, New York",
      "Rout, N and Rajendran, S. (2015). Hearing aid Counseling and Auditory training",
      "Schow, R.L. & Nerbonne, M.A., (2012). Introduction to Audiological Rehabilitation (6th edition), Allyn & Bacon, Boston."
    ],
    "stream": "Audiology",
    "kind": "Theory"
  },
  {
    "code": "B5.5",
    "type": "MO",
    "semester": 5,
    "title": "Optional Minor - 4",
    "hours": "15",
    "marks": 50,
    "credits": "1",
    "objectives": [],
    "units": [],
    "competencies": [],
    "reading": [],
    "stream": "Allied",
    "kind": "Optional Minor"
  },
  {
    "code": "B5.6",
    "type": "M",
    "semester": 5,
    "title": "Clinicals in Speech-language Pathology",
    "hours": "90+",
    "marks": 75,
    "credits": "3",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "Know",
        "items": [
          "Different samples /procedures required to analyze voice production mechanism (acoustic/ aerodynamic methods / visual examination of larynx/ self-evaluation)",
          "Assess parameters of voice and breathing for speech.",
          "Document the voice production mechanism in different animals and birds: compare these with human voice production.",
          "Different samples /procedures required to analyze speech production mechanism in children with motor speech disorders.",
          "Differential diagnosis of motor speech disorders in children.",
          "Procedures to assess laryngectomees and provide management options.",
          "Document the voice production mechanism in different animals and birds: compare these with human voice production."
        ]
      },
      {
        "level": "Know-how",
        "items": [
          "To assess posture and breathing for speech in children with motor speech disorders.",
          "To record a voice sample for acoustic and perceptual analysis.",
          "To assess the speech parameters of different types of speech in laryngectomee",
          "To consult with inter -disciplinary medical/rehabilitation team and counsel the individual/ family regarding management options and prognosis.",
          "Observe and document the findings from pre -recorded/ live samples of laryngeal examination procedures and compare differences across various voice disorders.",
          "Use software / instruments used in the assessment and management of voice disorders.",
          "Identify various types of voice prostheses, tracheostomy tubes, and artificial larynx and its parts. Document the use of these prostheses in various types of disorders."
        ]
      },
      {
        "level": "Show",
        "items": [
          "Perceptually analyse paediatric, adult, and geriatric voice using a standard test tool and compare the differences across age and gender.",
          "Perform aerodynamic analysis (spirometry, MPD, s/z ratio) of paediatric, adult, and geriatric voice and compare the differences across age and gender.",
          "Perform acoustic analysis of paediatric, adult, and geriatric voice using a software/ instrument and compare the differences across age and gender.",
          "Analyse paediatric, adult, and geriatric voice using electroglottography and compare the differences in various parameters across age and gender.",
          "Evaluate the voice of individuals with voice disorders using perceptual, acoustic, and aerodynamic analysis and EGG to compare the results across age, gender, and different types of voice disorders.",
          "Administer and document the findings of the quality -of-life questionnaire/ PROM on individuals with voice disorders.",
          "Assess the voice of at least 1 professional voice user. Describe the differences in the procedure for assessment of voice in PVU and non-PVU.",
          "Prepare a vocal hygiene checklist for individuals with voice disorders.",
          "Prepare a vocal hygiene checklist for different professional voice users (Singers, teachers, drama artists etc.) and understand the difference.",
          "Counsel patients with voice disorders.",
          "Demonstrate voice therapy techniques and document the same.",
          "Analyze the speech profile of 2 individuals with laryngectomy.",
          "Prepare a checklist/pamphlet illustrating care of the stoma, T tubes, and prosthesis used by laryngectomee.",
          "Perform OPME in 5 children with motor speech disorders."
        ]
      },
      {
        "level": "Do",
        "items": [
          "Write a baseline report for an individual with voice disorder.",
          "Write a lesson plan for an individual with voice disorder.",
          "Evaluate children and adults with speech sound disorders using protocol at your department/ institute and document the same.",
          "Plan and take therapy for a laryngectomee.",
          "Plan and take therapy for individuals with voice disorders. Document the differences in management across professional and non -professional voice users and various types of disorders."
        ]
      }
    ],
    "reading": [],
    "stream": "SLP",
    "kind": "Clinical"
  },
  {
    "code": "B5.7",
    "type": "M",
    "semester": 5,
    "title": "Clinicals in Audiology",
    "hours": "90+",
    "marks": 75,
    "credits": "3",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "Know",
        "items": [
          "Different protocols and interpretation in tympanometry and reflexometry.",
          "Different protocols used and interpretation in auditory brainstem responses and ASSR",
          "Protocols for screening and diagnostic otoacoustic emissions and their interpretation",
          "Tests to assess vestibular system",
          "Different indications for selecting implantable hearing devices",
          "Various speech stimulation and auditory training techniques Knowhow",
          "To administer auditory brainstem responses and ASSR for the purpose of threshold estimation and ABR for sight of lesion testing",
          "To administer tympanometry and reflexometry",
          "To administer multifrequency tympanometry and calculate resonance frequency",
          "To administer high risk register",
          "To modify the given environment to suit the needs of hearing impairment"
        ]
      },
      {
        "level": "Show",
        "items": [
          "Analysis of ABR waveforms - threshold estimation 5 and site of lesion 5",
          "Analysis of immittance audiometry and relating to other tests - 5 individuals with conductive and 5 individuals with sensori-neural hearing loss",
          "How to formulate select appropriate auditory training technique based on audiological evaluation"
        ]
      },
      {
        "level": "Do",
        "items": [
          "Threshold estimation on 5 infants (< 2 years) and 2 adult",
          "TEOAE and DPOAE on 5 infants (<2 years) and 2 adults",
          "Immittance evaluation on 3 children and 3 adults",
          "BOA on 5 infants (<2 years)",
          "VRA on 2 infants (6 month - 3 year)",
          "Conditioned play audiometry - 3 children (3-6 years)",
          "Appropriate auditory training on 5 children with hearing loss",
          "Hearing aid fitment on 1 infant (< 3 years) 2 children (3-6 years)",
          "Test battery report of hearing assessment for 3 children and 3 adults Semester 6"
        ]
      }
    ],
    "reading": [],
    "stream": "Audiology",
    "kind": "Clinical"
  },
  {
    "code": "B6.1",
    "type": "M",
    "semester": 6,
    "title": "Adult Language Disorders",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "identify the characteristics of language disorders in adults",
      "decipher the causes of language disorders in adults",
      "evaluate and diagnose speech -language characteristics in adults with of language disorders",
      "plan strategies to manage speech -language and related errors in adults with of language disorders",
      "counsel and provide guidance to caregivers on the management of language disorders",
      "understand the concept of cognitive communication disorders in adults, and",
      "initiate advocacy programs for adults with language disorders"
    ],
    "units": [
      {
        "title": "Neurosciences of Aphasia and Other Adult Language Disorders with Cognitive",
        "topics": [
          "Communication Disorders",
          "Neuroanatomical, neurophysiological, and neurochemical correlates for language function.",
          "Neurolinguistic models and language processes - connectionists, hierarchical, global, process, and computational models.",
          "Historical aspects of aphasia",
          "Language processing in right hemisphere",
          "Language processing in bi/ multilingual population"
        ]
      },
      {
        "title": "Language Disorders in Adults",
        "topics": [
          "Definitions of language disorder in adults (aphasia)",
          "Causes of language disorder in adults",
          "Different classifications of aphasia",
          "Types of aphasia and their speech, language, behavioral and cognitive characteristics",
          "Comorbidities in individuals with aphasia",
          "Overview of Speech-language characteristics in • Traumatic Brain Injury • Right Hemisphere Damage • Dementia • Primary Progressive Aphasia • Schizophrenia • Metabolic disorders • Alcohol-induced disorders"
        ]
      },
      {
        "title": "Assessment of Aphasia",
        "topics": [
          "Types and importance of different forms of language assessment of adults.",
          "Types of tests and tools for assessment of language in adults",
          "Description of tools and test for assessment and diagnosis of language in adults (Rationale, Administration, Scoring, and Interpretation) WAB, BDAE, Token test, Revised Token Test, -BST, WAB, RTT, BAT, LPT.",
          "Tools and tests adapted/ developed across languages in India for assessment of language in adults (Rationale, Administration, Scoring, and Interpretation).",
          "Overview of tests and tools for assessment of speech, language, linguistic, and cognition of adults with non -aphasic cognitive communication disorders (e.g ACE, BTHI, MMSE, ABCD, CLAP, CLQT, CCABI, FCP)"
        ]
      },
      {
        "title": "Management of Language Disorders in Adults",
        "topics": [
          "Principles of Language Intervention for individuals with aphasia",
          "Concept of spontaneous recovery, reorganization and retraining.",
          "Approaches and techniques for management of aphasia - Deblocking, VCIU, LOT, PACE, Stimulation Facilitation Approach, RET, V AT, Semantic Feature Analysis, TAP, TUF, MIT, TWA, Contingency naming training and others.",
          "Considerations of co morbidities in planning and implementation of therapy for individuals with aphasia",
          "Introduction to AAC for adults with aphasia.",
          "Team approach in rehabilitation of adults with aphasia. Team members and their roles in rehabilitation of adults with aphasia.",
          "Importance and role of caregivers/ family members in rehabilitation of persons with aphasia."
        ]
      },
      {
        "title": "Rehabilitation Issues Relating to Adults with Language Disorders",
        "topics": [
          "Factors influencing the assessment and intervention for language in the context of bilingual and multilingual influences.",
          "Factors influencing the assessment and management of language in persons who are preliterate, illiterate and literate.",
          "Importance of assessment of quality of life of adults with language disorders",
          "Generalization and maintenance issues in adults with language disorders",
          "Recovery patterns and prognosis in adults with language disorders",
          "Age related influence in adults with language disorders",
          "Rights of adults with language disorders"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Albert, M. L & Obler, L. K. (1978). The bilingual brain -neuropsychological and neurolinguistic aspects of bilingualism: Perspectives in neurolinguistics and psycholinguistics series. New York: Academic Press.",
      "Chapey, R. (2008). Language Intervention strategies in aphasia and related neurogenic communication disorders. Philadelphia: Lippincott Williams and Wilkins",
      "Davis, G. A. (2014). Aphasia and related cognitive communicative disorders. USA: Pearson Education Inc.",
      "Edwards, S. (2005). Fluent Aphasia. Cambridge University Press.",
      "Hegde, M. N., & Freed, D. (2022). A coursebook on aphasia and other neurogenic language disorders. San Diego: Plural Publishing Group Inc.",
      "Holmgren, E. & Rudkilde, E. S. (2013). Aphasia: classification, management practices, and Prognosis. New York: Nova Sciences Publishing.",
      "Lapointe, L. L., Murdoch, B. E., & Stierwalt, J. A. G. (2010). Brain -based Communication Disorders. Plural Publishing Inc. Stemmer, B., & Whitaker, H. A. (Eds.). (2008). Handbook of Neuroscience of Language. Elsevier.",
      "Manasco, M. H. (2014). Introduction to Neurogenic communication disorders Barlington: Jones and Barlett Learning."
    ],
    "stream": "SLP",
    "kind": "Theory"
  },
  {
    "code": "B6.2",
    "type": "M",
    "semester": 6,
    "title": "Motor Speech Disorders in Adults",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "identify the motor processes and control mechanisms in speech production",
      "describe terminologies, classification and characteristics of motor speech disorders in adults",
      "assess motor speech disorders in adults, and differentiate them other associated / related disorders",
      "plan approaches to management of dysarthria and apraxia of speech in adults",
      "plan strategies to assess and treat feeding and swallowing problems in adults, and",
      "counsel the affected clinical population and their family members"
    ],
    "units": [
      {
        "title": "Types of dysarthria: anatomical basis, etiology and speech characteristics",
        "topics": [
          "Speech Motor System",
          "Definition and classification of dysarthria",
          "Broad etiologic categories of dysarthria in adults (Degenerative diseases, inflammatory diseases, toxic -metabolic diseases, neoplastic diseases, traumatic diseases, vascular diseases)",
          "Different dimensions of dysarthria (Age of onset, cause, natural course, site of lesion, pathophysiology, speech characteristics, speech characteristics, severity)",
          "Anatomic and physiologic substrates, etiology and speech characteristics of different types of dysarthrias: Spastic Dysarthria; Flaccid Dysarthria; Hypokinetic dysarthria; Hyperkinetic dysarthria; Ataxic Dysarthria; Mixed dysarthria; Unilateral Upper Motor Neuron Dysarthria"
        ]
      },
      {
        "title": "Assessment and diagnosis of dysarthria",
        "topics": [
          "Behavioral assessment of speech subsystems in dysarthria: description of tasks, observations and measures - Respiratory subsystem; Phonatory Subsystem; Resonatory subsystem; --Articulatory subsystem - Speech intelligibility and prosody - Formal/standard protocols for assessment of dysathria",
          "Instrumental assessment of speech subsystems in dysarthria: Acoustic, kinematic and physiological assessment",
          "Advantages and disadvantages of behavioural and instrumental assessment of dysarthria",
          "Differential diagnosis of dysarthria from Apraxia of Speech and Aphasia.",
          "Differential Diagnosis of types of dysarthria"
        ]
      },
      {
        "title": "Management of dysarthria",
        "topics": [
          "Brief overview of medical intervention, surgical intervention for dysarthria on the speech in persons with acquired dysarthria",
          "Rationale for behavioral intervention and general principles for behavioral intervention including principles of motor learning",
          "Facilitative approach: vegetative, sensorimotor and reflex based intervention systems approach- Behavioral management of speech subsystems (Including use of prosthesis and AAC) - Respiratory subsystem; Phonatory subsystem; Resonatory subsystem; Articulatory subsystem- Prosody including rate of speech"
        ]
      },
      {
        "title": "Assessment and management of apraxia of speech (AOS)",
        "topics": [
          "Definition, and classification of acquired apraxia in adults - Nonverbal apraxia’s and verbal apraxia / AOS",
          "Anatomical and physiological substrates and etiologies of AOS",
          "Characteristics of nonverbal apraxia & verbal apraxia",
          "Behavioral assessment of apraxia of speech - Tasks, observations and measures related to an assessment protocol; Formal assessment batteries/scales and protocols for assessment - Instrumental analysis of speech of apraxia in adults: Acoustic, Kinematic and Physiological",
          "Management of apraxia of speech including AAC and speech/communication strategies"
        ]
      },
      {
        "title": "Dysphagia",
        "topics": [
          "Overview on neuroanatomy of swallowing",
          "Stages of swallowing",
          "Causes of dysphagia including, neurogenic, mechanical and motility - Signs and symptoms of dysphagia - Subjective and bedside evaluation of dysphagia",
          "Brief orientation on instrumental evaluation of swallowing",
          "Facilitatory and compensatory techniques in treatment of dysphagia"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Carrau, R. L., Murry, T., Howell, R. J. (2016). Comprehensive Management of Swallowing Disorders, Second Edition. United States: Plural Publishing, Incorporated.",
      "Duffy, J. R. (2019). Motor Speech Disorders: Substrates, Differential Diagnosis and Management, Fourth Edition. E-Book. Elsevier Health Sciences.",
      "Fogle, P. T. (2022). Essentials of communication sciences & disorders. Jones & Bartlett Learning.",
      "Freed, D. B. (2023). Motor Speech Disorders: Diagnosis and Treatment, Fourth Edition. United States: Plural Publishing, Incorporated.",
      "Gatokowska, I. (2020). Diagnosing Dysarthria in Adults: A New Speech Assessment Method for Polish, English, and Spanish (V ol. 3). AE Academic Publishing.",
      "Groher, M. E., Crary, M. A. (2020). Dysphagia: Clinical Management in Adults and Children. United Kingdom: Elsevier - Health Sciences Division.",
      "Hegde, M. N., Freed, D. B. (2020). Assessment of Communication Disorders in Adults: Resources and Protocols. United States: Plural Publishing, Incorporated.",
      "Johnson, A. F., & Jacobson, B. H. (2016). Medical Speech -Language Pathology: A Practitioner's Guide. Germany: Thieme Medical Publishers."
    ],
    "stream": "SLP",
    "kind": "Theory"
  },
  {
    "code": "B6.3",
    "type": "M",
    "semester": 6,
    "title": "Implantable Hearing Devices",
    "hours": "75 (45 + 30)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "assess candidacy for bone conduction hearing implants, middle ear implants, cochlear implants, and auditory brainstem implants",
      "select the appropriate device depending on the audiological and non -audiological findings",
      "manage post-implantation audiological management",
      "assess the benefit derived from implantation, and",
      "counsel the parents/care givers during different stages of implantation"
    ],
    "units": [
      {
        "title": "Need for Implantable Hearing Devices",
        "topics": [
          "Verification of hearing aids using functional gain, real ear insertion gain : REIG, REUR, REAR, REOR, RESR, REIG, REAG, RECD",
          "Use of impedance, OAEs and AEPs in the verification of hearing aids",
          "Hearing aid validation/outcome measures including questionnaires",
          "Selection and verification of use of Assistive listening devices",
          "Limitation of hearing aids and assistive listening devices",
          "Team involved in selection of different implantable devices"
        ]
      },
      {
        "title": "Cochlear Implant and Auditory Brainstem Implants",
        "topics": [
          "Types of cochlear implants (CI), components & features based on technology and design",
          "MRI Compatibility, Electrode types and options",
          "Types of Sound Processors, components & features based on technology and design",
          "Bilateral vs Unilateral CI, Bilateral Bi -modal CI, Unilateral Bi -modal CI (electro acoustic stimulation)",
          "Candidacy Evaluation for CI: Audiological and Non-audiological",
          "Overview of Auditory brainstem implant (ABI), Need and candidacy for ABI"
        ]
      },
      {
        "title": "Post Cochlear Implant Rehabilitation",
        "topics": [
          "Overview of surgical approaches, complications",
          "Sound coding strategies in CI",
          "Objective measures for intra-op monitoring and post-op management",
          "ESRT, ECAP, EABR, aided cortical potentials, ECochG",
          "Mapping of CI, MAP verification and assessment of benefit"
        ]
      },
      {
        "title": "Bone Conduction Hearing Implants and Middle Ear Implants",
        "topics": [
          "Bone conduction hearing aids vs bone conduction and middle ear implants",
          "Active and passive types and components",
          "Candidacy assessment for bone conduction hearing implants and middle ear implants",
          "Surgical Considerations, approaches and techniques, risk and complications",
          "Intra-Op monitoring and post -op fitting and assessment of benefit"
        ]
      },
      {
        "title": "Counseling and Care and Maintenance of Implantable Devices",
        "topics": [
          "Pre-implant counseling and informed consent for children and adults",
          "Post-implant counseling for parents/caretakers of children using CI",
          "Post -implant counseling for adults using CI and significant others",
          "Care and maintenance of implantable devices",
          "Measuring outcome of implantable devices",
          "Rehabilitation methods and techniques for pre-lingual implantees.",
          "Rehabilitation methods and techniques for post lingual implantees",
          "Team involved in rehabilitation with implantable devices"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Clark, G., Cowan, R. S. C., & Dowell, R. C. (1997). Cochlear Implantation for Infants and Children: Advances. Singular Publishing Group.",
      "Cooper, H., & Craddock, L. (2006). Cochlear Implants: A Practical Guide. Wiley.",
      "Dutt, S. N. (2002). The Birmingham Bone Anchored Hearing Aid Programme: Some Audiological and Quality of Life Outcomes. Den Haag: Print Partners Ipskamp.",
      "Eisenberg, L. S. (2009). Clinical Management of Children with Cochlear Implants.Plural Publishing.",
      "Gifford, R. H. (2013). Cochlear Implant Patient Assessment: Evaluation of Candidacy, Performance, and Outcomes. Plural Publishing.",
      "Hagr, A. (2007). BAHA: Bone -Anchored Hearing Aid. International Journal of Health Sciences, 1(2), 265-276.",
      "Kompis, M., & Caversaccio, M. -D.(2011). Implantable Bone Conduction Hearing Aids.Karger Medical and Scientific Publishers.",
      "Mankekar, G. (2014). Implantable Hearing Devices other than Cochlear Implants. Springer India."
    ],
    "stream": "Audiology",
    "kind": "Theory"
  },
  {
    "code": "B6.4",
    "type": "M",
    "semester": 6,
    "title": "Audiology in Practice",
    "hours": "75 (45 + 15)",
    "marks": 100,
    "credits": "4 (3 + 1)",
    "objectives": [
      "describe the highlights of legislations relating to hearing impairment and other disabilities",
      "incorporate ethical practices in professional service delivery. provide information on welfare measures, policies of government when needed, describe different strategies to create awareness of hearing impairment and programs to address them",
      "define the different clinical practice settings in audiology with reference to their requirement, protocols and role and responsibility of audiologist",
      "implement programs to measure noise and its impact on humans",
      "plan strategies to address sequel of excessive noise exposure in industries and the community, and",
      "describe terminology, technology and methods used in tele practice, and their application in audiological service delivery"
    ],
    "units": [
      {
        "title": "Scope, legislation and ethics in audiology",
        "topics": [
          "Scope of practice in audiology (National - ISHA & International body - AAA)",
          "Professional ethics (ISHA)",
          "Legislations and conventions relating to disability: need and historical aspects",
          "Classification of hearing impairment and disability certification",
          "Rehabilitation Council of India Act (1992) and its amendments",
          "Rights of Persons with Disability Act,1995, 2016",
          "National Trust Act (1999)",
          "Right to Education (2012)",
          "Biwako Millennium framework (2003) and Salamanca Statement 1994, UNCRPD",
          "National Education Policy and rights of persons with disabilty",
          "Concept of barrier free access and universal design relating to individuals with hearing impairment"
        ]
      },
      {
        "title": "Hearing health and strategies for prevention of hearing impairment",
        "topics": [
          "Epidemiology of hearing disorders",
          "ICD and ICF",
          "Levels of prevention: Primary, secondary and tertiary",
          "National programs and efforts national institutes",
          "Welfare measures by Government",
          "Camps (planning, purpose, organizing, and providing remedial measures)",
          "Public education and information (media, radio broadcasts, street plays) Hearing health and prevention programs (hearing help line, dangerous decibels, online hearing tests etc.)"
        ]
      },
      {
        "title": "Audiological practice in different settings",
        "topics": [
          "Audiological Private practice",
          "ENT clinics",
          "Pediatric / neonatology clinic/departments",
          "Neurology departments",
          "Factories and Industry",
          "Hearing aid dispensing center / hearing aid industry",
          "Rehabilitation centers such as DRC/CRCs",
          "Schools for the hearing impaired",
          "Cochlear implant clinics",
          "Multiple handicap habilitation center and others"
        ]
      },
      {
        "title": "Noise and hearing conservation in industry and community",
        "topics": [
          "Introduction to noise, types",
          "Sources of noise in the industry and community",
          "Effects of noise in the auditory system (outer, middle and inner ear)",
          "Temporary threshold shift, permanent threshold shift, factors increasing the risk of NIHL",
          "Non-auditory effects of noise (physiological, psychological, stress, sleep, job productivity, and accidents)",
          "Legislations related to noise, permissible noise exposure levels, workers compensation, OSHA standards, Indian legislations related to noise",
          "Instrumentation, measurement and procedure for measuring noise in industry",
          "Instrumentation, measurement and procedure for measuring noise in community",
          "Hearing conservation program (HCP), steps, record keeping, Ear protective devices"
        ]
      },
      {
        "title": "Scope and practice of tele audiology",
        "topics": [
          "Introduction to tele-health: definition, history of tele-health",
          "Terminologies-tele-health, tele medicine, tele practice",
          "Connectivity: internet, satellite, mobile data",
          "Methods of tele-practice-store and forward and real time",
          "Ethics and Regulations for tele-audiology",
          "Requirements/Technology for tele - audiology: Web based platforms, Video conferencing, infrastructure, Manpower at remote end and audiologist end, training assistants for tele-audiology Audiological screening using tele-technology : new born hearing screening, school screening, community screening, counseling",
          "Diagnostic audiological services using tele -technology : video otoscopy, pure tone audiometry, speech audiometry, oto acoustic emission, tympanometry, auditory brainstem response",
          "Intervention / aural rehabilitation using tele -technology: hearing aid counseling and troubleshooting, tinnitus, counseling, aural rehabilitation services, AVT, and counseling"
        ]
      }
    ],
    "competencies": [],
    "reading": [
      "Audiology Telepractice; Editor in Chief, Catherine V . Palmer, Ph.D.; Guest Editor, Greg D. Givens, Ph.D. Seminars in Hearing, volume 26, number 1, 2005.",
      "Bergland, B., Lindwall, T., Schwela, D.H., eds (1999). Guidelines on Community noise http://www.who.int/docstore/peh/noise/guidelines2.html WHO 1999",
      "BIS specifications relating to Noise Measurements. - IS:7194-1973 Specification for assessment of noise exposure during work for hearing conservation purposes.",
      "Census of India information on disability",
      "Dobie, R. A (2001). Medical legal evaluation of hearing loss, 2nd Ed.",
      "Hearing health and strategies for prevention of hearing impairment WHO (2001).",
      "International classification of Functioning, Disability and Health. Geneva: WHO",
      "http://www.asha.org/Practice-Portal/Professional-"
    ],
    "stream": "Audiology",
    "kind": "Theory"
  },
  {
    "code": "B6.5",
    "type": "MC",
    "semester": 6,
    "title": "RCI Course (Minor Compulsory)",
    "hours": "60",
    "marks": 100,
    "credits": "4",
    "objectives": [],
    "units": [],
    "competencies": [],
    "reading": [],
    "stream": "Allied",
    "kind": "Theory"
  },
  {
    "code": "B6.6",
    "type": "M",
    "semester": 6,
    "title": "Clinicals in Speech-language Pathology",
    "hours": "90+",
    "marks": 75,
    "credits": "3",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "Know",
        "items": [
          "Identify the cortical and subcortical language areas from the diagram/ model of the brain.",
          "Identify the cranial nerves involved in speech and swallowing mechanism, their origin, and insertion from an image/ model. Also, document the function of these nerves.",
          "Prepare a table of processes and components involved in various conceptual programming levels of speech production.",
          "Prepare a list of linguistic and non -linguistic characteristics of different types of aphasia.",
          "Explore software used for the management of motor speech disorders and adult language disorders.",
          "Procedures to assess motor speech disorders in adults",
          "Differential diagnosis of motor speech disorders in adults.",
          "Procedures to assess individuals with adult language disorders, and other related conditions."
        ]
      },
      {
        "level": "Know-how",
        "items": [
          "Differentially diagnose speech and language characteristics in various types of aphasia.",
          "Differentially diagnose speech and language characteristics in aphasia and right hemisphere damage.",
          "Administer bilingual aphasia test on individuals with aphasia.",
          "Identify the signs of UMN and LMN lesion from video samples.",
          "Using ‘Darley, Aronson, and Brown’s (1969 a, b) speech clusters for different dysarthria’, prepare a profile of speech characteristics of 1 adult/ geriatric with dysarthria.",
          "Use MAAT - K/ MANAT -K/ MAFAT - K for the treatment of individuals with aphasia.",
          "Assess posture, breathing, speech, and swallowing in adults with motor speech disorders.",
          "To record a sample for analysis of language and speech skills in adults with cognitive communication disorders.",
          "To consult with inter -disciplinary medical/ rehabilitation team and counsel the individual/family regarding management options and prognosis."
        ]
      },
      {
        "level": "Show",
        "items": [
          "Perform bedside screening for individuals with stroke/ TBI/ other neurological disorders.",
          "Perform bedside screening for individuals with dysphagia.",
          "Assess speech characteristics of individuals with aphasia using a standardised test tool.",
          "Assess speech characteristics of individuals with motor speech disorders using a standardized test tool (Include respiration, pitch, loudness, voice quality, resonance, articulation, prosody, DDK, intelligibility, and any other features)",
          "Assess cognitive -linguistic skills of neurotypical individuals and individuals with cognitive-communication disorders using a screening/ diagnostic tool. Compare the differences in characteristics of these individuals.",
          "Assess the quality of life of an individual with adult language disorder using a standard test tool (eg. SAQOL).",
          "Demonstrate one technique (based on EBP) for the treatment of individuals with aphasia.",
          "Counsel family members of an individual with aphasia/ dysarthria (Prepare a counseling checklist /guideline).",
          "Perform various oral motor exercises used for the treatment of dysarthria (Prepare steps involved for various oral motor exercises).",
          "Dysphagia assessment -minimum of 2 children and adults.",
          "Goals and activities for therapy (including AAC) based on assessment/ test results for adults with neuro-communication disorders."
        ]
      },
      {
        "level": "Do",
        "items": [
          "Prepare a low -tech AAC for functional communication of individuals with aphasia/ apraxia or any other neurogenic communication disorders.",
          "Perform OPME, cranial nerve examination, and examination of reflexes on adults/ geriatrics with motor speech disorders. Compare between neurotypical adults and adults with neurological deficit (Check for strength, speed, accuracy, range, steadiness & tone of oral muscles)",
          "Bed side evaluation of individuals with cognitive communication disorders - Minimum of 2 individuals.",
          "Plan and give therapy for individuals with motor speech disorder.",
          "Plan and give therapy for individuals with adult language disorder."
        ]
      }
    ],
    "reading": [],
    "stream": "SLP",
    "kind": "Clinical"
  },
  {
    "code": "B6.7",
    "type": "M",
    "semester": 6,
    "title": "Clinicals in Audiology",
    "hours": "90+",
    "marks": 75,
    "credits": "3",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "Know",
        "items": [
          "National and international standards related to noise exposure.",
          "Recommend appropriate treatment options such as speech reading, AVT, combined approaches etc. Knowhow",
          "Carryout noise survey in Industry and community",
          "Carryout mapping of cochlear implant in infants and children using both objective and subjective procedures",
          "Troubleshoot cochlear implant"
        ]
      },
      {
        "level": "Show",
        "items": [
          "Analysis of objective responses like compound action potential, stapedial reflexes on at least 3 samples",
          "Comprehensive hearing conservation program for at least 1 situation"
        ]
      },
      {
        "level": "Do",
        "items": [
          "AVT on at least 3 children with hearing impairment",
          "Trouble shooting and fine tuning of hearing aids on at least 5 geriatric clients",
          "Programming of hearing aid on at least 5 geriatric clients and 3 children",
          "BOA on 5 children (<2 years)",
          "VRA on 2 children (6 month - 3 year)",
          "Conditioned play audiometry on 3 children (3-6 years)",
          "At least one activity for different stages involved in auditory training",
          "Carry out real ear insertion gain measurements on5 clients",
          "Complete audiological report for 2 children and 2 adults with hearing loss and counsel the client/caretaker about hearing loss and further recommendations Semesters 7 and 8"
        ]
      }
    ],
    "reading": [],
    "stream": "Audiology",
    "kind": "Clinical"
  },
  {
    "code": "B7.1",
    "type": "M",
    "semester": 7,
    "title": "Clinicals in Speech-language Pathology",
    "hours": "600",
    "marks": 100,
    "credits": "20",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "General",
        "items": [
          "Diagnosis and management of speech, language, and swallowing disorders across the life span.",
          "Report evaluation findings, counsel, make appropriate referrals and liaise with professionals from related fields.",
          "Plan and execute intervention and rehabilitation programs for persons with speech language, communication, and swallowing disorders.",
          "Develop and maintain c linical documentation related to persons with speech - language, communication, and swallowing disorders",
          "Engage in community -related services such as camps, awareness programs specifically, and community-based rehabilitation activities, in general.",
          "Gain experience in different set -ups and be able to establish speech centers in different set-ups",
          "Advise on the welfare measures available for their clinical clientele and their families.",
          "Advise and fit appropriate aids and devices for the clinical population.",
          "Administer quality of life questionnaires on persons with communication disorders.",
          "Make appropriate referrals and liaise with professionals from related fields.",
          "Gain experience in different clinical set ups and be able to establish speech -language centers.",
          "Advise on the welfare measures available for their clinical clientele and their families."
        ]
      }
    ],
    "reading": [],
    "stream": "SLP",
    "kind": "Clinical"
  },
  {
    "code": "B7.2",
    "type": "M",
    "semester": 7,
    "title": "Clinicals in Audiology",
    "hours": "600",
    "marks": 100,
    "credits": "20",
    "objectives": [],
    "units": [],
    "competencies": [
      {
        "level": "General",
        "items": [
          "The following are the minimum requirements for starting/continuing a B.ASLP program with an intake of 20 students unless otherwise stated (subject to Note (a) below)",
          "The maximum intake for the B.ASLP program shall not exceed 40. However, the RCI rule supernumerary seats may be adopted.",
          "The requirements stipulated here should be read and interpreted in conjunction with the guidelines of RCI for inspectors for inspection of new/existing programs for approval. Personnel B.ASLP B.ASLP (Intake : 20 (Intake : 40 / year) / year) Core Faculty Professor- Speech Pathology & -- 1 Audiology Associate Professor- Speech 1 2 (1+1) Pathology & Audiology Assistant Professor - Speech 2 2 Pathology Assistant Professor - Audiology 2 2 Clinical Staff Speech Pathologist - Gr. I 1 2 Speech Pathologist - Gr. II 1 1 Audiologist - Gr. I 1 2 Audiologist - Gr. II 1 1 Allied Faculty (Part time or consultancy) Asst. Prof in Cl. Psychology 1 1 Asst. Prof in Electronics 1 1 Asst. Prof in Otolaryngology 1 1 Asst. Prof in Linguistics 1 1 Asst. Prof in Statistics 1 1 Asst. Prof in Neurology 1 1 Supporting staff - Technical (Part time or consultancy) Earmold technician 1 1 Bio-medical technician 1 1 Computer technician 1 1 Library & Information Officer or Assistant 1 1 Supporting staff - Administrative (Full time or part -time) Secretary - Academics 1 1 Secretary - Clinic 1 1 Secretary - Admin 1 1 Note (a) A minimum of two faculty members and 4 clinical staff in the core areas of speech - language pathology and audiology is a must to start the B.ASLP program with an intake of 20 students (Double for 40 student -intake). Two more faculty members in the core areas must be added before the commencement of the second year. Full contingent of staff, as shown above, must be in place before the commencement of the third year. Note (b) The B. ASLP program should be conducted by an independent institute/ college/ department in a university / department in a hospital / rehabilitation unit and headed and coordinated (administrative / academic and clinical) by a full -time audiologist and/or speech-language pathologist at the level of an associate professor. Note (c) An institution can apply for increase in intake only after a batch of students successfully complete their B.ASLP program. Note (d) All aided and government institutions shall implement reservations in admission as per state and/or central government rules from time to time. However, there shall be increase in infrastructure commensurate with increase in the number of seats as per reservation policy. Professional Qualification for Faculty/Staff in the Core Areas* Designation Qualifications Pay Scale Professor Essential",
          "M.Sc (Sp & Hg) / M.Sc (SLP) / M.Sc (Aud) or equivalent and Ph.D (in the core area*)",
          "PhD (in the core areas*)",
          "10 years teaching experience at PG/UG level",
          "Minimum of five publications with cumulative impact factor of 05.",
          "Valid RCI registration Desirable Experience of running under-graduate training programs As per UGC guidelines Associate Professor - Speech-language Pathology Essential",
          "M.Sc (Sp & Hg) / M.Sc (SLP) or equivalent",
          "8 years teaching experience at PG/UG level",
          "Minimum of five publications with cumulative impact factor of 04.",
          "Valid RCI registration As per UGC guidelines Desirable Ph.D (in core area*) Experience of running under-graduate training programs Associate Professor - Audiology Essential",
          "M.Sc (Sp & Hg) / M.Sc (Aud) or equivalent",
          "8 years teaching experience at PG/UG level"
        ]
      }
    ],
    "reading": [],
    "stream": "Audiology",
    "kind": "Clinical"
  }
];

/* Scheme of Examination (RCI clause 7.1). Columns: Practical, IA, Exam, Total, Credits. */
const EXAM_SCHEME = [
  {
    "sem": 1,
    "rows": [
      [
        "B1.1 M",
        "Introduction to Speech-language Pathology",
        "--",
        25,
        50,
        75,
        3
      ],
      [
        "B1.2 M",
        "Introduction to Audiology",
        "--",
        25,
        50,
        75,
        3
      ],
      [
        "B1.3 MC",
        "Anatomy and Physiology of Speech & Swallowing",
        "--",
        25,
        50,
        75,
        2
      ],
      [
        "B1.4 MC",
        "Anatomy and Physiology of Hearing",
        "--",
        25,
        50,
        75,
        2
      ],
      [
        "B1.5 M",
        "Practicals Speech-language Pathology",
        "--",
        "--",
        50,
        50,
        1
      ],
      [
        "B1.6 M",
        "Practicals Audiology",
        "--",
        "--",
        50,
        50,
        1
      ]
    ],
    "total": [
      "",
      "",
      "",
      100,
      300,
      400,
      12
    ]
  },
  {
    "sem": 2,
    "rows": [
      [
        "B2.1 M",
        "Fluency and its Disorders",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B2.2 M",
        "Diagnostic Audiology - Basic",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B2.3 MC",
        "Linguistics and Phonetics",
        "--",
        25,
        50,
        75,
        3
      ],
      [
        "B2.4 MC",
        "Otolaryngology",
        "--",
        25,
        50,
        75,
        3
      ],
      [
        "B2.5 MO",
        "Optional Minor - 1",
        "--",
        10,
        40,
        50,
        1
      ],
      [
        "B2.6 M",
        "Clinicals in Speech-language Pathology",
        "--",
        25,
        50,
        75,
        1
      ],
      [
        "B2.7 M",
        "Clinicals in Audiology",
        "--",
        25,
        50,
        75,
        1
      ]
    ],
    "total": [
      "",
      "",
      50,
      160,
      340,
      550,
      17
    ]
  },
  {
    "sem": 3,
    "rows": [
      [
        "B3.1 M",
        "Child Language Disorders",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B3.2 M",
        "Amplification Devices",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B3.3 MC",
        "Electronics and Acoustics",
        "--",
        25,
        50,
        75,
        3
      ],
      [
        "B3.4 MC",
        "Psychology for Speech and Hearing",
        "--",
        25,
        50,
        75,
        3
      ],
      [
        "B3.5 MO",
        "Optional Minor - 2",
        "--",
        10,
        40,
        50,
        1
      ],
      [
        "B3.6 M",
        "Clinicals in Speech-language Pathology",
        "--",
        25,
        50,
        75,
        3
      ],
      [
        "B3.7 M",
        "Clinicals in Audiology",
        "--",
        25,
        50,
        75,
        3
      ]
    ],
    "total": [
      "",
      "",
      50,
      160,
      340,
      550,
      21
    ]
  },
  {
    "sem": 4,
    "rows": [
      [
        "B4.1 M",
        "Structural Anomalies and Speech Sound Disorders",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B4.2 M",
        "Diagnostic Audiology - Advanced",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B4.3 MC",
        "Neurology",
        "--",
        25,
        50,
        75,
        3
      ],
      [
        "B4.4 MC",
        "Research Methods & Statistics",
        "--",
        25,
        50,
        75,
        3
      ],
      [
        "B4.5 MO",
        "Optional Minor - 3",
        "--",
        10,
        40,
        50,
        1
      ],
      [
        "B4.6 M",
        "Clinicals in Speech-language Pathology",
        "--",
        25,
        50,
        75,
        3
      ],
      [
        "B4.7 M",
        "Clinicals in Audiology",
        "--",
        25,
        50,
        75,
        3
      ]
    ],
    "total": [
      "",
      "",
      50,
      160,
      340,
      550,
      21
    ]
  },
  {
    "sem": 5,
    "rows": [
      [
        "B5.1 M",
        "Voice Disorders and Laryngectomy",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B5.2 M",
        "Motor Speech Disorders - Children",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B5.3 M",
        "Pediatric Audiology",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B5.4 M",
        "Aural Habilitation",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B5.5 MO",
        "Optional Minor - 4",
        "--",
        10,
        40,
        50,
        1
      ],
      [
        "B5.6 M",
        "Clinicals in Speech-language Pathology",
        "--",
        25,
        50,
        75,
        3
      ],
      [
        "B5.7 M",
        "Clinicals in Audiology",
        "--",
        25,
        50,
        75,
        3
      ]
    ],
    "total": [
      "",
      "",
      100,
      160,
      340,
      600,
      23
    ]
  },
  {
    "sem": 6,
    "rows": [
      [
        "B6.1 M",
        "Adult Language Disorders",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B6.2 M",
        "Motor Speech Disorders - Adults",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B6.3 M",
        "Implantable Devices",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B6.4 M",
        "Audiology in Practice",
        25,
        25,
        50,
        100,
        4
      ],
      [
        "B6.5 MC",
        "RCI Course",
        "--",
        25,
        75,
        100,
        4
      ],
      [
        "B6.6 M",
        "Clinicals in Speech-language Pathology",
        "--",
        25,
        50,
        75,
        3
      ],
      [
        "B6.7 M",
        "Clinicals in Audiology",
        "--",
        25,
        50,
        75,
        3
      ]
    ],
    "total": [
      "",
      "",
      100,
      175,
      375,
      650,
      26
    ]
  },
  {
    "sem": 7,
    "rows": [
      [
        "B7.1 M",
        "Clinicals in Speech-language Pathology (internship)",
        "--",
        "--",
        100,
        100,
        20
      ],
      [
        "B7.2 M",
        "Clinicals in Audiology (internship)",
        "--",
        "--",
        100,
        100,
        20
      ]
    ],
    "total": [
      "",
      "",
      "",
      "",
      200,
      200,
      40
    ]
  }
];

/* Grand total row of the Scheme of Examination. */
const EXAM_GRAND_TOTAL = [
  "",
  "",
  350,
  915,
  2235,
  3500,
  160
];

/* Credit distribution (RCI clause 7.3). * includes the 20 credits earned during internship. */
const CREDIT_STRUCTURE = [
  {
    "label": "Major (M) - Speech-language Pathology Theory",
    "credits": 32
  },
  {
    "label": "Major (M) - Audiology Theory",
    "credits": 32
  },
  {
    "label": "Major (M) - Speech-language Pathology Clinicals*",
    "credits": 33
  },
  {
    "label": "Major (M) - Audiology Clinicals*",
    "credits": 33
  },
  {
    "label": "Minor Compulsory (MC) - Related Areas",
    "credits": 22
  },
  {
    "label": "Minor Compulsory (MC) - RCI",
    "credits": 4
  },
  {
    "label": "Minor Optional (MO) - Related Areas",
    "credits": 4
  }
];

/* Permitted Minor (Optional) courses (RCI clause 7.9). Institutions design their curriculum. */
const MINOR_OPTIONS = [
  "Developmental Pediatrics",
  "Genetics",
  "Counseling and Guidance",
  "Basics of Sign Language",
  "CBR",
  "Dysphagia",
  "Auditory Habilitation",
  "Vestibular Disorders",
  "Disability Certification",
  "ASLP in Practice",
  "AAC",
  "Telerehabilitation"
];

/* Semester 1 weekly timetable, TPC 2026 batch. */
const TIMETABLE = {
  "meta": {
    "title": "BASLP First Semester - Weekly Timetable (October 2026)",
    "batch": "The Precision Clinicians (TPC 2026)",
    "year": "2026-27",
    "timings": "8:30 AM - 3:30 PM",
    "lunch": "12:30 - 1:30 PM"
  },
  "slots": [
    "8:30 - 9:30",
    "9:30 - 10:30",
    "10:30 - 11:30",
    "11:30 - 12:30",
    "1:30 - 2:30",
    "2:30 - 3:30"
  ],
  "days": [
    {
      "day": "Monday",
      "periods": [
        {
          "subject": "B1.3 MC – A&P of Speech & Swallowing",
          "faculty": "Ms. Swathi",
          "kind": "allied"
        },
        {
          "subject": "B1.3 MC – A&P of Speech & Swallowing",
          "faculty": "Ms. Swathi",
          "kind": "allied"
        },
        {
          "subject": "B1.4 MC – A&P of Hearing",
          "faculty": "Dr. Vibha K",
          "kind": "allied"
        },
        {
          "subject": "B1.4 MC – A&P of Hearing",
          "faculty": "Dr. Vibha K",
          "kind": "allied"
        },
        {
          "subject": "B1.2 M – Introduction to Audiology",
          "faculty": "Ms. Nimalka",
          "kind": "aud"
        },
        {
          "subject": "B1.2 M – Introduction to Audiology",
          "faculty": "Ms. Nimalka",
          "kind": "aud"
        }
      ]
    },
    {
      "day": "Tuesday",
      "periods": [
        {
          "subject": "COI / Library & ICT / Mentor–Mentee",
          "faculty": "Subject Expert / Mentors",
          "kind": "self"
        },
        {
          "subject": "COI / Library & ICT / Mentor–Mentee",
          "faculty": "Subject Expert / Mentors",
          "kind": "self"
        },
        {
          "subject": "B1.1 M – Introduction to Speech-Language Pathology",
          "faculty": "Ms. Minusha I.S",
          "kind": "slp"
        },
        {
          "subject": "B1.1 M – Introduction to Speech-Language Pathology",
          "faculty": "Ms. Minusha I.S",
          "kind": "slp"
        },
        {
          "subject": "B1.5 M – Practicals: Speech-Language Pathology",
          "faculty": "Ms. Rachana R Uchil",
          "kind": "slp"
        },
        {
          "subject": "B1.5 M – Practicals: Speech-Language Pathology",
          "faculty": "Ms. Rachana R Uchil",
          "kind": "slp"
        }
      ]
    },
    {
      "day": "Wednesday",
      "periods": [
        {
          "subject": "B1.2 M – Introduction to Audiology",
          "faculty": "Ms. Nimalka",
          "kind": "aud"
        },
        {
          "subject": "B1.2 M – Introduction to Audiology",
          "faculty": "Ms. Nimalka",
          "kind": "aud"
        },
        {
          "subject": "B1.4 MC – A&P of Hearing",
          "faculty": "Dr. Vibha K",
          "kind": "allied"
        },
        {
          "subject": "B1.4 MC – A&P of Hearing",
          "faculty": "Dr. Vibha K",
          "kind": "allied"
        },
        {
          "subject": "Faculty class (if available); else Mentor–Mentee / Library & ICT",
          "faculty": "",
          "kind": "reserved"
        },
        {
          "subject": "Faculty class (if available); else Mentor–Mentee / Library & ICT",
          "faculty": "",
          "kind": "reserved"
        }
      ]
    },
    {
      "day": "Thursday",
      "periods": [
        {
          "subject": "Clinical Posting – SLP / Audiology",
          "faculty": "Supervisors per roster",
          "kind": "clinical"
        },
        {
          "subject": "Clinical Posting – SLP / Audiology",
          "faculty": "Supervisors per roster",
          "kind": "clinical"
        },
        {
          "subject": "Clinical Posting – SLP / Audiology",
          "faculty": "Supervisors per roster",
          "kind": "clinical"
        },
        {
          "subject": "Clinical Posting – SLP / Audiology",
          "faculty": "Supervisors per roster",
          "kind": "clinical"
        },
        {
          "subject": "B1.1 M – Introduction to Speech-Language Pathology",
          "faculty": "Ms. Minusha I.S",
          "kind": "slp"
        },
        {
          "subject": "B1.1 M – Introduction to Speech-Language Pathology",
          "faculty": "Ms. Minusha I.S",
          "kind": "slp"
        }
      ]
    },
    {
      "day": "Friday",
      "periods": [
        {
          "subject": "Clinical Conference",
          "faculty": "Department Faculty",
          "kind": "clinical"
        },
        {
          "subject": "Clinical Conference / Library (till 10:30)",
          "faculty": "",
          "kind": "clinical"
        },
        {
          "subject": "Basic & Advanced Kannada Learning",
          "faculty": "Subject Expert",
          "kind": "allied"
        },
        {
          "subject": "Basic & Advanced Kannada Learning",
          "faculty": "Subject Expert",
          "kind": "allied"
        },
        {
          "subject": "Environmental Studies (University)",
          "faculty": "Subject Expert",
          "kind": "allied"
        },
        {
          "subject": "Environmental Studies (University)",
          "faculty": "Subject Expert",
          "kind": "allied"
        }
      ]
    },
    {
      "day": "Saturday",
      "periods": [
        {
          "subject": "B1.2 M – Introduction to Audiology",
          "faculty": "Ms. Nimalka",
          "kind": "aud"
        },
        {
          "subject": "B1.2 M – Introduction to Audiology",
          "faculty": "Ms. Nimalka",
          "kind": "aud"
        },
        {
          "subject": "B1.3 MC – A&P of Speech & Swallowing",
          "faculty": "Ms. Swathi",
          "kind": "allied"
        },
        {
          "subject": "B1.3 MC – A&P of Speech & Swallowing",
          "faculty": "Ms. Swathi",
          "kind": "allied"
        },
        {
          "subject": "COI – Constitution of India (University)",
          "faculty": "Subject Expert",
          "kind": "allied"
        },
        {
          "subject": "COI – Constitution of India (University)",
          "faculty": "Subject Expert",
          "kind": "allied"
        }
      ]
    }
  ],
  "notes": [
    "If two or more hours remain unengaged by the concerned faculty, students shall report to the clinics and continue as per their assigned clinical postings.",
    "Tuesday 8:30–10:30 is reserved for Constitution of India / Library & ICT / Mentor–Mentee.",
    "Wednesday 1:30–3:30 may be used by any available faculty for class; if no class is scheduled, Mentor–Mentee and Library & ICT shall continue.",
    "Dr. Nidhi's Anatomy Unit-01 slot on Tuesday has been withdrawn.",
    "B1.6 M Practicals: Audiology may be conducted with Audiology Supervisors during clinical postings or other unengaged hours unless separately notified."
  ]
};

/* Scrolling notice ticker items shown under the navigation. */
const NOTICES = [
  {
    "tag": "EXAMS",
    "text": "CoE notice 06.11.2026: University theory exams for I, III and V Semester B.ASLP commence 11 December 2026. The paper-wise timetable will be intimated shortly."
  },
  {
    "tag": "QUEST",
    "text": "Semester I self-study timetable: 6:15 am recall, college 8:30–3:30, then 5:15–9:05 pm. 12 November to 10 December. Download the PDF from the timetable."
  },
  {
    "tag": "2ND IA",
    "text": "2nd Internal Assessment: 2–7 November, 8:45–9:45 AM, one paper a day. Timetable under IA Results."
  },
  {
    "tag": "ATTENDANCE",
    "text": "Class attendance to 22 October is published: see Attendance. Personal statements are shared individually."
  },
  {
    "tag": "RESULTS",
    "text": "1st IA results are complete in all four papers (Intro to Audiology added): see IA Results for the class analytics and marks list."
  },
  {
    "tag": "TIMETABLE",
    "text": "Weekly timetable updated for October 2026. Unengaged hours: report to your clinical posting."
  },
  {
    "tag": "BUS",
    "text": "College bus: 8:10 AM from Your Space Hostel, Kuthar. Return 3:40 PM shuttle and 4:10 PM."
  },
  {
    "tag": "MENTOR",
    "text": "Mentor-Mentee meeting on the first Saturday of every month, 11:30 AM."
  },
  {
    "tag": "CLINICS",
    "text": "Clinical logbook entries must be written and signed on the same day as the posting."
  },
  {
    "tag": "EXAMS",
    "text": "The earlier date of 14 December is superseded. Theory exams open on 11 December 2026. Practical dates are not in this notice."
  },
  {
    "tag": "ATTEND",
    "text": "Attendance requirement: 80% in theory and 90% in clinicals, every subject, every semester."
  }
];

/* Department profile and contact details. */
const DEPARTMENT = {
  "glance": "Our department began in 2009 within Otorhinolaryngology and became an independent department in 2020. Accredited by the Rehabilitation Council of India, we blend classroom learning with hands-on clinical training, using state-of-the-art technology for screening, diagnostic and rehabilitative services.",
  "milestones": [
    {
      "value": "2009",
      "label": "Roots established under the Dept. of Otorhinolaryngology"
    },
    {
      "value": "2020",
      "label": "Became an independent academic department"
    },
    {
      "value": "RCI",
      "label": "Approved by the Rehabilitation Council of India"
    },
    {
      "value": "4 yrs",
      "label": "BASLP: 3 years of study + 10 months of internship"
    }
  ],
  "email": "hemaraja@yenepoya.edu.in",
  "phone": "9449499659",
  "hours": "Mon to Sat, 8:30 AM to 3:30 PM",
  "address": "Yenepoya Medical College Hospital, Deralakatte, Mangaluru 575018"
};

/* Batch roster - student NAMES ONLY. Campus IDs, contact details, marks and fee status are intentionally excluded because this site is public. */
const BATCH = {
  "name": "The Precision Clinicians",
  "year": "2026-27",
  "strength": 22,
  "hostellers": 12,
  "day_scholars": 10,
  "students": [
    "Aleena O P",
    "Ameena Filza",
    "Devina Thankam Mathew",
    "Fathima Rena P P",
    "Fathima Sheha C H",
    "Fathima Sheza Kurumkadan",
    "Fathimath Asna",
    "Fathimath Nuha K C",
    "Fathimath Safa",
    "Fathimath Salva K C",
    "Fathimathu Riza Haris",
    "Haya Ibarahim Rahmathulla",
    "Hiba Fathima",
    "Mohammed Niadh",
    "Nadha Fathima",
    "Naja Nasrin C",
    "Nasna Sherin P M",
    "Noula",
    "Raniya Nasrin M",
    "Rida Rihana Zameel",
    "Saliha Zakir Hussain",
    "Shimaaz Asiya"
  ]
};

/* Teaching faculty, clinical supervisors and support staff, grouped by "group". Transcribed from Ms. Pavana M J's Deeksharambh '26 department introduction. */
const FACULTY = [
  {
    "group": "Teaching Faculty",
    "name": "Dr. Shwetha Prabhu",
    "designation": "Professor & Head of the Department",
    "credentials": "Ph.D. | MASLP | RCI & ISHA Life Member",
    "teaches": "Anatomy & Physiology of Speech and Swallowing",
    "points": [
      "Leads the department's academics, clinical services and research; Head of the Department since 2020",
      "Ph.D. (2025), Kasturba Medical College, Manipal Academy of Higher Education; MASLP, Mangalore University",
      "Chairperson of the Board of Studies and Associate Editor on the JISHA editorial board",
      "Research on language-specific assessment and articulation disorders in multilingual, Indian contexts",
      "Your door for academic guidance, grievances and big ideas alike"
    ],
    "focus": [
      "Articulation disorders",
      "Multilingual assessment",
      "Clinical services",
      "Research & academics",
      "Youth Red Cross"
    ]
  },
  {
    "group": "Teaching Faculty",
    "name": "Mr. Hemaraja Nayaka S",
    "designation": "Associate Professor | Class Coordinator",
    "credentials": "MASLP | Voice & Acoustics",
    "teaches": "Speech-Language Pathology Theory",
    "points": [
      "Class Coordinator and first point of contact for the TPC Batch 2026",
      "Clinical and research interests in voice science, acoustic analysis and diagnostic audiology",
      "Published on voice acoustics after adenotonsillectomy, voice in long-term inhaler users, and tinnitus and hyperacusis in noise-exposed workers",
      "Leads the Virtual Technology & Simulation Lab orientation",
      "Anchors your sessions on time management and commencement of classes"
    ],
    "focus": [
      "Voice science",
      "Acoustic analysis",
      "Diagnostic audiology",
      "Tinnitus & hyperacusis",
      "Simulation training"
    ]
  },
  {
    "group": "Teaching Faculty",
    "name": "Ms. Pavana M J",
    "designation": "Assistant Professor",
    "credentials": "Ph.D. Scholar | MASLP | Music Therapist",
    "teaches": "Speech-Language Pathology Theory",
    "points": [
      "Doctoral research on Indian music therapy and cognitive-communicative abilities in Parkinsonism",
      "MASLP, Samvaad Institute of Speech and Hearing, Bengaluru; BASLP, Dr. M.V. Shetty College, Mangaluru",
      "4+ years of undergraduate teaching across audiology and speech-language pathology",
      "Best Oral Presentation, CogniSENSE 2025 (JSS Mysuru); Best Paper, KSB ISHACON 2024",
      "Trained in FEES at Tata Memorial Hospital; certified in music therapy and vertigo rehabilitation",
      "Coordinates the Mentor-Mentee programme with Mr. Hemaraja Nayaka S"
    ],
    "focus": [
      "Dysphagia",
      "Voice",
      "Fluency",
      "Music therapy",
      "Neuro-communication",
      "Auditory verbal therapy"
    ]
  },
  {
    "group": "Teaching Faculty",
    "name": "Ms. Shana Mariyam Basheer",
    "designation": "Assistant Professor",
    "credentials": "MASLP | Audiology",
    "teaches": "",
    "points": [
      "Teaches hearing anatomy, physiology and advanced audiological evaluation",
      "Coordinates departmental audits, academic quality and curriculum development",
      "Clinical interests across diagnostic audiology and undergraduate clinical training"
    ],
    "focus": [
      "Hearing anatomy",
      "Audiological evaluation",
      "Curriculum & quality",
      "Academic mentoring"
    ]
  },
  {
    "group": "Teaching Faculty",
    "name": "Ms. Merin Mathews",
    "designation": "Associate Professor",
    "credentials": "MASLP | Audiology",
    "teaches": "",
    "points": [
      "Clinical focus on diagnostic audiology and hearing assessment across all ages",
      "Guides undergraduate clinical postings in the audiology wing",
      "Supports newborn and school hearing screening programmes",
      "A steady early guide as you take your first steps into the audiology clinic"
    ],
    "focus": [
      "Diagnostic audiology",
      "Hearing assessment",
      "Paediatric audiology",
      "Clinical teaching"
    ]
  },
  {
    "group": "Teaching Faculty",
    "name": "Ms. Priyanka Nayak",
    "designation": "Assistant Professor",
    "credentials": "MSLP | Shaila Vora Awardee",
    "teaches": "Speech-Language Pathology Theory",
    "points": [
      "MSLP (2020) and BASLP (2018), Manipal Academy of Higher Education",
      "Recipient of the Shaila Vora Award at the 52nd ISHACON (2020)",
      "National conference work on paediatric dysphagia, autism intervention and music-based therapy",
      "Lifetime member of the Rehabilitation Council of India and ISHA",
      "Co-coordinates the NSS unit"
    ],
    "focus": [
      "Paediatric SLP",
      "Dysphagia",
      "Autism intervention",
      "Community service",
      "Music-based therapy"
    ]
  },
  {
    "group": "Teaching Faculty",
    "name": "Ms. Nimalka Maria Sequeira",
    "designation": "Associate Professor",
    "credentials": "MASLP | Audiology & Vestibular Sciences",
    "teaches": "Audiology Theory",
    "points": [
      "Clinical and research interests in audiology and vestibular sciences",
      "Active research output in balance and hearing sciences",
      "Mentors students on clinical conduct and patient-first values",
      "A go-to voice for questions on balance, dizziness and vestibular assessment"
    ],
    "focus": [
      "Audiology",
      "Vestibular sciences",
      "Balance assessment",
      "Professional ethics"
    ]
  },
  {
    "group": "Teaching Faculty",
    "name": "Mr. Srikanth Nayak",
    "designation": "Associate Professor",
    "credentials": "M.Sc. Audiology | Ph.D. Scholar",
    "teaches": "Audiology Practical / Clinical Teaching",
    "points": [
      "Ph.D. scholar in audiology; research in electrophysiology and psychoacoustics",
      "Work spans auditory brainstem response, hearing aids and binaural beamforming",
      "Champions technology-enabled learning and research tools across the programme",
      "Your go-to faculty for academic computing and research methods"
    ],
    "focus": [
      "Electrophysiology",
      "Psychoacoustics",
      "Hearing aids",
      "Auditory perception",
      "Research methods"
    ]
  },
  {
    "group": "Teaching Faculty",
    "name": "Dr. Vibha Kanagokar",
    "designation": "Professor, Audiology",
    "credentials": "MASLP | Audiology",
    "teaches": "Anatomy & Physiology of Hearing",
    "points": [
      "Research interests in auditory evoked potentials and auditory processing",
      "Work on hearing aids, cochlear implants, otoacoustic emissions and spatial hearing",
      "Helps first-years build effective, sustainable study habits",
      "Pairs strong clinical knowledge with a focus on how you learn best"
    ],
    "focus": [
      "Auditory processing",
      "Evoked potentials",
      "Cochlear implants",
      "Spatial hearing",
      "Study skills"
    ]
  },
  {
    "group": "Teaching Faculty",
    "name": "Ms. Pratheeksha B",
    "designation": "Assistant Professor, Audiology",
    "credentials": "Audiology",
    "teaches": "Audiology practicals and clinical postings",
    "points": [
      "Assistant Professor in Audiology in the Department of Audiology & Speech-Language Pathology",
      "Teaches and supervises undergraduate audiology practicals and clinical postings",
      "Clinical focus on audiological assessment and hearing rehabilitation",
      "Guides students through diagnostic procedures in the audiology clinic"
    ],
    "focus": [
      "Audiology",
      "Audiological assessment",
      "Clinical supervision",
      "Student mentoring"
    ]
  },
  {
    "group": "Teaching Faculty",
    "name": "Mrs. Minusha I S",
    "designation": "Assistant Professor, Speech-Language Pathology",
    "credentials": "Speech-Language Pathology",
    "teaches": "Speech-language practicals and therapy postings",
    "points": [
      "Assistant Professor in Speech-Language Pathology in the Department of Audiology & SLP",
      "Teaches and supervises undergraduate speech-language pathology practicals and postings",
      "Clinical focus on speech and language assessment and therapy",
      "Guides students through therapy sessions in the SLP clinic"
    ],
    "focus": [
      "Speech-Language Pathology",
      "Speech & language therapy",
      "Clinical supervision",
      "Student mentoring"
    ]
  },
  {
    "group": "Clinical Supervisors",
    "name": "Ms. Rachana R Uchil",
    "designation": "Clinical Supervisor",
    "credentials": "Speech-Language Pathology",
    "teaches": "SLP clinical postings",
    "points": [
      "Clinical Supervisor in the Department of Audiology & Speech-Language Pathology",
      "Supervises undergraduate clinical postings, therapy sessions and logbooks"
    ],
    "focus": [
      "SLP clinics",
      "Clinical supervision",
      "Youth Red Cross",
      "Student guidance"
    ]
  },
  {
    "group": "Clinical Supervisors",
    "name": "Ms. Niha Kuraisha",
    "designation": "Clinical Supervisor",
    "credentials": "Audiology & Speech-Language Pathology",
    "teaches": "Clinical postings and case work",
    "points": [
      "Clinical Supervisor in the Department of Audiology & Speech-Language Pathology",
      "Supervises students through their clinical postings and case work"
    ],
    "focus": [
      "Clinical supervision",
      "Community outreach",
      "Scope of practice",
      "Student guidance"
    ]
  },
  {
    "group": "Clinical Supervisors",
    "name": "Ms. Shadaf",
    "designation": "Clinical Supervisor",
    "credentials": "Audiology",
    "teaches": "Audiology clinics",
    "points": [
      "Clinical Supervisor in the Department of Audiology & Speech-Language Pathology",
      "Supervises students through audiology postings and test procedures",
      "One of the first people you will work beside in the audiology clinic"
    ],
    "focus": [
      "Audiology clinics",
      "Clinical supervision",
      "Test procedures",
      "Student guidance"
    ]
  },
  {
    "group": "Clinical Supervisors",
    "name": "Ms. Kashvi",
    "designation": "Clinical Supervisor",
    "credentials": "Our alumna | Newly joined to the team",
    "teaches": "Clinical postings",
    "points": [
      "Our own alumna: she studied BASLP in this very department",
      "Returned to the department as a Clinical Supervisor, where she once trained as a student",
      "Supervises students through their clinical postings",
      "Proof of where the next four years can take you"
    ],
    "focus": [
      "Clinical supervision",
      "Audiology & SLP clinics",
      "Student guidance",
      "Alumna of the dept."
    ]
  },
  {
    "group": "Support Staff",
    "name": "Ms. Pooja",
    "designation": "SDA, Dept. of Audiology & SLP",
    "credentials": "Technical & administrative coordination",
    "teaches": "Forms, records, attendance and office paperwork",
    "points": [
      "SDA for the Department of Audiology & Speech-Language Pathology",
      "Handles the department's technical and administrative coordination",
      "Your first stop for forms, records, attendance and office paperwork"
    ],
    "focus": [
      "Administration",
      "Records & documentation",
      "Student paperwork",
      "Event coordination"
    ]
  },
  {
    "group": "Support Staff",
    "name": "Mr. Faizal",
    "designation": "Lab Attendant",
    "credentials": "Labs & clinical set-up",
    "teaches": "Labs and clinics, from your first practical onwards",
    "points": [
      "Lab Attendant for the Department of Audiology & Speech-Language Pathology",
      "Keeps the department's labs and clinics ready for every session",
      "Supports equipment set-up for audiology and speech-language testing",
      "A familiar, helpful face in the labs from your very first practical onwards"
    ],
    "focus": [
      "Lab readiness",
      "Equipment support",
      "Clinical set-up",
      "Student assistance"
    ]
  }
];

/* Master Academic Calendar 2026-27. */
const CALENDAR = [
  {
    "sem": "Semester I: July 2026 - December 2026",
    "weeks": [
      [
        "W1",
        "Jul 20 - 25",
        "Orientation & Induction",
        "Jul 20: Semester Commencement"
      ],
      [
        "W2",
        "Jul 27 - Aug 01",
        "Theory Intensive Block",
        ""
      ],
      [
        "W3",
        "Aug 03 - 08",
        "Theory & Lab Practicals",
        ""
      ],
      [
        "W4",
        "Aug 10 - 15",
        "Clinical Rotation Prep",
        "Aug 15: Independence Day (Holiday)"
      ],
      [
        "W5",
        "Aug 17 - 22",
        "Clinical Rotation Block I",
        ""
      ],
      [
        "W6",
        "Aug 24 - 29",
        "Clinical Rotation Block I",
        ""
      ],
      [
        "W7",
        "Aug 31 - Sep 05",
        "Clinical Rotation Block I",
        ""
      ],
      [
        "W8",
        "Sep 07 - 12",
        "Theory Review Week",
        ""
      ],
      [
        "W9",
        "Sep 14 - 19",
        "Internal Assessments",
        "Sep 14: Ganesha Chaturthi (Holiday)"
      ],
      [
        "W10",
        "Sep 21 - 26",
        "Post-Assessment Review",
        "Parent-Teacher Meeting (Tentative)"
      ],
      [
        "W11",
        "Sep 28 - Oct 03",
        "Clinical Rotation Block II",
        ""
      ],
      [
        "W12",
        "Oct 05 - 10",
        "Clinical Rotation Block II",
        "Oct 02: Gandhi Jayanti (Holiday)"
      ],
      [
        "W13",
        "Oct 12 - 17",
        "Theory Intensive Week",
        ""
      ],
      [
        "W14",
        "Oct 19 - 24",
        "Clinical Rotation Block II",
        "Oct 21: Vijaya Dashami (Holiday)"
      ],
      [
        "W15",
        "Oct 26 - 31",
        "Classes & Clinical Postings",
        "2nd Internal Assessment moved to Nov 02 - 07"
      ],
      [
        "W16",
        "Nov 02 - 07",
        "Internal Assessments",
        "2nd Internal Assessment: one paper a day, 8:45 - 9:45 AM"
      ],
      [
        "W17",
        "Nov 09 - 14",
        "Theory Focus & Wrap-up",
        "Nov 10: Deepavali (Holiday)"
      ],
      [
        "W18",
        "Nov 16 - 21",
        "Institutional Mock Exams",
        ""
      ],
      [
        "W19",
        "Nov 23 - 28",
        "Revision Block",
        ""
      ],
      [
        "W20",
        "Nov 30 - Dec 05",
        "Pre-University Revision",
        ""
      ],
      [
        "W21",
        "Dec 07 - 12",
        "Revision camp, then theory exams",
        "CoE notification 06.11.2026: I, III and V semester theory exams commence 11 December 2026. Paper-wise timetable awaited. 7-10 December is the Exam Quest revision camp."
      ],
      [
        "W22",
        "Dec 14 - 19",
        "University theory exams",
        "December 2026 session continues. Theory exams opened on 11 December 2026. Practical dates are not in the CoE notice yet."
      ],
      [
        "W23",
        "Dec 21 - 26",
        "Practical Exams",
        "External Practical Viva-Voce"
      ],
      [
        "W24",
        "Dec 28 - Jan 02",
        "Winter Break",
        "Dec 25: Christmas (Holiday)"
      ]
    ]
  },
  {
    "sem": "Semester II: January 2027 - June 2027",
    "weeks": [
      [
        "W1",
        "Jan 04 - 09",
        "Winter Break Continues",
        ""
      ],
      [
        "W2",
        "Jan 11 - 16",
        "Semester Re-opening",
        "Jan 11: Registration & Classes Begin"
      ],
      [
        "W3",
        "Jan 18 - 23",
        "Theory Intensive Block",
        "Jan 26: Republic Day (Holiday)"
      ],
      [
        "W4",
        "Jan 25 - 30",
        "Theory & Lab Practicals",
        "National Speech-Language Webinar (Tentative)"
      ],
      [
        "W5",
        "Feb 01 - 06",
        "Clinical Rotation Cycle I",
        ""
      ],
      [
        "W6",
        "Feb 08 - 13",
        "Clinical Rotation Block I",
        ""
      ],
      [
        "W7",
        "Feb 15 - 20",
        "Clinical Rotation Block I",
        "Annual Sports & Cultural Week (Tentative)"
      ],
      [
        "W8",
        "Feb 22 - 27",
        "Theory Review Week",
        ""
      ],
      [
        "W9",
        "Mar 01 - 06",
        "Theory Focus Block",
        ""
      ],
      [
        "W10",
        "Mar 08 - 13",
        "Clinical Rotation Block II",
        ""
      ],
      [
        "W11",
        "Mar 15 - 20",
        "Clinical Rotation Block II",
        "Mar 21: Id-Ul-Fitr (Holiday)*"
      ],
      [
        "W12",
        "Mar 22 - 27",
        "Internal Assessments",
        "First Internal Written & Practical Exam"
      ],
      [
        "W13",
        "Mar 29 - Apr 03",
        "Post-Assessment Review",
        "Apr 03: Good Friday (Holiday)"
      ],
      [
        "W14",
        "Apr 05 - 10",
        "Clinical Rotation Block II",
        "Parent-Teacher Meeting (Tentative)"
      ],
      [
        "W15",
        "Apr 12 - 17",
        "Clinical Rotation Block III",
        "Apr 14: Dr. B.R. Ambedkar Jayanti (Holiday)"
      ],
      [
        "W16",
        "Apr 19 - 24",
        "Theory Intensive Week",
        ""
      ],
      [
        "W17",
        "Apr 26 - May 01",
        "Internal Assessments",
        "Second Internal Written & Practical Exam"
      ],
      [
        "W18",
        "May 03 - 08",
        "Post-Exam Clinicals",
        "May 01: May Day (Holiday)"
      ],
      [
        "W19",
        "May 10 - 15",
        "Last Working Day Checklist",
        "Logbook Submission Deadline"
      ],
      [
        "W20",
        "May 17 - 22",
        "Study Leave",
        "Mandatory Institutional Study Leave"
      ],
      [
        "W21",
        "May 24 - 29",
        "University Exams",
        "End-Semester Theory Examinations"
      ],
      [
        "W22",
        "May 31 - Jun 05",
        "University Exams",
        "Theory Exams Continue"
      ],
      [
        "W23",
        "Jun 07 - 12",
        "Practical Exams",
        "External Clinical Practicals/Viva"
      ],
      [
        "W24",
        "Jun 14 - 19",
        "Administrative Verification",
        "Post-Exam Valuation & Tabulation"
      ],
      [
        "W25",
        "Jun 21 - 26",
        "Summer Vacation Begins",
        ""
      ]
    ]
  }
];

/* Mandatory compliance notes printed with the academic calendar. */
const CALENDAR_NOTES = [
  "Working Days: each semester is structured to exceed 100 working days (excluding exams and holidays) as per RCI mandates.",
  "Attendance - Theory: minimum 80% required to sit for University Exams.",
  "Attendance - Clinical: minimum 90% required for portfolio verification.",
  "Compensatory Hours: missed clinical hours due to approved medical leave must be cleared via weekend compensatory hours before the end of the semester.",
  "Examinations: University theory examinations for I, III and V semester B.ASLP, December 2026 session, commence on 11 December 2026 (YU/COE/Exam/Notification 1/Dec/2026, dated 06.11.2026). The earlier portal date of 14 December 2026 is superseded. The detailed timetable will be intimated by the Controller of Examinations.",
  "Holiday dates such as Id-Ul-Fitr are subject to moon sighting confirmation by the University Administration."
];

/* RCI norms and regulations governing the B.ASLP program. */
const REGULATIONS = [
  {
    "no": "1.0",
    "title": "Nomenclature",
    "body": "The nomenclature of the program shall be Bachelor in Audiology and Speech-language Pathology. B.ASLP is the short form."
  },
  {
    "no": "2.0",
    "title": "Objectives of the B.ASLP Program",
    "body": "The program equips students with knowledge and skills to function as audiologists and speech-language pathologists in different work settings; understand concepts relating to speech, language, communication, hearing and disability; screen, evaluate, diagnose and assess the severity of disorders related to speech, language, swallowing, hearing and hearing-related vestibular disorders; manage these disorders across the life span; counsel persons with disorders of communication and their family members; rehabilitate affected persons; implement public awareness and prevention programs; liaise with professionals in allied fields, administrators and policy makers; and undertake advocacy measures on behalf of persons with speech, language and hearing disorders."
  },
  {
    "no": "3.0",
    "title": "Duration of the Program",
    "body": "The program shall be of 4 academic years (eight semesters) including 1 year of internship. It shall be completed within seven years from the date of admission. An academic year consists of two semesters, each extending over a minimum period of eighteen weeks. There shall be an examination at the end of each semester."
  },
  {
    "no": "4.0",
    "title": "Eligibility for Admission",
    "body": "Candidates should have passed 10+2 or an equivalent examination securing a minimum of 50% marks, with any two or more subjects in the science stream. Relaxation in qualifying marks is as per rules of the respective University, State/UT or Central Government. Eligibility of persons with disability is assessed by a committee comprising experts in speech-language pathology, audiology, clinical psychology, pediatrics and otolaryngology. Admission under the Disability Category follows the National Medical Commission guidelines (No. U.14021-8-2023-UGMEB dated 12 June 2023) issued for the MBBS program. Foreign applicants shall obtain an equivalency certificate from the Association of Indian Universities."
  },
  {
    "no": "5.0",
    "title": "Program Structure",
    "body": "Each semester spans 6 months / 26 weeks, of which 8 weeks are study holidays and examinations, leaving 18 weeks of study duration. Classes run 5 days per week (90 days per semester), 7 hours per day, totalling 630 hours per semester."
  },
  {
    "no": "6.0",
    "title": "Attendance",
    "body": "Attendance shall not be less than 80% in theory and 90% in clinical/practicals in each semester. Students not meeting the attendance requirement shall not be allowed to take the examination in the paper with shortage of attendance and will be marked \"failed\". Such students can take the exam in that paper in the next odd or even semester as the case may be."
  },
  {
    "no": "7.0",
    "title": "Examination Pattern",
    "body": "Students shall successfully complete 160 credits to be eligible for the award of the Bachelor's degree. Practical exams at the end of the 1st semester are conducted by two internal examiners nominated by the head of the department or institution, and the record of practicals maintained by students is also evaluated. Performance in at least one written test and one assignment forms the basis for 50% of internal assessment marks each semester; the remaining 50% is awarded on continuous assessment by the faculty teaching the subject, with each institute free to develop its own criteria. All clinical examinations are conducted by one internal and one external examiner, with clinical populations and audio/video records of clinical samples; examiners also evaluate records of clinical and practical work. Examinations for all Minor Optionals (B2.5, B3.5, B4.5, B5.5) and Minor Compulsory B6.5 are conducted by the respective institution, but the marks awarded are entered in the university marks card."
  },
  {
    "no": "8.0",
    "title": "Criteria for Passing",
    "body": "The student is required to obtain a minimum of 50% in each of the theory papers, internal assessment, practical and clinical exams for a pass. Students will not be able to appear for University exams if they do not pass in their practical or internal assessment component, or clinical examination. Carryover of papers shall be as per the policy of the University. Students shall pass the clinical examination of a given semester to proceed to the next semester."
  },
  {
    "no": "9.0",
    "title": "Clinical Internship",
    "body": "All candidates shall complete a clinical internship of one academic year (10 months) after the 6th semester, provided they have passed all examinations up to and including the 5th semester. Students who have started internship but are later found to have failed some 6th semester examination shall discontinue the internship and may resume only after passing the failed courses; internship already completed is counted when they resume."
  },
  {
    "no": "11.0",
    "title": "Award of Degree",
    "body": "The University shall award the degree and issue the certificate only after the candidate successfully completes all University examinations and the clinical internship."
  },
  {
    "no": "12.0",
    "title": "Certification as a Registered Professional",
    "body": "Successful students will be registered as an Audiologist and Speech-Language Pathologist in the Central Rehabilitation Register of the Rehabilitation Council of India. The training institution should ensure that all passed out students are registered with the Council. On all other issues not mentioned in these rules and regulations, such as the pattern of question paper, grading, award of grace marks and declaration of rank, the rules and regulations of the respective university shall prevail."
  }
];

/* Clinical internship guidelines (RCI Annexure 2). */
const INTERNSHIP = {
  "objectives": [
    "Facilitate transition from academic training to independent practice.",
    "Provide additional inputs to attain and maintain competence in the clinical management of persons with communication disorders.",
    "Equip students with skills to initiate group and individual action focusing on prevention, early identification and intervention at the level of the individual, family and community.",
    "Provide training to understand professional responsibilities and ethical practices, including the rights and dignity of patients, consultation and referral to other professionals, and professional obligations to peers, patients, families and the community."
  ],
  "guidelines": [
    {
      "title": "Mandatory",
      "body": "Internship is mandatory for all candidates."
    },
    {
      "title": "Duration",
      "body": "One academic year (10 months) split into two semesters (7 and 8)."
    },
    {
      "title": "Eligibility",
      "body": "Clinical internship starts immediately after the candidate completes academic and clinical training up to the 6th semester, read together with Clause 9.2 of the Rules and Regulations."
    },
    {
      "title": "Structure and duration of posting",
      "body": "Parent institutions decide the posting institutions, but students may be posted only at institutions approved by the Rehabilitation Council of India. Students shall do their internship at an institute outside the parent institute for the duration of at least one semester, at places such as hospitals, special educational centres/schools, and centres with facilities for ASD management, cochlear implantation and AVT. Institutions shall attempt to provide additional training in areas such as management of neurologically afflicted persons, prevention and early intervention programs, community based rehabilitation, occupational health programs, and structural abnormalities related to speech and hearing."
    },
    {
      "title": "Supervision",
      "body": "A speech-language pathologist and audiologist shall generally supervise students even in outside postings. In their absence, a specialist from an allied area such as otolaryngology, neurology, mental health or pediatrics may supervise."
    },
    {
      "title": "Maintenance of records",
      "body": "Every student shall maintain records of the number of hours of clinical work in different areas, clinical statistics, and work carried out in each institute, certified by the head of the institution or nominee where the internship is undertaken."
    },
    {
      "title": "Leave",
      "body": "Candidates should have attendance of at least 90% during the internship period. Internship shall be extended by the number of days the student falls short of 90% attendance. Compensatory work for shortage, if feasible, must be completed before the final clinical exams at the end of the 8th semester."
    },
    {
      "title": "Stipend and fees",
      "body": "As per the norms of the parent as well as the receiving institute."
    },
    {
      "title": "Grading and evaluation",
      "body": "All internees are assessed on attendance, performance in postings and presentation of log books. The mode and frequency of assessment is prescribed by the institute. The student is required to repeat those postings in which performance is below 40%."
    },
    {
      "title": "Certification",
      "body": "The parent institute awards a certificate after successful completion of the internship and clinical examination (B7.1 and B7.2). Supervised clinical hours spent during internship are included in the clinical competence certificate issued to students. The University shall award the degree only after successful completion of the internship and the final clinical exams thereafter."
    }
  ]
};

/* Yenepoya student code of conduct and disciplinary framework. */
const CONDUCT = [
  {
    "icon": "star",
    "title": "Institutional Philosophy and Professional Ethos",
    "items": [
      "The B.ASLP program at Yenepoya Medical College trains healthcare professionals to evaluate, diagnose and clinically manage speech, language, swallowing and hearing disorders across all age groups.",
      "As clinical scientists, students must maintain absolute academic integrity, professional objectivity and deep empathy.",
      "Standards safeguard patient safety, institutional reputation and professional ethics as prescribed by the RCI and aligned with the ASHA Code of Ethics."
    ]
  },
  {
    "icon": "check",
    "title": "Attendance Regulations (RCI Mandated)",
    "items": [
      "Theory: minimum 80% attendance in theory lectures for each subject across semesters. Students falling below 80% will be debarred from the respective theory examinations. No condonation is permitted without valid medical documentation approved by the Dean.",
      "Clinical practicum: minimum 90% attendance is mandatory for all clinical postings, practical sessions and hospital rotations, verified through signed clinical logbooks. Failure to maintain up-to-date logbooks results in non-acceptance of clinical hours.",
      "Internship: 90% attendance is compulsory during the year-long internship. Any shortage results in a non-negotiable extension of the internship by the exact number of deficit days.",
      "Leave: all applications must be submitted in writing and pre-sanctioned by the Head of the Department. Medical leave requires verification by the institutional medical board."
    ]
  },
  {
    "icon": "stethoscope",
    "title": "Clinical Presence and Professional Conduct",
    "items": [
      "Report precisely at scheduled times to assigned clinics (Audiology / Speech-Language Pathology / Hospital OPDs).",
      "A clean, well-pressed clinical apron and prominently displayed Yenepoya University ID badge are mandatory at all times in clinical zones.",
      "Maintain complete data protection for patient files, audiograms, case histories and therapy logs. Obtain informed consent (under supervision) before any assessment or intervention.",
      "Zero tolerance: unauthorized clinical photography or digital sharing of patient information is a severe breach of code and results in immediate disciplinary action.",
      "Maintain professionalism, collaboration and utmost respect when interacting with clinical supervisors, medical officers, nursing staff and allied healthcare teams."
    ]
  },
  {
    "icon": "coat",
    "title": "Dress Code and Grooming",
    "items": [
      "Clinical attire: prescribed formal wear with an immaculate white full/half apron and official badge.",
      "Footwear: closed-toe, clean, black formal shoes or professional clinical footwear are mandatory in clinical and laboratory zones, especially the Earmold Lab and Acoustics Lab.",
      "Grooming: hair must be tied back neatly; nails trimmed short to guarantee safe Oral Peripheral Mechanism Examinations (OPME) and ear impression procedures.",
      "Academic attire: clean formal attire is required for theory classes. T-shirts, ripped jeans, sneakers and casual sandals are strictly banned in academic areas."
    ]
  },
  {
    "icon": "building",
    "title": "Departmental and Institutional Regulations",
    "items": [
      "Equipment: audiometers, middle ear analyzers, electrophysiological equipment and speech analysis software are highly sensitive. Any malfunction or accidental damage must be reported immediately to the lab in-charge. Negligence resulting in damage will incur financial liability.",
      "Library: complete silence must be maintained; digital resources and reference books handled respectfully.",
      "Anti-ragging: Yenepoya enforces a strict zero-tolerance policy. Any involvement in physical or psychological harassment leads to immediate suspension and criminal prosecution under UGC Regulations.",
      "Substance abuse: possession, distribution or consumption of alcohol, tobacco or restricted substances within campus and hospital boundaries is strictly prohibited and results in immediate expulsion."
    ]
  },
  {
    "icon": "scale",
    "title": "Disciplinary Framework and Grievance Redressal",
    "items": [
      "Level 1: Clinical Supervisor / Class Coordinator - initial warning and documentation.",
      "Level 2: Head of the Department - parent-teacher meeting, academic suspension warnings.",
      "Level 3: Dean / Principal, Yenepoya Medical College - final authority for long-term suspension, monetary fines or university rustication.",
      "Grievance redressal: students have the right to file an appeal against disciplinary judgments to the Student Grievance Redressal Cell within 7 working days of the order."
    ]
  }
];

/* College bus and shuttle timings between the hostel and the campus. */
const TRANSPORT = {
  "hostel": "Your Space Hostel, Kuthar",
  "campus": "Yenepoya Medical College Campus",
  "routes": [
    {
      "direction": "to-campus",
      "label": "Morning Bus",
      "from": "Your Space Hostel, Kuthar",
      "to": "Yenepoya Medical College Campus",
      "time": "8:10 AM",
      "note": "Reach campus before the 8:30 AM first period. Boarding closes at departure time."
    },
    {
      "direction": "to-hostel",
      "label": "Shuttle Bus",
      "from": "Yenepoya Medical College Campus",
      "to": "Your Space Hostel, Kuthar",
      "time": "3:40 PM",
      "note": "Departs shortly after classes end at 3:30 PM."
    },
    {
      "direction": "to-hostel",
      "label": "Evening Return Bus",
      "from": "Yenepoya Medical College Campus",
      "to": "Your Space Hostel, Kuthar",
      "time": "4:10 PM",
      "note": "For students staying back for clinical postings, library or lab work."
    }
  ]
};

/* 1st internal assessment - CLASS-LEVEL summary only (no individual marks on the page).
   The named merit list is only in the downloadable report (published at the class coordinator's direction). */
const ASSESSMENT = {
  "title": "1st Internal Assessment",
  "dates": "23–26 September 2026",
  "published": "4 November 2026",
  "students": 22,
  "papers": [
    {
      "key": "H",
      "name": "Anatomy of Hearing",
      "short": "Hearing",
      "max": 25,
      "mean": 16.64,
      "sd": 3.38,
      "mean_pct": 66.5,
      "median": 17.0,
      "min": 10.0,
      "max_mark": 21.5,
      "bands": {
        "Distinction": 6,
        "First class": 11,
        "Second class": 2,
        "Below 50%": 3
      }
    },
    {
      "key": "S",
      "name": "Anatomy of Speech & Swallowing",
      "short": "Sp. & Sw.",
      "max": 25,
      "mean": 14.5,
      "sd": 2.31,
      "mean_pct": 58.0,
      "median": 14.0,
      "min": 11.0,
      "max_mark": 18.0,
      "bands": {
        "Distinction": 0,
        "First class": 8,
        "Second class": 11,
        "Below 50%": 3
      }
    },
    {
      "key": "I",
      "name": "Introduction to SLP",
      "short": "Intro SLP",
      "max": 25,
      "mean": 18.52,
      "sd": 3.81,
      "mean_pct": 74.1,
      "median": 19.75,
      "min": 8.0,
      "max_mark": 22.5,
      "bands": {
        "Distinction": 13,
        "First class": 6,
        "Second class": 2,
        "Below 50%": 1
      }
    },
    {
      "key": "A",
      "name": "Introduction to Audiology",
      "short": "Intro Aud",
      "max": 25,
      "mean": 12.68,
      "sd": 4.0,
      "mean_pct": 50.7,
      "median": 13.0,
      "min": 6.0,
      "max_mark": 20.0,
      "bands": {
        "Distinction": 2,
        "First class": 4,
        "Second class": 8,
        "Below 50%": 8
      }
    }
  ],
  "combined": {
    "key": "T",
    "name": "Combined score",
    "short": "Total",
    "max": 100,
    "mean": 62.34,
    "sd": 10.01,
    "mean_pct": 62.3,
    "median": 60.5,
    "min": 43.0,
    "max_mark": 79.5,
    "bands": {
      "Distinction": 4,
      "First class": 7,
      "Second class": 9,
      "Below 50%": 2
    }
  },
  "kpis": [
    {
      "label": "Class average",
      "value": "62.3%",
      "sub": "62.3 of 100 marks, four papers"
    },
    {
      "label": "Highest total",
      "value": "79.5/100",
      "sub": "Ameena Filza tops the class"
    },
    {
      "label": "First class or above",
      "value": "11 of 22",
      "sub": "4 Distinction, 7 First class"
    },
    {
      "label": "Need support",
      "value": "10",
      "sub": "below 50% in at least one paper"
    }
  ],
  "report": "IA1_Analytics_4Papers_I_BASLP_2026-27_Precision_Clinicians.pdf",
  "intro": "Complete results of the first internal assessment in all four papers, each marked out of 25 (total 100): Anatomy of Hearing, Anatomy of Speech & Swallowing, Introduction to Speech-Language Pathology and Introduction to Audiology. Updated 4 November 2026 with the Introduction to Audiology marks.",
  "highlights": [
    "Introduction to SLP remains the strongest paper: class average 74.1%, with 13 Distinctions.",
    "Introduction to Audiology is now the class priority: average 50.7% (12.7/25), with 8 students below 12.5.",
    "The four papers differ significantly (Friedman χ²(3) = 25.93, p < .001). Intro to SLP is 5.8 marks ahead of Intro to Audiology on average.",
    "Congratulations to Ameena Filza (79.5), Fathimath Salva K C (78), Raniya Nasrin M (77) and Nasna Sherin P M (76.5): the 4 Distinctions on the total.",
    "10 students need support in at least one paper; 4 more sit exactly on the 12.5 line. Focus revision on Audiology and Speech & Swallowing."
  ],
  "marks": [
    {
      "rank": 1,
      "sl": 2,
      "roll": "26BASLP02",
      "name": "Ameena Filza",
      "H": 20.5,
      "S": 18,
      "I": 22,
      "A": 19,
      "total": 79.5,
      "band": "Distinction",
      "support": []
    },
    {
      "rank": 2,
      "sl": 10,
      "roll": "26BASLP10",
      "name": "Fathimath Salva K C",
      "H": 21.5,
      "S": 14,
      "I": 22.5,
      "A": 20,
      "total": 78.0,
      "band": "Distinction",
      "support": []
    },
    {
      "rank": 3,
      "sl": 19,
      "roll": "26BASLP19",
      "name": "Raniya Nasrin M",
      "H": 20.5,
      "S": 18,
      "I": 22.5,
      "A": 16,
      "total": 77.0,
      "band": "Distinction",
      "support": []
    },
    {
      "rank": 4,
      "sl": 17,
      "roll": "26BASLP17",
      "name": "Nasna Sherin P M",
      "H": 19.5,
      "S": 18,
      "I": 22,
      "A": 17,
      "total": 76.5,
      "band": "Distinction",
      "support": []
    },
    {
      "rank": 5,
      "sl": 12,
      "roll": "26BASLP12",
      "name": "Haya Ibarahim Rahmathulla",
      "H": 18,
      "S": 13,
      "I": 22,
      "A": 16,
      "total": 69,
      "band": "First class",
      "support": []
    },
    {
      "rank": 6,
      "sl": 7,
      "roll": "26BASLP07",
      "name": "Fathimath Asna",
      "H": 17.5,
      "S": 18,
      "I": 20,
      "A": 13,
      "total": 68.5,
      "band": "First class",
      "support": []
    },
    {
      "rank": 7,
      "sl": 15,
      "roll": "26BASLP15",
      "name": "Nadha Fathima",
      "H": 16.5,
      "S": 13,
      "I": 21,
      "A": 17,
      "total": 67.5,
      "band": "First class",
      "support": []
    },
    {
      "rank": 8,
      "sl": 1,
      "roll": "26BASLP01",
      "name": "Aleena O P",
      "H": 18.5,
      "S": 14,
      "I": 21.5,
      "A": 13,
      "total": 67.0,
      "band": "First class",
      "support": []
    },
    {
      "rank": 8,
      "sl": 3,
      "roll": "26BASLP03",
      "name": "Devina Thankam Mathew",
      "H": 21,
      "S": 12.5,
      "I": 19.5,
      "A": 14,
      "total": 67.0,
      "band": "First class",
      "support": []
    },
    {
      "rank": 10,
      "sl": 21,
      "roll": "26BASLP21",
      "name": "Saliha Zakir Hussain",
      "H": 16,
      "S": 12.5,
      "I": 21.5,
      "A": 14,
      "total": 64.0,
      "band": "First class",
      "support": []
    },
    {
      "rank": 11,
      "sl": 6,
      "roll": "26BASLP06",
      "name": "Fathima Sheza Kurumkadan",
      "H": 19,
      "S": 12,
      "I": 17,
      "A": 14,
      "total": 62,
      "band": "First class",
      "support": [
        "Sp. & Sw."
      ]
    },
    {
      "rank": 12,
      "sl": 16,
      "roll": "26BASLP16",
      "name": "Naja Nasrin C",
      "H": 15.5,
      "S": 14,
      "I": 19.5,
      "A": 10,
      "total": 59.0,
      "band": "Second class",
      "support": [
        "Intro Aud"
      ]
    },
    {
      "rank": 12,
      "sl": 22,
      "roll": "26BASLP22",
      "name": "Shimaaz Asiya",
      "H": 16.5,
      "S": 17,
      "I": 12.5,
      "A": 13,
      "total": 59.0,
      "band": "Second class",
      "support": []
    },
    {
      "rank": 14,
      "sl": 5,
      "roll": "26BASLP05",
      "name": "Fathima Sheha C H",
      "H": 15,
      "S": 13.5,
      "I": 20,
      "A": 10,
      "total": 58.5,
      "band": "Second class",
      "support": [
        "Intro Aud"
      ]
    },
    {
      "rank": 15,
      "sl": 20,
      "roll": "26BASLP20",
      "name": "Rida Rihana Zameel",
      "H": 18.5,
      "S": 13,
      "I": 16,
      "A": 10,
      "total": 57.5,
      "band": "Second class",
      "support": [
        "Intro Aud"
      ]
    },
    {
      "rank": 16,
      "sl": 11,
      "roll": "26BASLP11",
      "name": "Fathimathu Riza Haris",
      "H": 11.5,
      "S": 12,
      "I": 20,
      "A": 13,
      "total": 56.5,
      "band": "Second class",
      "support": [
        "Hearing",
        "Sp. & Sw."
      ]
    },
    {
      "rank": 17,
      "sl": 13,
      "roll": "26BASLP13",
      "name": "Hiba Fathima",
      "H": 16.5,
      "S": 15.5,
      "I": 17,
      "A": 7,
      "total": 56.0,
      "band": "Second class",
      "support": [
        "Intro Aud"
      ]
    },
    {
      "rank": 18,
      "sl": 18,
      "roll": "26BASLP18",
      "name": "Noula",
      "H": 12.5,
      "S": 16.5,
      "I": 12.5,
      "A": 13,
      "total": 54.5,
      "band": "Second class",
      "support": []
    },
    {
      "rank": 19,
      "sl": 8,
      "roll": "26BASLP08",
      "name": "Fathimath Nuha K C",
      "H": 10,
      "S": 14,
      "I": 17,
      "A": 11,
      "total": 52,
      "band": "Second class",
      "support": [
        "Hearing",
        "Intro Aud"
      ]
    },
    {
      "rank": 20,
      "sl": 9,
      "roll": "26BASLP09",
      "name": "Fathimath Safa",
      "H": 10.5,
      "S": 17,
      "I": 16,
      "A": 7,
      "total": 50.5,
      "band": "Second class",
      "support": [
        "Hearing",
        "Intro Aud"
      ]
    },
    {
      "rank": 21,
      "sl": 14,
      "roll": "26BASLP14",
      "name": "Mohammed Niadh",
      "H": 13,
      "S": 12.5,
      "I": 17.5,
      "A": 6,
      "total": 49.0,
      "band": "Below 50%",
      "support": [
        "Intro Aud"
      ]
    },
    {
      "rank": 22,
      "sl": 4,
      "roll": "26BASLP04",
      "name": "Fathima Rena P P",
      "H": 18,
      "S": 11,
      "I": 8,
      "A": 6,
      "total": 43,
      "band": "Below 50%",
      "support": [
        "Sp. & Sw.",
        "Intro SLP",
        "Intro Aud"
      ]
    }
  ],
  "note": "Grade bands: Distinction 75% and above, First class 60–74%, Second class 50–59%. ▲ = below 50% (12.5/25) in that paper; a pointer for focused revision, not a final result. If you think a mark is wrong, tell the class coordinator."
};

/* 2nd internal assessment timetable (Semester I), as issued by the Head of the Department. */
const IA2_SCHEDULE = {
  "title": "2nd Internal Assessment",
  "semester": "Semester I",
  "dates": "2–7 November 2026",
  "time": "8:45 AM – 9:45 AM",
  "issued_by": "Professor & Head, Department of Audiology & Speech-Language Pathology",
  "papers": [
    {
      "date": "2026-11-02",
      "day": "Monday",
      "paper": "Introduction to Speech-Language Pathology"
    },
    {
      "date": "2026-11-03",
      "day": "Tuesday",
      "paper": "Introduction to Audiology"
    },
    {
      "date": "2026-11-04",
      "day": "Wednesday",
      "paper": "Anatomy & Physiology of Speech & Swallowing"
    },
    {
      "date": "2026-11-05",
      "day": "Thursday",
      "paper": "Anatomy & Physiology of Hearing"
    },
    {
      "date": "2026-11-06",
      "day": "Friday",
      "paper": "Constitution of India"
    },
    {
      "date": "2026-11-07",
      "day": "Saturday",
      "paper": "Environmental Science"
    }
  ],
  "note": "One paper a day, 8:45–9:45 AM."
};

/* Attendance - CLASS-LEVEL summary only (no individual figures on the page).
   The named class report is only in the downloadable PDF (published at the class coordinator's direction). */
const ATTENDANCE = {
  "title": "Class attendance",
  "period": "27 July – 20 October 2026",
  "as_of": "22 October 2026",
  "published": "24 October 2026",
  "students": 22,
  "intro": "Class-level attendance from the course registers: 119 class sessions between 27 July and 20 October 2026 in seven courses. Minimum attendance is 80% for theory and university courses and 90% for clinical work. Published 24 October 2026.",
  "kpis": [
    {
      "label": "Class attendance",
      "value": "86.8%",
      "sub": "all recorded hours, seven courses"
    },
    {
      "label": "Theory courses",
      "value": "18 of 22",
      "sub": "at or above 80% in all four"
    },
    {
      "label": "Environmental Studies",
      "value": "10 of 22",
      "sub": "at or above 80%"
    },
    {
      "label": "Sessions recorded",
      "value": "119",
      "sub": "27 Jul – 20 Oct 2026"
    }
  ],
  "courses": [
    {
      "name": "Intro to SLP",
      "category": "Theory",
      "minimum": 80,
      "sessions": 26,
      "hours": 42,
      "class_avg": 89.0,
      "below": 4,
      "borderline": 2,
      "provisional": false
    },
    {
      "name": "Intro to Audiology",
      "category": "Theory",
      "minimum": 80,
      "sessions": 26,
      "hours": 50,
      "class_avg": 85.7,
      "below": 3,
      "borderline": 5,
      "provisional": false
    },
    {
      "name": "A&P Speech & Swallowing",
      "category": "Theory",
      "minimum": 80,
      "sessions": 19,
      "hours": 37,
      "class_avg": 91.9,
      "below": 1,
      "borderline": 2,
      "provisional": false
    },
    {
      "name": "A&P Auditory System",
      "category": "Theory",
      "minimum": 80,
      "sessions": 22,
      "hours": 38,
      "class_avg": 90.8,
      "below": 2,
      "borderline": 2,
      "provisional": false
    },
    {
      "name": "Clinical (Speech)",
      "category": "Clinical",
      "minimum": 90,
      "sessions": 14,
      "hours": 18,
      "class_avg": 81.6,
      "below": 20,
      "borderline": 1,
      "provisional": true
    },
    {
      "name": "EVS",
      "category": "University",
      "minimum": 80,
      "sessions": 8,
      "hours": 16,
      "class_avg": 72.4,
      "below": 12,
      "borderline": 2,
      "provisional": false
    },
    {
      "name": "COI",
      "category": "University",
      "minimum": 80,
      "sessions": 4,
      "hours": 8,
      "class_avg": 81.2,
      "below": 12,
      "borderline": 0,
      "provisional": true
    }
  ],
  "highlights": [
    "The theory courses are on track for most of the class: 18 of 22 students are at or above 80% in all four.",
    "Environmental Studies needs attention: class attendance 72.4%, with 12 students below 80%. On 11 September, 18 of 22 were absent.",
    "Clinical teaching – Speech is provisional: only the speech clinical register (18 hours) is counted so far, and 20 students are below 90% on it.",
    "Every remaining class counts: the report shows how many of the planned hours to 28 November each student must attend."
  ],
  "report": "I_BASLP_Class_Attendance_Report_22Oct2026.pdf",
  "note": "Provisional figures. † Clinical teaching – Speech covers the speech clinical register only, and Constitution of India covers October only. Kannada and B1.5 practicals will be added when their registers are received. If you think an entry is wrong, tell the class coordinator the course and the date."
};

/* Downloadable source documents. Copy the PDFs into assets/docs/ to activate the links. */
const DOCS = [
  {
    "title": "Self-study plan, December 2026 theory exams",
    "issuer": "Class Coordinator, Department of Audiology & SLP",
    "note": "Semester I theory, B1.1 to B1.4 | print booklet, 12 point, one day a page | 12 November to 10 December 2026",
    "file": "BASLP_Self_Study_Plan_December_2026.pdf"
  },
  {
    "title": "Class Attendance Report",
    "issuer": "Class Coordinator, Department of Audiology & SLP",
    "note": "First semester to 22 October 2026 | attendance by student and course",
    "file": "I_BASLP_Class_Attendance_Report_22Oct2026.pdf"
  },
  {
    "title": "1st Internal Assessment Analytics",
    "issuer": "Class Coordinator, Department of Audiology & SLP",
    "note": "Four papers | class summary and merit list | 4 November 2026",
    "file": "IA1_Analytics_4Papers_I_BASLP_2026-27_Precision_Clinicians.pdf"
  },
  {
    "title": "B.ASLP Norms, Regulations & Curriculum Framework",
    "issuer": "Rehabilitation Council of India",
    "note": "Effective from Academic Session 2024-25 | 4 years | 160 credits",
    "file": "Syllabus.pdf"
  },
  {
    "title": "Student Code of Conduct & Disciplinary Handbook",
    "issuer": "Yenepoya (Deemed to be University)",
    "note": "Academic Year 2026-27",
    "file": "BASLP_Student_Code_of_Conduct_Handbook_Refined.pdf"
  },
  {
    "title": "Master Academic Calendar",
    "issuer": "Department of Audiology & SLP",
    "note": "Batch 2026-27 | Semester I & II",
    "file": "BASLP_Master_Academic_Calendar_Refined.pdf"
  },
  {
    "title": "BASLP First Semester Weekly Timetable",
    "issuer": "Department of Audiology & SLP",
    "note": "October 2026 | 8:30 AM - 3:30 PM",
    "file": "BASLP_Timetable_TPC_2026_October.pdf"
  },
  {
    "title": "RCI Code of Ethics",
    "issuer": "Rehabilitation Council of India",
    "note": "Professional conduct for rehabilitation professionals, 2023",
    "file": "code-of-ethics-2023.pdf"
  },
  {
    "title": "General Holidays List 2026",
    "issuer": "Yenepoya (Deemed to be University)",
    "note": "Institutional holiday calendar",
    "file": "Holidays 2026 - General.pdf"
  }
];

