# Project 2

Web Programming with Python and JavaScript

# Application.py
==================
While the code has comments I will give a brief description of each function.
- The index function feeds users the basic Landing.html page.
- The convert function checks if the requested channel exists or not. If it doesn't then it will create a new channel
- The send function sends users a list of all present channels
- The history function sends users a list of all previous messages for the specific channel they have chosen.
- The ChatSent function will activate when the server recieves a message and it will emit that message to all users of that channel.

# Landing.js
=============
This is the client's javascript file that allows for AJAX and socket.io connections to the server.
- First the client activates any TTS functionality present in the browser.
- Secondly the client checks if the user has a previous connection to the server, if so then fetch messages for that.
- Next the server uses socket.io to check for any messages from the server and adds to the respective channel.

# Personal Touch
================
- My personal touch was the addition of Text To Speech, whenever a user types /tts before a message it will on all 
users connected to that channel emit a Speech synthesised audio.
