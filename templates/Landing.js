document.addEventListener('DOMContentLoaded', function(){
    if (localStorage.getItem("username") === null){
        document.querySelector('button').disabled = true;
        document.querySelector('form').onsubmit = () => {
            return false
        }
        document.querySelector('#DISP').onkeyup = () => {
            if (document.querySelector('#DISP').value.length > 0) {
                document.querySelector('button').disabled = false;
            }
            else {
                document.querySelector('button').disabled = true;
            }
        }
        document.querySelector('button').onclick = () => {
            const username = document.querySelector('#DISP').value;
            document.querySelector('#intro').innerHTML = `Username: ${username}`;
            localStorage.setItem('username', username);
            document.querySelector(".UsernameInput").style.opacity = 0;
            document.querySelector(".UsernameInput").style.height = 0;
            document.querySelector('body').className = "";
            document.querySelector('.centered-content').className = ""
            document.querySelector('.appear').style.opacity = 1;
            return false
        }
    }
    else {
        const username = localStorage.getItem("username");
        document.querySelector('#intro').innerHTML = `Username: ${username}`;
        document.querySelector(".UsernameInput").style.opacity = 0;
        document.querySelector(".UsernameInput").style.height = 0;
        document.querySelector('body').className = "";
        document.querySelector('.centered-content').className = ""
        document.querySelector('.appear').style.opacity = 1;
    }
})

