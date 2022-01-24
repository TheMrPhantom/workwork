import os
import Latex.tex as latex
import TaskScheduler
import mail_templates
import mail
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, helpers, redirect
from flask import request
from flask.wrappers import Request
from flask_cors import CORS
from functools import wraps
import authenticator
import util
from web import *

from database import Queries


token_manager = authenticator.TokenManager()

db = Queries.Queries(sql_database)

taskScheduler = TaskScheduler.TaskScheduler()
taskScheduler.add_Daily_Task(db.createRequestsFromEvents)
taskScheduler.start()


def authenticated(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not token_manager.check_token(request.cookies.get('memberID'), request.cookies.get('token')):
            return util.build_response("Unauthorized", 403)
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper


def checkTrainer(request: Request):
    if not token_manager.check_token(request.cookies.get('memberID'), request.cookies.get('token')):
        return util.build_response("Unauthorized", 403)

    if not (db.isTrainer(request.cookies.get('memberID')) or db.isExecutive(request.cookies.get('memberID'))):
        return util.build_response("Unauthorized", 403)
    return None


def checkExecutive(request: Request):
    if not token_manager.check_token(request.cookies.get('memberID'), request.cookies.get('token')):
        return util.build_response("Unauthorized", 403)
    if not db.isExecutive(request.cookies.get('memberID')):
        return util.build_response("Unauthorized", 403)
    return None


def memberIDFromRequest(request: Request):
    return request.cookies.get('memberID')


def infosAboutSelfOrTrainer(request: Request, memberID):
    if checkTrainer(request):
        if not int(memberID) == int(memberIDFromRequest(request)):
            return util.build_response("Unauthorized", 403)
    return None


@app.route('/api/user/<int:userID>', methods=["GET"])
@authenticated
def memberInfo(userID):
    if infosAboutSelfOrTrainer(request, userID):
        return infosAboutSelfOrTrainer(request, userID)
    return util.build_response(db.getMemberInfo(userID))


@app.route('/api/user/<int:userID>/currentHours', methods=["GET"])
@authenticated
def currentHours(userID):
    if infosAboutSelfOrTrainer(request, userID):
        return infosAboutSelfOrTrainer(request, userID)
    return util.build_response(db.getCurrentWorkMinutes(userID))


@app.route('/api/user/<int:userID>/neededHours', methods=["GET"])
@authenticated
def neededHours(userID):
    if infosAboutSelfOrTrainer(request, userID):
        return infosAboutSelfOrTrainer(request, userID)
    return util.build_response(db.getNeededWorkMinutes(userID))


@app.route('/api/user/<int:userID>/requests/accepted', methods=["GET"])
@authenticated
def getAcceptedWork(userID):
    if infosAboutSelfOrTrainer(request, userID):
        return infosAboutSelfOrTrainer(request, userID)
    dbResponse = db.getAcceptedWorkRequests(userID)
    output = []
    for resp in dbResponse:
        output.append(
            {"id": resp[3], "sport": resp[0], "activity": resp[1], "duration": round(resp[2]/60, 2)})
    return util.build_response(output)


@app.route('/api/user/<int:userID>/participantIn', methods=["GET"])
@authenticated
def participantIn(userID):
    if infosAboutSelfOrTrainer(request, userID):
        return infosAboutSelfOrTrainer(request, userID)
    return util.build_response(db.participantIn(userID))


@app.route('/api/user/<int:userID>/trainerIn', methods=["GET"])
@authenticated
def trainerIn(userID):
    if infosAboutSelfOrTrainer(request, userID):
        return infosAboutSelfOrTrainer(request, userID)
    return util.build_response(db.trainerIn(userID))


@app.route('/api/user/<int:userID>/requests/pending', methods=["GET"])
@authenticated
def getPendingWork(userID):
    if infosAboutSelfOrTrainer(request, userID):
        return infosAboutSelfOrTrainer(request, userID)
    dbResponse = db.getPendingWorkRequests(userID)
    output = []
    for resp in dbResponse:
        output.append(
            {"id": resp[3], "sport": resp[0], "activity": resp[1], "duration": round(resp[2]/60, 2)})
    return util.build_response(output)


@app.route('/api/user/<int:memberID>/isExecutive', methods=["GET"])
@authenticated
def isExecutive(memberID):
    return util.build_response(db.isExecutive(memberID))


@app.route('/api/user/<int:memberID>/isTrainer', methods=["GET"])
@authenticated
def isTrainer(memberID):
    return util.build_response(db.isTrainer(memberID))


@app.route('/api/user/<int:memberID>/setExecutive', methods=["POST"])
@authenticated
def makeExecutive(memberID):
    check = checkExecutive(request)
    if check is not None:
        return check
    toBeSet = request.json["isExecutive"]
    if not db.isExecutive(request.cookies.get("memberID")):
        return util.build_response("unauthorized", code=401)
    db.setExecutive(memberID, toBeSet)
    util.log("Executive permissions changed",
             f"Member: {memberID} to {toBeSet}")
    return util.build_response(db.isExecutive(memberID))


@app.route('/api/sports/names', methods=["GET"])
def listSports():
    return util.build_response(db.getSports())


@app.route('/api/sports/names/trainerof', methods=["GET"])
@authenticated
def listSportsOfTrainer():
    sports = db.getSports()
    output = []
    if not db.isExecutive(request.cookies.get('memberID')):
        if db.isTrainer(request.cookies.get('memberID')):
            output = [sports[0]]
        for s in sports:
            if db.isTrainerof(request.cookies.get('memberID'), s["id"]):
                output.append(s)
    else:
        output = sports
    return util.build_response(output)


@app.route('/api/sports/names/membership/<int:userID>', methods=["GET"])
@authenticated
def listSportsOfMember(userID):
    if infosAboutSelfOrTrainer(request, userID):
        return infosAboutSelfOrTrainer(request, userID)
    sports = db.getSports()
    memberID = userID
    if not db.isExecutive(memberID):
        output = []
        for s in sports:
            if db.isMemberof(memberID, s["id"]):
                output.append(s)
    else:
        output = sports
    return util.build_response(output)


@app.route('/api/members', methods=["GET"])
@authenticated
def members():
    check = checkTrainer(request)
    if check is not None:
        return check
    members = db.getMembers()

    return util.build_response(db.getMembersList(members))


@app.route('/api/members/trainer', methods=["GET"])
@authenticated
def trainer():
    members = db.getMembers()
    output = []
    for m in members:
        isTrainer = db.isTrainer(m[0])
        if isTrainer:
            output.append({"id": m[0], "firstname": m[1],
                           "lastname": m[2], "isTrainerOrExecutive": isTrainer or int(m[5]) == 1})
    return util.build_response(output)


@app.route('/api/members/trainerOrExecutive', methods=["GET"])
@authenticated
def trainerOrExecutive():
    members = db.getMembers()
    output = []
    for m in members:
        isTrainer = db.isTrainer(m[0])
        if isTrainer or int(m[5]) == 1:
            output.append({"id": m[0], "firstname": m[1],
                           "lastname": m[2], "isTrainerOrExecutive": isTrainer or int(m[5]) == 1})
    return util.build_response(output)


@app.route('/api/work/request/<int:sportID>', methods=["GET"])
@authenticated
def getRequestsFromSport(sportID):
    req = db.getPendingWorkRequestsBySport(sportID)
    output = []
    for r in req:
        output.append({"firstname": r[0], "lastname": r[1],
                       "sportname": r[2], "description": r[3], "duration": r[4], "id": r[5]})
    return util.build_response(output)


@app.route('/api/work/request/pendingAmount', methods=["GET"])
@authenticated
def getPendingRequestAmount():
    output = 0
    sports = db.getSports()
    for s in sports:
        output += len(db.getPendingWorkRequestsBySport(s["id"]))
    return util.build_response(output)


@app.route('/api/sports/<int:sportID>/members', methods=["GET"])
@authenticated
def getSportsMembers(sportID):
    check = checkTrainer(request)
    if check is not None:
        return check
    req = db.getMembersOfSport(sportID)
    output = []
    for r in req:
        currentWork = db.getCurrentWorkMinutes(r[0])
        maxWork = db.getNeededWorkMinutes(r[0])
        isTrainer = db.isTrainer(r[0])
        isExecutive = db.isExecutive(r[0])
        output.append({"firstname": r[1], "lastname": r[2], "isTrainerOfSport": r[3],
                       "currentWork": currentWork, "maxWork": maxWork, "isTrainer": isTrainer, "isExecutive": isExecutive, "id": r[4]})
    return util.build_response(output)


@app.route('/api/memberstate', methods=["GET"])
@authenticated
def getMemberState():
    memberID = request.cookies.get('memberID')
    output = 1
    isTrainer = db.isTrainer(memberID)
    isExecutive = db.isExecutive(memberID)
    if isTrainer:
        output += 2**1
    if isExecutive:
        output += 2**2
    return util.build_response(output)


@app.route('/api/sports/<int:sportID>/delete', methods=["POST"])
@authenticated
def deleteSport(sportID):
    check = checkExecutive(request)
    if check is not None:
        return check
    db.removeSport(sportID)
    util.log("Sport deleted", f"SportID: {sportID}")

    return util.build_response("OK")


@app.route('/api/sports/<int:sportID>/workhours', methods=["POST"])
@authenticated
def changeExtraHours(sportID):
    check = checkExecutive(request)
    if check is not None:
        return check
    minutes = request.json["minutes"]
    db.changeExtraHours(sportID, minutes)
    util.log("Extra hours changed", f"SportID: {sportID} to {minutes}")
    return util.build_response("OK")


@app.route('/api/sports/add', methods=["POST"])
@authenticated
def addSport():
    check = checkExecutive(request)
    if check is not None:
        return check
    name = request.json["name"]
    extraHours = request.json["extraHours"]
    db.addSport(name, extraHours)
    util.log("Sport added", f"{name} with {extraHours} extra hours")
    return util.build_response("OK")


@app.route('/api/request/create', methods=["POST"])
@authenticated
def addRequest():
    memberID = request.json["memberID"]
    sportID = request.json["sportID"]
    description = request.json["description"]
    minutes = request.json["minutes"]
    trainer = request.json["trainer"] if "trainer" in request.json else []

    db.addWorkRequest(memberID, sportID, description, minutes)

    for tID in trainer:
        trainer_info = db.getMemberInfo(tID)
        member_info = db.getMemberInfo(memberID)
        mail_txt = mail_templates.getWorkHourAddedText(
            trainer_info['firstname'], member_info['firstname'], "sport/1")
        mail_html = mail_templates.getWorkHourAddedHTML(
            trainer_info['firstname'], member_info['firstname'], "sport/1")

        mail.send_async("Bestätigung von Arbeitsstunden",
                        trainer_info['mail'], mail_txt, mail_html, trainer_info['firstname'])

    util.log("Request added",
             f"{memberID} with {minutes} min because {description}")
    return util.build_response("OK")


@app.route('/api/request/<int:requestID>/accept', methods=["POST"])
@authenticated
def acceptWorkRequest(requestID):
    check = checkTrainer(request)
    if check is not None:
        return check
    db.acceptWorkRequest(requestID)
    util.log("Request accepted", f"RequestID: {requestID}")
    return util.build_response("OK")


@app.route('/api/request/<int:requestID>/deny', methods=["POST"])
@authenticated
def denyWorkRequest(requestID):
    check = checkTrainer(request)
    if check is not None:
        return check
    db.denyWorkRequest(requestID)
    util.log("Request denied", f"RequestID: {requestID}")
    return util.build_response("OK")


@app.route('/api/user/<int:memberID>/changeParticipation', methods=["POST"])
@authenticated
def changeParticipation(memberID):
    if infosAboutSelfOrTrainer(request, memberID):
        return infosAboutSelfOrTrainer(request, memberID)
    input = request.json
    for membership in input:
        db.changeParticipation(
            memberID, membership["id"], membership["isParticipant"])
    util.log("Memberships changed", f"Of {memberID}")
    return util.build_response("OK")


@app.route('/api/user/<int:memberID>/changeTrainer', methods=["POST"])
@authenticated
def changeTrainer(memberID):
    check = checkExecutive(request)
    if check is not None:
        return check
    input = request.json
    for membership in input:
        db.changeTrainer(
            memberID, membership["id"], membership["isTrainer"])
    util.log("Trainerships changed", f"Of {memberID}")
    return util.build_response("OK")


@app.route('/api/member/<int:memberID>/extraHours', methods=["GET"])
@authenticated
def getExtraHoursOfMember(memberID):
    if infosAboutSelfOrTrainer(request, memberID):
        return infosAboutSelfOrTrainer(request, memberID)
    return util.build_response(db.getExtraHoursOfUser(memberID))


@app.route('/api/member/<int:memberID>/change/extraHours', methods=["POST"])
@authenticated
def changeExtraHoursOfMember(memberID):
    check = checkExecutive(request)
    if check is not None:
        return check
    db.changeMemberWorkHours(memberID, request.json)
    util.log("ExtraHours changed", f"Of {memberID}")
    return util.build_response("OK")


@app.route('/api/member/<int:memberID>/change/firstname', methods=["POST"])
@authenticated
def changeFirstname(memberID):
    if infosAboutSelfOrTrainer(request, memberID):
        return infosAboutSelfOrTrainer(request, memberID)
    db.changeFirstname(memberID, request.json)
    util.log("Firstname changed", f"Of {memberID}")
    return util.build_response("OK")


@app.route('/api/member/<int:memberID>/change/lastname', methods=["POST"])
@authenticated
def changeLastname(memberID):
    if infosAboutSelfOrTrainer(request, memberID):
        return infosAboutSelfOrTrainer(request, memberID)
    db.changeLastname(memberID, request.json)
    util.log("Lastname changed", f"Of {memberID}")
    return util.build_response("OK")


@app.route('/api/member/<int:memberID>/change/email', methods=["POST"])
@authenticated
def changeEmail(memberID):
    if infosAboutSelfOrTrainer(request, memberID):
        return infosAboutSelfOrTrainer(request, memberID)
    if db.checkMailExists(request.json):
        return util.build_response("Mail Already Exists", code=409)
    db.changeMail(memberID, request.json)
    util.log("Email changed", f"Of {memberID}")
    return util.build_response("OK")


@app.route('/api/member/<int:memberID>/change/password', methods=["POST"])
@authenticated
def changePassword(memberID):
    if infosAboutSelfOrTrainer(request, memberID):
        return infosAboutSelfOrTrainer(request, memberID)
    isTrueMember = token_manager.check_token(
        memberID, request.cookies.get("token"))

    if not isTrueMember and not db.isExecutive(request.cookies.get("memberID")):
        return util.build_response("Not authorized", code=403)

    newPassword = request.json["newPassword"]
    db.changePassword(memberID, newPassword)
    util.log("Password changed", f"Of {memberID}")
    return util.build_response("OK")


@app.route('/api/member/add', methods=["POST"])
def addMember():
    firstName = request.json["firstname"]
    lastname = request.json["lastname"]
    email = request.json["email"]
    password = request.json["password"] if "password" in request.json else None
    memberships = request.json["membership"] if "membership" in request.json else [
    ]

    if db.checkMailExists(email):
        return util.build_response("Mail Already Exists", code=409)

    memberID, pw = db.addMember(firstName, lastname, email, password)

    for sportMembership in memberships:
        db.changeParticipation(memberID, sportMembership, True)

    if pw:
        util.log("User Created", f"{firstName} {lastname}")

        formattedName = str(firstName).capitalize()
        sportNameString = ""

        for sID in memberships:
            sportNameString += f"{db.getSportName(sID)}, "

        sportNameString = sportNameString[:-2]

        text = mail_templates.getRegistrationText(
            formattedName, sportNameString, pw)
        html = mail_templates.getRegistrationHTML(
            formattedName, sportNameString, pw)

        mail.send_async(subject="AMS Registrierung",
                        to=email, text=text, html=html, receiver_Name=formattedName)
        return util.build_response(pw)
    else:
        return util.build_response("OK")


@app.route('/api/member/delete/<int:memberID>', methods=["POST"])
@authenticated
def deleteMember(memberID):
    if not db.isExecutive(request.cookies.get("memberID")):
        return util.build_response("OK", code=401)
    db.deleteMember(memberID)
    util.log("Member deleted", f"MemberID: {memberID}")
    return util.build_response("OK")


@app.route('/api/workhours', methods=["GET"])
@authenticated
def getWorkHours():
    return util.build_response(db.getStandardWorkTime())


@app.route('/api/workhours/change', methods=["POST"])
@authenticated
def setWorkHours():
    check = checkExecutive(request)
    if check is not None:
        return check
    db.setStandardWorkTime(request.json)
    util.log("Standard worktime changed", f"To: {request.json} minutes")
    return util.build_response("OK")


@app.route('/api/mail/mailToSport/<int:sportID>', methods=["POST"])
@authenticated
def sendSportMail(sportID):
    check = checkTrainer(request)
    if check is not None:
        return check

    members = db.getMembersOfSport(sportID)
    sportName = db.getSportName(sportID)
    mails = []
    for m in members:
        mails.append(m[5])
    subject = request.json['subject']
    body = request.json['body']
    if subject == "" or body == "":
        return util.build_response("Subject and Body not both set", code=400)
    mail.sendBCC_async(subject, mails, body, sportName+" Mitglieder")
    return util.build_response("OK")


@app.route('/api/event/add', methods=["POST"])
@authenticated
def addEvent():
    check = checkTrainer(request)
    if check is not None:
        return check

    eventName = request.json["name"]
    sportID = request.json["sportID"]
    date = request.json["date"]
    timeslots = request.json["timeslots"]
    eventID = db.addEvent(eventName, sportID, date)
    if eventID is None:
        return util.build_response("Event already Exists", code=409)

    for t in timeslots:
        db.addTimeslot(eventID[0], t["name"],
                       t["helper"], t["start"], t["end"])

    return util.build_response("OK")


@app.route('/api/event', methods=["GET"])
@authenticated
def getEvents():
    events = db.getEvents()
    output = []
    for e in events:
        eventID = e[0]
        timeslots = db.getTimeslots(eventID)
        output.append(
            {"eventID": e[0], "name": e[1], "sportID": e[2], "date": e[3], "timeslots": timeslots})

    return util.build_response(output)


@app.route('/api/event/delete', methods=["POST"])
@authenticated
def deleteEvent():
    check = checkTrainer(request)
    if check is not None:
        return check
    eventID = request.json

    db.deleteEvent(eventID)

    return util.build_response("OK")


@app.route('/api/event/timeslot/<int:timeslotID>/participant/<int:memberID>', methods=["GET"])
@authenticated
def isTimeslotParticipant(memberID, timeslotID):
    if infosAboutSelfOrTrainer(request, memberID):
        return infosAboutSelfOrTrainer(request, memberID)
    return util.build_response(db.isTimeslotParticipant(memberID, timeslotID))


@app.route('/api/event/timeslot/<int:timeslotID>/participant/<int:memberID>', methods=["POST"])
@authenticated
def setTimeslotParticipant(memberID, timeslotID):
    if infosAboutSelfOrTrainer(request, memberID):
        return infosAboutSelfOrTrainer(request, memberID)
    isSet = request.json

    if isSet:
        maxhelper = db.getTimeslot(timeslotID)[3]
        participants = db.getTimeslotParticipants(timeslotID)
        currentHelper = len(participants) if participants else 0

        if currentHelper < maxhelper:
            db.addTimeslotParticipant(memberID, timeslotID)
        else:
            return util.build_response("Timeslot already full", code=409)
    else:
        db.removeTimeslotParticipant(memberID, timeslotID)
    return util.build_response(isSet)


@app.route('/api/event/timeslot/<int:timeslotID>/participants', methods=["GET"])
@authenticated
def getTimeslotParticipants(timeslotID):
    check = checkTrainer(request)
    if check is not None:
        return check

    return util.build_response(db.getTimeslotParticipants(timeslotID))


@app.route('/api/event/timeslot/<int:timeslotID>/participants/amount', methods=["GET"])
@authenticated
def getTimeslotParticipantsAmount(timeslotID):
    return util.build_response(len(db.getTimeslotParticipants(timeslotID)))


@app.route('/api/report/remainingWorkhours/pdf', methods=["GET"])
@authenticated
def getRemainingWorkhoursPDF():
    check = checkExecutive(request)
    if check is not None:
        return check

    members = db.getMembersList(db.getMembers())
    membersFiltered = []
    for m in members:
        current = 0
        for cur in m["currentWork"]:
            current += cur["hours"]

        max = 0
        for maxW in m["maxWork"]:
            max += maxW["hours"]

        if current < max:
            membersFiltered.append(m)

    tables = {}
    tables['overview'] = []
    for m in membersFiltered:
        current = 0
        for cur in m["currentWork"]:
            current += cur["hours"]

        max = 0
        for maxW in m["maxWork"]:
            max += maxW["hours"]
        tables['overview'].append(
            [f"{m['firstname']} {m['lastname']}", current, max, max-current])

    for s in db.getSports():
        if s['name'] == "Allgemein":
            continue

        sportName = s['name']
        tables[sportName] = []

        for m in membersFiltered:
            if db.isMemberof(m['id'], s['id']):
                current = 0
                for cur in m["currentWork"]:
                    current += cur["hours"]

                max = 0
                for maxW in m["maxWork"]:
                    max += maxW["hours"]
                tables[sportName].append(
                    [f"{m['firstname']} {m['lastname']}", current, max, max-current])

    latex.build_workhour_overview(tables)
    resp = helpers.send_from_directory(
        os.getcwd(), "BerichtArbeitsstunden.pdf")
    resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return resp


@app.route('/api/report/members/pdf', methods=["GET"])
@authenticated
def getMemberPDF():
    check = checkExecutive(request)
    if check is not None:
        return check

    members = db.getMembersList(db.getMembers())

    table = []
    for m in members:
        current = 0
        for cur in m["currentWork"]:
            current += cur["hours"]

        max = 0
        for maxW in m["maxWork"]:
            max += maxW["hours"]
        table.append(
            [f"{m['firstname']} {m['lastname']}", current, max, max-current])

    latex.build_member_overview(table)
    resp = helpers.send_from_directory(os.getcwd(), "BerichtMitglieder.pdf")
    resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return resp


@app.route('/api/login', methods=["POST"])
def login():
    post_data = request.json
    username = post_data["username"]
    password = post_data["password"]
    rights = db.checkPassword(username, password)

    if rights:
        util.log("Login", f"{username} logged in")
        token = token_manager.create_token(rights["memberID"])
        return util.build_response("OK", cookieToken=token, cookieMemberID=rights["memberID"])
    return util.build_response("Unauthorized", code=403)


@app.route('/api/login/check', methods=["GET"])
@authenticated
def loginCheck():
    return util.build_response("OK")


@app.route('/api/logout', methods=["POST"])
@authenticated
def logout():
    token_manager.delete_token(request.cookies.get('token'))
    util.log("Logout", f"MemberID: {request.cookies.get('memberID')}")
    return util.build_response("OK")


app.run("0.0.0.0", threaded=True)
