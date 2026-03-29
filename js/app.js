let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let playerScore = 0;
let computerScore = 0;
let gameOver = true;
let playerBet = 0;
let deck = [];
let playerHand = [];
let computerHand = [];
let playerAceCount = 0;
let computerAceCount = 0;

const counterDisplay = document.getElementById("points");
const compCounterDisplay = document.getElementById("computerPoints");
const resultDisplay = document.getElementById("resultMessage");
const playerBetting = document.getElementById("playerBetting");
const yourBet = document.getElementById("yourBet");
const balanceDisplay = document.getElementById("balance");
const drawButton = document.getElementById("draw");
const stopButton = document.getElementById("stop");
const playerHandDisplay = document.getElementById("pHand");
const computerHandDisplay = document.getElementById("cHand");

////////////////////
// USER INTERFACE //
////////////////////
const initiateGameUI = () => {
  updateUIstate();
  updateBalanceDisplay();
  updateBetDisplay();
  currentUserDisplay();
};
const updateUIstate = () => {
  drawButton.disabled = gameOver;
  stopButton.disabled = gameOver;
};

const renderPlayerHand = () => {
  playerHandDisplay.innerHTML = "";

  for (let i = 0; i < playerHand.length; i++) {
    let image = document.createElement("img");
    image.src = "./Images/PNG-cards/" + playerHand[i].image;
    image.height = 100;
    image.style.margin = "5px";

    playerHandDisplay.appendChild(image);
  }
};

const renderComputerHand = () => {
  computerHandDisplay.innerHTML = "";

  for (let i = 0; i < computerHand.length; i++) {
    let image = document.createElement("img");
    image.height = 100;
    image.style.margin = "5px";

    if (i == 0 && !gameOver) {
      image.src = "./Images/classic-cards/b2fv.png";
    } else {
      image.src = "./Images/PNG-cards/" + computerHand[i].image;
    }

    computerHandDisplay.appendChild(image);
  }
};

const currentUserDisplay = () => {
  document.getElementById("user").innerText = currentUser.username;
};

const updatePlayerScoreDisplay = () => {
  counterDisplay.innerText = playerScore;
};
const updateComputerScoreDisplay = () => {
  compCounterDisplay.innerText = computerScore;
};
const updateBetDisplay = () => {
  yourBet.innerText = playerBet;
};
const updateBalanceDisplay = () => {
  balanceDisplay.innerText = currentUser.balance;
};

////////////////
// GAME LOGIC //
////////////////

const placeBet = () => {
  if (!gameOver) return;

  let getPlayerBet = Number(document.querySelector("#bet").value);

  if (getPlayerBet > currentUser.balance) return;

  playerBet = getPlayerBet;

  currentUser.balance -= playerBet;
  saveBalance();

  startRound();
};

const startRound = () => {
  gameOver = false;
  updateUIstate();

  playerHand = [];
  computerHand = [];

  playerScore = 0;
  computerScore = 0;
  playerAceCount = 0;
  computerAceCount = 0;

  resultDisplay.innerText = "";

  updatePlayerScoreDisplay();
  updateComputerScoreDisplay();
  updateBalanceDisplay();
  updateBetDisplay();
  renderComputerHand();
  renderPlayerHand();

  deck = createDeck();
  shuffleDeck(deck);

  initialCards();
};

const endRound = () => {
  gameOver = true;
  updateUIstate();
  renderComputerHand();
  renderPlayerHand();

  if (playerScore == computerScore) {
    resultDisplay.innerText = "Oavgjort";
    payout();
  } else if (playerScore > 21) {
    resultDisplay.innerText = "Över 21. Spelaren förlorar rundan";
  } else if (playerScore == 21) {
    resultDisplay.innerText = "Spelaren vinner rundan";
    payout();
  } else {
    if (playerScore > computerScore || computerScore > 21) {
      resultDisplay.innerText = "Spelaren vinner rundan";
      payout();
    } else {
      resultDisplay.innerText = "Datorn vinner rundan";
    }
  }

  resultDisplay.innerText = "\nPlacera ett bet för att starta en ny runda";

  updateBalanceDisplay();
  playerBet = 0;
  updateBetDisplay();
};

const playerTurn = () => {
  if (playerScore < 21) {
    if (deck.length == 0) {
      endRound();
    }

    drawCardToPlayer();

    if (playerScore >= 21) {
      endRound();
    }
  }
};

const computerTurn = () => {
  while (computerScore < 17) {
    drawCardToComputer();
  }

  endRound();
};

const initialCards = () => {
  drawCardToPlayer();
  drawCardToPlayer();
  drawCardToComputer();
  drawCardToComputer();

  if (playerScore == 21 || computerScore > 21) endRound();
};

const drawCardToPlayer = () => {
  playerScore += deck[0].value;
  playerHand.push(deck[0]);

  if (deck[0].rank == "ace") {
    playerAceCount++;
  }

  while (playerScore > 21 && playerAceCount > 0) {
    playerScore -= 10;
    playerAceCount--;
  }

  deck.shift();
  updatePlayerScoreDisplay();
  renderPlayerHand();
};

const drawCardToComputer = () => {
  computerScore += deck[0].value;
  computerHand.push(deck[0]);

  if (deck[0].rank == "ace") {
    computerAceCount++;
  }

  while (computerScore > 21 && computerAceCount > 0) {
    computerScore -= 10;
    computerAceCount--;
  }

  deck.shift();
  updateComputerScoreDisplay();
  renderComputerHand();
};

const payout = () => {
  if (playerScore == computerScore) {
    currentUser.balance += playerBet;
    saveBalance();
  } else {
    currentUser.balance += playerBet * 2;
    saveBalance();
  }
};

const addBalance = () => {
  currentUser.balance += Number(document.querySelector("#deposit").value);
  saveBalance();
};

const createDeck = () => {
  const suits = ["spades", "hearts", "diamonds", "clubs"];
  const ranks = [
    "ace",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "jack",
    "queen",
    "king",
  ];
  const newDeck = [];

  for (let suit of suits) {
    for (let rank of ranks) {
      let value;
      if (rank === "ace") {
        value = 11;
      } else if (rank === "jack" || rank === "queen" || rank === "king") {
        value = 10;
      } else {
        value = Number(rank);
      }

      newDeck.push({
        suit: suit,
        rank: rank,
        value: value,
        image: rank + "_of_" + suit + ".png",
      });
    }
  }

  return newDeck;
};

const shuffleDeck = (myDeck) => {
  let currentIndex = myDeck.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [myDeck[currentIndex], myDeck[randomIndex]] = [
      myDeck[randomIndex],
      myDeck[currentIndex],
    ];
  }
};

/////////////
// STORAGE //
/////////////
const saveBalance = () => {
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  let users = JSON.parse(localStorage.getItem("user")) || [];

  for (let user of users) {
    if (currentUser.username == user.username) {
      user.balance = currentUser.balance;
    }
  }

  localStorage.setItem("user", JSON.stringify(users));
};

//------------------//
//  Event listeners //
//------------------//

document.querySelector("#depositButton").addEventListener("click", () => {
  addBalance();
  updateBalanceDisplay();
});

document.querySelector("#draw").addEventListener("click", () => {
  if (gameOver) return;
  playerTurn();
});

document.querySelector("#stop").addEventListener("click", () => {
  if (gameOver) return;
  computerTurn();
});

document.querySelector("#betButton").addEventListener("click", () => {
  placeBet();
});

document.querySelector("#logout").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  location.href = "index.html";
});

//----------------//
// Initiate Game  //
//----------------//

initiateGameUI();
