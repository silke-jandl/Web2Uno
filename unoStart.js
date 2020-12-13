"use strict";

let names = ["name1", "name2", "name3", "name4"];
let players = [];
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
let removeCardColor ;
let removeCardValue ;
let img;
let topCard;
let cardArray;
let itsThisPlayersTurn;

async function post() {
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
        method: "POST",
        body: JSON.stringify(names),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {

        let result = await response.json();
        //alert(JSON.stringify(result));

        gameId = result.Id;
        console.log(gameId);

        newGame.topCard = result.TopCard;
        currentPlayer = result.NextPlayer;
        console.log(currentPlayer);

        handCards.push(document.getElementById("player1cards").id);
        handCards.push(document.getElementById("player2cards").id);
        handCards.push(document.getElementById("player3cards").id);
        handCards.push(document.getElementById("player4cards").id);

        newGame.Id = result.Id;
        newGame.Players = result.Players;
        newGame.NextPlayer = result.NextPlayer;
        newGame.TopCard = result.TopCard;

        Player.Player = result.Players.Player;
        Player.Cards = result.Players.Card;
        Player.Score = result.Players.Score;

        Card.Color = result.Color;
        Card.Text = result.Text;
        Card.Value = result.Value;
        Card.Score = result.Score;

        let startkarte = document.getElementById("ablagestapel");
        let img = new Image();
        img.src = "cardImages/" + newGame.TopCard.Color + newGame.TopCard.Value + ".png";
        startkarte.appendChild(img);
        startkarte = newGame.TopCard;

        for (let i = 0; i < handCards.length; i++) {
            for (let j = 0; j < result.Players[i].Cards.length; j++) {
                let karte = document.createElement("div");
                karte.setAttribute("id", i + "cardToPlay" + j)
                karte.setAttribute("onclick", "getIdOfClickedCard(this.id)");
                karte.setAttribute("class", "cards");
                let img = new Image();
                img.src = "cardImages/" + newGame.Players[i].Cards[j].Color + newGame.Players[i].Cards[j].Value + ".png";
                img.height = 90;
                karte.appendChild(img);
                document.getElementById(handCards[i]).appendChild(karte);
            }
        }
        
        let scores = [];
        scores.push(document.getElementById("score1").id);
        scores.push(document.getElementById("score2").id);
        scores.push(document.getElementById("score3").id);
        scores.push(document.getElementById("score4").id);

        for(let i = 0; i < scores.length; i++){
            let idString = i + 1;
            document.getElementById("score" + idString);
            let score = document.createElement("p");
            score.innerText = result.Players[i].Score;
            score.setAttribute("class", "scoreStyle");

            document.getElementById(scores[i]).appendChild(score);
        }
        const btnDraw = document.getElementById('drawCard');
        btnDraw.addEventListener("click", drawCard);

        cardArray = getCards();
        topCard = getTopCard();

        itsThisPlayersTurn = names.indexOf(currentPlayer);
        alert(itsThisPlayersTurn);
    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

//$('#playerNames').modal()
post();

document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
    // console.log("submit")
    evt.preventDefault()
    //TODO check if names are the same & there are 4 names
    $('#playerNames').modal('hide')

    let name1 = document.getElementById("player1").value;
    let name2 = document.getElementById("player2").value;
    let name3 = document.getElementById("player3").value;
    let name4 = document.getElementById("player4").value;
    players.push(name1);
    players.push(name2);
    players.push(name3);
    players.push(name4);

    document.getElementById("player1name").textContent = name1;
    document.getElementById("player2name").textContent = name2;
    document.getElementById("player3name").textContent = name3;
    document.getElementById("player4name").textContent = name4;

    post();

});

async function getTopCard(){
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/topCard/" + gameId,{
        method: "GET",
        contentType: "application/json",
        headers:{
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

async function drawCard(){
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/drawCard/" + gameId,{
        method: "PUT",
        contentType: "application/json",
        headers:{
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    if (response.ok) {
        let result = await response.json();
        alert(JSON.stringify(result))

            let karte = document.createElement("div");
            let check = players.indexOf(currentPlayer);
            let cardArraySize = document.getElementById(handCards[check]).childElementCount;
            //console.log(cardArraySize);
            karte.setAttribute("id", check + "cardToPlay" + cardArraySize);
            karte.setAttribute("onclick", "getIdOfClickedCard(this.id");
            karte.setAttribute("class", "cards");

            let img = new Image();
            img.src = "cardImages/" + result.Card.Color + result.Card.Value + ".png";
            img.height = 100;
            karte.value = result.Card.Value;
            karte.color = result.Card.Color;
            karte.appendChild(img);

            check += 1;
            //console.log("p" + check + "cards");
            document.getElementById("p" + check + "cards").appendChild(karte);

            let newScore = document.getElementById("score" + check).innerText; 
            newScore = parseInt(newScore);
            newScore += result.Card.Score;
            document.getElementById("score" + check).innerText = newScore;

            currentPlayer = result.NextPlayer;
            //console.log(currentPlayer);
            getCards();
    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

async function getCards(){

    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/getCards/" + gameId + "?playerName=" + currentPlayer, {
        method: "GET",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if(response.ok){
        let result = await response.json();
        //console.log(result);
       //alert(JSON.stringify(result))
       cardArray = result.Cards;
    }
    else{
        alert("HTTP-Error: " + response.status)
    }
}

function getIdOfClickedCard(clickedId) {
    checkCards(clickedId);
}

function checkCards(clickedId) {

    itsThisPlayersTurn = names.indexOf(currentPlayer);
    //itsThisPlayersTurn = players.indexOf(currentPlayer);
    let indexOfCardInArray = clickedId.charAt(clickedId.length-1);
     console.log(indexOfCardInArray);
     console.log(itsThisPlayersTurn);
     alert(itsThisPlayersTurn);
    if (itsThisPlayersTurn == clickedId.charAt(0)) {
         alert(clickedId);
        let removeCard = cardArray.splice(indexOfCardInArray, 1);
        removeCardColor = removeCard[0].Color;
        removeCardValue = removeCard[0].Value;
        //console.log(colorRemoveCard);
        //console.log(cardArray);
        let topCardColor = topCard.Color;
        let TopCardValue = topCard.Value;

        if (removeCardColor == "Black" || removeCardValue == TopCardValue || removeCardValue == topCardColor) {
            playCard(clickedId);
        }
    } else {
        alert("Falsche Kartenhand!");
        cardArray.push(removeCard);
        //console.log(cardArray);
    }
}

async function playCard(clickedId) {

    let response = await fetch( "https://nowaunoweb.azurewebsites.net/api/game/playCard/" + gameId +
    "?value=" + removeCardValue + "&color=" + removeCardValue + "&wildColor=" + wildColor, {
        method: "PUT",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {
        let result = await response.json();
        //console.log(result);
     //   alert(JSON.stringify(result));

     if(removeCardColor == "Black"){
        $('#ChooseColorForm').modal()
   }

        let cardToDelete = document.getElementById(clickedId);
    //    console.log(clickedId);
        cardToDelete.parentElement.removeChild(cardToDelete);
        clickedId = "";

        let newTopCard = document.getElementById("topCard").childNodes;
        console.log(newTopCard);
    
        let newImgTopCard = new Image();
        newImgTopCard.src = "cardsImages/" + removeCardColor + removeCardValue + ".png";
        newImgTopCard.height = 150;


        document.getElementById("topCard").replaceChild(newImgTopCard, img);
        img = newImgTopCard;

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
