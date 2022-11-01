const riotKey = 'RGAPI-405d2658-0116-4c67-8dc6-61944946ed47';

function challLadderElem(summonerName, points) {
    this.summonerName = summonerName;
    this.points = points;
}

async function test() {
    var summonerName = "test";
    let ppuid = "test";
    summonerName = document.getElementById("4").value;
    ppuid = await retrievePUUID(summonerName);
    document.getElementById("1").innerHTML = summonerName;
    let player = [];
    player = await getSummonerRankInfo(summonerName);
    var soloqRankInt;
    for(var j = 0; j < player.length; j++){
        if(player[j].queueType === 'RANKED_SOLO_5x5'){
            soloqRankInt = j;
        }
    }
    switch (player[soloqRankInt].tier) {
        case "CHALLENGER":
            document.getElementById("2").src = "Resources\\Emblem_Challenger.png";
            break;
        case "GRANDMASTER":
            document.getElementById("2").src = "Resources\\Emblem_Grandmaster.png";
            break;
        case "MASTER":
            document.getElementById("2").src = "Resources\\Emblem_Master.png";
            break;
        case "DIAMOND":
            document.getElementById("2").src = "Resources\\Emblem_DIAMOND.png";
            break;
        case "PLATINUM":
            document.getElementById("2").src = "Resources\\Emblem_Platinum.png";
            break;
        case "GOLD":
            document.getElementById("2").src = "Resources\\Emblem_Gold.png";
            break;
        case "SILVER":
            document.getElementById("2").src = "Resources\\Emblem_Silver.png";
            break;
        case "BRONZE":
            document.getElementById("2").src = "Resources\\Emblem_Bronze.png";
            break;
        case "IRON":
            document.getElementById("2").src = "Resources\\Emblem_Iron.png";
            break;
        default:
    }
    document.getElementById("3").innerHTML = player[soloqRankInt].tier + " " + player[soloqRankInt].rank + " " + player[soloqRankInt].points;
    let matchIDs = [];
    matchIDs = await getMatchHistory(ppuid, 10);
    let matchinfo = [];
    for (var j = 0; j < 10; j++) {
        matchinfo = await parseMatchData(matchIDs[j]);
        for (var i = 0; i < 10; i++) {
            if (matchinfo.players[i].puuid === ppuid) {
                if (matchinfo.players[i].gameWon) {
                    document.getElementById((j+5).toString()).innerHTML = "Win" + " " + matchinfo.queue + " " + matchinfo.gameDuration + " " + 
                    matchinfo.players[i].championId + " " + matchinfo.players[i].creepScore;
                }
                else {
                    document.getElementById((j+5).toString()).innerHTML = matchinfo.gameDuration + " " + matchinfo.queue + " LOST";
                }
            }
        }
    }
}

async function getNAChallengers() { //return all summoner names from challenger players
    // set up api call
    let APICallString = 'https://na1.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/I?page=1&api_key=';
    APICallString += riotKey;

    let response = await fetch(APICallString);
    response = await response.json(); // we fetched an array of json objects from riot api

    let list = [];

    for (var i = 0; i < response.length; i++) { // iterate through each js object and push into array
        var user = new challLadderElem(response[i].summonerName, response[i].leaguePoints);
        list.push(user);
    }

    return list;
}

