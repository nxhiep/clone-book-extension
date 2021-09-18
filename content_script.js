const KEY = 'clone_data_hello_world';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getTopicName() {
    let name = document.querySelector('.tp-display-section-name');
    return name && name.innerText || '';
}

function getQuestionId() {
    let prefix = '/question/';
    let hash = window.location.hash;
    let offset = hash.indexOf(prefix) + prefix.length;
    let limit = hash.indexOf('?zoom');
    return hash.substring(offset, limit);
}

var stop = true;

if (window.location.href.indexOf('practicetest') > -1) {
    let buttonStart = document.createElement('button');
    buttonStart.innerHTML = 'Start';
    buttonStart.onclick = () => {
        stop = false;
        selectQuestion();
    }
    buttonStart.setAttribute('style', `
        position: fixed;
        top: 10px;
        left: 10px;
        padding: 10px 30px;
        border-radius: 10px;
        background: green;
        color: white;
        z-index: 1111
    `);
    let buttonStop = document.createElement('button');
    buttonStop.innerHTML = 'Stop';
    buttonStop.onclick = () => {
        stop = true;
    }
    buttonStop.setAttribute('style', `
        position: fixed;
        top: 10px;
        left: 120px;
        padding: 10px 30px;
        border-radius: 10px;
        background: red;
        color: white;
        z-index: 1111
    `);
    document.body.appendChild(buttonStart);
    document.body.appendChild(buttonStop);
}

async function selectQuestion() {
    let formElement = document.querySelector('.question-container');
    if (!formElement) {
        window.alert('OK');
        return;
    }
    await sleep(500);
    let choices = formElement.querySelectorAll('.tp-question-multiplechoice .choice-container');
    console.log(choices.length);
    let check = Object.values(choices).find((a) => a.classList.contains('correct-answer'));
    if (!check && choices.length > 0) {
        let input = choices.item(0).querySelector('input');
        input && input.click();
        let buttonNext = document.querySelector('.tp-right-aligned-buttons #submitBtn');
        buttonNext && buttonNext.click();
    }
    let question = await getQuestion(formElement);
    console.log("question", question)
    let buttonTryQuestion = document.querySelector('.tp-right-aligned-buttons .tp-nav-retry');
    if(buttonTryQuestion) {
        buttonTryQuestion.click();
        await sleep(300);
        let index = 1;
        while(index < choices.length) {
            await sleep(300);
            let input = choices.item(index)?.querySelector('input');
            input && input.click();
            await sleep(300);
            let buttonNext = document.querySelector('.tp-right-aligned-buttons #submitBtn');
            buttonNext && buttonNext.click();
            await sleep(300);
            buttonTryQuestion = document.querySelector('.tp-right-aligned-buttons .tp-nav-retry');
            console.log("xxxxxxx", index, !!buttonTryQuestion)
            if(buttonTryQuestion) {
                index++;
                buttonTryQuestion.click();
            } else {
                break;
            }
        }
    }
    let buttonNextQuestion = document.querySelector('.tp-right-aligned-buttons .tp-nav-next');
    console.log("buttonNextQuestion", buttonNextQuestion)
    fetch("http://localhost:4000/save-data", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(question)
    }).then(res => {
        console.log("Request complete! response:", res);
        if (res.status == 200) {
            setTimeout(() => {
                buttonNextQuestion && buttonNextQuestion.click();
            }, 300);
            setTimeout(() => {
                if(!stop) {
                    selectQuestion();
                }
            }, 600);
        } else {
            window.alert('xxxxxxxxxxxxxxxxxxxxxxx')
        }
    });
    return null;
}

async function getQuestion(formElement) {
    await sleep(400);
    let text = formElement.querySelector('.instruction').innerHTML;
    let imageElement = formElement.querySelector('img');
    console.log("imageElement", imageElement)
    let image = imageElement && imageElement.getAttribute('src') || '';
    let correctAnswer = '';
    let answers = Object.values(formElement.querySelectorAll('.choice-container')).map(e => {
        let text = e.querySelector('span[bind-compiled-html="opt.text"]');
        text = text && text.innerHTML || '';
        if(e.classList.contains('correct-answer')) {
            correctAnswer = text;
        }
        return text;
    });
    return {
        id: getQuestionId(),
        topicName: getTopicName(),
        text: text,
        answer: answers,
        correctAnswer: correctAnswer,
        image: image,
    }
}