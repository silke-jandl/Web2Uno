"use strict";

//global variables
let players = ["name1", "name2", "name3", "name4"];
//let players = [];
let handCards = [];
let currentPlayer;
let gameId;
let newGame = {};
let Player = {};
let Card = {
    color: '',
    value: '',
    score: '',
    text: '',
};
let wildColor = "";
let removeCardColor;
let removeCardValue;
let img;
let topCard;
let cardArray;
let itsThisPlayersTurn;

document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
    // console.log("submit")
    evt.preventDefault()
    //TODO check if names are the same & there are 4 names
    $('#playerNames').modal('hide')

    let { name1, name2, name3, name4 } = saveNamesFromModalDialog();

    showNamesOnPlaymat(name1, name2, name3, name4);

    post();

});

async function post() {
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
        method: "POST",
        body: JSON.stringify(players),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    if (response.ok) {

        let result = await response.json();
        //alert(JSON.stringify(result));

        startGame(result);
    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

//$('#playerNames').modal()
post();



function showNamesOnPlaymat(name1, name2, name3, name4) {
    document.getElementById("player1name").textContent = name1;
    document.getElementById("player2name").textContent = name2;
    document.getElementById("player3name").textContent = name3;
    document.getElementById("player4name").textContent = name4;
}

function saveNamesFromModalDialog() {
    let name1 = document.getElementById("player1").value;
    let name2 = document.getElementById("player2").value;
    let name3 = document.getElementById("player3").value;
    let name4 = document.getElementById("player4").value;
    players.push(name1);
    players.push(name2);
    players.push(name3);
    players.push(name4);
    return { name1, name2, name3, name4 };
}

async function startGame(result) {
    gameId = result.Id;
    //console.log(gameId);
    newGame.Id = result.Id;

    preprarePlayers(result);
    preparePlaymat(result);

    itsThisPlayersTurn = players.indexOf(currentPlayer);
    alert(itsThisPlayersTurn);

    let getCardsResponse = await getCards();
    cardArray = getCardsResponse.Cards;
    topCard = getTopCard();
}

function preparePlaymat(result) {
    const btnDraw = document.getElementById('drawCard');
    btnDraw.addEventListener("click", drawCard);

    newGame.TopCard = result.TopCard;
    let startkarte = document.getElementById("ablagestapel");
    let img = new Image();
    img.src = "cardImages/" + newGame.TopCard.Color + newGame.TopCard.Value + ".png";
    img.setAttribute("id", "topCard");
    startkarte.appendChild(img);
    startkarte = newGame.TopCard;
}

function preprarePlayers(result) {
    newGame.Players = result.Players;
    newGame.NextPlayer = result.NextPlayer;
    currentPlayer = result.NextPlayer;
    console.log(currentPlayer);
    Player.Player = result.Players.Player;

    prepareScoreForPlayers(result);

    prepareCardsForPlayer(result);
}

function prepareCardsForPlayer(result) {
    Player.Cards = result.Players.Card;

    handCards.push("handCards1");
    handCards.push("handCards2");
    handCards.push("handCards3");
    handCards.push("handCards4");

    console.log(handCards);

    Card.Color = result.Color;
    Card.Text = result.Text;
    Card.Value = result.Value;
    Card.Score = result.Score;

    for (let i = 0; i < handCards.length; i++) {
        for (let j = 0; j < result.Players[i].Cards.length; j++) {
            let karte = document.createElement("div");
            karte.setAttribute("id", i + "cardToPlay" + j);
            karte.setAttribute("onclick", "getIdOfClickedCard(this.id)");
            karte.setAttribute("class", "cards");
            let img = new Image();
            img.src = "cardImages/" + newGame.Players[i].Cards[j].Color + newGame.Players[i].Cards[j].Value + ".png";
            img.height = 90;
            karte.appendChild(img);
            document.getElementById(handCards[i]).appendChild(karte);
        }
    }
}

function prepareScoreForPlayers(result) {
    Player.Score = result.Players.Score;
    let scores = [];

    scores.push("score1");
    scores.push("score2");
    scores.push("score3");
    scores.push("score4");

    for (let i = 0; i < scores.length; i++) {
        let idString = i + 1;
        document.getElementById("score" + idString);
        let score = document.createElement("p");
        score.innerText = result.Players[i].Score;
        score.setAttribute("class", "scoreStyle");

        document.getElementById(scores[i]).appendChild(score);
    }
}

async function getTopCard() {
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/topCard/" + gameId, {
        method: "GET",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    if (response.ok) {
        let result = await response.json();
        //alert(JSON.stringify(result))
        //console.log(result);
        topCard = result;
    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

async function drawCard() {
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/drawCard/" + gameId, {
        method: "PUT",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    if (response.ok) {
        let result = await response.json();
        alert(JSON.stringify(result))

        console.log(currentPlayer + "drawCard");

        let karte = document.createElement("div");
        let check = players.indexOf(currentPlayer);
        console.log(check);
        let cardArraySize = document.getElementById(handCards[check]).childElementCount;
        console.log(cardArraySize);
        karte.setAttribute("id", check + "cardToPlay" + cardArraySize);
        karte.setAttribute("onclick", "getIdOfClickedCard(this.id");
        karte.setAttribute("class", "cards");

        let img = new Image();
        img.src = "cardImages/" + result.Card.Color + result.Card.Value + ".png";
        img.height = 100;
        karte.value = result.Card.Value;
        karte.color = result.Card.Color;
        karte.appendChild(img);

        // check += 1;
        //console.log("p" + check + "cards");
        document.getElementById(handCards[check]).appendChild(karte);

        let newScore = document.getElementById("score" + (check + 1)).innerText;
        newScore = parseInt(newScore);
        newScore += result.Card.Score;
        document.getElementById("score" + (check + 1)).innerText = newScore;

        currentPlayer = result.NextPlayer;
        console.log(currentPlayer + "drawCardNextPlayer");
        //console.log(currentPlayer);
        getCards();
    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

async function getCards() {

    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/getCards/" + gameId + "?playerName=" + currentPlayer, {
        method: "GET",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {
        let result = await response.json();
        return result;
        //console.log(result);
        //alert(JSON.stringify(result))
        //   cardArray = result.Cards;
        // let getCardsResponse = await getCards()
        // cardArray = getCardsResponse.Cards
        // same with Score

    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

function getIdOfClickedCard(clickedId) {
    checkCards(clickedId);
}

function checkCards(clickedId) {

    //console.log("Blödsinn");
    console.log(currentPlayer + "checkCards");
    itsThisPlayersTurn = players.indexOf(currentPlayer);
    //itsThisPlayersTurn = players.indexOf(currentPlayer);
    let indexOfCardInArray = clickedId.charAt(clickedId.length - 1);
    console.log("indexArrayCards", indexOfCardInArray);
    console.log("Player", itsThisPlayersTurn);
    alert(itsThisPlayersTurn);
    if (itsThisPlayersTurn == clickedId.charAt(0)) {
        alert(clickedId);
        let removeCard = cardArray.splice(indexOfCardInArray, 1);
        removeCardColor = removeCard[0].Color;
        removeCardValue = removeCard[0].Value;
        //console.log(colorRemoveCard);
        //console.log(cardArray);
        let topCardColor = topCard.Color;
        let topCardValue = topCard.Value;

        if (removeCardColor == "Black" || removeCardValue == topCardValue || removeCardColor == topCardColor) {
            console.log("Blöd");
            playCard(clickedId);
        }
    } else {
        alert("Falsche Kartenhand!");
        //console.log(cardArray);
    }
}

async function playCard(clickedId) {

    console.log("https://nowaunoweb.azurewebsites.net/api/game/playCard/" + gameId +
        "?value=" + removeCardValue + "&color=" + removeCardColor + "&wildColor=" + wildColor);
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/playCard/" + gameId +
        "?value=" + removeCardValue + "&color=" + removeCardColor + "&wildColor=" + wildColor, {
        method: "PUT",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {
        let result = await response.json();
        console.log(result);
        //   alert(JSON.stringify(result));

        if (removeCardColor == "Black") {
            $('#ChooseColorForm').modal()
        }
        console.log("Handkarten", cardArray);

        let cardToDelete = document.getElementById(clickedId);
        //    console.log(clickedId);
        cardToDelete.parentElement.removeChild(cardToDelete);
        console.log("Handkarten2", cardArray);
        let newTopCard = document.getElementById("topCard");
        console.log(newTopCard);
        let parentElement = document.getElementById("handCards" + (itsThisPlayersTurn + 1));
        while (parentElement.firstChild) {
            parentElement.removeChild(parentElement.firstChild);
        }
        let getCardsResponse = await getCards();
        cardArray = getCardsResponse.Cards;


        for (let j = 0; j < cardArray.length; j++) {
            let karte = document.createElement("div");
            karte.setAttribute("id", itsThisPlayersTurn + "cardToPlay" + j);
            karte.setAttribute("onclick", "getIdOfClickedCard(this.id)");
            karte.setAttribute("class", "cards");
            let img = new Image();
            img.src = "cardImages/" + cardArray[j].Color + cardArray[j].Value + ".png";
            img.height = 90;
            karte.appendChild(img);
            document.getElementById("handCards" + (itsThisPlayersTurn + 1)).appendChild(karte);
        }

        let newImgTopCard = new Image();
        newImgTopCard.src = "cardImages/" + removeCardColor + removeCardValue + ".png";
        newImgTopCard.height = 150;
        console.log(newImgTopCard);

        document.getElementById("topCard").replaceWith(newImgTopCard);
        img = newImgTopCard;
        img.setAttribute("id", "topCard");
        newImgTopCard.height = 150;
        console.log(img);
        console.log(newImgTopCard);

        currentPlayer = result.Player;
        console.log(currentPlayer);
        getCards();

    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}


document.getElementById('ChooseColorForm').addEventListener('submit', function (evt) {
    console.log('submit')

    evt.preventDefault();

    document.getElementById('red').value;
    topCard.Color = "Red";

    document.getElementById('blue').value;
    topCard.Color = "Blue";

    document.getElementById('green').value;
    topCard.Color = "Green";

    document.getElementById('yellow').value;
    topCard.Color = "Yellow";
});
