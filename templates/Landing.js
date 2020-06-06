document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('button').disabled = true;
    document.querySelector('form').onsubmit = () => {
        return false
    }
    document.querySelector('#DISP').onkeyup = () => {
        if (document.querySelector('#DISP').value.length > 0)
            document.querySelector('button').disabled = false;
        else
            document.querySelector('button').disabled = true;
    
    document.querySelector('button').onclick = () => {
        const username = document.querySelector('#DISP').value;
        document.querySelector('#intro').innerHTML = `Welcome ${username}`;
        document.querySelector('#intro').style.opacity = 1;
        return false
    }
    };
})

