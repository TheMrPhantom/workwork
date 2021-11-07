from flask import Flask, redirect
from flask import request
from flask_cors import CORS
from functools import wraps
import authenticator
import util
import database

app = Flask(__name__)
CORS(app, supports_credentials=True)

token_manager = authenticator.TokenManager()
db = database.SQLiteWrapper()


def authenticated(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not token_manager.check_token(request.cookies.get('memberID'), request.cookies.get('token')):
            return util.build_response("Unauthorized", 403)
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper


@app.route('/api/user/<int:userID>', methods=["GET"])
@authenticated
def memberInfo(userID):
    return util.build_response(db.getMemberInfo(userID))


@app.route('/api/user/<int:userID>/currentHours', methods=["GET"])
@authenticated
def currentHours(userID):
    return util.build_response(db.getCurrentWorkMinutes(userID))


@app.route('/api/user/<int:userID>/neededHours', methods=["GET"])
@authenticated
def neededHours(userID):
    return util.build_response(db.getNeededWorkMinutes(userID))


@app.route('/api/user/<int:userID>/requests/accepted', methods=["GET"])
@authenticated
def getAcceptedWork(userID):
    dbResponse = db.getAcceptedWorkRequests(userID)
    output = []
    for resp in dbResponse:
        output.append(
            {"id": resp[3], "sport": resp[0], "activity": resp[1], "duration": round(resp[2]/60, 2)})
    return util.build_response(output)


@app.route('/api/user/<int:userID>/participantIn', methods=["GET"])
@authenticated
def participantIn(userID):
    return util.build_response(db.participantIn(userID))


@app.route('/api/user/<int:userID>/trainerIn', methods=["GET"])
@authenticated
def trainerIn(userID):
    return util.build_response(db.trainerIn(userID))


@app.route('/api/user/<int:userID>/requests/pending', methods=["GET"])
@authenticated
def getPendingWork(userID):
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
    if not db.isExecutive(request.cookies.get('memberID')):
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
    members = db.getMembers()
    output = []
    for m in members:
        currentWork = db.getCurrentWorkMinutes(m[0])
        maxWork = db.getNeededWorkMinutes(m[0])
        isTrainer = db.isTrainer(m[0])
        output.append({"id": m[0], "firstname": m[1],
                       "lastname": m[2], "email": m[3], "currentWork": currentWork, "maxWork": maxWork, "isTrainer": isTrainer, "isExecutive": int(m[5]) == 1})
    return util.build_response(output)


@app.route('/api/members/trainer', methods=["GET"])
@authenticated
def trainer():
    members = db.getMembers()
    output = []
    for m in members:
        isTrainer = db.isTrainer(m[0])
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

    db.removeSport(sportID)
    util.log("Sport deleted",f"SportID: {sportID}")

    return util.build_response("OK")


@app.route('/api/sports/<int:sportID>/workhours', methods=["POST"])
@authenticated
def changeExtraHours(sportID):
    minutes = request.json["minutes"]
    db.changeExtraHours(sportID, minutes)
    util.log("Extra hours changed",f"SportID: {sportID} to {minutes}")
    return util.build_response("OK")


@app.route('/api/sports/add', methods=["POST"])
@authenticated
def addSport():
    name = request.json["name"]
    extraHours = request.json["extraHours"]
    db.addSport(name, extraHours)
    util.log("Sport added",f"{name} with {extraHours} extra hours")
    return util.build_response("OK")


@app.route('/api/request/create', methods=["POST"])
@authenticated
def addRequest():
    memberID = request.json["memberID"]
    sportID = request.json["sportID"]
    description = request.json["description"]
    minutes = request.json["minutes"]
    #trainer=request.json["trainer"] if "trainer" in request.json else None
    db.addWorkRequest(memberID, sportID, description, minutes)
    util.log("Request added",f"{memberID} with {minutes} min because {description}")
    return util.build_response("OK")


@app.route('/api/request/<int:requestID>/accept', methods=["POST"])
@authenticated
def acceptWorkRequest(requestID):
    db.acceptWorkRequest(requestID)
    util.log("Request accepted",f"RequestID: {requestID}")
    return util.build_response("OK")


@app.route('/api/request/<int:requestID>/deny', methods=["POST"])
@authenticated
def denyWorkRequest(requestID):
    db.denyWorkRequest(requestID)
    util.log("Request denied",f"RequestID: {requestID}")
    return util.build_response("OK")


@app.route('/api/user/<int:memberID>/changeParticipation', methods=["POST"])
@authenticated
def changeParticipation(memberID):
    input = request.json
    for membership in input:
        db.changeParticipation(
            memberID, membership["id"], membership["isParticipant"])
    util.log("Memberships changed",f"Of {memberID}")
    return util.build_response("OK")


@app.route('/api/user/<int:memberID>/changeTrainer', methods=["POST"])
@authenticated
def changeTrainer(memberID):
    input = request.json
    for membership in input:
        db.changeTrainer(
            memberID, membership["id"], membership["isTrainer"])
    util.log("Trainerships changed",f"Of {memberID}")
    return util.build_response("OK")


@app.route('/api/member/<int:memberID>/change/firstname', methods=["POST"])
@authenticated
def changeFirstname(memberID):
    db.changeFirstname(memberID, request.json)
    util.log("Firstname changed",f"Of {memberID}")
    return util.build_response("OK")


@app.route('/api/member/<int:memberID>/change/lastname', methods=["POST"])
@authenticated
def changeLastname(memberID):
    db.changeLastname(memberID, request.json)
    util.log("Lastname changed",f"Of {memberID}")
    return util.build_response("OK")


@app.route('/api/member/<int:memberID>/change/email', methods=["POST"])
@authenticated
def changeEmail(memberID):
    if db.checkMailExists(request.json):
        return util.build_response("Mail Already Exists", code=409)
    db.changeMail(memberID, request.json)
    util.log("Email changed",f"Of {memberID}")
    return util.build_response("OK")


@app.route('/api/member/<int:memberID>/change/password', methods=["POST"])
@authenticated
def changePassword(memberID):
    isTrueMember = token_manager.check_token(
        memberID, request.cookies.get("token"))

    if not isTrueMember and not db.isExecutive(request.cookies.get("memberID")):
        return util.build_response("Not authorized", code=403)

    newPassword = request.json["newPassword"]
    db.changePassword(memberID, newPassword)
    util.log("Password changed",f"Of {memberID}")
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
        return util.build_response(pw)
    else:
        return util.build_response("OK")


@app.route('/api/member/delete/<int:memberID>', methods=["POST"])
@authenticated
def deleteMember(memberID):
    if not db.isExecutive(request.cookies.get("memberID")):
        return util.build_response("OK", code=401)
    db.deleteMember(memberID)
    util.log("Member deleted",f"MemberID: {memberID}")
    return util.build_response("OK")


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
