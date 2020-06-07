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
    if (localStorage.getItem("username") === null){
        InputButton.disabled = true;
        AddChannel.disabled = true;
        FindChannel.disabled = true;
        ChannelButton.disabled = true;
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
        FindHolder.style.opacity = 1;
        FindHolder.style.height = "100%";
        const request = new XMLHttpRequest();
        request.open('POST', '/AllChannels');

        request.onload = () => {
            const response = JSON.parse(request.responseText);
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
})

