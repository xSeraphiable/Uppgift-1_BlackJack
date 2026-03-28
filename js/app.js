
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let playerTotal = 0;
let computerTotal = 0;
let gameOver = true;
// let balance = currentUser.balance;
let playerBet = 0;
let deck = [];
let playerHand = [];
let computerHand = [];
let playerHandAces = 0;
let computerHandAces = 0;



const counterDisplay = document.getElementById("points");
const compCounterDisplay = document.getElementById("computerPoints");
const resultDisplay = document.getElementById("resultMessage");
const playerBetting = document.getElementById("playerBetting");
const yourBet = document.getElementById("yourBet");
const balanceDisplay = document.getElementById("balance");
const drawButton = document.getElementById("draw");
const stopButton = document.getElementById("stop");
const pHandDisplay = document.getElementById("pHand");
const cHandDisplay = document.getElementById("cHand");

const updateDisplay = () => { counterDisplay.innerText = playerTotal; }
const updateCompDisplay = () => { compCounterDisplay.innerText = computerTotal;}
const displayBet = () =>{ yourBet.innerText = playerBet;}
const displayBalance = () =>{balanceDisplay.innerText = currentUser.balance}

drawButton.disabled = gameOver;
stopButton.disabled = gameOver;


//------------------//
//     Functions    //
//------------------//

const placeBet = () => {

    if(!gameOver) return;
    
    let getPlayerBet = Number(document.querySelector("#bet").value);

    if (getPlayerBet > currentUser.balance) return;

    playerBet = getPlayerBet;

    currentUser.balance -= playerBet;

    startRound();
}

const startRound = () => {

    gameOver = false;
    updateUIstate();

    playerHand = [];
    computerHand = [];

  playerTotal = 0;
  computerTotal = 0;
  playerHandAces = 0;
  computerHandAces = 0;

  resultDisplay.innerText = "";

  updateDisplay();
  updateCompDisplay();
  displayBalance();
  displayBet();
  renderComputerHand();
  renderPlayerHand();

  deck = createDeck();
  shuffleDeck(deck);

  initialCards();

};

const updateUIstate = () =>{

    drawButton.disabled = gameOver;
    stopButton.disabled = gameOver;
}

const renderPlayerHand = () =>{

    pHandDisplay.innerHTML = "";

    for(let i = 0; i < playerHand.length; i++){

        let image = document.createElement('img');      
        image.src = "./Images/PNG-cards/" + playerHand[i].image;
        image.height = 100;
        image.style.margin = '5px';

        pHandDisplay.appendChild(image);
    }

}

const renderComputerHand = () =>{

    cHandDisplay.innerHTML = "";

        for (let i = 0; i < computerHand.length; i++) {

            let image = document.createElement("img");
            image.height = 100;
            image.style.margin = "5px";

            if(i == 0 && !gameOver)
            {
                image.src = "./Images/classic-cards/b2fv.png";                
            }
            else{                
                image.src = "./Images/PNG-cards/" + computerHand[i].image;            
            }

            cHandDisplay.appendChild(image);

        }

}

const result = () => {

    gameOver = true;
    updateUIstate();
    renderComputerHand();
    renderPlayerHand();

    if (playerTotal == computerTotal) {
      resultDisplay.innerText = "Oavgjort";
      payout();
    } else if (playerTotal > 21) {
      resultDisplay.innerText = "Över 21. Spelaren förlorar rundan";
    } else if (playerTotal == 21) {
      resultDisplay.innerText = "Spelaren vinner rundan";
      payout();
    } else {
      if (playerTotal > computerTotal || computerTotal > 21) {
        resultDisplay.innerText = "Spelaren vinner rundan";
        payout();
      } else {
        resultDisplay.innerText = "Datorn vinner rundan";
      }
    }
    
    resultDisplay.innerText = "\nPlacera ett bet för att starta en ny runda"
    
    displayBalance();
    playerBet = 0;
    displayBet();
}


const playerTurn = () => {
    
    if (playerTotal < 21){

        if(deck.length == 0) { result();}

        drawCardToPlayer();

        if (playerTotal >= 21){
            result();
        }
    }

}

const computerTurn =  () =>{    

    while (computerTotal < 17){
        drawCardToComputer();
    }
        
    result();
    
}

const initialCards = () =>{

    drawCardToPlayer();
    drawCardToPlayer();
    drawCardToComputer();
    drawCardToComputer();

    if(playerTotal == 21 || computerTotal > 21) result();
}

const drawCardToPlayer = () =>{  
    
       playerTotal += deck[0].value;       
       playerHand.push(deck[0]);

       if(deck[0].rank == "ace")
       {
        playerHandAces++;
       }

       while(playerTotal > 21 && playerHandAces > 0){
        playerTotal -= 10;
        playerHandAces--;
       }


       deck.shift();
       updateDisplay(); 
       renderPlayerHand();
    
}

const drawCardToComputer = () =>{
  computerTotal += deck[0].value;
  computerHand.push(deck[0]);

if(deck[0].rank == "ace")
{
    computerHandAces++;
}

while(computerTotal > 21 && computerHandAces > 0)
{
    computerTotal-= 10;
    computerHandAces--;
}

  deck.shift();
  updateCompDisplay();
  renderComputerHand();
}

const payout =() =>{
    if(playerTotal == computerTotal)
    {
        currentUser.balance += playerBet;
    }
    else
    {
        currentUser.balance += playerBet * 2;
    }
}

const addBalance = () => {

    currentUser.balance += Number(document.querySelector("#deposit").value);

}

const createDeck = () => {

    const suits = ["spades", "hearts", "diamonds", "clubs"];
    const ranks = ["ace", "2", "3", "4", "5", "6","7","8","9","10","jack", "queen", "king"];
   const newDeck = [];
    
    for (let suit of suits)
    {
        for(let rank of ranks)
        {
            let value;
            if(rank === "ace")
                {value = 11;}
            else if(rank === "jack" || rank === "queen" || rank === "king")
                {value = 10;}
            else
                {value = Number(rank);}


            newDeck.push({
                suit: suit,
                rank: rank,
                value: value,
                image: rank + "_of_" + suit + ".png"
            });
        }
    }

    return newDeck;
}

const shuffleDeck = (myDeck) => {

    let currentIndex = myDeck.length;

    while(currentIndex != 0)
    {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [myDeck[currentIndex], myDeck[randomIndex]] =
        [myDeck[randomIndex], myDeck[currentIndex]];
    }
}



//------------------//
//  Event listeners //
//------------------//

document
.querySelector("#depositButton")
.addEventListener("click", () =>{
    addBalance();
    displayBalance();
})

document
.querySelector("#draw")
.addEventListener("click", ()=>{
    if (gameOver) return;
    playerTurn();

});

document
.querySelector("#stop")
.addEventListener("click", () =>{
    if (gameOver) return;
    computerTurn();

});

document
.querySelector("#betButton")
.addEventListener("click", () =>{
    
    placeBet();

});

