/* December 2026 self-study timetable for Semester I only.
   The CoE notice (YU/COE/Exam/Notification 1/Dec/2026, dated 06.11.2026)
   also names Semesters III and V. This plan is the first-year theory
   timetable: B1.1 to B1.4. College stays 8:30 am to 3:30 pm. Self-study
   is the morning recall and the two evening sittings. */
const STUDY_PLAN = {
  "notice": {
    "ref": "YU/COE/Exam/Notification 1/Dec/2026",
    "dated": "06.11.2026",
    "starts": "11 December 2026",
    "semesters": "I"
  },
  "pdf": "assets/docs/BASLP_Self_Study_Plan_December_2026.pdf",
  "rules": [
    "This timetable is for Semester I theory only: B1.1, B1.2, B1.3 and B1.4. B1.5 and B1.6 stay on the practical and clinical roster.",
    "College is 8:30 am to 3:30 pm, with lunch 12:30 to 1:30. The hostel bus leaves at 8:10 am. Self-study does not replace a class or a posting.",
    "On a class day you study 6:15 to 7:00 am, then 5:15 to 7:25 pm and 8:05 to 9:05 pm. That is about three hours. Sundays and 7 to 10 December are longer.",
    "You still need 50% in the theory paper, and also in internal assessment, practicals and the clinical examination.",
    "The paper order is not out yet. When it is published, keep these topics and move the 7 to 10 December camp so each paper's full day falls just before that paper.",
    "10 December: last new work ends at 4:00 pm. Pack the hall ticket, identity card, pens and water, and sleep."
  ],
  "rhythms": {
    "evening": [
      ["6:15–7:00 am", "Morning recall, book closed, then get ready for the 8:10 bus."],
      ["8:30 am–3:30 pm", "College and clinics. Lunch 12:30–1:30. Not self-study."],
      ["5:15–6:25 pm", "Main paper, new work."],
      ["6:40–7:25 pm", "Same paper, short answers."],
      ["8:05–8:50 pm", "Paired paper, one page already studied."],
      ["8:50–9:05 pm", "Error log. In bed by 10:30 pm."]
    ],
    "boss": [
      ["7:20–10:45 am", "First paper, with a break at 9:00."],
      ["11:00 am–3:00 pm", "Second paper, with lunch 12:30–1:30."],
      ["3:15–4:30 pm", "Mixed recall and the error log. Evening is free."]
    ],
    "holiday": [
      ["8:15–12:00 pm", "One paper: diagrams, then questions."],
      ["12:00–1:30 pm", "Lunch and rest."],
      ["1:30–3:25 pm", "Weak pages only, then stop."]
    ],
    "camp": [
      ["7:30–8:00 am", "Blank map of the paper."],
      ["8:00 am–12:30 pm", "Three study blocks, with breaks."],
      ["1:30–4:30 pm", "Diagrams, then a timed set."],
      ["7:30–8:15 pm", "Gap list only."]
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
    evening: "Class day",
    boss: "Sunday",
    holiday: "Holiday",
    camp: "Study camp"
  };
  const pair = { "B1.1": "B1.3", "B1.3": "B1.1", "B1.2": "B1.4", "B1.4": "B1.2" };

  function row(time, block, work, hold) {
    return { time: time, block: block, work: work, hold: !!hold };
  }

  function periodsFor(iso, kind, paper, title, focus) {
    const topic = focus[0] || title;
    const next = focus[1] || "Eight short answers on the same topic.";
    const extra = focus[2] || "";
    const mate = pair[paper] || "the other theory paper";
    if (iso === "2026-12-10") {
      return [
        row("7:30–8:00 am", "Blank map", "No notes. One line for the weakest unit in B1.1, B1.2, B1.3 and B1.4."),
        row("8:00–8:40 am", "B1.1", "Closed book. Speech chain, development, one disorder overview."),
        row("8:40–8:50 am", "Break", "Water. Stand up.", true),
        row("8:50–9:30 am", "B1.2", "One audiogram sketch and one tuning-fork case."),
        row("9:30–9:40 am", "Break", "Walk.", true),
        row("9:40–10:20 am", "B1.3", "Drawings only: larynx and the swallow stages."),
        row("10:20–10:30 am", "Break", "No phone.", true),
        row("10:30–11:10 am", "B1.4", "Middle ear, cochlea and the pathway, from memory."),
        row("11:10 am–12:30 pm", "Gaps only", "Redo the one miss in each set. No new chapter."),
        row("12:30–2:00 pm", "Lunch and rest", "Eat, then lie down. Books stay closed.", true),
        row("2:00–4:00 pm", "Kit", "Hall ticket, identity card, pens, pencil, water. Set the alarm. No study after 4:00 pm."),
        row("10:00 pm", "Lights out", "Sleep. Theory exams open tomorrow.", true)
      ];
    }
    if (kind === "evening") {
      return [
        row("6:15–7:00 am", "Morning recall", "Book closed, 45 minutes, on yesterday's main paper. Then stop."),
        row("7:00–8:05 am", "Leave for college", "Breakfast. Hostellers board the 8:10 am bus. Be at the stop by 8:05.", true),
        row("8:30 am–12:30 pm", "College", "Classes and clinics on the weekly timetable. Not a self-study hour.", true),
        row("12:30–1:30 pm", "Lunch", "College lunch. Notes stay in the bag.", true),
        row("1:30–3:30 pm", "College", "Afternoon periods. A free hour means the clinical posting, not the library.", true),
        row("3:40 / 4:10 pm", "Bus home", "3:40 pm shuttle, or 4:10 pm if you stayed back. Day scholars leave after 3:30.", true),
        row("5:00–5:15 pm", "Reset", "Snack. Ten minutes away from the phone.", true),
        row("5:15–6:25 pm", paper + " · first sitting", title + ". " + topic),
        row("6:25–6:40 pm", "Break", "Stand, water, no phone.", true),
        row("6:40–7:25 pm", paper + " · questions", next),
        row("7:25–8:05 pm", "Dinner", "Eat away from the desk.", true),
        row("8:05–8:50 pm", mate + " · second sitting", "One page of " + mate + " you have already studied. Shut the book for the last 15 minutes." + (extra ? " " + extra : "")),
        row("8:50–9:05 pm", "Close", "Three-line error log. In bed by 10:30 pm.")
      ];
    }
    if (kind === "boss") {
      const parts = paper.split("+").map((s) => s.trim()).filter(Boolean);
      const first = parts[0] && parts[0].indexOf("B1.") === 0 ? parts[0] : "First paper";
      const second = parts[1] && parts[1].indexOf("B1.") === 0 ? parts[1] : mate;
      return [
        row("7:00–7:20 am", "Set the desk", "Two papers only: " + first + " and " + second + ". One notebook. Phone in another room."),
        row("7:20–9:00 am", first + " · first sitting", title + ". " + topic),
        row("9:00–9:15 am", "Break", "Walk. Do not revise on the break.", true),
        row("9:15–10:45 am", first + " · questions", "Book open for 20 minutes, then closed. " + next),
        row("10:45–11:00 am", "Break", "Snack.", true),
        row("11:00 am–12:30 pm", second + " · first sitting", extra || "Diagrams first, then the definitions."),
        row("12:30–1:30 pm", "Lunch and rest", "Eat, then 20 minutes with your eyes closed.", true),
        row("1:30–3:00 pm", second + " · questions", "Short notes. Mark them before you look anything up."),
        row("3:00–3:15 pm", "Break", "Step outside.", true),
        row("3:15–4:15 pm", "Mixed recall", "Both papers, book closed."),
        row("4:15–4:30 pm", "Error log", "Three points for the weekday evenings. Then stop. The evening is free.")
      ];
    }
    if (kind === "holiday") {
      return [
        row("8:00–8:15 am", "Check the notice", "27 November is Kanakadasa Jayanti on the Karnataka list. If the University holds class, switch to the class-day clock."),
        row("8:15–10:00 am", paper + " · diagrams", title + ". " + topic),
        row("10:00–10:20 am", "Break", "Eat if you have not. Stretch.", true),
        row("10:20 am–12:00 pm", paper + " · questions", next),
        row("12:00–1:30 pm", "Lunch and rest", "A holiday includes the rest.", true),
        row("1:30–3:10 pm", paper + " · weak pages", extra || "Only the pages you marked this morning. No new unit."),
        row("3:10–3:25 pm", "Close", "Error log, tick the day, and stop by 3:30 pm.")
      ];
    }
    const parts = paper.split("+").map((s) => s.trim()).filter((s) => s.indexOf("B1.") === 0);
    if (parts.length === 2) {
      return [
        row("7:30–8:00 am", "Blank page", "Unit headings of " + parts[0] + " and " + parts[1] + ", from memory."),
        row("8:00–9:30 am", parts[0] + " · drawings", topic),
        row("9:30–9:45 am", "Break", "Water.", true),
        row("9:45–11:15 am", parts[0] + " · functions", next),
        row("11:15–11:30 am", "Break", "Snack.", true),
        row("11:30 am–1:00 pm", parts[1] + " · drawings", "External ear, middle ear, cochlea, pathway."),
        row("1:00–2:00 pm", "Lunch", "Away from the desk.", true),
        row("2:00–3:30 pm", parts[1] + " · functions", extra || "One sentence under each drawing."),
        row("3:30–3:45 pm", "Break", "Walk.", true),
        row("3:45–4:45 pm", "Timed notes", "Five short notes, book closed, then mark them."),
        row("7:30–8:10 pm", "Gap list", "The three misses only. No new chapter. Lights out by 10:30 pm.")
      ];
    }
    return [
      row("7:30–8:00 am", "Blank map", paper + ". Write the unit headings you remember."),
      row("8:00–9:20 am", paper + " · block 1", title + ". " + topic),
      row("9:20–9:35 am", "Break", "Stand up.", true),
      row("9:35–10:55 am", paper + " · block 2", next),
      row("10:55–11:10 am", "Break", "Water and a short walk.", true),
      row("11:10 am–12:30 pm", paper + " · block 3", extra || "Remaining units. Gaps only, no new textbook."),
      row("12:30–1:30 pm", "Lunch", "No notes at the table.", true),
      row("1:30–2:50 pm", "Diagrams", "Redraw the two figures you would need in the hall."),
      row("2:50–3:05 pm", "Break", "Outside.", true),
      row("3:05–4:15 pm", "Timed paper", "Short notes, 50-mark pace. Stop when the clock stops."),
      row("4:15–4:30 pm", "Mark", "List the gaps. Do not open a new chapter."),
      row("7:30–8:15 pm", "Evening recall", "Read the gap list only. In bed by 10:30 pm.")
    ];
  }

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
          recall: row[3],
          periods: periodsFor(iso, kind, row[0], row[1], row[2])
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
      blurb: "Semester I theory only. College is 8:30 am to 3:30 pm. On a class day the self-study clock is 6:15–7:00 am, 5:15–7:25 pm and 8:05–9:05 pm. B1.5 and B1.6 stay on the practical roster.",
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
  ];
})();