async function retrievePUUID(summonerName) { // retrieve a puuid given a summoner name
    let APICallString = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + riotKey;

    let response = await fetch(APICallString);
    response = await response.json();

    console.log(response.puuid);

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

    switch (queueId) {
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

function Player(name, puuid, champId, team, damage, gold, kills, deaths, assists, ctrlWards,
    regWards, items, creepScore, csPerMin, gameWon) {
    this.summonerName = name;
    this.puuid = puuid;
    this.championId = champId;
    this.team = team;
    this.damageToChamps = damage;
    this.gold = gold;
    this.kills = kills;
    this.deaths = deaths;
    this.assists = assists;
    this.controlWards = ctrlWards;
    this.regWards = regWards;
    this.items = items;
    this.creepScore = creepScore;
    this.csPerMin = csPerMin;
    this.gameWon = gameWon;
}

function MatchInfo(queueId, gameDuration, blueBans, redBans, players, teamWon) {
    this.queue = getMatchMode(queueId);
    this.gameDuration = time(gameDuration);
    this.blueBans = blueBans;
    this.redBans = redBans;
    this.players = players; // use players.side to see what team/side they are on
    this.teamWon = teamWon;
}

function time(duration) {
    var time = Math.round(duration / 60) + 'm ' + duration % 60 + 's';
    return time;
}

// getSummonerId and getSummonerDetails work in tandem to retrieve ranked information for
// a given user's summoner name
async function getSummonerId(summonerName) {
    let APICallString = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/' + await retrievePUUID(summonerName) + '?api_key=' + riotKey;
    let response = await fetch(APICallString);
    response = await response.json();
    console.log(response.id);
    return response.id;
}

function Rank(queueType, tier, rank, points, wins, loss) {
    this.queueType = queueType;
    this.tier = tier;
    this.rank = rank;
    this.points = points;
    this.wins = wins;
    this.loss = loss;
}

async function getSummonerRankInfo(summonerName) {
    let APICallString = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + await getSummonerId(summonerName) + '?api_key=' + riotKey;
    let response = await fetch(APICallString);
    response = await response.json();
    let ranked = [];
    for (var i = 0; i < response.length; i++) {
        var elem = response[i];
        var rank = new Rank(elem.queueType, elem.tier, elem.rank, elem.leaguePoints,
            elem.wins, elem.losses);
        ranked.push(rank);
    }
    return ranked;
}

/* important things to note here: champions and items will be stored in their Id numbers for front-end usage
* to match images. I do not think it is worth manually writing out/assigning string names for each id (too many man....)
*/
async function parseMatchData(matchID) {
    let APICallString = 'https://americas.api.riotgames.com/lol/match/v5/matches/' + matchID + '?api_key=' + riotKey;
    let response = await fetch(APICallString);
    response = await response.json();
    //console.log(response);

    let players = [];
    var gameMinutes = response.info.gameDuration / 60;

    for (var i = 0; i < response.info.participants.length; i++) {
        var elem = response.info.participants[i];

        var team = '';
        if (elem.teamId == 100) team = 'blue';
        else team = 'red';

        var items = [elem.item0, elem.item1, elem.item2, elem.item3, elem.item4, elem.item5, elem.item6];
        var cs = elem.totalMinionsKilled + elem.neutralMinionsKilled;

        var player = new Player(elem.summonerName, elem.puuid, elem.championId, team, elem.totalDamageDealtToChampions,
            elem.goldEarned, elem.kills, elem.deaths, elem.assists, elem.visionWardsBoughtInGame, elem.wardsPlaced,
            items, cs, Math.round(cs / gameMinutes * 10) / 10, elem.win);

        players.push(player);
    }

    let sideWon = '';
    if (players && players[0].team == 'blue' && players[0].win == true) sideWon = 'blue';
    else if (players.length == 10 && response.info.gameDuration < 420) sideWon = 'remake';
    else sideWon = 'red';

    let blueBans = [];
    let redBans = [];
    elem = response.info.teams;
    for (var i = 0; i < elem[0].bans.length; i++) {
        blueBans.push(elem[0].bans[i].championId);
    }
    for (var j = 0; j < elem[1].bans.length; j++) {
        redBans.push(elem[1].bans[j].championId);
    }

    var match = new MatchInfo(response.info.queueId, response.info.gameDuration, blueBans,
        redBans, players, sideWon);

    return match;
}

(async () => {

    /*
    //example of how we use getSummonerRankInfo:

    let rankedData;
    var promise = getSummonerRankInfo('Everglowing').then(
        function(data) {rankedData = data; console.log('got ranked data for everglowing')},
        function(error) {console.log('error in pulling ranked data')}
    );
    await promise;
    console.log(rankedData);


    
    //example of how we use parseMatchData:
    
    let match;
    var promise = parseMatchData('NA1_4476492203').then(
        function(data) {match = data; console.log('we got the match data')},
        function(error) {console.log('error in getting match data')}
    );
    await promise;
    console.log(match);

    

    // example of how we use getNAChallengers():
    let challSummonerNames = [];
    var promise = getNAChallengers().then(
        function(data)  {challSummonerNames = data; console.log('successfully pulled chall name list')},
        function(error) {console.log('error in calling chall summNames')}
    );
    await promise;
    console.log(challSummonerNames);

    
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
    console.log(matchHistory);

    // example of getSummonerName
    let testName = '';
    promise = getSummonerName(puuid).then(
        function(data) {testName = data; console.log('success in calling name from puuid')},
        function(error) {console.log('error in retrieving name from puuid')}
    );
    await promise;
    // testName holds 'Kuhz'
    //console.log(testName);
    */

})();