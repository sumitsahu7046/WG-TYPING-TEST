/* =========================================
   WG TYPING TEST
   MAIN ENGINE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const timerEl =
    document.getElementById("timer");

const wpmEl =
    document.getElementById("wpm");

const accuracyEl =
    document.getElementById("accuracy");

const errorsEl =
    document.getElementById("errors");

const textDisplay =
    document.getElementById("textDisplay");

const typingInput =
    document.getElementById("typingInput");

const typingBox =
    document.getElementById("typingBox");

const typingStatus =
    document.getElementById("typingStatus");

const clickMessage =
    document.getElementById("clickMessage");

const progressBar =
    document.getElementById("progressBar");

const progressPercent =
    document.getElementById("progressPercent");

const restartBtn =
    document.getElementById("restartBtn");

const againBtn =
    document.getElementById("againBtn");

const resultPanel =
    document.getElementById("resultPanel");

const finalWpm =
    document.getElementById("finalWpm");

const finalAccuracy =
    document.getElementById("finalAccuracy");

const finalErrors =
    document.getElementById("finalErrors");

const bestWpm =
    document.getElementById("bestWpm");

const timeButtons =
    document.querySelectorAll(".time-btn");


/* =========================================
   TEXT DATABASE
========================================= */

const texts = [

    "The best way to improve your typing speed is to practice every day. Focus on accuracy first and speed will naturally follow.",

    "Technology gives us powerful tools to learn, create and communicate. Keep practicing your skills and make small improvements every day.",

    "Success does not come from speed alone. Consistent practice, patience and accuracy are the keys to becoming a better typist.",

    "A great developer keeps learning new things and uses technology to solve problems in creative and meaningful ways.",

    "Typing is a skill that becomes faster with regular practice. Stay focused, keep your hands relaxed and enjoy the process.",

    "The future belongs to people who are willing to learn new skills and turn their ideas into something useful.",

    "Every expert was once a beginner. Practice every day, learn from your mistakes and keep moving forward.",

    "Fast typing is useful for students, developers, writers and anyone who spends time working with a computer.",

    "Good accuracy creates a strong foundation for speed. Type carefully, stay focused and let your speed improve naturally."

];


/* =========================================
   VARIABLES
========================================= */

let selectedTime = 60;

let timeLeft = 60;

let timer = null;

let started = false;

let finished = false;

let startTime = null;

let currentText = "";

let totalTyped = 0;

let correctChars = 0;

let errorCount = 0;


/* =========================================
   RANDOM TEXT
========================================= */

function randomText() {

    const index =
        Math.floor(
            Math.random() * texts.length
        );

    return texts[index];
}


/* =========================================
   LOAD TEST
========================================= */

function loadTest() {

    currentText = randomText();

    textDisplay.innerHTML = "";

    currentText
        .split("")
        .forEach((character, index) => {

            const span =
                document.createElement("span");

            span.textContent = character;

            if (index === 0) {
                span.classList.add("current");
            }

            textDisplay.appendChild(span);

        });

}


/* =========================================
   RESET
========================================= */

function resetTest() {

    clearInterval(timer);

    started = false;

    finished = false;

    startTime = null;

    totalTyped = 0;

    correctChars = 0;

    errorCount = 0;

    timeLeft = selectedTime;


    timerEl.textContent =
        timeLeft;

    wpmEl.textContent =
        "0";

    accuracyEl.textContent =
        "100%";

    errorsEl.textContent =
        "0";


    progressBar.style.width =
        "0%";

    progressPercent.textContent =
        "0%";


    typingStatus.textContent =
        "CLICK HERE & START TYPING";


    typingBox.classList.remove(
        "focused"
    );


    typingInput.value = "";

    resultPanel.classList.add(
        "hidden"
    );


    loadTest();

}


/* =========================================
   START TEST
========================================= */

function startTest() {

    if (started || finished) {
        return;
    }

    started = true;

    startTime = Date.now();

    typingBox.classList.add(
        "focused"
    );

    typingStatus.textContent =
        "TYPING IN PROGRESS";


    timer = setInterval(() => {

        timeLeft--;

        timerEl.textContent =
            timeLeft;


        updateStats();


        if (timeLeft <= 0) {

            finishTest();

        }

    }, 1000);

}


/* =========================================
   INPUT EVENT
========================================= */

typingInput.addEventListener(
    "input",
    handleTyping
);


