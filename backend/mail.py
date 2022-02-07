from datetime import datetime, timedelta
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from database.EventParticipant import EventParticipant
from database.Member import Member
from database.Timeslot import Timeslot
from database.Event import Event
from database.Queries import Queries
import threading
from typing import List
from typing import Dict
import constants

try:
    import config
except:
    pass
import os

port = 587
smtp_server = os.environ.get("smtp_server") if os.environ.get(
    "smtp_server") else config.smtp_server
username = os.environ.get("mail_username") if os.environ.get(
    "mail_username") else config.username
password = os.environ.get("mail_password") if os.environ.get(
    "mail_password") else config.password
sender_email = os.environ.get("server_mail") if os.environ.get(
    "server_mail") else config.sender_email

# Create a secure SSL context
context = ssl.create_default_context()


def create_remeber_mails(db) -> None:
    database: Queries
    if isinstance(db, tuple):
        database = db[0]
    else:
        database = db
    events: List[Event] = database.getEvents()
    current_time = datetime.utcnow()

    for event in events:

        participant_dict: Dict[Member, (Member, List[Timeslot])] = {}

        if current_time > event.date.replace(hour=0, minute=0, second=0)-timedelta(days=constants.REMEBER_MAIL_TIME) and not event.members_notified:
            # Should remind People
            timeslots: List[Timeslot] = event.timeslots

            for timeslot in timeslots:
                participants: List[EventParticipant] = timeslot.participants

                for participant in participants:
                    member: Member = participant.member
                    if member.id in participant_dict:
                        participant_dict[member.id][1].append(timeslot)
                    else:
                        participant_dict[member.id] = (
                            member, [timeslot])

        for participant in participant_dict.values():
            __send_remeber_mail(participant[0], participant[1])

        event.members_notified = True

    database.session.commit()


def __send_remeber_mail(member: Member, timeslots: List[Timeslot]) -> None:
    assert len(timeslots) > 0
    event: Event = timeslots[0].event
    mail_text = f"""Hallo {member.firstname},
du hast dich beim Event {event.name} am {event.date.strftime("%d.%m.%Y")} zum helfen angemeldet. Bitte denke an deine Schichten:
"""

    for timeslot in timeslots:
        start_time = f"{timeslot.start.strftime('%H:%M')} Uhr"
        mail_text += f"  -> {timeslot.name} um {start_time}\n"
    mail_text += f"\n{constants.MAIL_GREETING}"

    send(constants.MAIL_REMEMBERMAIL_SUBJECT, member.mail, mail_text,
         receiver_Name=f"{member.firstname} {member.lastname}")


def send(subject, to, text, html=None, receiver_Name=None):
    print("Start sending Mail to", receiver_Name)
    try:
        server = smtplib.SMTP(smtp_server, port)
        server.starttls(context=context)
        server.login(username, password)

        part1 = MIMEText(text, "plain")

        if html:
            part2 = MIMEText(html, "html")

        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"AMS Hundesportfreunde Degerloch <{sender_email}>"
        if isinstance(to, list):
            message["To"] = f"AMS Hundesportfreunde Degerloch <{sender_email}>"
        else:
            message["To"] = f"{receiver_Name} <{to}>" if receiver_Name else to

        message.attach(part1)

        if html:
            message.attach(part2)

        server.sendmail(sender_email, to, message.as_string())

    except Exception as e:
        print(e)
    finally:
        server.quit()
    print("Done sending mail")


def send_async(subject, to, text, html=None, receiver_Name=None):
    mail_Thread = threading.Thread(target=send, args=(
        subject, to, text, html, receiver_Name,))
    mail_Thread.start()


# def sendBCC(subject, to, text, receiver_Name):
#     print("Start sending Mail to", receiver_Name)

#     try:
#         server = smtplib.SMTP(smtp_server, port)
#         server.starttls(context=context)
#         server.login(username, password)

#         part1 = MIMEText(text, "plain")

#         message = MIMEMultipart("alternative")
#         message["Subject"] = subject
#         message["From"] = f"AMS Hundesportfreunde Degerloch <{sender_email}>"
#         message["To"] = f"{receiver_Name} <{sender_email}>"
#         message.attach(part1)
#         server.sendmail(sender_email, to, message.as_string())

#     except Exception as e:
#         print(e)
#     finally:
#         server.quit()
#     print("Done sending mail")


# def sendBCC_async(subject, to, text, receiver_Name):
#     mail_Thread = threading.Thread(target=sendBCC, args=(
#         subject, to, text, receiver_Name,))
#     mail_Thread.start()
