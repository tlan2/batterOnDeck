// Tom Lancaster & Pat Rademacher (c) 2020
// Batter On Deck
// career.js




var team_names_colors = [
  ["Arizona Diamondbacks",[167,30,49],[227,212,173],[0,0,0]], 
  ["Atlanta Braves",   [206,31,67],[22,40,79], [234, 170, 0]],
  ["Baltimore Orioles", [0,0,0], [221, 73, 38],[162,170,173]],
  ["Boston Red Sox", [189, 48, 57], [25,44,85],[255,255,255]],
  ["Chicago Cubs", [204,52,51], [39,59,129],[255,255,255]],
  ["Chicago White Sox", [0,0,0], [196,206,212],[255,255,255]],
  ["Cincinnati Reds", [198,1,31],[0,0,0],[255,255,255]], 
  ["Cleveland Indians", [226,29,56],[26,46,90],[255,255,255]], 
  ["Colorado Rockies", [51,0,111],[0,0,0], [196,206,212]], 
  ["Detroit Tigers", [12,35,64],[250,70,22],[255,255,255]], 
  ["Houston Astros",[30,49,96], [234,110,36], [255,255,255]], 
  ["Kansas City Royals", [23,72,133],[123,178,221],[192,153,90]], 
  ["Los Angeles Angels", [186,0,33],[0,50,99], [196,206,212]], 
  ["Los Angeles Dodgers", [255,255,255],[0,90,156], [239,62,66]], 
  ["Miami Marlins", [30,118,189], [242,103,34], [254,209,7]],  
  ["Milwaukee Brewers", [26, 37, 80], [181, 146, 47], [255, 255, 255]], 
  ["Minnesota Twins", [26,46,90],[211,30,71],[207,172,122]], 
  ["New York Mets", [0,45, 114], [252,89,16],[255,255,255]], 
  ["New York Yankees", [18,36,72], [196,206,211],[255,255,255]], 
  ["Oakland Athletics",[0,56,49],[239,178,30],[255, 255, 255]], 
  ["Philadelphia Phillies",[232,24,40],[40,73,153],[255,255,255]], 
  ["Pittsburgh Pirates",[0,0,0],[253,184,39],[253,184,39]], 
  ["St. Louis Cardinals",[34,32,95],[196,30,58],[254,219,0]], 
  ["San Diego Padres",[30,49,96],[255,255,255],[255,255,255]], 
  ["San Francisco Giants", [0,0,0], [241,91,40],[230,216,175]], 
  ["Seattle Mariners", [24,45,85],[2,93,93],[196,206,211]], 
  ["Tampa Bay Rays",[27,47,91],[143,188,230],[245,209,48]], 
  ["Texas Rangers",[35,57,116],[192,33,38],[255,255,255]],
  ["Toronto Blue Jays", [19,74,142], [29,45,92], [232,41,28]] 
  ["Washington Nationals",[171,30,34],[33,39,89],[255,255,255]]]
var spectrum_of_all = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

function searchByPlayerName(event){
clearPlayerInfo();
spectrum_of_all = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
var inputPlayer = document.getElementById('getPlayer').value;
fetchAllPlayerInfo(inputPlayer);
event.preventDefault();
}

function fetchAllPlayerInfo(name){

var urlName = convertToURlName(name);


fetch(`https://mlb-data.p.rapidapi.com/json/named.search_player_all.bam?active_sw='Y'&sport_code='mlb'&name_part='${urlName}'`, {
"method": "GET",
"headers": {
"x-rapidapi-host": "mlb-data.p.rapidapi.com",
"x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5"
}
})
.then(response => {
// console("response.json() = " + response.json());
return response.json();
})
.then(function(data){
var totalSize = data.search_player_all.queryResults.totalSize;




if(data.search_player_all.queryResults.totalSize == 0){  
fetchRetiredPlayerInfo(urlName);
} else {
  const id = data.search_player_all.queryResults.row.player_id;
  const name = data.search_player_all.queryResults.row.name_display_first_last;
  const position = data.search_player_all.queryResults.row.position;
  const team = data.search_player_all.queryResults.row.team_full;
  for (var q = 0; q < team_names_colors.length; q++){
    if(team == team_names_colors[q][0]){
      for (var r = 0; r < 3; r++){
        spectrum_of_all[r] = team_names_colors[q][r+1];
      }
      break;
    }
  } 
   var filler = 'rgb(' + spectrum_of_all[0]+ ')'; 
   document.head.innerHTML += "<style>\n.row > div[class^='col'] {display: block; height: 120px; padding: 10px 10px; text-align: center; font-family: 'Oleo Script'; font: Oleo Script; font-size: 1.8vw; justify-content: space-between; align-content: space-around; margin-right: auto; margin-left:auto; border: solid 4px" + " rgb(" + spectrum_of_all[1]+");}</style>";
   document.getElementById("stats").style.backgroundColor = 'rgb(' + spectrum_of_all[0]+ ')';  
   document.getElementById("stats").style.border = 'solid 20px' + ' rgb(' + spectrum_of_all[1]+ ')';  
   document.getElementById("stats").style.color = 'rgb(' + spectrum_of_all[2]+ ')';  
  const player = `
                  <h1 id="active">${name} - ${position}</h1>
                  <h2 id="active">${team}</h2>
                  <br>`;
                  document.getElementById('home').innerHTML = player;

  fetchPlayerCareerStats(id, position);
}

})
.catch(err => {
console.log(err);
});
}


