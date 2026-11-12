#!/usr/bin/env python3
"""Print-ready Semester I self-study timetable. Body text is 12 pt."""

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
SERIF_R = "/usr/share/fonts/truetype/noto/NotoSerif-Regular.ttf"

MAROON = (128, 0, 0)
MAROON_DEEP = (80, 0, 16)
NAVY = (30, 58, 138)
INK = (31, 41, 55)
MUTED = (75, 85, 99)
LINE = (226, 214, 216)
STUDY = (255, 255, 255)
HOLD = (243, 244, 246)
ROSE = (253, 242, 244)
CREAM = (255, 248, 230)
WHITE = (255, 255, 255)

BODY = 12
LEAD = 5.4


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
    def footer(self):
        self.set_y(-12)
        self.set_draw_color(*MAROON)
        self.set_line_width(0.4)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(1.5)
        self.set_font("Noto", "", 9)
        self.set_text_color(*MUTED)
        self.cell(0, 5, "Semester I  ·  B.ASLP self-study timetable  ·  print and keep", align="L")
        self.set_x(self.l_margin)
        self.cell(0, 5, str(self.page_no()), align="R")


def lines_of(pdf, text, width, style="", size=BODY):
    pdf.set_font("Noto", style, size)
    return pdf.multi_cell(width, LEAD, text or "", align="L", dry_run=True, output="LINES") or [""]


def write(pdf, text, size=BODY, style="", color=INK, h=LEAD):
    pdf.set_font("Noto", style, size)
    pdf.set_text_color(*color)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, h, text, align="L", new_x="LMARGIN", new_y="NEXT")


