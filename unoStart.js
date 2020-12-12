"use strict";

//let names = ["name1", "name2", "name3", "name4"];
let players = [];
let handCards = [];
let currentPlayer;
let gameId;
let newGame = {};
let Players = {};
let Cards = {};

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
        alert(JSON.stringify(result));

        gameId = result.Id;
        console.log(gameId);

        newGame.topCard = result.TopCard;
        currentPlayer = result.NextPlayer;

        handCards.push(document.getElementById("player1Placement").id);
        handCards.push(document.getElementById("player2Placement").id);
        handCards.push(document.getElementById("player3Placement").id);
        handCards.push(document.getElementById("player4Placement").id);


        newGame.Id = result.Id;
        newGame.Players = result.Players;
        newGame.NextPlayer = result.NextPlayer;
        newGame.TopCard = result.TopCard;


        Players.Player = result.Players.Player;
        Players.Cards = result.Players.Card;
        Players.Score = result.Players.Score;


        Cards.Color = result.Color;
        Cards.Text = result.Text;
        Cards.Value = result.Value;
        Cards.Score = result.Score;

        let startkarte = document.getElementById("ablagestapel");
        let img = new Image();
        img.src = "cardImages/" + newGame.TopCard.Color + newGame.TopCard.Value + ".png";
        startkarte.appendChild(img);
        startkarte = newGame.TopCard;

        for (let i = 0; i < handCards.length; i++) {
            for (let j = 0; j < 7; j++) {
                let karte = document.createElement("div");
                karte.setAttribute("class", "Handkarten" + i)
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
        // let aktiverSpieler = document.createElement("p")
        // aktiverSpieler.innerText = result.NextPlayer;
        // document.getElementsByClassName("activePlayer").appendChild(aktiverSpieler);

    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

$('#playerNames').modal()

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

    function replyId(clickedId){
        alert(clickedId);
    }
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
        alert(JSON.stringify(result))
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
            karte.setAttribute("id", "cardToPlay" + result.Player.Cards);
            karte.setAttribute("onclick", "replyId(this.id");
            let img = new Image();
            img.src = "cardImages/" + result.Card.Color + result.Card.Value + ".png";
            img.height = 100;
            karte.appendChild(img);
            let check = players.includes(currentPlayer);
            check += 1;
            console.log("p" + check + "cards");
            document.getElementById("p" + check + "cards").appendChild(karte);

            console.log(document.getElementById("score" + check).innerText);
            let newScore = document.getElementById("score" + check).innerText; 
            
            newScore = parseInt(newScore);
            newScore += result.Card.Score;
            document.getElementById("score" + check).innerText = newScore;

            currentPlayer = result.NextPlayer;
            //getCards();
    }
    else {
        alert("HTTP-Error: " + response.status)
    }
}

// async function getCards(){

//     let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/getCards/" + gameId 
//     + "?playerName=" + currentPlayer, {
//         method: "GET",
//         contentType: "application/json",
//         headers: {
//             "Content-type": "application/json; charset=UTF-8"
//         }
//     });

//     if(response.ok){
//         let result = await response.json();
//         console.log(result);
//         // alert to check response
//        alert(JSON.stringify(result))

//     }
//     else{
//         alert("HTTP-Error: " + response.status)
//     }
// }

// // function removeCard(event){
// //     let cardDiv = event.target.parentElement;
// //     cardDiv.parentElement.removeChild(cardDiv);
// // }


// async function playCard(){

//     let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/playCard/" + gameId +
//     "?value=" + value + "&color=" + color +"&wildColor=" + wildColor, {
//         method: "GET",
//         contentType: "application/json",
//         headers: {
//             "Content-type": "application/json; charset=UTF-8"
//         }
//     });

//     if(response.ok){
//         let result = await response.json();
//         console.log(result);
//         alert(JSON.stringify(result))
//     }
//     else{
//         alert("HTTP-Error: " + response.status)
//     }
// }