function fetchRetiredPlayerInfo(urlName){
// Returns RETIRED players PERSONAL info including ID
//var spectrum_of_all = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

fetch(`https://mlb-data.p.rapidapi.com/json/named.search_player_all.bam?active_sw='N'&sport_code='mlb'&name_part='${urlName}'`, {
"method": "GET",
"headers": {
"x-rapidapi-host": "mlb-data.p.rapidapi.com",
"x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5"
}
})
.then(response => {
return response.json();
})
.then(function (retiredData){
var totalSize = retiredData.search_player_all.queryResults.totalSize;

if(totalSize == "0"){
document.getElementById('home').innerHTML = playerDoesNotExist();
const id = retiredData.search_player_all.queryResults.row['0'].player_id;
const name = retiredData.search_player_all.queryResults.row['0'].name_display_first_last;
const position = retiredData.search_player_all.queryResults.row['0'].position;
const team = retiredData.search_player_all.queryResults.row['0'].team_full;

return;

} else if(totalSize > 1){

const id = retiredData.search_player_all.queryResults.row['0'].player_id;
const name = retiredData.search_player_all.queryResults.row['0'].name_display_first_last;
const position = retiredData.search_player_all.queryResults.row['0'].position;
const team = retiredData.search_player_all.queryResults.row['0'].team_full;

const player = `
          <h1 id="retired">${name} - ${position}</h1>
          <h2 id="retired">${team}</h2>
          <br>`;



document.getElementById('home').innerHTML = player;
fetchPlayerCareerStats(id, position);

} else {

const id = retiredData.search_player_all.queryResults.row.player_id;
const name = retiredData.search_player_all.queryResults.row.name_display_first_last;
const position = retiredData.search_player_all.queryResults.row.position;
const team = retiredData.search_player_all.queryResults.row.team_full;

for (var q = 0; q < team_names_colors.length; q++){
if(team == team_names_colors[q][0]){
for (var r = 0; r < 3; r++){
spectrum_of_all[r] = team_names_colors[q][r+1];
}
break;
}
} 
var filler = 'rgb(' + spectrum_of_all[0]+ ')'; 
document.head.innerHTML += "<style>\n.row > div[class^='col'] {display: block; height: 120px; padding: 5px 5px; text-align: center; font-family: 'Oleo Script'; font: Oleo Script; font-size: 1.8vw; justify-content: space-between; align-content: space-around; margin-right: auto; margin-left:auto; border: solid 4px" + " rgb(" + spectrum_of_all[1]+");}</style>";
document.getElementById("stats").style.backgroundColor = 'rgb(' + spectrum_of_all[0]+ ')';  
document.getElementById("stats").style.border = 'solid 20px' + ' rgb(' + spectrum_of_all[1]+ ')';  
document.getElementById("stats").style.color = 'rgb(' + spectrum_of_all[2]+ ')';  

const player = `
          <h1 id="retired">${name} - ${position}</h1>
          <h2 id="retired">${team}</h2>
          <br>`;

document.getElementById('home').innerHTML = player;
document.getElementById('home').innerHTML = player;

fetchPlayerCareerStats(id, position);
}



})
.catch(err => {
console.log(err);
});
}

