"use strict";

let names = ["name1", "name2", "name3", "name4"]
async function post(){
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
        method: "POST",
        body: JSON.stringify(names),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    });

    if(response.ok){
        let result = await response.json();
        alert(JSON.stringify(result))
    }
    else {
        alert("HTTP-Error: "  + response.status)
    }
}
post();

$('#playerNames').modal()

document.getElementById('playerNamesForm').addEventListener('submit', function(evt){
    console.log("submit")
    evt.preventDefault()
    $('#playerNames').modal('hide')
});

let players = [];
let name1 = document.getElementById("player1").value;
let name2 = document.getElementById("player2").value;
let name3 = document.getElementById("player3").value;
let name4 = document.getElementById("player4").value;
players.push(name1);
players.push(name2);
players.push(name3);
players.push(name4);

// document.getElementById("playerNamesSubmitButton").addEventListener("click", function() {
// });


let handCards = [];
handCards.push(document.getElementById("player1Placement").id);
handCards.push(document.getElementById("player2Placement").id);
handCards.push(document.getElementById("player3Placement").id);
handCards.push(document.getElementById("player4Placement").id);


//Spielernamen zuordnen zu placement ??
//let s1 = document.getElementById();


//StartGameResponse
let newGame = {}
newGame.Id = result.Id;
newGame.Players = result.Players;
newGame.NextPlayer = result.NextPlayer;
newGame.TopCard = result.TopCard;

let Players ={};
Players.Player = result.Player.Player; 
Players.Card = result.Player.Card; 
Players.Score = result.Player.Score;

let Cards = {};
Card.Color = result.Color; 
Card.Text = result.Text;
Card.Value = result.Value;
Card.Score = result.Score;

let startkarte = document.getElementById("ablagestapel");
let img = new Image();
img.src ="/cardImages" + newGame.TopCard.Colorv + newGame.topCard.Value + ".png";
startkarte.appendChild(img);
startkarte = newGame.TopCard;

console.log("Startkarte ", startkarte);

for (let i = 0; i < handkaten.lenght; i++){
    for(let j = 0; j < 7; j++){
        let karte = document.createElement("div")
;
karte.setAttribute("class", "Handkarten" + i)
let img = new Image();
img.scr ="image/cards/" + newGame.Players[i].Cards[j].Color + newGame.Players[i].Cards[j]. Value + ".png";
img.height = 90;
karte.appendChild(img);
document.getElementById(handkarten[i]).appendChild(karte);
}

let aktiverSpieler = document.createElement("p")
aktiverSpieler.innerText = result.NextPlayer;
document.getElementById("activePlayer").appendChild(aktiverSpieler);}