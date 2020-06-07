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
    let GlobalChannel = null;
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    if (localStorage.getItem("username") === null){
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
    else {
        const username = localStorage.getItem("username");
        document.querySelector('#intro').innerHTML = `${username}`;
        UsernameForm.style.opacity = 0;
        UsernameForm.style.height = 0;
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
           ConnectedTo.innerHTML = `Connected To: ${val}`;
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

            socket.emit('ChatSent', {'channel':GlobalChannel,'username':document.querySelector('#intro').innerHTML,'message':ChatMessage});
        }
    })
    socket.on('ChatDistribute', message => {
        var li = document.createElement("li");
        console.log(message.RefMessage);
        li.innerHTML = `${message.RefMessage}`;
        ChatBox.appendChild(li);
    })
})

