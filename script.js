// Needed HTML objects etc.
const random_quote_api_url = "https://goquotes-api.herokuapp.com/api/v1/random?count=1";
const quote_display = document.getElementById("quote-display");
const quote_input = document.getElementById("quote-input");
const timer_div = document.getElementById("timer");

// Other needed variables
let timer_interval;
let start_time;
let key_strokes = 0;
let started = false
let incorrect_strokes = 0;

quote_input.addEventListener("input", () =>
{
    key_strokes++;
    const display_arr = quote_display.getElementsByTagName("span");
    const input_arr = quote_input.value.split("");
    const audio1=new Audio('typing\\space.wav');
    const audio2=new Audio('typing\\2real.wav');
    let correct = true;
    
    if(toplay)
    {
       
        if(input_arr.length<=display_arr.length && input_arr.length != 0)
        {
            
            if(input_arr[input_arr.length-1]==display_arr[input_arr.length-1].innerText)
            {
                audio1.play();
            }
            else
            {
                audio2.play();
            }
        }
    }

    if (input_arr.length == 0)
    {
        resetQuizData();
        stopTimer();
        resetTimer();
        stopTimer();
    }
    else if (input_arr.length == 1)
    {
        if (started == false)
        {
            start_time = new Date();
            started = true;
        }
        startTimer();
    }

    else if (input_arr.length <= display_arr.length)
    {
        if(input_arr[input_arr.length - 1] != display_arr[input_arr.length - 1].innerHTML)
        {
            incorrect_strokes++;
        }
    }

    for (let index=0; index < display_arr.length; index++)
    {
        if (index >= input_arr.length)
        {
            display_arr[index].classList.remove("correct");
            display_arr[index].classList.remove("incorrect");
            correct = false;
            continue;
            
        }
        if (input_arr[index] == display_arr[index].innerText)
        {
            display_arr[index].classList.add("correct");
            display_arr[index].classList.remove("incorrect");
        }
        else
        {
            correct = false;
            display_arr[index].classList.add("incorrect");
            display_arr[index].classList.remove("correct");
        }
    }

    if (correct)
    {
        stopTimer()
        timer_div.innerText = getTimerTime()
        openPopup()
    }
})

function getRandomQuote()
{
    return fetch(random_quote_api_url).then(response => response.json()).then(data => data.quotes[0].text);
}

async function showNewQuote()
{
    const quote = await getRandomQuote();
    const quote_arr = quote.split("");
    quote_display.innerHTML = "";
    for(let i=0; i < quote_arr.length; i++)
    {
        const character_span = document.createElement("span");
        character_span.innerText = quote_arr[i];
        quote_display.appendChild(character_span);
    }
    quote_input.value = null;
}

function stopTimer()
{
    clearInterval(timer_interval);
}

function getTimerTime()
{
    return Math.floor((new Date() - start_time) / 1000);
}

function startTimer()
{
    timer_interval = setInterval(() =>
    {
        timer_div.innerText = getTimerTime()
    }, 1000)
}

function resetTimer()
{
    timer_div.innerText = 0;
    start_time = new Date();
}



function resetQuizData()
{
    resetTimer()
    key_strokes = 0;
    incorrect_strokes = 0;
    started = false;
}

// Popup logic
const popup_container = document.getElementById("popup-container")
const popup_close = document.getElementById("popup-close")
const popup_title = document.getElementById("popup-title")
const popup_body = document.getElementById("popup-body")
const overlay = document.getElementById("overlay")

function openPopup()
{
    popup_container.classList.add("active")
    overlay.classList.add("active")
    popup_title.innerText = "Congratulations!"
    popup_body.innerHTML = "Your statistics: </br>"
    const time_taken = ((new Date() - start_time) / 1000)
    popup_body.innerText += "Finished in: " + Number(time_taken.toFixed(2)) + " seconds."
    popup_body.innerHTML += "</br>"

    popup_body.innerText += "Total keystrokes: " + key_strokes
    popup_body.innerHTML += "</br>"

    popup_body.innerText += "Mistakes: " + incorrect_strokes
    popup_body.innerHTML += "</br>"

    popup_body.innerText += "Accuracy: " + Number((100 - ((incorrect_strokes/key_strokes) * 100)).toFixed(2)) + "%"
    popup_body.innerHTML += "</br>"
    
    const display_arr = quote_display.getElementsByTagName("span")

    let words = 1

    for (let index=0; index < display_arr.length; index++)
    {
        if (display_arr[index].innerText == " ")
        {
            words++;
        }
    }
    popup_body.innerText += "Words per minute: " + Number((words / time_taken * 60).toFixed(2))
}

function closePopup()
{
    popup_container.classList.remove("active")
    overlay.classList.remove("active")
    showNewQuote()
}

popup_close.addEventListener("click", () =>
{
    closePopup()
    resetQuizData();
    stopTimer();
});

showNewQuote();

let log=console.log;
function op(elem){
    return document.querySelector(elem)
}
function opp(elem){
    return document.querySelectorAll(elem)
}

let toplay=true;
function chIcon()
{
    toplay=!toplay;
    op('#start').classList.toggle("active");
    op('#stop').classList.toggle("active");
}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////



let TxtType = function(el, toRotate, period) 
{
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function()
 {
    let i = this.loopNum % this.toRotate.length;
    let fullTxt = this.toRotate[i];

    if (this.isDeleting) 
    {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    let that = this;
    let delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    let elements = document.getElementsByClassName('typewrite');
    for (let i=0; i<elements.length; i++) {
        let toRotate = elements[i].getAttribute('data-type');
        let period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    let css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #BFBFBF }";
    document.body.appendChild(css);
};

