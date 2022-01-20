import subprocess
import datetime
from threading import Lock
import os
critical_function_lock_workhour_overview = Lock()
critical_function_lock_member_overview = Lock()


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

Table: {name} 

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
    with critical_function_lock_workhour_overview:

        output_string = yaml_header(
            "Bericht: Personen mit offenen Arbeitsstunden")

        for table in member_infos.items():
            if table[0] == "overview":
                output_string += "# Alle Mitglieder\n"
                output_string += build_workhour_table(
                    "Alle Mitglieder offene Arbeitsstunden", table[1])
                output_string += "# Nach Sparte\n"
            else:
                output_string += f"## {table[0]}\n"
                output_string += build_workhour_table(
                    f"{table[0]} offene Arbeitsstunden", table[1])

        with open(f'{file_dir}/template_workhours.md', "w") as writer:
            writer.write(output_string)

        pandoc_engine_string = "--latex-engine" if os.environ.get(
            "deprecated_pandoc") else "--pdf-engine"

        subprocess.run(["pandoc", f"{file_dir}/template_workhours.md", "-s",
                        f"{pandoc_engine_string}=lualatex", "-o", "BerichtArbeitsstunden.pdf", "-H", f"{file_dir}/workhours_header.tex"])


def build_member_overview(member_infos: dict):
    file_dir = os.path.dirname(__file__)
    with critical_function_lock_member_overview:

        output_string = yaml_header(
            "Mitgliederübersicht")
        output_string += build_workhour_table(
            "Übersicht über alle Mitglieder", member_infos)

        with open(f'{file_dir}/template_member_workhours.md', "w") as writer:
            writer.write(output_string)

        pandoc_engine_string = "--latex-engine" if os.environ.get(
            "deprecated_pandoc") else "--pdf-engine"

        subprocess.run(["pandoc", f"{file_dir}/template_member_workhours.md", "-s",
                        f"{pandoc_engine_string}=lualatex", "-o", "BerichtMitglieder.pdf", "-H", f"{file_dir}/member_header.tex"])

# Example
# build_workhour_overview({'overview': [["Thorsten", 5, 12, 7], [
#                        "Thorsten", 5, 12, 7]], 'Agility': [["Thorsten", 5, 12, 7], ["Thorsten", 5, 12, 7]]})
