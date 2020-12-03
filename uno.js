"use strict";

// let names = ["name1", "name2", "name3", "name4"]
// async function post(){
//     let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
//         method: "POST",
//         body: JSON.stringify(names),
//         headers: {
//             "Content-type": "application/json; charset=UTF-8",
//         }
//     });

//     if(response.ok){
//         let result = await response.json();
//         alert(JSON.stringify(result))
//     }
//     else {
//         alert("HTTP-Error: "  + response.status)
//     }
// }
// post();



$('#playerNames').modal()

document.getElementById('playerNamesForm').addEventListener('submit', function(evt){
    console.log("submit")
    evt.preventDefault()
    $('#playerNames').modal('show')
});