let playerTotal = 0;
let computerTotal = 0;
let gameOver = true;
let balance = 100;
let playerBet = 0;
let deck = [];

const counterDisplay = document.getElementById("points");
const compCounterDisplay = document.getElementById("computerPoints");
const resultDisplay = document.getElementById("resultMessage");
const playerBetting = document.getElementById("playerBetting");
const yourBet = document.getElementById("yourBet");
const balanceDisplay = document.getElementById("balance");
const drawButton = document.getElementById("draw");
const stopButton = document.getElementById("stop");

const updateDisplay = () => { counterDisplay.innerText = playerTotal; }
const updateCompDisplay = () => { compCounterDisplay.innerText = computerTotal;}
const displayBet = () =>{ yourBet.innerText = playerBet;}
const displayBalance = () =>{balanceDisplay.innerText = balance}

drawButton.disabled = gameOver;
stopButton.disabled = gameOver;


//------------------//
//     Functions    //
//------------------//

const placeBet = () => {

    if(!gameOver) return;
    
    let getPlayerBet = Number(document.querySelector("#bet").value);

    if (getPlayerBet > balance) return;

    playerBet = getPlayerBet;

    balance -= playerBet;

    startRound();
}

const startRound = () => {

    gameOver = false;
    updateUIstate();

  playerTotal = 0;
  computerTotal = 0;

  resultDisplay.innerText = "";

  updateDisplay();
  updateCompDisplay();
  displayBalance();
  displayBet();
  deck = createDeck();

};

const updateUIstate = () =>{

    drawButton.disabled = gameOver;
    stopButton.disabled = gameOver;
}

const result = () => {

    gameOver = true;
    updateUIstate();

    if(playerTotal == 21 ){
        resultDisplay.innerText = "Spelaren vinner rundan";        
        payout();
    }
    else if(playerTotal > 21){
        resultDisplay.innerText = "Över 21. Spelaren förlorar rundan";
    }
    else
    {
        if (playerTotal > computerTotal || computerTotal > 21)
        {
            resultDisplay.innerText = "Spelaren vinner rundan";
            payout();          
        }
        else{
            resultDisplay.innerText = "Datorn vinner rundan";
            
        }
    }
    
    resultDisplay.innerText = "\nPlacera ett nytt bet för att starta en ny runda"
    
    displayBalance();
    playerBet = 0;
    displayBet();
}


const playerTurn = () => {
    
    if (playerTotal < 21) {
        playerTotal += Math.floor(Math.random() * (11 - 2 + 1)) + 2;
        updateDisplay();

        if (playerTotal > 21) {
            result();
        }
    }
    
}

const computerTurn =  () =>{
    
    while(computerTotal < 17)
        {        
            computerTotal += Math.floor(Math.random() * (11 - 2 + 1)) + 2;
            updateCompDisplay();
        }
        
    result();
    
}

const payout =() =>{
    balance += playerBet * 2;
}

const addBalance = () => {

    balance += Number(document.querySelector("#deposit").value);

}

const createDeck = () => {

    const suits = ["spade", "hearts", "diamonds", "clubs"];
    const ranks = ["A", "2", "3", "4", "5", "6","7","8","9","10","J", "Q", "K"];
   
    
    for (let suit of suits)
    {
        for(let rank of ranks)
        {
            let value;
            if(rank === "A")
                {value = 11;}
            else if(rank === "J" || rank === "Q" || rank === "K")
                {value = 10;}
            else
                {value = Number(rank);}


            deck.push({
                suit: suit,
                rank: rank,
                value: value
            });
        }
    }

    return deck;
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

