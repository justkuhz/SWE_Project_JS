import fetch from 'node-fetch';
const riotKey = '';
//const fetch = require("node-fetch")
 
var summonerName = 'Kaii99';

async function getBasicAccountInfo(SummonerName){

    let link = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + await SummonerName + '?api_key=';
    link += riotKey;

    let response = await fetch(link);
    response = await response.json();
    console.log(response);
}

getBasicAccountInfo(summonerName);

//console.log(summonerName);