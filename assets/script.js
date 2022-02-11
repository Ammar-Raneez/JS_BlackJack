window.onload = () => {
    document.querySelector('#hit-btn').addEventListener('click', hit);              
    document.querySelector('#danger-btn').addEventListener('click', deal);
    document.querySelector('#warning-btn').addEventListener('click', dealerLogic);
}

let game = {
    'you': {'scoreSpan': '#your-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A'],
    'cardsValue': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'Q': 10, 'J': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
    'firstPlayer': false,
}

const YOU = game['you'];
const DEALER =game['dealer'];

const hitSounds = new Audio('assets/music/swoosh.mp3');
const winSound = new Audio('assets/music/cash.mp3');
const loseSound = new Audio('assets/music/aww.mp3');

let hit = () => { 
    if(!game['isStand']) {
        let rCard = randomCard();
        showCard(YOU, rCard);
        updateScore(YOU, rCard);
        game['firstPlayer'] = true;
    }
}

let showCard = (currentPlayer, card) => {
    if(currentPlayer['score'] <= 21){
        let cardImg = document.createElement('img');
        cardImg.src =`assets/images/cards/${card}.jpg`;

        document.querySelector(currentPlayer['div']).appendChild(cardImg);
        hitSounds.play();
    }
}

let deal = () => {
    if(game['turnsOver']){
        game['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        yourImages.forEach(image => image.remove());

        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        dealerImages.forEach(image => image.remove());

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector(YOU['scoreSpan']).innerText = 0;
        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector(DEALER['scoreSpan']).innerText = 0;
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';

        document.querySelector('#final-result').innerText = "Let's Play!";
        document.querySelector('#final-result').style.color = "black";

        game['turnsOver'] = false;
        game['firstPlayer'] = false;
    }
}

let randomCard = () => {
    let randomIndex = Math.floor(Math.random() * 13);
    return game['cards'][randomIndex];
}

let updateScore = (currentPlayer, card) => {
    if(card === 'A') {
        if(currentPlayer['score'] += game['cardsValue'][card][1] <= 21) {
            currentPlayer['score'] += game['cardsValue'][card][1];
        } else {
            currentPlayer['score'] += game['cardsValue'][card][0];
        }
    } else {
        currentPlayer['score'] += game['cardsValue'][card];
    }
    showScore(currentPlayer);
}

let showScore = currentPlayer => {
    if(currentPlayer['score'] > 21){
        document.querySelector(currentPlayer['scoreSpan']).innerText = "BUST!";
        document.querySelector(currentPlayer['scoreSpan']).style.color = "red";
    } else {
        document.querySelector(currentPlayer['scoreSpan']).innerText = currentPlayer['score'];
    }
}

//a promise allows us to run code in the future after a specific task is completed. in our case the setTimeout is run at the end of each iteration
//we create a promise, due to the fact that the function will be kept on repeating, and it must happen asynchronously
let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));      //creating a new promise that, returns a setTimeout function

let dealerLogic = async () => { //we use async-await here to make sure that it happens parallely
    if(game['firstPlayer']) {   //as in, it doesn't sleep the entire browser for 1s, rather what it does is it
        game['isStand'] = true; //runs that particular code without disturbing the browser, n the rest of the code                            

        while(DEALER['score'] < 17 && game['isStand']) {    
            let card = randomCard();    
            showCard(DEALER, card);
            updateScore(DEALER, card);
            showScore(DEALER, card);
            await(sleep(1000));
        }
    
        game['turnsOver'] = true;
        showResult(decideWinner());
    }
}

let decideWinner = () => {
    let winner;

    //if you don't bust
    if(YOU['score'] <= 21) {
        //your score is higher than dealer or dealer busts but your score is less than 22
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            winner = YOU;
            game['wins']++;
        }

        //dealer score greater than yours, and both dont bust
        else if(YOU['score'] < DEALER['score']) {
            winner = DEALER;
            game['losses']++;
        }

        //both dont bust but are equal
        else if(YOU['score'] === DEALER['score']) {
            game['draws']++;
        }
    }

    //if you bust but dealer doesnt
    else if(YOU['score'] > 21 && DEALER['score'] <= 21) {
        winner = DEALER;
        game['losses']++;
    }

    //if you both bust
    else if(YOU['score' > 21 && DEALER['score'] > 21]) {
        game['draws']++;
    }
    
    console.log(game['wins'], game['losses'])
    return winner;
}

let showResult = (winner) => {
    let message, messageColor;
    game['firstPlayer'] = false;

    if(winner === YOU) {
        message = 'You Won!';
        messageColor = 'green';
        winSound.play();
    } 
    
    else if(winner === DEALER) {
        message = 'You Lost!';
        messageColor = 'red';
        loseSound.play();
    }

    else {
        message = 'You Drew!';
        messageColor = 'goldenRod';
    }

    document.querySelector('#final-result').innerText = message;
    document.querySelector('#final-result').style.color = messageColor;

    document.querySelector('#wins').innerText = game['wins'];
    document.querySelector('#losses').innerText = game['losses'];
    document.querySelector('#draws').innerText = game['draws'];
}