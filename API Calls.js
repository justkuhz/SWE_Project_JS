
const riotKey = 'RGAPI-5590e97c-1eef-41f8-824a-7389cf4cfebc';
const sp = '%20';
const fetch = require("node-fetch");

async function getMatchList(accID, champID, queue, endTime, beginTime, endIndex, beginIndex){
    //link building
    let link = 'https://nai.api.riotgames.com/lol/match/v5/matchlists/by-account/' + await accId + '?';
    if(champID != null)
        link+= 'champion=' + champID + '&';
    if(queue != null)
        link+= 'queue=' + queue + '&';
    
}