import os

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit
import requests
from datetime import date

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)
AllChannelsName = []
AllChannels = []
AllChannelsId = {}


@app.route("/")
def index():
    return render_template("Landing.html")
@app.route("/PostChannel", methods=["POST"])
def convert():
    NewChannel = request.form.get("ChannelName")
    if NewChannel in AllChannelsName:
        print("There was a conflict")
        return jsonify(success = False, message = "The channel already exists")
    else:
        print("There was not a conflict")
        AllChannelsName.append(NewChannel)
        AllChannelsId[str(NewChannel)] = len(AllChannelsId)
        AllChannels.append([])
        return jsonify(success = True, message = f"The channel {NewChannel} was created")
@app.route("/AllChannels", methods=["POST"])
def send():
    return jsonify(AllChannelsName)
@app.route("/GetHistory",methods=["POST"])
def history():
    channel = request.form.get("channel")
    print(channel)
    i = AllChannelsId[channel]
    return jsonify(AllChannels[i])
@socketio.on("ChatSent")
def vote(ChatMessage):
    channel = ChatMessage["channel"]
    username = ChatMessage["username"]
    message = ChatMessage["message"]
    TimeSent = date.today().strftime("%a %b %d %Y %I:%M %p")
    TotalMessage = f"({TimeSent}) ({username}): {message}"
    i = AllChannelsId[channel]
    if len(AllChannels[i]) == 100:
        AllChannels[i].pop(0)
        AllChannels[i].append(TotalMessage)
    else:
        AllChannels[i].append(TotalMessage)
    emit("ChatDistribute", {"RefMessage": TotalMessage}, broadcast=True)
