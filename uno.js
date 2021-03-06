"use strict";

let game = {};

//let players = ["name1", "name2", "name3", "name4"];
let players = [];


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
    let response = await fetch('https://nowaunoweb.azurewebsites.net/api/Game/PlayCard/' + game.Id + '?value=' + card.Value + '&color=' + card.Color + '&wildColor=' + wildcolor, {
        method: 'PUT',
        contentType: 'application/json',
        headers: {
            'Content-Type': 'application/json; Charset=UTF-8'
        }
    });

    let result = await response.json();

    if (!response.ok) {
        showHTTPError(response);
        return;
    }

    if ('error' in result) {
        //showValidationError(result);
        return;
    }

    await reloadAllPlayerCards();
    game.TopCard = card;
    if (game.TopCard.Color == 'Black') {
        game.TopCard.Color = wildcolor;
    }
    checkIfUno(result);
    $('#uno').css('visibility', 'hidden');
}

function checkIfUno(result) {
    for (let indexOfPlayer in game.Players) {
        let player = game.Players[indexOfPlayer];
        if (player.Cards.length == 1) {
            if (indexOfPlayer == 0) {
                unoIsCalled(result);
                updatePlayerCards();
                updateTopCard();
                checkIfThereIsAWinner();
            }
            if (indexOfPlayer == 1) {
                unoIsCalled(result);
                updatePlayerCards();
                updateTopCard();
                checkIfThereIsAWinner();
            }
            if (indexOfPlayer == 2) {
                unoIsCalled(result);
                updatePlayerCards();
                updateTopCard();
                checkIfThereIsAWinner();
            }
            if (indexOfPlayer == 3) {
                unoIsCalled(result);
                updatePlayerCards();
                updateTopCard();
                checkIfThereIsAWinner();
                }
                // unoIsCalled(result);
                // updatePlayerCards();
                // updateTopCard();
                // checkIfThereIsAWinner();
            } else {
                setNextPlayer(result.Player);
                updatePlayerCards();
                updateTopCard();
                checkIfThereIsAWinner();
            }
        }
    }

    function unoIsCalled() {
        $('#uno').css('visibility', 'visible');
        $('#call-uno').on('click', setTimeout(callUno, 3000));
    }

    function callUno(result) {
        $('#logo').addClass('roll-out-left').delay(500);
        setTimeout(getRidOfUnoButton, 500);
        setNextPlayer(result.Player);
    }

    function getRidOfUnoButton() {
        if ($('#uno').css('visibility', 'visible')) {
            $('#uno').css('visibility', 'hidden');
            $('#logo').removeClass('roll-out-left');
        }
    }

    function checkIfThereIsAWinner() {
        for (let indexOfPlayer in game.Players) {
            let player = game.Players[indexOfPlayer];
            if (player.Cards.length == 0) {
                if (indexOfPlayer == 0) {
                    $('#winner-player-0 .modal-title').text('Congratulations ' + player.Player);
                    $('#winner-player-0').modal();
                }
                if (indexOfPlayer == 1) {
                    $('#winner-player-1 .modal-title').text('Congratulations ' + player.Player);
                    $('#winner-player-1').modal();
                }
                if (indexOfPlayer == 2) {
                    $('#winner-player-2 .modal-title').text('Congratulations ' + player.Player);
                    $('#winner-player-2').modal();
                }
                if (indexOfPlayer == 3) {
                    $('#winner-player-3 .modal-title').text('Congratulations ' + player.Player);
                    $('#winner-player-3').modal();
                }
            }
        }
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
            $playerName = $('#player-' + indexOfPlayer),
            $playerWithCards = $('#player-cards-' + indexOfPlayer);

        $('.player').css('font-weight', 'normal');
        $('.col-6').css('opacity', '50%');
        $('.player').css('color', 'white');

        $playerName.css('font-weight', 'bold');
        $playerWithCards.css('opacity', '100%');
        //$playerName.css('color','#ffdd00');
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

    $('#winner-0-form').on('click', function () {
        $('#winner-player-0').modal('hide');
        window.location.reload;
    });

    $('#winner-1-form').on('click', function () {
        $('#winner-player-1').modal('hide');
        window.location.reload;
    });

    $('#winner-2-form').on('click', function () {
        $('#winner-player-2').modal('hide');
        window.location.reload;
    });

    $('#winner-3-form').on('click', function () {
        $('#winner-player-3').modal('hide');
        window.location.reload;
    });

    $(document).on('click', '.hand-card', function () {
        let $clickedCard = $(this),
            indexOfClickedPlayer = $clickedCard.data('player'),
            indexOfClickedCard = $clickedCard.data('card'),
            player = game.Players[indexOfClickedPlayer],
            card = player.Cards[indexOfClickedCard];

        if (game.NextPlayer != player.Player) {
            $clickedCard.addClass("shake-horizontal");
            return;
        }

        if (card.Color != 'Black' && card.Value != game.TopCard.Value && card.Color != game.TopCard.Color) {
            $clickedCard.addClass("shake-horizontal");
            return;
        }

        if (card.Color == 'Black') {
            $('#chooseColor').modal();
            getChosenColorFromModal(card);
        }

        if (card.Value == game.TopCard.Value || card.Color == game.TopCard.Color) {
            let wildcolor = "";
            $clickedCard.addClass("bounce-out-top");
            playCard(wildcolor, card);
        }
    });

    document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
        evt.preventDefault();
        $('#playerNames').modal('hide');

        let { name1, name2, name3, name4 } = saveNamesFromModalDialog();

        showNamesOnPlaymat(name1, name2, name3, name4);

        startGame();
    });

    $('#draw-card img').on('click', drawCard);

    $('#uno').css('visibility', 'hidden');

    $('#playerNames').modal();

//startGame();