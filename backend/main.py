from flask import Flask, redirect
from flask import request
from flask_cors import CORS
import authenticator
import util

app = Flask(__name__)
CORS(app, supports_credentials=True)

token_manager = authenticator.TokenManager()

@app.route('/api/user/<int:userID>/currentHours', methods=["GET"])
def currentHours(userID):
    print(userID)
    return  util.build_response(5)

@app.route('/api/user/<int:userID>/neededHours',methods=["GET"])
def neededHours(userID):
    print(userID)
    return util.build_response(12)


app.run("0.0.0.0", threaded=True)