function handleTyping() {

    if (finished) {
        return;
    }


    if (!started) {
        startTest();
    }


    const typed =
        typingInput.value;


    totalTyped =
        typed.length;


    errorCount = 0;

    correctChars = 0;


    const letters =
        textDisplay.querySelectorAll(
            "span"
        );


    letters.forEach(
        (letter, index) => {

            letter.classList.remove(
                "correct",
                "incorrect",
                "current"
            );


            const typedChar =
                typed[index];


            if (typedChar === undefined) {
                return;
            }


            if (
                typedChar ===
                currentText[index]
            ) {

                letter.classList.add(
                    "correct"
                );

                correctChars++;

            } else {

                letter.classList.add(
                    "incorrect"
                );

                errorCount++;

            }

        }
    );


    /* Current cursor */

    const currentIndex =
        typed.length;


    if (
        letters[currentIndex]
    ) {

        letters[currentIndex]
            .classList.add("current");

    }


    /* Progress */

    const progress =
        Math.min(
            (typed.length /
                currentText.length) *
            100,
            100
        );


    progressBar.style.width =
        progress + "%";


    progressPercent.textContent =
        Math.round(progress) + "%";


    updateStats();


    /* Complete text */

    if (
        typed.length >=
        currentText.length
    ) {

        finishTest();

    }

}


/* =========================================
   UPDATE STATS
========================================= */

function updateStats() {

    if (!started || !startTime) {
        return;
    }


    const elapsed =
        (Date.now() - startTime) / 1000;


    if (elapsed <= 0) {
        return;
    }


    const minutes =
        elapsed / 60;


    const wpm =
        Math.round(
            (correctChars / 5) /
            minutes
        );


    const accuracy =
        totalTyped === 0
            ? 100
            : Math.round(
                (correctChars /
                    totalTyped) *
                100
            );


    wpmEl.textContent =
        Math.max(0, wpm);


    accuracyEl.textContent =
        Math.max(
            0,
            accuracy
        ) + "%";


    errorsEl.textContent =
        errorCount;

}


/* =========================================
   FINISH TEST
========================================= */

function finishTest() {

    if (finished) {
        return;
    }


    finished = true;

    clearInterval(timer);


    typingInput.blur();


    updateStats();


    const wpm =
        parseInt(
            wpmEl.textContent
        ) || 0;


    const accuracy =
        accuracyEl.textContent;


    finalWpm.textContent =
        wpm;


    finalAccuracy.textContent =
        accuracy;


    finalErrors.textContent =
        errorCount;


    /* Best score */

    const oldBest =
        parseInt(
            localStorage.getItem(
                "wgTypingBestWPM"
            )
        ) || 0;


    const newBest =
        Math.max(
            oldBest,
            wpm
        );


    localStorage.setItem(
        "wgTypingBestWPM",
        newBest
    );


    bestWpm.textContent =
        newBest;


    typingStatus.textContent =
        "TEST FINISHED";


    typingBox.classList.remove(
        "focused"
    );


    /* Show result */

    resultPanel.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        resultPanel.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);

}


/* =========================================
   RESTART BUTTON
========================================= */

restartBtn.addEventListener(
    "click",
    () => {

        resetTest();

        typingInput.focus();

    }
);


/* =========================================
   TRY AGAIN
========================================= */

againBtn.addEventListener(
    "click",
    () => {

        resetTest();

        typingInput.focus();

    }
);


/* =========================================
   TIME BUTTONS
========================================= */

timeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                timeButtons.forEach(
                    btn => {
                        btn.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                selectedTime =
                    parseInt(
                        button.dataset.time
                    );


                resetTest();


                typingInput.focus();

            }
        );

    }
);


/* =========================================
   CLICK ANYWHERE IN TYPING BOX
========================================= */

typingBox.addEventListener(
    "click",
    () => {

        if (!finished) {

            typingInput.focus();

        }

    }
);


/* =========================================
   FOCUS EFFECT
========================================= */

typingInput.addEventListener(
    "focus",
    () => {

        if (!finished) {

            typingBox.classList.add(
                "focused"
            );

            typingStatus.textContent =
                started
                    ? "TYPING IN PROGRESS"
                    : "READY TO START";

        }

    }
);


/* =========================================
   BLUR EFFECT
========================================= */

typingInput.addEventListener(
    "blur",
    () => {

        if (!started && !finished) {

            typingBox.classList.remove(
                "focused"
            );

            typingStatus.textContent =
                "CLICK HERE & START TYPING";

        }

    }
);


/* =========================================
   ESC = RESTART
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            resetTest();

            typingInput.focus();

        }

    }
);


/* =========================================
   LOAD BEST SCORE
========================================= */

function loadBestScore() {

    const best =
        localStorage.getItem(
            "wgTypingBestWPM"
        ) || 0;


    bestWpm.textContent =
        best;

}


/* =========================================
   INITIALIZE
========================================= */

resetTest();

loadBestScore();