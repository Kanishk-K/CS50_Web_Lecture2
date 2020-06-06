document.addEventListener('DOMContentLoaded', function(){
    const InputButton = document.querySelector('#InputButton');
    const AddChannel = document.querySelector('#AddChannel');
    const FindChannel = document.querySelector('#FindChannel');
    const UsernameForm = document.querySelector(".UsernameInput");
    const UsernameInput = document.querySelector('#DISP');
    const ChannelForm = document.querySelector(".NewChannel");
    const ChannelButton = document.querySelector('#ChannelButton');
    const ChannelInput = document.querySelector('#ChannelDISP');
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
        console.log("ChannelButton has been clicked")
        const request = new XMLHttpRequest();
        const NewChannel = ChannelInput.value;
        request.open('POST', '/PostChannel');

        request.onload = () => {
            const response = JSON.parse(request.responseText);
            
            if (response.success) {
                console.log(response.message);
            }
            else {
                console.log(response.message)
            }
        }
        const ChannelInfo = new FormData();
        ChannelInfo.append("ChannelName",NewChannel)
        request.send(ChannelInfo);
        return false
    }
})

