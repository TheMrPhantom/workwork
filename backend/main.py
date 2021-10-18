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
    return util.build_response(db.getCurrentWorkMinutes(userID)/60)


@app.route('/api/user/<int:userID>/neededHours', methods=["GET"])
@authenticated
def neededHours(userID):
    return util.build_response(db.getNeededWorkMinutes(userID)/60)


@app.route('/api/user/<int:userID>/requests/accepted', methods=["GET"])
@authenticated
def getAcceptedWork(userID):
    dbResponse = db.getAcceptedWorkRequests(userID)
    output = []
    for resp in dbResponse:
        output.append(
            {"id": resp[3], "sport": resp[0], "activity": resp[1], "duration": resp[2]/60})
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
            {"id": resp[3], "sport": resp[0], "activity": resp[1], "duration": resp[2]/60})
    return util.build_response(output)


@app.route('/api/sports/names', methods=["GET"])
@authenticated
def listSports():
    return util.build_response(db.getSports())


@app.route('/api/sports/names/trainerof', methods=["GET"])
@authenticated
def listSportsOfTrainer():
    sports = db.getSports()
    if not db.isExecutive(request.cookies.get('memberID')):
        output = []
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
        currentWork = db.getCurrentWorkMinutes(m[0])/60
        maxWork = db.getNeededWorkMinutes(m[0])/60
        isTrainer = db.isTrainer(m[0])
        output.append({"id": m[0], "firstname": m[1],
                       "lastname": m[2], "email": m[3], "currentWork": currentWork, "maxWork": maxWork, "isTrainer": isTrainer, "isExecutive": int(m[5]) == 1})
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


@app.route('/api/sports/<int:sportID>/members', methods=["GET"])
@authenticated
def getSportsMembers(sportID):
    req = db.getMembersOfSport(sportID)
    output = []
    for r in req:
        currentWork = db.getCurrentWorkMinutes(r[0])/60
        maxWork = db.getNeededWorkMinutes(r[0])/60
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

    return util.build_response("OK")


@app.route('/api/sports/<int:sportID>/workhours', methods=["POST"])
@authenticated
def changeExtraHours(sportID):
    minutes = request.json["minutes"]
    db.changeExtraHours(sportID, minutes)

    return util.build_response("OK")


@app.route('/api/sports/add', methods=["POST"])
@authenticated
def addSport():
    name = request.json["name"]
    extraHours = request.json["extraHours"]
    db.addSport(name, extraHours)

    return util.build_response("OK")


@app.route('/api/request/create', methods=["POST"])
@authenticated
def addRequest():
    memberID = request.json["memberID"]
    sportID = request.json["sportID"]
    description = request.json["description"]
    minutes = request.json["minutes"]

    db.addWorkRequest(memberID, sportID, description, minutes)

    return util.build_response("OK")


@app.route('/api/request/<int:requestID>/accept', methods=["POST"])
@authenticated
def acceptWorkRequest(requestID):
    db.acceptWorkRequest(requestID)
    return util.build_response("OK")


@app.route('/api/request/<int:requestID>/deny', methods=["POST"])
@authenticated
def denyWorkRequest(requestID):
    db.denyWorkRequest(requestID)
    return util.build_response("OK")


@app.route('/api/user/<int:memberID>/changeParticipation', methods=["POST"])
@authenticated
def changeParticipation(memberID):
    input = request.json
    for membership in input:
        db.changeParticipation(
            memberID, membership["id"], membership["isParticipant"])
    return util.build_response("OK")


@app.route('/api/user/<int:memberID>/changeTrainer', methods=["POST"])
@authenticated
def changeTrainer(memberID):
    input = request.json
    for membership in input:
        db.changeTrainer(
            memberID, membership["id"], membership["isTrainer"])
    return util.build_response("OK")


@app.route('/api/member/<int:memberID>/change/firstname', methods=["POST"])
@authenticated
def changeFirstname(memberID):
    db.changeFirstname(memberID, request.json)
    return util.build_response("OK")


@app.route('/api/member/<int:memberID>/change/lastname', methods=["POST"])
@authenticated
def changeLastname(memberID):
    db.changeLastname(memberID, request.json)
    return util.build_response("OK")


@app.route('/api/member/<int:memberID>/change/email', methods=["POST"])
@authenticated
def changeEmail(memberID):
    db.changeMail(memberID, request.json)
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
    return util.build_response("OK")


@app.route('/api/member/add', methods=["POST"])
def addMember():
    firstName = request.json["firstname"]
    lastname = request.json["lastname"]
    email = request.json["email"]
    password = request.json["password"] if "password" in request.json else None

    pw = db.addMember(firstName, lastname, email, password)

    if pw:
        return util.build_response(pw)
    else:
        return util.build_response("OK")


@app.route('/api/login', methods=["POST"])
def login():
    post_data = request.json
    rights = db.checkPin(post_data["username"], post_data["password"])

    if rights:
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
    return util.build_response("OK")


app.run("0.0.0.0", threaded=True)
