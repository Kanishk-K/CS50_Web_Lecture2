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
    #Submit main page.
    return render_template("Landing.html")
@app.route("/PostChannel", methods=["POST"])
def convert():
    #From the request get the Channel's Intended Name.
    NewChannel = request.form.get("ChannelName")
    #If the name of the channel is already present within the list then return a fail message, otherwise add it to the lists.
    if NewChannel in AllChannelsName:
        return jsonify(success = False, message = "The channel already exists")
    else:
        #Add the channel's name to the list of already existing one.
        AllChannelsName.append(NewChannel)
        #Associate the Channel's name with its location id.
        AllChannelsId[str(NewChannel)] = len(AllChannelsId)
        #Add an array that represents the new channel which will contain its messages.
        AllChannels.append([])
        return jsonify(success = True, message = f"The channel {NewChannel} was created")
@app.route("/AllChannels", methods=["POST"])
def send():
    #When asked about all present channels provide a list of them.
    return jsonify(AllChannelsName)
@app.route("/GetHistory",methods=["POST"])
def history():
    #Get channel name from the request.
    channel = request.form.get("channel")
    if channel in AllChannelsId.keys():
        #If the channel exists send all messages that were previously sent.
        i = AllChannelsId[channel]
        return jsonify(success = True, messages = AllChannels[i])
    else:
        #If the channel is not found, inform the client that the channel isn't avaliable.
        return jsonify(success = False, messages = "The channel was removed or unreachable.")
@socketio.on("ChatSent")
def ChatSent(ChatMessage):
    #Get information from the sent message.
    TTS = False
    channel = ChatMessage["channel"]
    username = ChatMessage["username"]
    message = ChatMessage["message"]
    #Check if the /tts command is present within the first 5 letters.
    if "/tts" in message[:5]:
        #If it is then delete the mention of the first /tts and enable the TTS flag.
        TTS = True
        message = message.replace("/tts","",1)
    #Append the date that the message was sent to the reformatted message.
    TimeSent = date.today().strftime("%a %b %d %Y %I:%M %p")
    TotalMessage = f"({TimeSent}) ({username}): {message}"
    i = AllChannelsId[channel]
    #If the length of messages stored on this server is already 100, delete the oldest message from storage and append the newest one.
    if len(AllChannels[i]) == 100:
        AllChannels[i].pop(0)
        AllChannels[i].append(TotalMessage)
    else:
        AllChannels[i].append(TotalMessage)
    #Send data back to the client, the new message, the channel it was sent to, the TTS flag, the original message (for TTS) and the user who sent it (for TTS).
    emit("ChatDistribute", {"RefMessage": TotalMessage, "channel" : channel, "TTS" : TTS, "OGmessage" : message, "username" : username}, broadcast=True)
