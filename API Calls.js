
const userAction = async () => {
    const riotKey = ();
    const response = await fetch ('https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=' + riotKey);
    const myJson = await response.json()
    // do something with the myJson
    console.log(myJson);
}
