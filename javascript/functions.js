// Tom Lancaster & Pat Rademacher (c) 2020
// Batter On Deck
// functions.js

function searchByPlayerName(event){
   clearPlayerInfo();
   var inputPlayer = document.getElementById('getPlayer').value;
   console.log(inputPlayer);
   fetchPlayerInfo(inputPlayer);
   event.preventDefault();
}

function fetchPlayerInfo(name){

    var urlName = convertToURlName(name);

    fetch(`https://mlb-data.p.rapidapi.com/json/named.search_player_all.bam?active_sw='Y'&sport_code='mlb'&name_part='${urlName}'`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "mlb-data.p.rapidapi.com",
		"x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5"
	}
    })
    .then(response => {
      return response.json();
    })
    .then(function(data){
            console.log("data", data)

            if(data.search_player_all.queryResults.totalSize == 0){
              var i = Math.floor(Math.random() * 4) + 1;
              console.log("random # = " + i);
              var missing = ["1.jpg", "2.jpg", "3.jpg", "4.jpg"];
              console.log("missing[i+1] = " + missing[i+1]);
              var html = `<h1 id="name">Player Does Not Exist.</h1>
                          <br>
                          <br>
                          <img src="images/missing/${missing[i+1]}" id="missing" alt="Player Does Not Exist">`;
              document.getElementById('nameResult').innerHTML = html;
            }
  
            //INSERT CODE HERE
            const id = data.search_player_all.queryResults.row.player_id;
            const name = data.search_player_all.queryResults.row.name_display_first_last;
            const position = data.search_player_all.queryResults.row.position;
    
            const player = `<h1 id="name">${name} - ${position}</h1>`;

            console.log(name);
            console.log(position);
    
            document.getElementById('nameResult').innerHTML = player;
    })
    .catch(err => {
      console.log(err);
    });
  }

  // Searches inputted player when user presses "Enter"
  // https://stackoverflow.com/questions/12955222/how-to-trigger-html-button-when-you-press-enter-in-textbox
  document.querySelector("#nameResult").addEventListener("keyup", event => {
    if(event.key !== "Enter") return; // Use `.key` instead.
    document.querySelector("#nameResult").click(); // Things you want to do.
    event.preventDefault(); // No need to `return false;`.
});

function convertToURlName(inputName){
    var urlName = inputName.toLowerCase().trim().replace(' ', '+');
    console.log(urlName);
    return urlName;
}

function clearPlayerInfo(){
  document.getElementById('nameResult').innerHTML = "";
}

function playerDoesNotExist(){
  var i = Math.floor(Math.random() * 4) + 1;
  console.log("random # = " + i);
  var missing = ["1.jpg", "2.jpg", "3.jpg", "4.jpg"];
  console.log("missing[i+1] = " + missing[i+1]);
  var img = `<h1 id="name">Player Does Not Exist.</h1>
                <br>
                <br>
                <img src="images/missing/${missing[i+1]} id="missing" alt="Player Does Not Exist.">`;

  return img;
}
  
function fetchPlayerByID(id){

    fetch(`https://mlb-data.p.rapidapi.com/json/named.player_info.bam?sport_code='mlb'&player_id='${id}'`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "mlb-data.p.rapidapi.com",
        "x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5"
      }
    })
    .then(response => {
      return response.json();
    })
    .then(function(data){
            console.log("data", data)
  
            //INSERT CODE HERE
            const id = data.player_info.queryResults.row.player_id;
            const name = data.player_info.queryResults.row.name_display_first_last;
            const position = data.player_info.queryResults.row.primary_position_txt;
    
            const html = `<li>${id}-${name}-${position}</li>`;

            console.log(name);
            console.log(position);
    
            document.getElementById('results').insertAdjacentHTML('beforebegin', html);
    })
    .catch(err => {
      console.log(err);
    });
  } 

var retiredPlayers = ["greg maddux",  "pedro martinez", "john smoltz", 
"damon","johnson",  "rivera",
"martinez", "bench", "gehrig", 
"hornsby", "wagner", "schmidt",
  "williams", "mays", "ruth"];



var activePlayers = ["Mike Trout", "Mookie Betts", "Alex Bregman",
"Aroldis Chapman", "Francisco Lindor", "Jacob deGrom",
"Buster Posey", "Jose Altuve", "Freddie Freeman",
"Giancarlo Stanton"];


