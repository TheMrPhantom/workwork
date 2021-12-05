import subprocess
import datetime
from threading import Lock
import os
critical_function_lock = Lock()


def yaml_header(title):
    date = datetime.datetime.now().strftime("%d.%m.%Y")
    return f"""---
title: "{title}"
author: "Arbeitsstunden Management System"
mainfont: Exo-Regular.ttf
date: Stand {date}
geometry: "left=2.54cm,right=2.54cm,top=1.91cm,bottom=1.91cm"
subparagraph: true
lang: de-DE
---
"""


def build_workhour_table(name, table):
    output = f"""

Table: {name} offene Arbeitsstunden 

|Name|Abgeleistete Stunden|Benötigte Stunden|Offene Stunden|
| - | - | - | - |
"""
    for row in table:
        for item in row:
            output += f"|{item}"
        output += "|\n"
    output += """

\\newpage

"""
    return output


def build_workhour_overview(member_infos: dict):
    file_dir = os.path.dirname(__file__)
    with critical_function_lock:

        output_string = yaml_header(
            "Bericht: Personen mit offenen Arbeitsstunden")

        for table in member_infos.items():
            if table[0] == "overview":
                output_string += "# Alle Mitglieder\n"
                output_string += build_workhour_table(
                    "Alle Mitglieder", table[1])
                output_string += "# Nach Sparte\n"
            else:
                output_string += f"## {table[0]}\n"
                output_string += build_workhour_table(table[0], table[1])

        with open(f'{file_dir}/template_workhours.md', "w") as writer:
            writer.write(output_string)

        subprocess.run(["pandoc", f"{file_dir}/template_workhours.md", "-s",
                        "--latex-engine=lualatex", "-o", "BerichtArbeitsstunden.pdf", "-H", f"{file_dir}/workhours_header.tex"])


# Example
#build_workhour_overview({'overview': [["Thorsten", 5, 12, 7], [
#                        "Thorsten", 5, 12, 7]], 'Agility': [["Thorsten", 5, 12, 7], ["Thorsten", 5, 12, 7]]})
