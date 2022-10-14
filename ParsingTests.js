import fetch from 'node-fetch';

const riotKey = 'RGAPI-fcc2bf5c-f558-4d5f-9f66-bd5bc16f7890';

async function getNAChallengers(){
    // set up api call
    var APICallString = 'https://na1.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/I?page=1&api_key=';
    APICallString += riotKey;
    
    let response = await fetch(APICallString);
    response = await response.json(); // we fetched an array of json objects from riot api
    
    var summonerNames = [];

    for (var i = 0; i < response.length; i++) { // iterate through each js object and push into array
        summonerNames.push(response[i].summonerName);
    }
    
    for (var i = 0; i < summonerNames.length; i++) { // print all elements in new array
        console.log(summonerNames[i]);
    }
}

getNAChallengers();