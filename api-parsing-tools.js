import fetch from 'node-fetch';

const riotKey = '';

async function getNAChallengers() { //return all summoner names from challenger players
    // set up api call
    let APICallString = 'https://na1.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/I?page=1&api_key=';
    APICallString += riotKey;

    let response = await fetch(APICallString);
    response = await response.json(); // we fetched an array of json objects from riot api

    let list = [];

    for (var i = 0; i < response.length; i++) { // iterate through each js object and push into array
        list[i] = response[i].summonerName;
    }

    return list;
}

async function retrievePUUID(summonerName) { // retrieve a puuid given a summoner name
    let APICallString = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + riotKey;

    let response = await fetch(APICallString);
    response = await response.json();

    return response.puuid;
}

async function getMatchHistory(summonerPUUID, n) { // return list of match IDs from recent match history of n size
    let APICallString = 'https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/' + summonerPUUID + '/ids?start=0&count=' + n + '&api_key=' + riotKey;

    let response = await fetch(APICallString);
    response = await response.json();

    let list = [];

    for (var i = 0; i < response.length; i++) {
        list[i] = response[i];
    }

    return list;
}

// requires queueId which is a key/value attribute pair from match data retrieved from a match id
function getMatchMode(queueId) { // given a queueId from match data, returns the name of the queue type
    let queueType = '';

        switch(queueId) {
            case 450: 
                queueType = 'ARAM'; break;
            case 830: 
            case 840:
            case 850:
                queueType = 'Bots'; break;
            case 700:
                queueType = 'Clash'; break;
            case 400:
            case 430:
                queueType = 'Normals'; break;
            case 420:
                queueType = 'Ranked Solo'; break;
            case 440: 
                queueType = 'Ranked 5:5 Flex'; break;
            case 0:
                queueType = 'Custom Game'; break;
            default: console.log('undefined queue type at game ' + i + ' of match history'); break;
        }

    return queueType;
}

async function getSummonerName(puuid) { // given a users puuid, return the username
    let APICallString = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/' + puuid + '?api_key=' + riotKey;
    let response = await fetch(APICallString);
    response = await response.json();
    return response.name;
}

async function getParticipants(matchID) {
// participants are displayed as blue side players first then red side players in champion select order
}

(async () => {
    // example of how we use getNAChallengers():
    let challSummonerNames = [];
    var promise = getNAChallengers().then(
        function(data)  {challSummonerNames = data; console.log('successfully pushed chall name list')},
        function(error) {console.log('error in calling chall summNames')}
    );
    await promise;
    // at this point js var "challSummonerNames" holds all challenger summonerNames
    // console.log(challSummonerNames);

    // example of how we use retrievePUUID() function: 
    const name = 'Kuhz';
    var puuid = '';
    promise = retrievePUUID(name).then(
        function(data) {puuid = data; console.log('success in retrieving puuid')},
        function(error) {console.log('error in puuid call for ' + name)}
    );
    await promise;
    // at this point our puuid const variable has the puuid for 'Kuhz'
    // console.log(puuid);

    // example of how to use getMatchHistory() function
    let matchHistory = [];
    promise = getMatchHistory(puuid, 10).then( // second parameter is number of games between 1 - 100
        function(data) {matchHistory = data; console.log('success in calling match history')},
        function(error) {console.log('error in retrieving match history')}
    );
    await promise;
    // at this point the matchHistory array should hold the 1-100 most recent match IDs for the puuid provided
    //console.log(matchHistory);

    // example of getSummonerName
    let testName = '';
    promise = getSummonerName(puuid).then(
        function(data) {testName = data; console.log('success in calling name from puuid')},
        function(error) {console.log('error in retrieving name from puuid')}
    );
    await promise;
    // testName holds 'Kuhz'
    //console.log(testName);
    })();