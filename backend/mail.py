import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading
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


def send(subject, to, text, html, receiver_Name=None):
    print("Start sending Mail to", receiver_Name)
    try:
        server = smtplib.SMTP(smtp_server, port)
        server.starttls(context=context)
        server.login(username, password)

        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")

        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"AMS Hundesportfreunde Degerloch <{sender_email}>"
        message["To"] = f"{receiver_Name} <{to}>" if receiver_Name else to
        message.attach(part1)
        message.attach(part2)
        server.sendmail(sender_email, to, message.as_string())

    except Exception as e:
        print(e)
    finally:
        server.quit()
    print("Done sending mail")


def send_async(subject, to, text, html, receiver_Name=None):
    mail_Thread = threading.Thread(target=send, args=(
        subject, to, text, html, receiver_Name,))
    mail_Thread.start()


def sendBCC(subject, to, text, receiver_Name):
    print("Start sending Mail to", receiver_Name)

    try:
        server = smtplib.SMTP(smtp_server, port)
        server.starttls(context=context)
        server.login(username, password)

        part1 = MIMEText(text, "plain")

        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"AMS Hundesportfreunde Degerloch <{sender_email}>"
        message["To"] = f"{receiver_Name} <{sender_email}>"
        message.attach(part1)
        server.sendmail(sender_email, to, message.as_string())

    except Exception as e:
        print(e)
    finally:
        server.quit()
    print("Done sending mail")

def sendBCC_async(subject, to, text, receiver_Name):
    mail_Thread = threading.Thread(target=sendBCC, args=(
        subject, to, text, receiver_Name,))
    mail_Thread.start()