def band(pdf, title, subtitle=""):
    pdf.set_fill_color(*MAROON)
    pdf.rect(0, 0, pdf.w, 28, "F")
    pdf.set_fill_color(*MAROON_DEEP)
    pdf.rect(0, 28, pdf.w, 2.2, "F")
    pdf.set_y(8)
    pdf.set_text_color(*WHITE)
    pdf.set_font("Serif", "", 18)
    pdf.cell(0, 8, title, align="C", new_x="LMARGIN", new_y="NEXT")
    if subtitle:
        pdf.set_font("Noto", "", BODY)
        pdf.cell(0, 6, subtitle, align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_y(36)


def section_label(pdf, text):
    pdf.ln(0.8)
    y = pdf.get_y()
    pdf.set_fill_color(*NAVY)
    pdf.rect(pdf.l_margin, y, 2.2, 7, "F")
    pdf.set_x(pdf.l_margin + 5)
    pdf.set_font("Noto", "B", BODY)
    pdf.set_text_color(*NAVY)
    pdf.cell(0, 7, text, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1.5)


def draw_table(pdf, rows, widths, header=True):
    """rows: list of (cells, fill, bold_first). cells are strings."""
    x0 = pdf.l_margin
    total = sum(widths)
    if header:
        head = ["Time", "Block", "What to do", "Tick"]
        h = 8
        pdf.set_fill_color(*MAROON)
        pdf.set_text_color(*WHITE)
        pdf.set_font("Noto", "B", BODY)
        pdf.set_xy(x0, pdf.get_y())
        for i, (label, w) in enumerate(zip(head, widths)):
            pdf.set_fill_color(*MAROON)
            pdf.rect(x0 + sum(widths[:i]), pdf.get_y(), w, h, "F")
        pdf.set_xy(x0, pdf.get_y())
        for label, w in zip(head, widths):
            align = "C" if label == "Tick" else "L"
            pdf.cell(w, h, "  " + label if align == "L" else label, align=align)
        pdf.ln(h)

    for cells, fill, _study in rows:
        pads = [1.5, 1.6, 2.0, 1]
        inner = [widths[i] - pads[i] * 2 for i in range(4)]
        wrapped = [
            lines_of(pdf, cells[0], inner[0], "B"),
            lines_of(pdf, cells[1], inner[1], "B"),
            lines_of(pdf, cells[2], inner[2], ""),
            [""],
        ]
        text_h = max(len(w) for w in wrapped) * LEAD
        row_h = text_h + 1.8
        if pdf.get_y() + row_h > pdf.h - 18:
            pdf.add_page()
            pdf.set_y(16)
        y = pdf.get_y()
        pdf.set_fill_color(*fill)
        pdf.set_draw_color(*LINE)
        pdf.set_line_width(0.2)
        pdf.rect(x0, y, total, row_h, "FD")
        cursor = x0
        for i in range(3):
            if i:
                pdf.line(cursor, y, cursor, y + row_h)
            pdf.set_xy(cursor + pads[i], y + 0.9)
            style = "B" if i < 2 else ""
            color = NAVY if i == 0 else (MAROON if _study and i == 1 else (MUTED if fill == HOLD else INK))
            pdf.set_text_color(*color)
            pdf.set_font("Noto", style, BODY)
            pdf.multi_cell(inner[i], LEAD, cells[i], align="L", new_x="RIGHT", new_y="TOP")
            cursor += widths[i]
        pdf.line(cursor, y, cursor, y + row_h)
        if _study:
            box = 4.2
            pdf.set_draw_color(*MAROON)
            pdf.set_line_width(0.4)
            pdf.rect(cursor + (widths[3] - box) / 2, y + (row_h - box) / 2, box, box)
        pdf.set_y(y + row_h)


def day_page(pdf, index, total, level):
    pdf.set_auto_page_break(auto=False)
    pdf.add_page()
    kind = level["kindName"]
    pdf.set_fill_color(*MAROON)
    pdf.rect(0, 0, pdf.w, 26, "F")
    pdf.set_fill_color(*MAROON_DEEP)
    pdf.rect(0, 26, pdf.w, 1.6, "F")
    pdf.set_y(4)
    pdf.set_text_color(*WHITE)
    pdf.set_font("Noto", "", 11)
    pdf.cell(0, 5, f"Day {index} of {total}    ·    {kind}", align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Serif", "", 16)
    pdf.cell(0, 7, level["label"], align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Noto", "B", BODY)
    pdf.cell(0, 5.5, f"{level['paper']}    {level['title']}", new_x="LMARGIN", new_y="NEXT")
    pdf.set_y(32)

    usable = pdf.w - pdf.l_margin - pdf.r_margin
    widths = (44, 48, usable - 44 - 48 - 14, 14)
    table_rows = []
    for slot in level["periods"]:
        study = not slot.get("hold")
        table_rows.append(
            ([slot["time"], slot["block"], slot["work"], ""], ROSE if study else HOLD, study)
        )
    draw_table(pdf, table_rows, widths)

    pdf.ln(3)
    y = pdf.get_y()
    recall = "Tick the box, and this day, only after you can do this with the book shut:  " + level["recall"]
    inner_w = usable - 8
    recall_lines = lines_of(pdf, recall, inner_w, "B")
    box_h = len(recall_lines) * LEAD + 8
    if y + box_h > pdf.h - 14:
        print(f"overflow day {index}: y={y:.1f} box={box_h:.1f}")
    pdf.set_fill_color(*CREAM)
    pdf.set_draw_color(180, 130, 40)
    pdf.set_line_width(0.4)
    pdf.rect(pdf.l_margin, y, usable, box_h, "FD")
    pdf.set_xy(pdf.l_margin + 4, y + 3)
    pdf.set_text_color(120, 72, 10)
    pdf.set_font("Noto", "B", BODY)
    pdf.multi_cell(inner_w, LEAD, recall, align="L")
    pdf.set_auto_page_break(auto=True, margin=16)


def main():
    plan = load_plan()
    camp = plan["campaigns"][0]
    levels = camp["levels"]
    pdf = Plan(format="A4")
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.set_margins(14, 14, 14)
    pdf.c_margin = 0
    pdf.add_font("Noto", "", FONT)
    pdf.add_font("Noto", "B", FONT_B)
    pdf.add_font("Serif", "", SERIF)
    pdf.add_font("SerifR", "", SERIF_R)

    pdf.add_page()
    pdf.set_auto_page_break(auto=False)
    band(
        pdf,
        "Semester I self-study timetable",
        "B.ASLP  ·  12 November to 10 December 2026",
    )
    write(
        pdf,
        "Department of Audiology and Speech-Language Pathology",
        style="B",
        color=MAROON,
    )
    write(pdf, "Yenepoya (Deemed to be University), Mangaluru", color=MUTED)
    pdf.ln(2)
    notice = plan["notice"]
    write(
        pdf,
        f"University theory examinations commence on {notice['starts']} "
        f"({notice['ref']}, dated {notice['dated']}). "
        "This booklet is the first-year plan for B1.1, B1.2, B1.3 and B1.4. "
        "It is the self-study clock, not the examination timetable. "
        "The paper order will be intimated by the Controller of Examinations.",
    )
    pdf.ln(1)

    section_label(pdf, "The four theory papers")
    for code, title, marks in camp["papers"]:
        write(pdf, f"{code}    {title}", style="B", color=MAROON, h=5.4)
        write(pdf, marks, color=MUTED, h=5.2)

    section_label(pdf, "How a class day is built")
    write(
        pdf,
        "College is 8:30 am to 3:30 pm, with lunch from 12:30 to 1:30. "
        "The hostel bus leaves at 8:10 am and returns at 3:40 pm or 4:10 pm. "
        "Grey rows are college, meals, the bus and breaks. Rose rows are self-study. "
        "On a class day that is about three hours: a morning recall, then two evening sittings.",
    )
    pdf.ln(1)
    write(
        pdf,
        "Class-day clock: 6:15–7:00 am recall, then 5:15–6:25 pm and 6:40–7:25 pm "
        "on the main paper, and 8:05–9:05 pm on the paired paper.",
    )

    section_label(pdf, "Other kinds of day")
    labels = {
        "boss": "Sunday. Two papers, done by 4:30 pm. The evening is free.",
        "holiday": "Friday 27 November. Confirm Kanakadasa Jayanti on the University list. If class is held, use the class-day clock.",
        "camp": "7 to 10 December. A full paper in the morning and a timed set in the afternoon. On 10 December, stop new work at 4:00 pm.",
    }
    for key, text in labels.items():
        write(pdf, text)

    section_label(pdf, "Keep these in front of the clock")
    for i, rule in enumerate(plan["rules"], 1):
        write(pdf, f"{i}.  {rule}")
        pdf.ln(0.2)
    if pdf.get_y() > pdf.h - 16:
        print(f"cover overflow y={pdf.get_y():.1f}")

    for i, level in enumerate(levels, 1):
        day_page(pdf, i, len(levels), level)

    pdf.add_page()
    band(pdf, "The night before", "10 December, then the morning of 11 December")
    points = [
        "New reading ends at 4:00 pm on 10 December. The evening is for the hall ticket, not a new chapter.",
        "Pack the hall ticket, identity card, pens, pencil, eraser and a bottle of water before you sleep.",
        "Sleep. A chapter opened at midnight will not raise a 50-mark paper.",
        "On the morning of the first paper, read only the one-page map of that paper.",
        "If the published order starts with a different paper, swap 7 to 10 December. Keep the earlier days as they are.",
        "Clinical postings on examination days follow the department notice.",
        "You still need 50 percent in the theory paper, and also in internal assessment, practicals and the clinical examination. Attendance stays 80 percent in theory and 90 percent in clinicals.",
    ]
    for n, point in enumerate(points, 1):
        write(pdf, f"{n}.  {point}")
        pdf.ln(1.4)
    pdf.ln(2)
    write(
        pdf,
        "Prepared for the Precision Clinicians, first year, from the RCI curriculum "
        "(academic session 2024-25) and the Controller of Examinations notification dated 06.11.2026. "
        "Class coordinator: Mr. Hemaraja Nayaka S.",
        color=MUTED,
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUT))
    print(OUT, OUT.stat().st_size, "pages", pdf.page)


if __name__ == "__main__":
    main()
