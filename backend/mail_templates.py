import util
import mail
import constants

domain = "http://"+util.domain if "127.0.0.1" in util.domain else "https://"+util.domain


def getRegistrationText(name, sports, password):
    return f"""Hallo {name},

du hast dich erfolgreich im Arbeitsstunden Management System (AMS) der Hundesportfreunde Degerloch registriert.

Nach deinen Angaben bist du bei folgenden Sparten dabei: {sports}. Falls du dich vertan hast,
kannst du dies einfach in den Einstellungen ändern.

Dein initiales Passwort lautet:

{password}

Bitte ändere dein Passwort in den Einstellungen nach dem ersten Login.
            {greetings_text()}
"""


def getRegistrationHTML(name, sports, password):
    return f"""
    <html>
        <body>
            Hallo {name},
            <br />
            du hast dich erfolgreich im <b>A</b>rbeitsstunden <b>M</b>anagement <b>S</b>ystem (AMS) der Hundesportfreunde Degerloch registriert.
            <br />
            Nach deinen Angaben bist du bei folgenden Sparten dabei: {sports}. Falls du dich vertan hast,
            kannst du dies einfach in den Einstellungen <a href="{domain+"/settings"}">hier</a> ändern.
            <br />
            <br />
            Dein initiales Passwort lautet:
            <br />
            <h3>{password}</h3>
            <b>Bitte ändere dein Passwort in den <a href="{domain+"/settings"}">Einstellungen</a> nach dem ersten Login</b>.
            <p>
            {greetings_html()}
            </p>
        </body>
    </html>
    """


def getWorkHourAddedText(trainerName, memberName, requestURL):
    return f"""Hallo {trainerName},
{memberName} hat eine Arbeitsstunde hinzugefügt und dich als bestätigende Person eingetragen.
Bitte schaue dir die Anfrage unter {domain}/{requestURL} an.
            {greetings_text()}
"""


def getWorkHourAddedHTML(trainerName, memberName, requestURL):
    return f"""
    <html>
        <body>
            Hallo {trainerName},
            <br />
            {memberName} hat eine Arbeitsstunde hinzugefügt und dich als bestätigende Person eingetragen.
            <br />
            Bitte schaue dir die Anfrage unter <a href="{domain}/{requestURL}">{domain}/{requestURL}</a> an.

            <p>
            {greetings_html()}
            </p>
        </body>
    </html>
    """


def event_ended_text(trainer_name, member_texts, sport_id, sport_name):
    mail_text = f"""Hallo {trainer_name},
{constants.MAIL_TEXT_AFTER_EVENT}
"""
    for text in member_texts:
        mail_text += f"    - {text}\n"

    mail_text += f"""
Die Anfragen findest du in der Sparte {sport_name}

Link zur Website: {domain}/sport/{sport_id}
{greetings_text()}
    """
    return mail_text


def notify_members_text(member):
    mail_text = f"""Hallo {member['firstname']},
wir möchten dich auf deine aktuell noch ausstehenden Arbeisstunden aufmerksam machen.
Bis Jahresende musst du noch folgende Arbeisstunden ableisten: 
"""
    cw = member['currentWork']
    mw = member['maxWork']

    for idx in range(len(cw)):
        if cw[idx]['hours'] < mw[idx]['hours']:
            mail_text += f"  -> {round(  mw[idx]['hours']-cw[idx]['hours'],2)} {cw[idx]['name']} Arbeitsstunden\n"

    mail_text += f"\n{constants.MAIL_GREETING}"

    return mail_text


def greetings_text():
    return """
Viele Grüße
Das Arbeitsstunden Team
"""


def greetings_html():
    return """
Viele Grüße<br />
Das Arbeitsstunden Team
"""
