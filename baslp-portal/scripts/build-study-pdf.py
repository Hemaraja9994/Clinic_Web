#!/usr/bin/env python3
"""Build the December 2026 self-study PDF from js/study-plan.js."""

import json
import subprocess
from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parents[1]
JS = ROOT / "js" / "study-plan.js"
OUT = ROOT / "assets" / "docs" / "BASLP_Self_Study_Plan_December_2026.pdf"
FONT = "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"
FONT_B = "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"
SERIF = "/usr/share/fonts/truetype/noto/NotoSerif-Bold.ttf"

MAROON = (128, 0, 0)
NAVY = (30, 58, 138)
INK = (31, 41, 55)
MUTED = (75, 85, 99)


def load_plan():
    raw = subprocess.check_output(
        [
            "node",
            "-e",
            "const fs=require('fs');"
            f"const s=fs.readFileSync({json.dumps(str(JS))},'utf8');"
            "eval(s.replace('const STUDY_PLAN','globalThis.STUDY_PLAN'));"
            "process.stdout.write(JSON.stringify(STUDY_PLAN));",
        ]
    )
    return json.loads(raw)


class Plan(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Noto", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 6, "B.ASLP  |  December 2026 self-study plan  |  Yenepoya (Deemed to be University)", align="L")
        self.ln(8)

    def footer(self):
        self.set_y(-12)
        self.set_font("Noto", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 6, f"Preparation rotation, not the CoE timetable  ·  {self.page_no()}", align="C")


def write_wrapped(pdf, text, size=10, style="", color=INK, h=5.2):
    pdf.set_font("Noto", style, size)
    pdf.set_text_color(*color)
    pdf.multi_cell(0, h, text)
    pdf.ln(1)


def block_title(pdf, text):
    pdf.ln(1)
    pdf.set_fill_color(*MAROON)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Noto", "B", 11)
    pdf.cell(0, 8, "  " + text, fill=True, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)


def main():
    plan = load_plan()
    pdf = Plan(format="A4")
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.set_margins(16, 16, 16)
    pdf.add_font("Noto", "", FONT)
    pdf.add_font("Noto", "B", FONT_B)
    pdf.add_font("Serif", "", SERIF)
    pdf.add_page()

    pdf.set_fill_color(*MAROON)
    pdf.rect(0, 0, 210, 42, "F")
    pdf.set_y(10)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Noto", "", 10)
    pdf.cell(0, 5, "Department of Audiology and Speech-Language Pathology", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Serif", "", 18)
    pdf.cell(0, 10, "Self-study plan for the theory examinations", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Noto", "", 10)
    pdf.cell(0, 6, "B.ASLP  ·  Semesters I, III and V  ·  December 2026 session", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.set_y(50)
    pdf.set_text_color(*INK)
    notice = plan["notice"]
    write_wrapped(
        pdf,
        f"Source notice: {notice['ref']}, dated {notice['dated']}, from the Controller of Examinations, "
        f"Yenepoya (Deemed to be University). University theory examinations for semester {notice['semesters']} "
        f"B.ASLP commence on {notice['starts']}. The paper-wise timetable will be intimated shortly.",
        size=11,
        h=5.6,
    )
    pdf.ln(1)
    write_wrapped(
        pdf,
        "This booklet is a 29-day preparation rotation, from Thursday 12 November 2026 to Thursday 10 December 2026. "
        "It is not the examination timetable. When the Controller publishes the order of papers, keep the same topics "
        "and move the final camp days (7 to 10 December) so the last full day for a paper falls just before that paper.",
        size=11,
        h=5.6,
    )

    block_title(pdf, "How to use the days")
    kind_label = {
        "evening": "Class evenings (most weekdays), 6:30 to 9:05 pm",
        "boss": "Sunday boss, about 8:30 am to 4:30 pm",
        "holiday": "Friday 27 November, if the University confirms the holiday",
        "camp": "Final camp, 7 to 10 December",
    }
    for key, label in kind_label.items():
        write_wrapped(pdf, label, size=11, style="B", color=NAVY, h=5.4)
        for when, task in plan["rhythms"][key]:
            write_wrapped(pdf, f"{when}   {task}", size=10, h=5)
        pdf.ln(1)

    block_title(pdf, "Rules that sit above the plan")
    for i, rule in enumerate(plan["rules"], 1):
        write_wrapped(pdf, f"{i}.  {rule}", size=10, h=5.2)

    write_wrapped(
        pdf,
        "Pass mark: 50% in each theory paper, and also in internal assessment, practicals and the clinical examination. "
        "A strong theory week does not repair a failed practical or a clinical attendance shortage.",
        size=10,
        style="B",
        h=5.2,
    )
    write_wrapped(
        pdf,
        "Ticks on the website stay in the student's browser. This PDF is the copy to print and keep.",
        size=10,
        h=5.2,
    )

    for camp in plan["campaigns"]:
        pdf.add_page()
        pdf.set_fill_color(*NAVY)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font("Serif", "", 16)
        pdf.cell(0, 12, "  " + camp["name"], fill=True, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(3)
        write_wrapped(pdf, camp["blurb"], size=11, h=5.5)
        write_wrapped(pdf, "Theory papers in this campaign", size=11, style="B", color=MAROON)
        for code, title, marks in camp["papers"]:
            write_wrapped(pdf, f"{code}   {title}   ({marks})", size=10, h=5)

        for i, lv in enumerate(camp["levels"], 1):
            pdf.ln(1.5)
            if pdf.get_y() > 250:
                pdf.add_page()
            pdf.set_fill_color(253, 242, 244)
            pdf.set_text_color(*MAROON)
            pdf.set_font("Noto", "B", 11)
            heading = f"  {i}.  {lv['label']}   ·   {lv['kindName']}   ·   {lv['paper']}"
            pdf.set_x(pdf.l_margin)
            pdf.multi_cell(0, 7, heading, fill=True, new_x="LMARGIN", new_y="NEXT")
            pdf.set_text_color(*INK)
            pdf.set_font("Noto", "B", 11)
            pdf.multi_cell(0, 6, lv["title"], new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Noto", "", 10)
            pdf.set_text_color(*INK)
            for line in lv["focus"]:
                pdf.set_x(pdf.l_margin)
                pdf.multi_cell(0, 5, "•  " + line, new_x="LMARGIN", new_y="NEXT")
            pdf.set_text_color(*NAVY)
            pdf.set_font("Noto", "B", 10)
            pdf.set_x(pdf.l_margin)
            pdf.multi_cell(0, 5.2, "Tick this level only after: " + lv["recall"], new_x="LMARGIN", new_y="NEXT")
            pdf.set_text_color(*INK)

    pdf.add_page()
    block_title(pdf, "The night before, and the morning of 11 December")
    for line in [
        "10 December, 6:00 pm is the end of new reading in every campaign.",
        "Pack the hall ticket, identity card, pens, pencil, eraser and a bottle of water the night before.",
        "Eat, and sleep. A last unread chapter at midnight will not raise a 50-mark paper.",
        "On the morning of the first paper, read only the one-page map of that paper. Do not open a new unit.",
        "If the published timetable starts with a different paper, swap the camp days. Do not throw away the earlier levels.",
        "Clinical postings on examination days follow the department notice, not this booklet.",
    ]:
        write_wrapped(pdf, "•  " + line, size=11, h=5.6)
    pdf.ln(4)
    write_wrapped(
        pdf,
        "Prepared for students of the Department of Audiology and Speech-Language Pathology, "
        "Yenepoya (Deemed to be University), from the RCI curriculum (academic session 2024-25) "
        "and the Controller of Examinations notification dated 06.11.2026. "
        "Class coordinator: Mr. Hemaraja Nayaka S.",
        size=10,
        color=MUTED,
        h=5.2,
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUT))
    print(OUT, OUT.stat().st_size)


if __name__ == "__main__":
    main()
