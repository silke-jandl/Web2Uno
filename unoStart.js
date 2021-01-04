"use strict";

let game = {};

let players = ["name1", "name2", "name3", "name4"];
//let players = [];


async function startGame() {
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/Game/Start", {
        method: "POST",
        body: JSON.stringify(players),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {
        let result = await response.json();

        game = result;

        updatePlayerCards();
        //updateTopCard();
        let $topCardImg = document.querySelector('#top-card img');
        $topCardImg.setAttribute('src', './cardImages/' + game.TopCard.Color + game.TopCard.Value + '.png');
        highlightCurrentPlayer();
    } else {
        showHTTPError(response);
    }
}

async function drawCard() {
    let $drawcard = $(this);
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/Game/DrawCard/" + game.Id, {
        method: "PUT",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {
        let result = await response.json();
        //   , indexOfCurrentPlayer = getIndexOfPlayer(game.NextPlayer);

        $drawcard.addClass("ping");


        await getCards(game.NextPlayer);

        setNextPlayer(result.NextPlayer);
        updatePlayerCards();

        $drawcard.removeClass("ping");

    } else {
        showHTTPError(response);
    }
}

async function getCards(playerName) {
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/getCards/" + game.Id + "?playerName=" + playerName, {
        method: "GET",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {
        let result = await response.json(),
            indexOfPlayer = getIndexOfPlayer(playerName);

        game.Players[indexOfPlayer].Cards = result.Cards;
        game.Players[indexOfPlayer].Score = result.Score;

        return result;
    } else {
        showHTTPError(response);
    }
}

async function getTopCard() {
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/Game/TopCard/" + game.Id, {
        method: "GET",
        contentType: "application/json",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    if (response.ok) {
        let result = await response.json();
        return result;
    } else {
        showHTTPError(response);
    }
}

async function playCard(wildcolor, card) {

    console.log(wildcolor);
    // getTopCard.Color = wildcolor;

    let response = await fetch('https://nowaunoweb.azurewebsites.net/api/Game/PlayCard/' + game.Id + '?value=' + card.Value + '&color=' + card.Color + '&wildColor=' + wildcolor, {
        method: 'PUT',
        contentType: 'application/json',
        headers: {
            'Content-Type': 'application/json; Charset=UTF-8'
        }
    });

    let result = await response.json();

    // check if http error
    if (!response.ok) {
        showHTTPError(response);
        return;
    }

    // check if validation error
    if ('error' in result) {
        showValidationError(result);
        return;
    }

    // everything is ok

    //card.classList.add("bounce-out-top");

    await reloadAllPlayerCards();
    game.TopCard = card;
    if(game.TopCard.Color == 'Black'){
        game.TopCard.Color = wildcolor;
    }
    setNextPlayer(result.Player);
    updatePlayerCards();
    updateTopCard();
}

async function getChosenColorFromModal(card) {

    $('#red').on('click', function () {
        let chosenColor = 'Red';
        $('#chooseColor').modal('hide');
        getTopCard.Color = chosenColor;
        playCard(chosenColor, card);
    });

    $('#yellow').on('click', function () {
        let chosenColor = 'Yellow';
        $('#chooseColor').modal('hide');
        game.TopCard.Color = chosenColor;
        playCard(chosenColor, card);
    });

    $('#green').on('click', function () {
        let chosenColor = 'Green';
        $('#chooseColor').modal('hide');
        getTopCard.Color = chosenColor;
        playCard(chosenColor, card);
    });

    $('#blue').on('click', function () {
        let chosenColor = 'Blue';
        $('#chooseColor').modal('hide');
        getTopCard.Color = chosenColor;
        playCard(chosenColor, card);
    });
}

async function reloadAllPlayerCards() {
    for (let indexOfPlayer in game.Players) {
        let player = game.Players[indexOfPlayer];

        await getCards(player.Player);
    }
}

function showValidationError(result) {
    let message = '';

    switch (result.error) {
        case 'IncorrectPlayer':
            message = 'Oh come on, let the person play whose turn it is!';
            break;
        default:
            message = "There, you've done it, you broke the game...\n\n(" + result.error + ")";
            break;
    }

    alert(message);
}

function showHTTPError(response) {
    alert('HTTP-Error: ' + response.status);
}

