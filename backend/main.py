from flask import Flask, redirect
from flask import request
from flask_cors import CORS
import authenticator

app = Flask(__name__)
CORS(app, supports_credentials=True)

token_manager = authenticator.TokenManager()