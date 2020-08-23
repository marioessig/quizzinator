// set global variables
var leaderboardBtnEl = document.querySelector("#leaderboard");
var startBtnEl = document.querySelector("#quiz-me-btn");
var answer1BtnEl = document.querySelector("#answer1-btn");
var answer2BtnEl = document.querySelector("#answer2-btn");
var answer3BtnEl = document.querySelector("#answer3-btn");
var answer4BtnEl = document.querySelector("#answer4-btn");
var submitBtnEl = document.querySelector("#submit-btn");
var skipBtnEl = document.querySelector("#skip-btn");
var backBtnEl = document.querySelector("#back-btn");
var clrBtnEl = document.querySelector("#clr-btn");
var intDivEl = document.querySelector(".intDiv");
var intEl = document.querySelector(".initial");
var timerEl = document.querySelector(".timer");
var timerTimeEl = document.querySelector("#timer");
var resultsEl = document.querySelector("#results");
var userLabelEl = document.querySelector("#userInt-label");
var userIntEl = document.querySelector("#userInt");
var mainEl = document.querySelector("main");
var LeaderboardEl = document.querySelector("#leaderboard-list");
var scores = [];
var counter;
var end;
var timer;

// set questions variables
var questionNumber = 0;
var questionSet = [];
var question1 = {
    question: "Which of the following is the correct syntax to display “GeeksforGeeks” in an alert box using JavaScript?",
    answer1: "alertbox(”GeeksforGeeks”);",
    answer2: "msg(“GeeksforGeeks”);",
    answer3: "msgbox(“GeeksforGeeks”);",
    answer4: "alert(“GeeksforGeeks”);",
    correctAnswer: "4"
}
var question2 = {
    question: "Which of the following method of Boolean object returns a string depending upon the value of the object?",
    answer1: "toString()",
    answer2: "valueOf()",
    answer3: "toSource()",
    answer4: "None of above",
    correctAnswer: "1"
}
var question3 = {
    question: "Which built-in method calls a function for each element in the array?",
    answer1: "while()",
    answer2: "loop()",
    answer3: "forEach()",
    answer4: "None of the above",
    correctAnswer: "3"
}
var question4 = {
    question: "Which built-in method returns the calling string value converted to upper case?",
    answer1: "toUpperCase()",
    answer2: "toUpper()",
    answer3: "changeCase(case)",
    answer4: "None of the above",
    correctAnswer: "1"
}
var question5 = {
    question: "Which of the following function of String object combines the text of two strings and returns a new string?",
    answer1: "add()",
    answer2: "merge()",
    answer3: "concat()",
    answer4: "append()",
    correctAnswer: "3"
}

questionSet.push(question1);
questionSet.push(question2);
questionSet.push(question3);
questionSet.push(question4);
questionSet.push(question5);

// initialize Leaderboard
initializeLeaderboard();

function initializeLeaderboard() {
    // get local storage scores
    var localScores = localStorage.getItem("scores");

    // exit upon null scores
    if (!localScores) {
        scores = [];
        return false;
    }

    // Parse leaderboard list
    scores = JSON.parse(localScores);

    // create leaderboard
    for (var i = 0; i < scores.length; i++) {
        var listEl = document.createElement("li");
        listEl.className = "leaderboard-item";
        listEl.textContent = (i + 1) + "- " + scores[i].name + " [" + scores[i].score + "]";
        LeaderboardEl.appendChild(listEl);
    }
}

// set timer
function updateTimer() {
    // move to submit screen at end of timer
    if (Date.now() > end) {
        clearInterval(counter);
        submitLeaderboardScreen(0);
    }
    // update timer if time remains
    else {
        timer = Math.floor((end - Date.now()) / 1000);
        timerTimeEl.textContent = timer;
    }
}

// Reset to initial screen
function resetScreen() {
    // location: submit screen
    if (backBtnEl.classList.contains("hidden")) {
        // hide screen elements
        results.classList.add("hidden");
        userLabelEl.classList.add("hidden");
        userIntEl.classList.add("hidden");
        submitBtnEl.classList.add("hidden");
        skipBtnEl.classList.add("hidden");
    }
    // location: leaderboard screen
    else {
        // hide screen elements
        LeaderboardEl.classList.add("hidden");
        backBtnEl.classList.add("hidden");
        clrBtnEl.classList.add("hidden");

        // display elements
        intEl.classList.remove("hidden");
    }

    // display elements
    leaderboardBtnEl.classList.remove("hidden");
    startBtnEl.classList.remove("hidden");

    // update textContent
    timerTimeEl.textContent = "60";
    intDivEl.textContent = "Test yourself!";
    intEl.innerHTML = "<p class='initial'> Challenge yourself on what you know about full-stack programming languages. <br> <br> Keep in mind, once you click on 'Quiz Me!' button, the timer will start right away.  <br> You lose <span class='ital-red'>3 seconds</span> for each wrong answer! <br> <br> <span>Best Luck!</span></p>";

    // revert styles after reset
    intDivEl.setAttribute("style", "text-align: center");
    intEl.setAttribute("style", "text-align: center");
    mainEl.setAttribute("style", "text-align: center");
}