function setNextPlayer(playerName) {
    game.NextPlayer = playerName;
    highlightCurrentPlayer();
}

function getPlayerNames() {
    return game.Players.map(p => p.Player);
}

function getIndexOfPlayer(playerName) {
    return getPlayerNames().indexOf(playerName);
}

function updateTopCard() {
    getTopCard();
    let $topCardImg = document.querySelector('#top-card img');
    $topCardImg.setAttribute('src', './cardImages/' + game.TopCard.Color + game.TopCard.Value + '.png');
    console.log(game.TopCard);
}

function updatePlayerCards() {
    for (let indexOfPlayer in game.Players) {
        let player = game.Players[indexOfPlayer];
        let $handCards = $('#hand-cards-' + indexOfPlayer);

        $handCards.html('');

        for (let indexOfCard in player.Cards) {
            let card = player.Cards[indexOfCard],
                $card = $('<div>'),
                $cardImage = $('<img>');

            $card.attr('class', 'hand-card');
            $card.attr('data-player', indexOfPlayer);
            $card.attr('data-card', indexOfCard);

            $cardImage.attr('src', '././cardImages/' + card.Color + card.Value + '.png');

            $card.append($cardImage);

            $handCards.append($card);
        }
    }
    updateScores();
}

function updateScores() {
    for (let indexOfPlayer in game.Players) {
        let player = game.Players[indexOfPlayer];
        let $score = $('#score-' + indexOfPlayer);

        $score.innerText = player.Score;

        if(player.Cards.length == 0){
            alert("Congratulations, you won at a game my 2-year-old niece can win at");
            // $score.addClass('roll-out-right');
        }
    }
}

function highlightCurrentPlayer() {
    let indexOfPlayer = getIndexOfPlayer(game.NextPlayer),
        $playerName = $('#player-' + indexOfPlayer);

    $('.player').css('font-weight', 'normal'); +

        $playerName.css('font-weight', 'bold');
}

function showNamesOnPlaymat(name1, name2, name3, name4) {
    document.getElementById("player-0").textContent = name1;
    document.getElementById("player-1").textContent = name2;
    document.getElementById("player-2").textContent = name3;
    document.getElementById("player-3").textContent = name4;
}

function saveNamesFromModalDialog() {
    let name1 = document.getElementById("player1").value;
    let name2 = document.getElementById("player2").value;
    let name3 = document.getElementById("player3").value;
    let name4 = document.getElementById("player4").value;

    if (name1 != name2 && name1 != name3 && name1 != name4 && name2 != name3 && name2 != name4 && name3 != name4) {
        players.push(name1);
        players.push(name2);
        players.push(name3);
        players.push(name4);
    } else {
        alert("One player, one unique name, that's how we're playing here. If that's already to hard for you, maybe this game is not for you... If you dare, though, refresh the page and try again.");
        return;
    }
    return { name1, name2, name3, name4 };
}


document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
    // // console.log("submit")
    evt.preventDefault();
    //TODO check if names are the same & there are 4 names
    $('#playerNames').modal('hide');

    let { name1, name2, name3, name4 } = saveNamesFromModalDialog();

    showNamesOnPlaymat(name1, name2, name3, name4);

    startGame();
});

$('#draw-card img').on('click', drawCard);

$(document).on('click', '.hand-card', function () {
    let $clickedCard = $(this),
        indexOfClickedPlayer = $clickedCard.data('player'),
        indexOfClickedCard = $clickedCard.data('card'),
        player = game.Players[indexOfClickedPlayer],
        card = player.Cards[indexOfClickedCard];

        if (game.NextPlayer != player.Player) {
            //alert('These aren\'t your cards, now, are they?');
            $clickedCard.addClass(".shake-horizontal");
            return;
        }
    
        if (card.Color != 'Black' && card.Value != game.TopCard.Value && card.Color != game.TopCard.Color) {
            alert('Falsche Karte!');
            $clickedCard.addClass("shake-horizontal");
            return;
        }
    
        if (card.Color == 'Black') {
            $('#chooseColor').modal();
            getChosenColorFromModal(card);
        }

        if (card.Value == game.TopCard.Value || card.Color == game.TopCard.Color){
            let wildcolor = "";
            $clickedCard.addClass("bounce-out-top");
            playCard(wildcolor, card);
        }

});

//$('#playerNames').modal();

startGame();

