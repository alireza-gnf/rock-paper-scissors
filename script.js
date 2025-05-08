const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";
let gameChoices = [ROCK, PAPER, SCISSORS];
const PLAYER_WON = "player";
const COMPUTER_WON = "computer";
const DRAW = "draw";
let playerScore = 0;
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
  finalResultText: document.querySelector("#play-screen .final-result-text"),
  playBtn: document.querySelector("#play-screen .play-button"),
  controlsText: document.querySelector("#play-screen .controls-text"),
  choiceTimer: document.querySelector("#play-screen .timer"),
  controls: document.querySelector("#play-screen .controls-container"),
};

playScreen.playBtn.addEventListener("click", playGame);

function playGame() {
  playScreen.playBtn.removeEventListener("click", playGame);
  playScreen.playBtn.classList.add("hidden");
  resetGame();
  playRound();
}

async function playRound() {
  prepareForRound();
  const playerChoice = await waitForPlayerChoice();
  const computerChoice = getRandomChoice();
  const playerChoiceUpper = playerChoice.toUpperCase();
  const computerChoiceUpper = computerChoice.toUpperCase();
  leftPlayer.choiceImg.setAttribute("src", `./assets/${playerChoice}.png`);
  leftPlayer.choiceImg.setAttribute("alt", playerChoice);
  leftPlayer.choiceImg.classList.remove("hidden");
  leftPlayer.choiceText.textContent = playerChoiceUpper;
  rightPlayer.choiceImg.setAttribute("src", `./assets/${computerChoice}.png`);
  rightPlayer.choiceImg.setAttribute("alt", computerChoice);
  rightPlayer.choiceImg.classList.remove("hidden");
  rightPlayer.choiceText.textContent = computerChoiceUpper;
  switch (getRoundResult(playerChoice, computerChoice)) {
    case PLAYER_WON:
      playerScore++;
      leftPlayer.score.textContent = playerScore;
      leftPlayer.lives[playerScore - 1].classList.add("full");
      playScreen.roundResult.textContent = "You Win!";
      playScreen.roundResultText.textContent = `${playerChoiceUpper} beats ${computerChoiceUpper}`;
      break;
    case COMPUTER_WON:
      computerScore++;
      rightPlayer.score.textContent = computerScore;
      rightPlayer.lives[computerScore - 1].classList.add("full");
      playScreen.roundResult.textContent = "Computer Wins!";
      playScreen.roundResultText.textContent = `${computerChoiceUpper} beats ${playerChoiceUpper}`;
      break;
    case DRAW:
      playScreen.roundResultText.textContent = "";
      playScreen.roundResult.textContent = "That's a Draw!";
      break;
  }

  if (isGameFinished()) {
    updateFinalResult();
  } else {
    playRound();
  }
}

function prepareForRound() {
  renderControls();
  playScreen.controlsText.classList.add("countdown-animation");
  playScreen.choiceTimer.classList.add("countdown-animation");
}

function getRoundResult(playerChoice, computerChoice) {
  if (
    (playerChoice === ROCK && computerChoice === SCISSORS) ||
    (playerChoice === SCISSORS && computerChoice === PAPER) ||
    (playerChoice === PAPER && computerChoice === ROCK)
  ) {
    return PLAYER_WON;
  } else if (playerChoice === computerChoice) {
    return DRAW;
  } else {
    return COMPUTER_WON;
  }
}

function isGameFinished() {
  return playerScore === 5 || computerScore === 5;
}

function updateFinalResult() {
  if (playerScore === 5) {
    playScreen.roundResult.textContent = "You Won The Game!";
    playScreen.finalResultText.textContent = "Could You Win Again?";
  } else {
    playScreen.roundResult.textContent = "You Lost The Game!";
    playScreen.finalResultText.textContent = "Maybe Next Time.";
  }

  playScreen.playBtn.textContent = "Play Again";
  playScreen.playBtn.classList.remove("hidden");
  playScreen.playBtn.addEventListener("click", playGame);
}

function resetGame() {
  playerScore = 0;
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
  playScreen.finalResultText.textContent = "";
  playScreen.playBtn.textContent = "Play";
  playScreen.choiceTimer.textContent = "";
  playScreen.controlsText.textContent = "";
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
    playScreen.controlsText.textContent = "Pick one:";
    playScreen.choiceTimer.textContent = `00:0${timeout}`;
    const interval = countDown(timeout, 1, (timeLeft) => {
      playScreen.choiceTimer.textContent = `00:0${timeLeft}`;
      if (!timeLeft) {
        playScreen.controls.removeEventListener("click", onClick);
        resolve(getRandomChoice());
      }
    });

    playScreen.controls.classList.toggle("opaque");
    playScreen.controls
      .querySelectorAll(".controls-img")
      .forEach((ctrl) => ctrl.classList.toggle("not-clickable"));
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
  }).finally(() => {
    playScreen.controlsText.textContent = "";
    playScreen.choiceTimer.textContent = "";
    playScreen.controls.classList.toggle("opaque");
    playScreen.controls
      .querySelectorAll(".controls-img")
      .forEach((ctrl) => ctrl.classList.toggle("not-clickable"));
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