// retain remaining time and move to submit screen
function submitLeaderboardScreen(timeLeft) {
    // hide elements
    answer1BtnEl.classList.add("hidden");
    answer2BtnEl.classList.add("hidden");
    answer3BtnEl.classList.add("hidden");
    answer4BtnEl.classList.add("hidden");
    timerEl.classList.add("hidden");

    // display elements
    intEl.classList.remove("hidden");
    userLabelEl.classList.remove("hidden");
    userIntEl.classList.remove("hidden");
    submitBtnEl.classList.remove("hidden");
    skipBtnEl.classList.remove("hidden");

    // update textContent and hide an element
    intDivEl.textContent = "You did it!";
    intEl.textContent = "Your final score is " + timeLeft + ".";
    results.classList.add("hidden");

    // update styles
    intEl.setAttribute("style", "text-align: left")
    mainEl.setAttribute("style", "text-align: left");
}

// move to Leaderboard
function viewLeaderboard() {
    // location: initial, hide elements
    if (submitBtnEl.classList.contains("hidden")) {
        startBtnEl.classList.add("hidden");
        leaderboardBtnEl.classList.add("hidden");
    }
    // location: submit screen, hide elements
    else {
        userLabelEl.classList.add("hidden");
        userIntEl.classList.add("hidden");
        submitBtnEl.classList.add("hidden");
        skipBtnEl.classList.add("hidden");
        results.classList.add("hidden");
    }
    intEl.classList.add("hidden");

    // display elements
    LeaderboardEl.classList.remove("hidden");
    backBtnEl.classList.remove("hidden");
    clrBtnEl.classList.remove("hidden");

    // update textContent
    intDivEl.textContent = "Leaderboard";

    // update styles
    mainEl.setAttribute("style", "text-align: left");
    intDivEl.setAttribute("style", "text-align: left");
}

// get answers from player
function sendAnswer(choice) {
    var correct = questionSet[questionNumber].correctAnswer;
    // display result of answer choices
    if (choice === correct) {
        results.textContent = "You got it!";
        results.setAttribute("style", "color: green");
    }
    else {
        results.textContent = "Aww... nope!";
        results.setAttribute("style", "color: red");
        end -= 3000;
        updateTimer();
    }

    // display results section
    if (results.classList.contains("hidden")) {
        results.classList.remove("hidden");
    }

    // add increments to each question
    questionNumber++;

     // move to submit screen if no more questions
    if (questionNumber >= questionSet.length) {
        clearInterval(counter);
        submitLeaderboardScreen(timer);
    }
    else {
        // If more questions, update textContent for next question
        intDivEl.textContent = questionSet[questionNumber].question;
        answer1BtnEl.textContent = questionSet[questionNumber].answer1;
        answer2BtnEl.textContent = questionSet[questionNumber].answer2;
        answer3BtnEl.textContent = questionSet[questionNumber].answer3;
        answer4BtnEl.textContent = questionSet[questionNumber].answer4;
    }
}

// initial screen event listeners
leaderboardBtnEl.addEventListener("click", viewLeaderboard);
startBtnEl.addEventListener("click", function () {
    // Initialize question number for new set
    questionNumber = 0;

    // hide elements
    intEl.classList.add("hidden");
    leaderboardBtnEl.classList.add("hidden");
    startBtnEl.classList.add("hidden");

    // display elements
    timerEl.classList.remove("hidden");
    answer1BtnEl.classList.remove("hidden");
    answer2BtnEl.classList.remove("hidden");
    answer3BtnEl.classList.remove("hidden");
    answer4BtnEl.classList.remove("hidden");

    // update textContent
    intDivEl.textContent = questionSet[questionNumber].question;
    answer1BtnEl.textContent = questionSet[questionNumber].answer1;
    answer2BtnEl.textContent = questionSet[questionNumber].answer2;
    answer3BtnEl.textContent = questionSet[questionNumber].answer3;
    answer4BtnEl.textContent = questionSet[questionNumber].answer4;

    // Start timer
    end = Date.now() + 60000;
    counter = setInterval(updateTimer, 100);
});

// answer event listeners
answer1BtnEl.addEventListener("click", function () {
    sendAnswer("1");
});
answer2BtnEl.addEventListener("click", function () {
    sendAnswer("2");
});
answer3BtnEl.addEventListener("click", function () {
    sendAnswer("3");
});
answer4BtnEl.addEventListener("click", function () {
    sendAnswer("4");
});

// submit screen event listeners
skipBtnEl.addEventListener("click", resetScreen);
submitBtnEl.addEventListener("click", function () {
    // create new score record
    var leaderboard =
    {
        name: userIntEl.value,
        score: timer
    }

    // add to the leaderboard list
    var scoreLength = scores.length;
    for (var i = 0; i < scoreLength; i++) {
        if (scores[i].score < leaderboard.score) {
            scores.splice(i, 0, leaderboard);
            break;
        }
    }
    if (scoreLength === scores.length) {
        scores.push(leaderboard);
    }
    localStorage.setItem("scores", JSON.stringify(scores));

    // re-create leaderboard list
    LeaderboardEl.innerHTML = "";
    for (var i = 0; i < scores.length; i++) {
        var listEl = document.createElement("li");
        listEl.className = "leaderboard-item";
        listEl.textContent = (i + 1) + ". " + scores[i].name + " - " + scores[i].score;
        LeaderboardEl.appendChild(listEl);
    }

    viewLeaderboard();
});

// leaderboard event listeners
backBtnEl.addEventListener("click", resetScreen);
clrBtnEl.addEventListener("click", function () {
    LeaderboardEl.innerHTML = "";
    scores = [];
    localStorage.setItem("scores", JSON.stringify(scores));
});