function fetchPlayerCareerStats(id, position){
// Fetches player's CAREER REGULAR SEASON STATS
if(position == "P"){
fetch(`https://mlb-data.p.rapidapi.com/json/named.sport_career_pitching.bam?player_id='${id}'&league_list_id='mlb'&game_type='R'`, {
"method": "GET",
"headers": {
"x-rapidapi-host": "mlb-data.p.rapidapi.com",
"x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5"
}
})
.then(response => {
return response.json();
})
.then(function(careerData){

const games = careerData.sport_career_pitching.queryResults.row.g;
const wins = careerData.sport_career_pitching.queryResults.row.w;
const losses = careerData.sport_career_pitching.queryResults.row.l;
const winPct = careerData.sport_career_pitching.queryResults.row.wpct;
const era = careerData.sport_career_pitching.queryResults.row.era;
const gamesStarted = careerData.sport_career_pitching.queryResults.row.gs;
const completeGames = careerData.sport_career_pitching.queryResults.row.cg;
const shutouts = careerData.sport_career_pitching.queryResults.row.sho;
const onBasePlusSlugging = careerData.sport_career_pitching.queryResults.row.ops;
const battingAvg = careerData.sport_career_pitching.queryResults.row.avg;
const kPer9 = careerData.sport_career_pitching.queryResults.row.k9;
const strikeOuts = careerData.sport_career_pitching.queryResults.row.so;
const innningsPitched = careerData.sport_career_pitching.queryResults.row.ip;
const runsPer9 = careerData.sport_career_pitching.queryResults.row.rs9;

const html = `<div class = "container">
          <div class="row row-grid" >
            <div class="col-lg-3 col-md-3 col-sm-12" id="homeRuns">
              <div class="smaller-font">  
                Games
            </div>
            <div class = "larger-font">
              ${games}
              </div>
          </div>
            <div class="col-lg-3 col-md-3 col-sm-12" id="battingAvg">
            <div class="smaller-font">
              Wins-Losses, Win %
              </div>
              <div font-size="1.5vw"> 
            ${wins}-${losses},${winPct}
            </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12" id="rbi">
              <div class="smaller-font">
              Earned Run Average (ERA)
              </div>
              <div class="larger-font">
            ${era}
            </div>
            

          </div>
        </div>
        <div class="row row-grid">
          <div class="col-lg-3 col-md-3 col-sm-12" id="slg">
          <div class="smaller-font"> 
            On-Base Slugging Pct (SLG)
          </div>
          <div class = "larger-font">
            ${onBasePlusSlugging}
            </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12" id="obp">
              <div class="smaller-font">
           Opponent Batting Avg.
           </div>
           <div class="larger-font">
            ${battingAvg}
            </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12" id="runs">
            <div class="smaller-font">
              Runs per 9 Innings</div>
              <div class="larger-font">
            ${runsPer9}
            </div>
            </div>
            </div>
            <div class="row row-grid">
              <div class="col-lg-3 col-md-3 col-sm-12" id="steals">
              <div class = "smaller-font">
                Gamnes Started (GS)</div>
                <div class = "larger-font">
            ${gamesStarted}
            </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12" id="strikeOuts">
            <div class="smaller-font">
              Complete Games (CG)</div>
            <div class="larger-font">
            ${completeGames}
            </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12 " id="walks">
              <div class = "smaller-font">
              Shutouts (SHO)</div>
             <div class = "larger-font">
            ${shutouts}
            </div>
            </div>
            </div>
            <div class="row row-grid">
              <div class="col-lg-3 col-md-3 col-sm-12" id="steals">
              <div class = "smaller-font">
                Innings Pitched (IP)</div>
                <div class = "larger-font">
            ${innningsPitched}
            </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12 " id="walks">
              <div class = "smaller-font">
              StrikeOuts (SO)</div>
             <div class = "larger-font">
            ${strikeOuts}
            </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12 " id="walks">
              <div class = "smaller-font">
              StrikeOuts Per 9 Innings (Kper9)</div>
             <div class = "larger-font">
            ${kPer9}
            </div>
            </div>
          </div>
          </div>`

document.getElementById('stats').innerHTML = html;              
})
.catch(err => {
console.log(err);
});
} else {
fetch(`https://mlb-data.p.rapidapi.com/json/named.sport_career_hitting.bam?player_id='${id}'&game_type='R'&league_list_id='mlb'`, {
"method": "GET",
"headers": {
"x-rapidapi-host": "mlb-data.p.rapidapi.com",
"x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5"
}
})
.then(response => {
return response.json();
})
.then(function(careerData){

const hr = careerData.sport_career_hitting.queryResults.row.hr;
const avg = careerData.sport_career_hitting.queryResults.row.avg;
const rbi = careerData.sport_career_hitting.queryResults.row.rbi;
const slg = careerData.sport_career_hitting.queryResults.row.slg;
const obp = careerData.sport_career_hitting.queryResults.row.obp;
const r = careerData.sport_career_hitting.queryResults.row.r;
const sb = careerData.sport_career_hitting.queryResults.row.sb;
const so = careerData.sport_career_hitting.queryResults.row.so;
const bb = careerData.sport_career_hitting.queryResults.row.bb;

const html = `<div class = "container">
           <div class="row row-grid" >
            <div class="col-lg-3 col-md-3 col-sm-12" id="homeRuns">
            <div class="smaller-font">  
            Home Runs
            </div>
            <div class = "larger-font">
            ${hr}
          </div>
          </div>
            <div class="col-lg-3 col-md-3 col-sm-12" id="battingAvg">
            <div class="smaller-font">
              Batting Avg.
              </div>
              <div class = "larger-font"> 
              ${avg}
            </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12" id="rbi">
              <div class="smaller-font">
              Runs Batted In (RBI)
              </div>
              <div class="larger-font">
              ${rbi}

              </div>

            </div>
          </div>
          <div class="row row-grid">
            <div class="col-lg-3 col-md-3 col-sm-12" id="slg">
            <div class="smaller-font"> 
              Slugging Pct (SLG)
            </div>
            <div class = "larger-font">
              ${slg}
            </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12" id="obp">
              <div class="smaller-font">
           On Base Pct (OBP)
           </div>
           <div class="larger-font">
              ${obp}
            </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12" id="runs">
            <div class="smaller-font">
              Runs (R)</div>
              <div class="larger-font">
              ${r}
            </div>
          </div>
          </div>
          <div class="row row-grid">
            <div class="col-lg-3 col-md-3 col-sm-12" id="steals">
            <div class = "smaller-font">
              Steals (SB)</div>
              <div class = "larger-font">
              ${sb}
              </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12" id="strikeOuts">
            <div class="smaller-font">
              Strike Outs (SO)</div>
            <div class="larger-font">
              ${so}</div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12 " id="walks">
              <div class = "smaller-font">
              Walks (BB)</div>
             <div class = "larger-font">
              ${bb}
              </div>
            </div>
          </div>
          </div>`

document.getElementById('stats').innerHTML = html;              
})
.catch(err => {
console.log(err);
});
}


}

