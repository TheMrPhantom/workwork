import util

domain = "http://"+util.domain if "127.0.0.1" in util.domain else "https://"+util.domain


def getRegistrationText(name, sports, password):
    return f"""
            Hallo {name},

            du hast dich erfolgreich im Arbeitsstunden Management System (AMS) der Hundesportfreunde Degerloch registriert.

            Nach deinen Angaben bist du bei folgenden Sparten dabei: {sports}. Falls du dich vertan hast, 
            kannst du dies einfach in den Einstellungen ändern. 

            Dein initiales Passwort lautet: 

            {password}

            Bitte ändere dein Passwort in den Einstellungen nach dem ersten Login.

            Viele Grüße
            Das Arbeitsstunden Team
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
            Viele Grüße<br />
            Das Arbeitsstunden Team
            </p>
        </body>
    </html>
    """


def getWorkHourAddedText(trainerName, memberName, requestURL):
    return f"""
            Hallo {trainerName},
            {memberName} hat eine Arbeitsstunde hinzugefügt und dich als bestätigende Person eingetragen.
            Bitte schaue dir die Anfrage unter {domain}/{requestURL} an.

            Viele Grüße
            Das Arbeitsstunden Team
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
            Viele Grüße<br />
            Das Arbeitsstunden Team
            </p>
        </body>
    </html>
    """
