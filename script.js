let blackjackGame = {
    'you': {
        'scoreSpan': '#your-result', 
        'div': '#your-box',
        'score': 0
    },
    'dealer': {
        'scoreSpan': '#dealer-result', 
        'div': '#dealers-box',
        'score': 0
    },
    'cards': ['2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC', '2D', '3D', '4D', '5D', 
    '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD','2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 
    'QH', 'KH', 'AH','2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS'],

    'cardsCopy': [],

    'cardsMap': {'2C': 2, '3C': 3, '4C': 4, '5C': 5, '6C': 6, '7C': 7, '8C': 8, '9C': 9, '10C': 10, 'JC': 10, 
    'QC': 10, 'KC': 10, 'AC': [1, 11], '2D': 2, '3D': 3, '4D': 4, '5D': 5, '6D': 6, '7D': 7, '8D': 8, '9D': 9, 
    '10D': 10, 'JD': 10, 'QD': 10, 'KD': 10, 'AD': [1, 11],'2H': 2, '3H': 3, '4H': 4, '5H': 5, '6H': 6, '7H': 7, 
    '8H': 8, '9H': 9, '10H': 10, 'JH': 10, 'QH': 10, 'KH': 10, 'AH': [1, 11],'2S': 2, '3S': 3, '4S': 4, '5S': 5, 
    '6S': 6, '7S': 7, '8S': 8, '9S': 9, '10S': 10, 'JS': 10, 'QS': 10, 'KS': 10, 'AS': [1, 11]},

    'result': {
        'win': {
            'text': 'You win',
            'color': 'green'
        },

        'loose': {
            'text': 'You loose',
            'color': 'red'
        },

        'draw': {
            'text': 'Draw',
            'color': 'yellow'
        }
    }
}

const YOU = blackjackGame.you;
const DEALER = blackjackGame.dealer;


const hitSound = new Audio("blackjack_assets/sounds/swish.m4a");
const winSound  = new Audio("blackjack_assets/sounds/cash.mp3");
const looseSound = new Audio("blackjack_assets/sounds/aww.mp3");


/*
HIT BUTTON
*/

/*
When the hit button is pressed it starts the game to display the cards  
*/
blackjackHit = () =>{
    let score = YOU.score
    if (score < 21) {
        let card = getRandomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}
 

async function dealerBlackjackHit() {
    let score = DEALER.score 
    if (score < 17) {
        let card = getRandomCard();
        showCard(card, DEALER)
        updateScore(card, DEALER); 
        showScore(DEALER); 
        dealerBlackjackHit();
    }
}

/*
gets a random card from the deck 
@return --> random card from the deck 
*/
getRandomCard = () => {
    let randomNumber = Math.floor(Math.random() * blackjackGame.cards.length);
    let randomCard = blackjackGame.cards[randomNumber]
    blackjackGame.cardsCopy.push(randomCard)
    blackjackGame.cards.splice(randomNumber, 1);
    return randomCard;
}


/* 
Displays the card on your side or the dealers side
@params --> YOU or the DEALER to decide which div the card goes into 
*/ 
showCard = (card, activePlayer) =>{
    let cardImage = document.createElement('img');
    cardImage.src = `blackjack_assets/images/${card}.png`;
    cardImage.height = '150'
    cardImage.width = '120'
    document.querySelector(activePlayer.div).appendChild(cardImage);
    hitSound.play();
}

updateScore = (card, activePlayer) => {
    if (card === 'AS' || card === 'AH' || card === 'AC' || card === 'AD') {
        if (activePlayer.score + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer.score += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer.score += blackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer.score += blackjackGame['cardsMap'][card];
    }
}

showScore = (activePlayer) => {
    let roundScore = activePlayer.score
    document.querySelector(activePlayer.scoreSpan).innerText = roundScore;
    if (roundScore > 21) {
        document.querySelector(activePlayer.scoreSpan).innerText = 'BUST';
        document.querySelector(activePlayer.scoreSpan).style.color = 'red';
    }
}

/*
DEAL BUTTON
*/

/*
Deals more cards to you to play the game over again and resets the score
*/
blackjackDeal = () => {
    removeImages()
    resetDeck();
    resetScore(YOU)
    resetScore(DEALER)
    resetResult()
}

resetScore = (activePlayer) => {
    YOU.score = 0;
    DEALER.score = 0;
    document.querySelector(activePlayer.scoreSpan).innerText = 0;
    document.querySelector(activePlayer.scoreSpan).style.color = 'white';

}

resetResult = () => {
    document.querySelector('#result').innerText = "Let's play"
    document.querySelector('#result').style.color = 'black'
}

/*
Puts all the cards back in the deck to select from
*/
resetDeck = () => {
    let array = blackjackGame.cards.concat(blackjackGame.cardsCopy);
    blackjackGame.cards = array;
    blackjackGame.cardsCopy = []
}

/*
Removes the images from each board 
*/
removeImages = () => {
    let images = document.querySelector('.game-display').querySelectorAll('img');
    for(let i=0; i < images.length; i++){
        images[i].remove();
    }
}

/*
STAND BUTTON
*/


function blackjackStand() {
    dealerBlackjackHit();

    let yourScore = YOU.score;
    let dealerScore = DEALER.score;

    showResult(yourScore, dealerScore);

}

showResult = (yourScore, dealerScore) => {
    if (yourScore < dealerScore && dealerScore <= 21 || yourScore > 21) {
        document.querySelector('#result').innerText = blackjackGame.result.loose.text;
        document.querySelector('#result').style.color = blackjackGame.result.loose.color;
        looseSound.play()
        countLoss();

    } else if (yourScore === dealerScore) {
        document.querySelector('#result').innerText = blackjackGame.result.draw.text;
        document.querySelector('#result').style.color = blackjackGame.result.draw.color;
        countDraw();

    } else {
        document.querySelector('#result').innerText = blackjackGame.result.win.text;
        document.querySelector('#result').style.color = blackjackGame.result.win.color;
        winSound.play()
        countWin();
    }   
}

countWin = () => {
    let currentCount = document.querySelector('#wins').innerText;
    currentCount++;
    document.querySelector('#wins').innerText = currentCount;
}

countLoss = () => {
    let currentCount = document.querySelector('#losses').innerText;
    currentCount++;
    document.querySelector('#losses').innerText = currentCount;
}

countDraw = () => {
    let currentCount = document.querySelector('#draws').innerText;
    currentCount++;
    document.querySelector('#draws').innerText = currentCount;
}