//============================================================================
//           SUB FUNCTIONS / HELPER FUNCTIONS
//============================================================================

// Searches inputted player when user presses "Enter"
// https://stackoverflow.com/questions/12955222/how-to-trigger-html-button-when-you-press-enter-in-textbox
document.querySelector("#home").addEventListener("keyup", event => {
if(event.key !== "Enter") return; 
document.querySelector("#home").click(); 
event.preventDefault(); 
});

// Converts user's input into url usable form
function convertToURlName(inputName){
var urlName = inputName.toLowerCase().trim().replace(' ', '+');
return urlName;
}

// Clears out all player data on new search
function clearPlayerInfo(){
document.getElementById('home').innerHTML = "";
document.getElementById('stats').innerHTML = "";


}

function playerDoesNotExist(){
var i = Math.floor(Math.random() * 4) + 1;
var missing = ["1.jpg", "2.jpg", "3.jpg", "4.jpg"];

var subheader;
var j = i-1
if(j == 0){
subheader = "<h5 id=\"missing\">This is awkward....</h5>"
} else if(j == 1){
subheader = "<h5 id=\"missing\">Maybe they've gone missing.</h5>"
} else if(j == 2){
subheader = "<h5 id=\"missing\">There are plenty of wannabes out there though.</h5>"
} else if(j == 3){
subheader = "<h5 id=\"missing\">Sorry to break it to you.</h5>"
}
var html = `<br>
<h3 id="missing">Player Does Not Exist.</h3>
<br>
${subheader}
<br>
<img src="images/missing/${missing[i-1]}" id="missingPic" alt="Player Does Not Exist">`;

return html;
}

//============================================================================
//           DEPRECATED?
//============================================================================

function fetchPlayerByID(id){
// Provides ALL PERSONAL info the player including twitter handle

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

const id = data.player_info.queryResults.row.player_id;
const name = data.player_info.queryResults.row.name_display_first_last;
const position = data.player_info.queryResults.row.primary_position_txt;

const html = `<li>${id}-${name}-${position}</li>`;

document.getElementById('results').insertAdjacentHTML('beforebegin', html);
})
.catch(err => {
console.log(err);
});
} 



