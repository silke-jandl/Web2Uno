"use strict";

let game = {};

let players = ["name1", "name2", "name3", "name4"];

let wildcolor = "Blue";


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

        await getCards(game.NextPlayer);

        //$('#draw-card img').classList.add("flip-vertical-right");

        setNextPlayer(result.NextPlayer);
        updatePlayerCards();

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

async function playCard() {
    let $clickedCard = $(this),
        indexOfClickedPlayer = $clickedCard.data('player'),
        indexOfClickedCard = $clickedCard.data('card'),
        player = game.Players[indexOfClickedPlayer],
        card = player.Cards[indexOfClickedCard];

    // // let wildcolor = 'sth';
    // //console.log(wildcolor);

    // console.log(card);

    // // check player
    // if (game.NextPlayer != player.Player) {
    //     alert('Falsche Kartenhand!');
    //     return;
    // }
    // // if (game.TopCard.Color == 'Black') {
    // //     // if (card.Color != wildcolor) {
    // //     //     alert("Color to be played ", wildcolor);
    // //     //     console.log(wildcolor);
    // //     //     return;
    // //     // }

    // // }

    // // check card
    // if (card.Color != 'Black' && card.Value != game.TopCard.Value && card.Color != game.TopCard.Color) {
    //     //alert('Falsche Karte!');
    //     $clickedCard.addClass("flip-vertical-right");
    //     return;
    // }

    // if (card.Color == 'Black') {
    //     $('#chooseColor').modal();

    //     wildcolor = await getChosenColorFromModal();
    //     console.log(wildcolor);
    // }

    checkIfCardCanBePlayed($clickedCard, player);

    if (card.Color == 'Black') {
        $('#chooseColor').modal();
        //wildcolor = chosenColor;        
        wildcolor = await getChosenColorFromModal();
        //return wildcolor;

        console.log(wildcolor, 'inside if black condition');
    }

    console.log(wildcolor);

    if (game.TopCard.Color == 'Black') {
        if (card.Color != wildcolor) {
            alert("Color to be played ", wildcolor);
            return;
        }
    }



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

    $clickedCard.addClass("bounce-out-top");

    await reloadAllPlayerCards();
    game.TopCard = card;
    setNextPlayer(result.Player);
    updatePlayerCards();
    updateTopCard();
}

async function checkIfCardCanBePlayed(card, player) {

    if (game.NextPlayer != player.Player) {
        //alert('These aren\'t your cards, now, are they?');
        card.addClass("shake-horizontal").removeClass("shake-horizontal");
        return;
    }

    if (card.Color != 'Black' && card.Value != game.TopCard.Value && card.Color != game.TopCard.Color) {
        //alert('Falsche Karte!');
        card.addClass("shake-horizontal");
        card.removeClass("shake-horizontal");
        return;
    }
}

async function getChosenColorFromModal() {
    // let chosenColor;

    $('#red').on('click', function () {
        // let valueR = $('#red').val();
        // $('top-card').val(valueR);
        // $('#chooseColor').modal('hide');

        let chosenColor = 'Red';
        $('#chooseColor').modal('hide');
        getTopCard.Color = chosenColor;
        return chosenColor;
    });

    $('#yellow').on('click', function () {
        let chosenColor = 'Yellow';
        $('#chooseColor').modal('hide');
        game.TopCard.Color = chosenColor;
        return chosenColor;
    });

    $('#green').on('click', function () {
        let chosenColor = 'Green';
        $('#chooseColor').modal('hide');
        getTopCard.Color = chosenColor;
        return chosenColor;
    });

    $('#blue').on('click', function () {
        let chosenColor = 'Blue';
        $('#chooseColor').modal('hide');
        getTopCard.Color = chosenColor;
        return chosenColor;
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
        let $score = document.querySelector('#score-' + indexOfPlayer);

        $score.innerText = player.Score;
    }
}

function highlightCurrentPlayer() {
    let indexOfPlayer = getIndexOfPlayer(game.NextPlayer),
        $playerName = $('#player-' + indexOfPlayer);

    $('.player').css('font-weight', 'normal'); +

        $playerName.css('font-weight', 'bold');
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

$(document).on('click', '.hand-card', playCard);

$('ChooseColorForm').on('submit', function (evt) {
    evt.preventDefault();
    playCard();
    $('#ChooseColorForm').modal('hide');
    return getChosenColorFromModal();
    //playCard();
});

// $('#playerNames').modal();

//object in dem ich farbe speichere und dannim modalen aufruf mit übergeben (nach/statt hide)

startGame();

