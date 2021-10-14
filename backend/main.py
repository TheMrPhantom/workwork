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
        if not token_manager.check_token(request.cookies.get('memberID'),request.cookies.get('token')):
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
            {"sport": resp[0], "activity": resp[1], "duration": resp[2]/60})
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
            {"sport": resp[0], "activity": resp[1], "duration": resp[2]/60})
    return util.build_response(output)


@app.route('/api/sports/names', methods=["GET"])
@authenticated
def listSports():
    return util.build_response(db.getSports())


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
                       "lastname": m[2], "email": m[3], "currentWork": currentWork, "maxWork": maxWork, "isTrainer": isTrainer})
    return util.build_response(output)


@app.route('/api/work/request/<int:sportID>', methods=["GET"])
@authenticated
def getRequestsFromSport(sportID):
    req = db.getPendingWorkRequestsBySport(sportID)
    output = []
    for r in req:
        output.append({"firstname": r[0], "lastname": r[1],
                       "sportname": r[2], "description": r[3], "duration": r[4]})
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
        output.append({"firstname": r[1], "lastname": r[2], "isTrainerOfSport": r[3],
                       "currentWork": currentWork, "maxWork": maxWork, "isTrainer": isTrainer})
    return util.build_response(output)


@app.route('/api/login', methods=["POST"])
def login():
    post_data = request.json
    rights = db.checkPin(post_data["username"], post_data["password"])

    if rights:
        token = token_manager.create_token(rights["memberID"])
        return util.build_response("OK", cookieToken=token, cookieMemberID=rights["memberID"])
    return util.build_response("Unauthorized", code=403)


app.run("0.0.0.0", threaded=True)
