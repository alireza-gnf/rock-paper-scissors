const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";
let gameChoices = [ROCK, PAPER, SCISSORS];
let humanScore = 0;
let computerScore = 0;
const leftPlayer = {
  lives: document.querySelectorAll("#left-player .life"),
  choiceImg: document.querySelector("#left-player .choice-img"),
  choiceText: document.querySelector("#left-player .choice-text"),
  score: document.querySelector("#play-screen #score-left"),
};
const rightPlayer = {
  lives: document.querySelectorAll("#right-player .life"),
  choiceImg: document.querySelector("#right-player .choice-img img"),
  choiceText: document.querySelector("#right-player .choice-text"),
  score: document.querySelector("#play-screen #score-right"),
};
const playScreen = {
  roundResult: document.querySelector("#play-screen .round-result"),
  roundResultText: document.querySelector("#play-screen .round-result-text"),
  playBtn: document.querySelector("#play-screen .play-button"),
  controlsText: document.querySelector("#play-screen .controls-text"),
  choiceTimer: document.querySelector("#play-screen .timer"),
  controls: document.querySelector("#play-screen .controls-container"),
};

function playGame() {
  playScreen.playBtn.removeEventListener("click", playGame);
  resetGame();
  renderControls();
  playScreen.controlsText.classList.add("countdown-animation");
  playScreen.choiceTimer.classList.add("countdown-animation");
  const intervalId = countDown(5, 1, (limitInSeconds) => {
    playScreen.choiceTimer.textContent = `00:0${limitInSeconds}`;
    if (!limitInSeconds) {
      playScreen.controls.removeEventListener("click");
    }
  });
}

function playRound(humanChoice, computerChoice) {
  if (
    (humanChoice === ROCK && computerChoice === SCISSORS) ||
    (humanChoice === SCISSORS && computerChoice === PAPER) ||
    (humanChoice === PAPER && computerChoice === ROCK)
  ) {
    console.log(`You win! ${humanChoice} beats ${computerChoice}`);
    humanScore++;
  } else if (humanChoice === computerChoice) {
    console.log("It's a draw!");
  } else {
    console.log(`You lose! ${computerChoice} beats ${humanChoice}`);
    computerScore++;
  }
  console.log(`You: ${humanScore} Computer: ${computerScore}`);
}

function resetGame() {
  humanScore = 0;
  computerScore = 0;
  for (const life of [...leftPlayer.lives, ...rightPlayer.lives]) {
    life.classList.remove("full");
  }
  leftPlayer.choiceImg.classList.add("hidden");
  leftPlayer.choiceText.style.display = "";
  leftPlayer.score.textContent = 0;
  rightPlayer.choiceImg.classList.add("hidden");
  rightPlayer.choiceText.style.display = "";
  rightPlayer.score.textContent = 0;
  playScreen.roundResult.textContent = "";
  playScreen.roundResultText.textContent = "Rock, Paper, Scissors Game";
  playScreen.playBtn.textContent = "Play";
}

function getHumanChoice() {}

function countDown(limitInSeconds, delayInSeconds, func) {
  const intervalId = setInterval(() => {
    limitInSeconds -= 1;
    if (!limitInSeconds) {
      clearInterval(intervalId);
    }
    func(limitInSeconds);
  }, delayInSeconds * 1000);
  return intervalId;
}

function renderControls() {
  const randomIndices = [];
  [...playScreen.controls.children]
    .filter((child) => child.classList.contains("control"))
    .forEach((label) => {
      // This is to randomly order controls each time
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * 3);
      } while (randomIndices.includes(randomIndex));
      randomIndices.push(randomIndex);
      const randomPick = gameChoices[randomIndex];
      label.setAttribute("for", `${randomPick}-btn`);
      const img = label.querySelector("img");
      img.setAttribute("src", `./assets/btn-${randomPick}.png`);
      img.setAttribute("alt", randomPick);
    });
}

function getComputerChoice() {
  return gameChoices[Math.floor(Math.random() * 3)];
}

function isInvalid(input) {
  return isNaN(input) || input < 1 || input > 3;
}

playScreen.playBtn.addEventListener("click", playGame);
