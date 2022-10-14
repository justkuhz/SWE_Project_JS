import fetch from 'node-fetch';
const riotKey = 'RGAPI-fcc2bf5c-f558-4d5f-9f66-bd5bc16f7890';
//const fetch = require("node-fetch")
 
var summonerName = 'Kaii99';
var summonerPUUID = 'GNjUAh18xGeIwEO6UOutjJ18EbZgK8od8LvnvmWD87VUej43Dm5uOM8lcnVpPtuDBhxdHj0CUT5Ivg';
var matchID = 'NA1_4459719917';

async function getNAChallengers(){

    let link = 'https://na1.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/I?page=1&api_key=';
    link += riotKey;

    let response = await fetch(link);
    response = await response.json();
    console.log(response);
}

// Will use this function to get the puuid from the names that are given to us in the above^ call.
async function getBasicAccountInfo(summonerName){ // By summonerName

    let link = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + await summonerName + '?api_key=';
    link += riotKey;

    let response = await fetch(link);
    response = await response.json();
    console.log(response);
}
/*async function getBasicAccountInfo(summonerPUUID){ // By PUUID

    let link = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + await summonerPUUID + '?api_key=';
    link += riotKey;

    let response = await fetch(link);
    response = await response.json();
    console.log(response);
}
*/

async function getListOfMatchIDsForAPlayer(summonerPUUID){

    let link = 'https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/' + await summonerPUUID + '/ids?start=0&count=20&api_key=';
    link += riotKey;

    let response = await fetch(link);
    response = await response.json();
    console.log(response);
}
async function getMatchByMatchID(matchID){

    let link = 'https://americas.api.riotgames.com/lol/match/v5/matches/' + await matchID + '?api_key=';
    link += riotKey;

    let response = await fetch(link);
    response = await response.json();
    console.log(response);
}

getNAChallengers() .then 
getBasicAccountInfo(summonerName);
getListOfMatchIDsForAPlayer(summonerPUUID);
getMatchByMatchID(matchID);
getBasicAccountInfo(summonerName);


