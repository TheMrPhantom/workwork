from flask import Flask, redirect
from flask import request
from flask_cors import CORS
import authenticator
import util
import database

app = Flask(__name__)
CORS(app, supports_credentials=True)

token_manager = authenticator.TokenManager()
db = database.SQLiteWrapper()


@app.route('/api/user/<int:userID>', methods=["GET"])
def memberInfo(userID):
    return util.build_response(db.getMemberInfo(userID))


@app.route('/api/user/<int:userID>/currentHours', methods=["GET"])
def currentHours(userID):
    return util.build_response(db.getCurrentWorkMinutes(userID)/60)


@app.route('/api/user/<int:userID>/neededHours', methods=["GET"])
def neededHours(userID):
    return util.build_response(db.getNeededWorkMinutes(userID)/60)


@app.route('/api/user/<int:userID>/requests/accepted', methods=["GET"])
def getAcceptedWork(userID):
    dbResponse = db.getAcceptedWorkRequests(userID)
    output = []
    for resp in dbResponse:
        output.append(
            {"sport": resp[0], "activity": resp[1], "duration": resp[2]/60})
    return util.build_response(output)


@app.route('/api/user/<int:userID>/participantIn', methods=["GET"])
def participantIn(userID):
    return util.build_response(db.participantIn(userID))

@app.route('/api/user/<int:userID>/trainerIn', methods=["GET"])
def trainerIn(userID):
    return util.build_response(db.trainerIn(userID))


@app.route('/api/user/<int:userID>/requests/pending', methods=["GET"])
def getPendingWork(userID):
    dbResponse = db.getPendingWorkRequests(userID)
    output = []
    for resp in dbResponse:
        output.append(
            {"sport": resp[0], "activity": resp[1], "duration": resp[2]/60})
    return util.build_response(output)


@app.route('/api/sports/names', methods=["GET"])
def listSports():
    return util.build_response(db.getSports())


@app.route('/api/members', methods=["GET"])
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
def getRequestsFromSport(sportID):
    req = db.getPendingWorkRequestsBySport(sportID)
    output = []
    for r in req:
        output.append({"firstname": r[0], "lastname": r[1],
                       "sportname": r[2], "description": r[3], "duration": r[4]})
    return util.build_response(output)


@app.route('/api/sports/<int:sportID>/members', methods=["GET"])
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


app.run("0.0.0.0", threaded=True)
