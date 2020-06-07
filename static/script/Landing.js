document.addEventListener('DOMContentLoaded', function(){
    const InputButton = document.querySelector('#InputButton');
    const AddChannel = document.querySelector('#AddChannel');
    const FindChannel = document.querySelector('#FindChannel');
    const UsernameForm = document.querySelector(".UsernameInput");
    const UsernameInput = document.querySelector('#DISP');
    const ChannelHolder = document.querySelector(".ChannelInput");
    const ChannelForm = document.querySelector(".NewChannel");
    const ChannelButton = document.querySelector('#ChannelButton');
    const ChannelInput = document.querySelector('#ChannelDISP');
    const ChannelAlert = document.querySelector('.ChannelAlert')
    const FindHolder = document.querySelector(".FindChannel");
    const FindForm = document.querySelector(".FindInput");
    const Dropdown = document.querySelector("#Dropdown");
    const ChannelList = document.querySelector("#ChannelList");
    const ChatHolder = document.querySelector(".ChatBox");
    const ChatForm = document.querySelector(".ChatForm");
    const ChatInput = document.querySelector("#ChatDISP");
    const ChatButton = document.querySelector("#ChatButton");
    const ChatBox = document.querySelector("ul");
    const ConnectedTo = document.querySelector("#connected");
    const LeaveButton = document.querySelector("#LeaveButton");
    let GlobalChannel = null;
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
    var available_voices = window.speechSynthesis.getVoices();
	var english_voice = '';
	for(var i=0; i<available_voices.length; i++) {
		if(available_voices[i].lang === 'en-US') {
			english_voice = available_voices[i];
			break;
		}
	}
	if(english_voice === '')
		english_voice = available_voices[0];
    if (localStorage.getItem("username") === null && localStorage.getItem("LastChannel") === null){
        InputButton.disabled = true;
        AddChannel.disabled = true;
        FindChannel.disabled = true;
        ChannelButton.disabled = true;
        ChatButton.disabled = true;
        UsernameForm.onsubmit = () => {
            return false
        }
        ChannelForm.onsubmit = () => {
            return false
        }
        UsernameInput.onkeyup = () => {
            if (UsernameInput.value.length > 0) {
                InputButton.disabled = false;
            }
            else {
                InputButton.disabled = true;
            }
        }
        InputButton.onclick = () => {
            const username = UsernameInput.value;
            document.querySelector('#intro').innerHTML = `${username}`;
            localStorage.setItem('username', username);
            AddChannel.disabled = false;
            FindChannel.disabled = false;
            UsernameForm.style.opacity = 0;
            UsernameForm.style.height = 0;
            return false
        }
    }
    else if (localStorage.getItem("username") !== null && localStorage.getItem("LastChannel") === null) {
        const username = localStorage.getItem("username");
        document.querySelector('#intro').innerHTML = `${username}`;
        UsernameForm.style.opacity = 0;
        UsernameForm.style.height = 0;
    }
    else {
        const username = localStorage.getItem("username");
        document.querySelector('#intro').innerHTML = `${username}`;
        UsernameForm.style.opacity = 0;
        UsernameForm.style.height = 0;
        GlobalChannel = localStorage.getItem("LastChannel");
        const request = new XMLHttpRequest();
        request.open('POST', '/GetHistory');
        request.onload = () => {
            const response = JSON.parse(request.responseText);
            if (response.success) {
                console.log(response.messages);
                response.messages.forEach((item, index) => {
                    var li = document.createElement("li");
                    li.innerHTML = `${item}`
                    document.querySelector("ul").appendChild(li);
                })
                ConnectedTo.innerHTML = `Connected To: ${GlobalChannel}`;
                ChatHolder.style.opacity = 1;
                ChatHolder.style.height = "100%";
                AddChannel.disabled = true;
                FindChannel.disabled = true;
            }
            else {
                localStorage.setItem("LastChannel",null);
                ChatHolder.style.opacity = 0;
                ChatHolder.style.height = 0;
                AddChannel.disabled = false;
                FindChannel.disabled = false;

            }
        }
        const AllChannels = new FormData();
        AllChannels.append('channel',GlobalChannel)
        request.send(AllChannels);
        ChatHolder.style.opacity = 1;
        ChatHolder.style.height = "100%";
        AddChannel.disabled = true;
        FindChannel.disabled = true;
    }
    AddChannel.onclick = () => {
        ChannelForm.style.opacity = 1;
        ChannelForm.style.height = "100%";
        FindHolder.style.opacity = 0;
        FindHolder.style.height = 0;
        ChatHolder.style.opacity = 0;
        ChatHolder.style.height = 0;
    }
    ChannelInput.onkeyup = () => {
        if (ChannelInput.value.length > 0) {
            ChannelButton.disabled = false;
        }
        else {
            ChannelButton.disabled = true;
        }
    }
    ChannelButton.onclick = () => {
        const request = new XMLHttpRequest();
        const NewChannel = ChannelInput.value;
        ChannelInput.value = "";
        request.open('POST', '/PostChannel');

        request.onload = () => {
            const response = JSON.parse(request.responseText);
            
            if (response.success) {
                ChannelAlert.className = "alert alert-success ChannelAlert";
                ChannelAlert.innerHTML = response.message;

            }
            else {
                ChannelAlert.className = "alert alert-danger ChannelAlert";
                ChannelAlert.innerHTML = response.message;
            }
        }
        const ChannelInfo = new FormData();
        ChannelInfo.append("ChannelName",NewChannel)
        request.send(ChannelInfo);
        return false
    }
    FindChannel.onclick = () => {
        ChannelForm.style.opacity = 0;
        ChannelForm.style.height = 0;
        ChatHolder.style.opacity = 0;
        ChatHolder.style.height = 0;
        FindHolder.style.opacity = 1;
        FindHolder.style.height = "100%";
        ChannelList.innerHTML = "";
        document.querySelectorAll('#Dropdown option').forEach(option => option.remove())
        for (i = Dropdown.options.length-1; i>= 0; i--) {
            Dropdown.remove(i);
        }
        const request = new XMLHttpRequest();
        request.open('POST', '/AllChannels');

        request.onload = () => {
            const response = JSON.parse(request.responseText);
            console.log(response);
            response.forEach((item, index) => {
                var node = document.createElement("OPTION");
                node.value = item;
                var textnode = document.createTextNode(item);
                node.appendChild(textnode);
                Dropdown.appendChild(node);
            })
        }
        const AllChannels = new FormData();
        request.send(AllChannels);
    }
    function onInput(e) {
        var input = e.target,
            val = input.value;
            list = input.getAttribute('list'),
            options = document.getElementById(list).childNodes;
     
       for(var i = 0; i < options.length; i++) {
         if(options[i].innerText === val) {
           // An item was selected from the list!
           // yourCallbackHere()
           AddChannel.disabled = true;
           FindChannel.disabled = true;
           FindHolder.style.opacity = 0;
           FindHolder.style.height = 0;
           ChatHolder.style.opacity = 1;
           ChatHolder.style.height = "100%";
           GlobalChannel = val;
           localStorage.setItem('LastChannel',val);
           ConnectedTo.innerHTML = `Connected To: ${val}`;
           const request = new XMLHttpRequest();
           request.open('POST', '/GetHistory');
           request.onload = () => {
               const response = JSON.parse(request.responseText);
               console.log(response);
               response.messages.forEach((item, index) => {
                   var li = document.createElement("li");
                   li.innerHTML = `${item}`
                   document.querySelector("ul").appendChild(li);
               })
           }
           const AllChannels = new FormData();
           AllChannels.append('channel',GlobalChannel)
           request.send(AllChannels);
           break;
         }
       }
     }
    ChannelList.addEventListener('input', onInput);
    ChatInput.onkeyup = () => {
        if (ChatInput.value.length > 0) {
            ChatButton.disabled = false;
        }
        else {
            ChatButton.disabled = true;
        }
    }
    socket.on('connect', () => {
        ChatButton.onclick = () => {
            const ChatMessage = ChatInput.value;
            ChatInput.value = "";
            socket.emit('ChatSent', {'channel':GlobalChannel,'username':document.querySelector('#intro').innerHTML,'message':ChatMessage});
        }
    })
    socket.on('ChatDistribute', message => {
        if (message.channel === ConnectedTo.innerHTML.substring(14,ConnectedTo.innerHTML.length)){
            var li = document.createElement("li");
            console.log(message.RefMessage);
            li.innerHTML = `${message.RefMessage}`;
            ChatBox.appendChild(li);
            if (message.TTS === true){
                var utter = new SpeechSynthesisUtterance();
                utter.rate = 1;
                utter.pitch = 0.5;
                utter.text = `${message.username} says ${message.OGmessage}`;
                utter.voice = english_voice;
                window.speechSynthesis.speak(utter);
            }
        }
    })
    LeaveButton.onclick = () => {
        localStorage.setItem("LastChannel",null);
        GlobalChannel = null;
        ConnectedTo.innerHTML = "";
        document.querySelectorAll('ul li').forEach(li => li.remove());
        AddChannel.disabled = false;
        FindChannel.disabled = false;
        ChatHolder.style.opacity = 0;
        ChatHolder.style.height = 0;
    }
})

