// Add an event listener for the DOMContentLoaded event
window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
    const startButton = document.getElementById("start-btn");
    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const questionContainerElement =
        document.getElementById("question-container");
    const questionElement = document.getElementById("question");
    const answerButtonsElement = document.getElementById("answer-buttons");
    const optionsElement = document.getElementById("options-container");
    const shuffleCheckbox = document.getElementById("shuffle-check");
    const timedCheckbox = document.getElementById("timed-check");
    const removeCheckbox = document.getElementById("remove-check");
    const correctQuestions = [];
    const minutesLabel = document.getElementById("minutes");
    const secondsLabel = document.getElementById("seconds");
    const timeText = document.getElementById("time-text");
    const timeDisplay = document.getElementById("time-container");
    const bodyElement = document.body;
    let totalSeconds = 0;

    let shuffledQuestions, currentQuestionIndex, remove, timed, timerInterval;

    let shuffled = true;

    //using the domLoaded function because the buttons need to be rendered before we can
    //add an event listener
    startButton.addEventListener("click", startGame);
    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        setNextQuestion();
    });
    backButton.addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
        }
        setNextQuestion();
    });
    // checkbox listeners
    shuffleCheckbox.addEventListener("change", (event) => {
        shuffled = event.target.checked;
    });
    timedCheckbox.addEventListener("change", (event) => {
        timed = event.target.checked;
        if (timed) {
            timeDisplay.classList.remove("hide");
        } else {
            timeDisplay.classList.add("hide");
        }
    });
    removeCheckbox.addEventListener("change", (event) => {
        remove = event.target.checked;
    });

    function setTime() {
        totalSeconds++;
        secondsLabel.innerHTML = pad(totalSeconds % 60);
        minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
        let modThirty = totalSeconds % 30;
        if ((modThirty == 0 || modThirty == 2) && totalSeconds > 5) {
            timeText.classList.add("retina-burn");
        } else if (modThirty == 1 || modThirty == 3) {
            timeText.classList.remove("retina-burn");
        }
    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }

    function startGame() {
        startButton.classList.add("hide");
        optionsElement.classList.add("hide");
        totalSeconds = 0;
        if (timed) {
            timerInterval = setInterval(setTime, 1000);
        }
        if (shuffled) {
            shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        } else {
            shuffledQuestions = questions;
        }
        currentQuestionIndex = 0;
        questionContainerElement.classList.remove("hide");

        setNextQuestion();
    }

    function setNextQuestion() {
        resetState();
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    }

    // function setPrevQuestion() {
    //     resetState();
    //     showQuestion(shuffledQuestions[currentQuestionIndex - 1]);
    // }

    function showQuestion(question) {
        questionElement.innerText = question.question;
        question.answers.forEach((answer) => {
            const button = document.createElement("button");
            button.innerText = answer.text;
            button.classList.add("btn");
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener("click", selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        clearStatusClass(document.body);
        nextButton.classList.add("hide");
        backButton.classList.add("hide");
        bodyElement.removeChild(bodyElement.firstChild);
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct;
        if (correct && remove) {
            correctQuestions.push(shuffledQuestions[currentQuestionIndex]);
            shuffledQuestions.splice(currentQuestionIndex, 1);
            currentQuestionIndex--;
        }
        const flashInfo = document.createElement("div");
        flashInfo.innerText = shuffledQuestions[currentQuestionIndex].info;
        flashInfo.classList.add("information");
        bodyElement.prepend(flashInfo);
        console.log(shuffledQuestions);
        setStatusClass(document.body, correct);
        Array.from(answerButtonsElement.children).forEach((button) => {
            setStatusClass(button, button.dataset.correct);
        });
        if (shuffledQuestions.length > currentQuestionIndex + 1) {
            nextButton.classList.remove("hide");
            if (currentQuestionIndex > 0) {
                backButton.classList.remove("hide");
            }
        } else {
            clearInterval(timerInterval);
            startButton.innerText = "Restart";
            startButton.classList.remove("hide");
        }
    }

    function setStatusClass(element, correct) {
        clearStatusClass(element);
        if (correct) {
            element.classList.add("correct");
        } else {
            element.classList.add("wrong");
        }
    }

    function clearStatusClass(element) {
        element.classList.remove("correct");
        element.classList.remove("wrong");
    }

    const questions = [
        // q1
        {
            question: "What... is your name?",
            info: "You are King Arthur, leader of the Knights of the Round Table",
            answers: [
                { text: "Sir Lancelot of Camelot", correct: false },
                { text: "Arthur, King of the Britans", correct: true },
                { text: "Brave Sir Robin", correct: false },
                { text: "Sir Bevedere", correct: false },
            ],
        },
        // q2
        {
            question: "What... is your quest?",
            info: "You're looking for an old cup",
            answers: [
                { text: "To burn the witch", correct: false },
                { text: "To sing", correct: false },
                { text: "To seek the Holy Grail", correct: true },
                { text: "To get huge tracts of land", correct: false },
            ],
        },
        // q3
        {
            question: "What is your favorite colour?",
            info: "Don't hesitate!",
            answers: [
                { text: "No... Ahhhhhh!", correct: false },
                {
                    text: "Turquoise with a hint of perriwinkle",
                    correct: false,
                },
                { text: "Blue", correct: true },
            ],
        },
        // q4
        {
            question: "What is the capital of Assyria?",
            info: "Ignorance is punishable by death",
            answers: [
                { text: "Harran", correct: false },
                { text: "Nineveh", correct: false },
                { text: "I don't know that!", correct: false },
                { text: "Assur", correct: true },
            ],
        },
        // q5
        {
            question: "What is the airspeed velocity of an unladen swallow?",
            info: "Well well, how the turn tables",
            answers: [
                { text: "12.3 m/s", correct: false },
                { text: "Swallows can't fly", correct: false },
                { text: "African or European?", correct: true },
                { text: "Fast", correct: false },
            ],
        },
        // q6
        {
            question: "How do you know she is a witch?",
            info: "She turned me into a newt!  ... I got better",
            answers: [
                { text: "Burn her!", correct: false },
                { text: "She has a cauldron", correct: false },
                { text: "She looks like one", correct: true },
                { text: "She has got a wart", correct: false },
            ],
        },
        // q7
        {
            question: "Why do witches burn?",
            info: "We must investigate further if she is a witch, here is a question to get us started",
            answers: [
                {
                    text: "It's a chemical reaction that can happen to anything carbon-based",
                    correct: false,
                },
                { text: "Gasoline", correct: false },
                { text: "'Cause they're made of wood", correct: true },
                { text: "Because we set them on fire", correct: false },
            ],
        },
        // q8
        {
            question: "How do we tell whether she is made of wood?",
            info: "This one will take some more science to figure out",
            answers: [
                { text: "Build a bridge out of her", correct: false },
                { text: "Throw her into the pond", correct: false },
                { text: "See what else floats in water", correct: true },
            ],
        },
        // q9
        {
            question: "What also floats in water?",
            info: "Rocks don't float",
            answers: [
                { text: "Bread", correct: false },
                { text: "Apples", correct: false },
                { text: "A duck", correct: true },
                { text: "Very small rocks", correct: false },
            ],
        },
        // q10
        {
            question: "If she weighs the same as a duck...",
            info: "Who are you that are so wise in the ways of science?",
            answers: [
                { text: "She's a witch!", correct: true },
                { text: "She is a duck", correct: false },
                { text: "She is a very small rock", correct: false },
                { text: "It is a fair trial", correct: false },
            ],
        },
    ];
}
