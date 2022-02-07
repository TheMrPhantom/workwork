import os

MAIL_SUBJECT_AFTER_EVENT = "Genehmigung Arbeitsstunden von"
MAIL_SUBJECT_OPEN_WORKHOURS = f"{os.environ.get('orga_name')} offene Arbeisstunden" if os.environ.get(
    'orga_name') else "Offene Arbeitsstunden"
MAIL_TEXT_AFTER_EVENT = "Dein Event ist beendet, bitte schaue dir die Arbeitsstunden-Anfragen folgender Mitglieder an:"
MAIL_REMEMBERMAIL_SUBJECT = f"{os.environ.get('orga_name')} Anstehendes Event" if os.environ.get(
    'orga_name') else "Anstehendes Event"
MAIL_GREETING = "Viele Grüße\nDas Arbeitsstunden Team"
REMEBER_MAIL_TIME = 2
