import os

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit
import requests

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)
AllChannels = []


@app.route("/")
def index():
    return render_template("Landing.html")
@app.route("/PostChannel", methods=["POST"])
def convert():
    NewChannel = request.form.get("ChannelName")
    if NewChannel in AllChannels:
        print("There was a conflict")
        return jsonify(success = False, message = "The channel already exists")
    else:
        print("There was not a conflict")
        AllChannels.append(NewChannel)
        return jsonify(success = True, message = f"The channel {NewChannel} was created")