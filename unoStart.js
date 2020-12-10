"use strict";

let names = ["name1", "name2", "name3", "name4"]
let players = [];
let handCards = [];

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

        handCards.push(document.getElementById("player1Placement").id);
handCards.push(document.getElementById("player2Placement").id);
handCards.push(document.getElementById("player3Placement").id);
handCards.push(document.getElementById("player4Placement").id);

let newGame = {};
newGame.Id = result.Id;
newGame.Players = result.Players;
newGame.NextPlayer = result.NextPlayer;
newGame.TopCard = result.TopCard;

let Players ={};
Players.Player = result.Players.Player; 
Players.Cards = result.Players.Card; 
Players.Score = result.Players.Score;

let Cards = {};
Cards.Color = result.Color; 
Cards.Text = result.Text;
Cards.Value = result.Value;
Cards.Score = result.Score;

let startkarte = document.getElementById("ablagestapel");
let img = new Image();
img.src ="cardImages/" + newGame.TopCard.Color + newGame.TopCard.Value + ".png";
startkarte.appendChild(img);
startkarte = newGame.TopCard;

//console.log("Startkarte ", startkarte);

for (let i = 0; i < handCards.length; i++){
    for(let j = 0; j < 7; j++){
        let karte = document.createElement("div")
;
karte.setAttribute("class", "Handkarten" + i)
let img = new Image();
img.scr ="cardImages/" + newGame.Players[i].Cards[j].Color + newGame.Players[i].Cards[j].Value + ".png";
img.height = 90;
karte.appendChild(img);
document.getElementById(handCards[i]).appendChild(karte);
}
}
// let aktiverSpieler = document.createElement("p")
// aktiverSpieler.innerText = result.NextPlayer;
// document.getElementsByClassName("activePlayer").appendChild(aktiverSpieler);}

    }
    else {
        alert("HTTP-Error: "  + response.status)
    }
}

$('#playerNames').modal()

document.getElementById('playerNamesForm').addEventListener('submit', function(evt){
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



//Spielernamen zuordnen zu placement ??
//let s1 = document.getElementById();


//StartGameResponse
