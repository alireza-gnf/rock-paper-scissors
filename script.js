const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";
let gameChoices = [ROCK, PAPER, SCISSORS];
let humanScore = 0;
let computerScore = 0;
const leftPlayer = {
  lives: document.querySelectorAll("#left-player .life"),
  choiceImg: document.querySelector("#left-player .choice-img img"),
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
  playScreen.playBtn.classList.add("hidden");
  resetGame();
  playRound();
}

async function playRound() {
  renderControls();
  playScreen.controlsText.classList.add("countdown-animation");
  playScreen.choiceTimer.classList.add("countdown-animation");
  playScreen.choiceTimer.classList.remove("hidden");
  const playerChoice = await waitForPlayerChoice();
  console.log(playerChoice);

  // if (
  //   (humanChoice === ROCK && computerChoice === SCISSORS) ||
  //   (humanChoice === SCISSORS && computerChoice === PAPER) ||
  //   (humanChoice === PAPER && computerChoice === ROCK)
  // ) {
  //   console.log(`You win! ${humanChoice} beats ${computerChoice}`);
  //   humanScore++;
  // } else if (humanChoice === computerChoice) {
  //   console.log("It's a draw!");
  // } else {
  //   console.log(`You lose! ${computerChoice} beats ${humanChoice}`);
  //   computerScore++;
  // }
  // console.log(`You: ${humanScore} Computer: ${computerScore}`);
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
  playScreen.roundResultText.textContent = "";
  playScreen.playBtn.textContent = "Play";
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

function isValid(choice) {
  return gameChoices.includes(choice);
}

function waitForPlayerChoice(timeout = 3) {
  return new Promise((resolve) => {
    playScreen.choiceTimer.textContent = `00:0${timeout}`;
    const interval = countDown(timeout, 1, (timeLeft) => {
      playScreen.choiceTimer.textContent = `00:0${timeLeft}`;
      if (!timeLeft) {
        playScreen.controls.removeEventListener("click", onClick);
        resolve(getRandomChoice());
      }
    });

    playScreen.controls.addEventListener("click", onClick);
    function onClick(e) {
      if (e.target.matches("input")) {
        const playerChoice = e.target.getAttribute("value");
        if (isValid(playerChoice)) {
          clearInterval(interval);
          playScreen.controls.removeEventListener("click", onClick);
          resolve(playerChoice);
        } else {
          alert("Invalid choice");
        }
      }
    }
  });
}

function getRandomChoice() {
  return gameChoices[Math.floor(Math.random() * 3)];
}

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

playScreen.playBtn.addEventListener("click", playGame);
