const inputs = document.querySelector(".inputs"),
    typingInput = document.querySelector(".typing-input"),
    hintTag = document.querySelector(".hint span"),
    guessLeft = document.querySelector(".guess-left span"),
    wrongLetters = document.querySelector(".wrong-letter span"),
    resetBtn = document.querySelector(".reset-btn"),
    startBtn = document.getElementById("start-btn"),
    startScreen = document.getElementById("start-screen"),
    gameScreen = document.getElementById("game-screen"),
    difficultyScreen = document.getElementById("difficulty-screen"),
    difficultyBtns = document.querySelectorAll(".difficulty-btn"),
    finalScoreScreen = document.getElementById("final-score-screen"),
    finalScoreDisplay = document.getElementById("final-score"),
    currentQuestionDisplay = document.getElementById("current-question"),
    exitBtn = document.getElementById("exit-btn");


let word,
    maxGuesses,
    incorrectLetters,
    correctLetters,
    currentDifficulty = "easy",
    score = 0,
    wordsAttempted = 0,
    usedWords = [];

function startGameScreen() {
    startScreen.style.display = "none";
    difficultyScreen.style.display = "block";
}

function selectDifficulty(difficulty) {
    currentDifficulty = difficulty;
    score = 0;
    wordsAttempted = 0;
    usedWords = [];
    difficultyScreen.style.display = "none";
    gameScreen.style.display = "block";
    nextQuestion();
}  

function nextQuestion() {
    // Filter words by difficulty, keep order
    let difficultyWords = wordList.filter((item, idx) => {
        if (currentDifficulty === "easy") {
            return idx < 20;
        } else if (currentDifficulty === "medium") {
            return idx >= 20 && idx < 40;
        } else if (currentDifficulty === "hard") {
            return idx >= 40;
        }
    });

    // Always present 20 questions per session
    let questionIndex = wordsAttempted % difficultyWords.length;
    let currentItem = difficultyWords[questionIndex];
    word = currentItem.word;
    usedWords.push(word);
    maxGuesses = word.length >= 5 ? 8 : 6;
    correctLetters = [];
    incorrectLetters = [];
    hintTag.innerText = currentItem.hint;
    guessLeft.innerText = maxGuesses;
    wrongLetters.innerText = incorrectLetters;

    // Update question counter
    currentQuestionDisplay.textContent = wordsAttempted + 1;

    let html = "";
    for (let i = 0; i < word.length; i++) {
        html += `<input type="text" disabled>`;
    }
    inputs.innerHTML = html;
}

// Don't call nextQuestion() on load anymore since we need difficulty selection first
// nextQuestion();

function initGame(e) {
    let key = e.target.value.toLowerCase();
    if (
        key.match(/^[A-Za-z]+$/) &&
        !incorrectLetters.includes(key) &&
        !correctLetters.includes(key)
    ) {
        if (word.includes(key)) {
            for (let i = 0; i < word.length; i++) {
                if (word[i] == key) {
                    inputs.querySelectorAll("input")[i].value = key;
                }
            }
            if (!correctLetters.includes(key)) {
                correctLetters.push(key);
            }
        } else {
            maxGuesses--;
            incorrectLetters.push(key);
        }
        guessLeft.innerText = maxGuesses;
        wrongLetters.innerText = incorrectLetters;
    }
    typingInput.value = "";

    setTimeout(() => {
        // Count unique letters in word
        let uniqueLetters = [...new Set(word.toLowerCase())].length;
        if (correctLetters.length === uniqueLetters) {
            score++;
            wordsAttempted++;
            if (wordsAttempted >= 20) {
                showFinalScore();
            } else {
                alert(`Congratulations! You found the word ${word.toUpperCase()}!\n\nScore: ${score}/${wordsAttempted}`);
                nextQuestion();
            }
        } else if (maxGuesses < 1) {
            wordsAttempted++;
            for (let i = 0; i < word.length; i++) {
                inputs.querySelectorAll("input")[i].value = word[i];
            }
            if (wordsAttempted >= 20) {
                showFinalScore();
            } else {
                alert(`Game over! The word was: ${word.toUpperCase()}\n\nScore: ${score}/${wordsAttempted}`);
                nextQuestion();
            }
        }
    }, 100);
}

function showFinalScore() {
    gameScreen.style.display = "none";
    finalScoreScreen.style.display = "block";
    finalScoreDisplay.textContent = score;
}

function goBackToStart() {
    finalScoreScreen.style.display = "none";
    startScreen.style.display = "block";
}

resetBtn.addEventListener("click", nextQuestion);
startBtn.addEventListener("click", startGameScreen);
exitBtn.addEventListener("click", goBackToStart);
difficultyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        selectDifficulty(btn.dataset.difficulty);
    });
});
typingInput.addEventListener("input", initGame);
inputs.addEventListener("click", () => typingInput.focus());
document.addEventListener("keydown", () => typingInput.focus());    