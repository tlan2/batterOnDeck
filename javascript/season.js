// Tom Lancaster & Pat Rademacher (c) 2020
// Batter On Deck
// season.js

var team_names_colors = [
  ["Arizona Diamondbacks",[167,25,48],[227,212,173],[0,0,0]], 
  ["Atlanta Braves", [206,17,65], [19, 39, 79], [234,170,0]],
  ["Baltimore Orioles", [223,70,1], [0, 0, 0],[0,0,0]],
  ["Boston Red Sox", [189, 48, 57], [12,35,64],[12,35,64]],
  ["Chicago Cubs", [14,51,134], [204,52,51],[100,100,100]],
  ["Chicago White Sox", [39,37,31], [196,206,212],[255,255,255]],
  ["Cincinnati Reds", [198,1,31],[0,0,0],[0,0,0]], 
  ["Cleveland Indians", [12,35,64],[227,25,55],[255,255,255]], 
  ["Colorado Rockies", [51,0,111], [196,206,212], [0,0,0]], 
  ["Detroit Tigers", [12,35,64],[250,70,22],[100,100,100]], 
  ["Houston Astros",[0,45,98], [235,110,31], [244,145,30]], 
  ["Kansas City Royals", [0,70,135],[189,155,96],[123,178,201]], 
  ["Los Angeles Angels", [0,50,99], [186,0,33], [134,38,51]], 
  ["Los Angeles Dodgers", [0,90,156], [239,62,66], [191,192,191]], 
  ["Miami Marlins", [0,163,224], [239,51,64], [65,116,141]],  
  ["Milwaukee Brewers", [255, 197, 47], [18, 40, 75], [18, 40, 75]], 
  ["Minnesota Twins", [0,43,92],[211,17,69],[185,151,91]], 
  ["New York Mets", [0,45, 114], [252,89,16],[252,89,16]], 
  ["New York Yankees", [18,36,72], [196,206,211],[196,206,211]], 
  ["Oakland Athletics",[0,56,49],[239,178,30],[162,170,173]], 
  ["Philadelphia Phillies",[232,24,40],[0,45,114],[0,45,114]], 
  ["Pittsburgh Pirates",[0,0,0],[253,184,39],[253,184,39]], 
  ["St. Louis Cardinals",[196,30,58],[12,35,64],[254,219,0]], 
  ["San Diego Padres",[47,36,29],[255,196,37],[255,255,255]], 
  ["San Francisco Giants", [253,90,30], [0,0,0],[0,0,0]], 
  ["Seattle Mariners", [12,44,86],[0,92,92],[100,100,100]], 
  ["Tampa Bay Rays",[9,44,92],[143,188,230],[245,209,48]], 
  ["Texas Rangers",[0,50,120],[192,17,31],[100,100,100]],
  ["Toronto Blue Jays", [19,74,142], [29,45,92], [232,41,28]] 
  ["Washington Nationals",[171,0,3],[20,34,90],[100,100,100]]];

function searchByPlayerName(event){
  clearPlayerInfo();
  var inputPlayer = document.getElementById('getPlayer').value;
  console.log(inputPlayer);
  fetchAllPlayerInfo(inputPlayer);
  event.preventDefault();
}

function fetchAllPlayerInfo(name){
 // Retrieve player id, name, position, team

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
       console.log("activePlayerInfo", data);
       var totalSize = data.search_player_all.queryResults.totalSize;
       console.log("Active totalSize = " + data.search_player_all.queryResults.totalSize);

       if(data.search_player_all.queryResults.totalSize == 0){
             console.log("Not active.")
             fetchRetiredPlayerInfo(urlName);
       } else {
                 var spectrum_of_all = [[0,0,0], [0,0,0], [0,0,0]];
                 const id = data.search_player_all.queryResults.row.player_id;
                 const name = data.search_player_all.queryResults.row.name_display_first_last;
                 const position = data.search_player_all.queryResults.row.position;
                 const team = data.search_player_all.queryResults.row.team_full;
                 for (var i = 0; i < team_names_colors.length; i++){
                   if (team == team_names_colors[i][0]){
                     for (var j = 0; j < 3; j++){
                        spectrum_of_all[j] = team_names_colors[i][j+1];}
                        break;
                     }
                    
                     }
                     document.head.innerHTML += "<style>\n.row > div[class^='col'] display: block; height: 120px; padding: 5px 5px; text-align: center; font-family: 'Oleo Script'; font: Oleo Script; font-size: 1.8vw; justify-content: space-between; align-content: space-around; margin-right: auto; margin-left:auto;background-color: rgb(" + spectrum_of_all[0]+"); color:  rgb(" + spectrum_of_all[2]+") border: solid 4px" + " rgb(" + spectrum_of_all[1]+");}</style>";


                   }
                 })
                 var firstYear = data.search_player_all.queryResults.row.pro_debut_date;

                 firstYear = firstYear.substring(0,4);

                 console.log(firstYear)

                 var dropDownList = createDropDownListActive(firstYear);


                 var player = `  <div id = "playerInfo">
                                 <h1 id="active">${name} - ${position}</h1>
                                 <h2 id="active">${team}</h2>
                                  `;

                 console.log(name);
                 console.log(position);
         
                 document.getElementById('nameResult').innerHTML = player + dropDownList;

                 var currentYear = new Date().getFullYear();
                 fetchTeamsFromYear(currentYear.toString())
                 fetchPlayerSeasonStats(id, position, currentYear.toString());

                 const selectElement = document.getElementById("dropDownList");

                 selectElement.addEventListener('change', (event) => {
                  fetchTeamsFromYear(`${event.target.value}`);
                   fetchPlayerSeasonStats(id, position, `${event.target.value}`);
                 });     
           }     
   })
   .catch(err => {
     console.log(err);
   });
 }



function fetchRetiredPlayerInfo(urlName){
// Returns RETIRED players PERSONAL info including ID

 console.log("retired player fetch.")

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
       console.log("retiredData", retiredData);
       var totalSize = retiredData.search_player_all.queryResults.totalSize;
       console.log("Retired totalSize = " + totalSize);
     
       if(totalSize == "0"){
         console.log("in totalSize condition");
         document.getElementById('nameResult').innerHTML = playerDoesNotExist();
         return;

       } else if(totalSize > 1){
         console.log("More than 1 player with same name.");

         const id = retiredData.search_player_all.queryResults.row['0'].player_id;

         console.log("first id of 2 players = " + id);
         
         fetchPlayerByID(id);

       } else {
         console.log("Retired Player stats retrieval.");

         const id = retiredData.search_player_all.queryResults.row.player_id;
 
         console.log("retired id = " + id);
     
   
         fetchPlayerByID(id);
       }
 
   })
   .catch(err => {
     console.log(err);
   });
 }

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
           console.log("fetchPlayerByID-data", data)


           var spectrum_of_all = [[0,0,0], [0,0,0], [0,0,0]];
           const name = data.player_info.queryResults.row.name_display_first_last;
           const position = data.player_info.queryResults.row.primary_position_txt;
           const team = data.player_info.queryResults.row.team_name;
           const team = data.search_player_all.queryResults.row.team_full;
                 for (var i = 0; i < team_names_colors.length; i++){
                   if (team == team_names_colors[i][0]){
                     for (var j = 0; j < 3; j++){
                        spectrum_of_all[j] = team_names_colors[i][j+1];}
                        break;
                     }
                    
                     }
                     document.head.innerHTML += "<style>\n.row > div[class^='col'] display: block; height: 120px; padding: 5px 5px; text-align: center; font-family: 'Oleo Script'; font: Oleo Script; font-size: 1.8vw; justify-content: space-between; align-content: space-around; margin-right: auto; margin-left:auto;background-color: rgb(" + spectrum_of_all[0]+"); color:  rgb(" + spectrum_of_all[2]+") border: solid 4px" + " rgb(" + spectrum_of_all[1]+");}</style>";
           var firstYear = data.player_info.queryResults.row.pro_debut_date;
           var lastYear = data.player_info.queryResults.row.end_date;
           firstYear = firstYear.substring(0,4);
           lastYear = lastYear.substring(0,4);

           console.log("retired-firstYear = " + firstYear);
           console.log("retired-lastYear = " + lastYear);
           console.log(typeof firstYear);
           console.log(typeof lastYear);
   
           const html = `<h1 id="retired">${name} - ${position}</h1>
                         <h2 id="retired">${team}</h2>
                         `;

           var dropDownList = createDropDownListRetired(firstYear, lastYear);
   
           document.getElementById('nameResult').innerHTML = html + dropDownList;

           fetchTeamsFromYear(lastYear);
           fetchPlayerSeasonStats(id, position, lastYear);

           const selectElement = document.getElementById("dropDownList");
           selectElement.addEventListener('change', (event) => {
             fetchTeamsFromYear(`${event.target.value}`);
             fetchPlayerSeasonStats(id, position, `${event.target.value}`);
           });
   })
   .catch(err => {
     console.log(err);
   });
 } 


function fetchPlayerSeasonStats(id, position, year){
// Fetches player's SEASON REGULAR SEASON STATS
console.log("position = " + position);

if(position == "P"){
 console.log("PITCHER season stats");
 fetch(`https://mlb-data.p.rapidapi.com/json/named.sport_pitching_tm.bam?season='${year}'&player_id='${id}'&league_list_id='mlb'&game_type='R'`, {
         "method": "GET",
         "headers": {
         "x-rapidapi-host": "mlb-data.p.rapidapi.com",
         "x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5"
 }
 })
 .then(response => {
   return response.json();
 })
 .then(function(seasonData){
         console.log("PITCHER seasonData", seasonData)

         document.getElementById('stats').innerHTML = "";

         const games = seasonData.sport_pitching_tm.queryResults.row.g;
         const wins = seasonData.sport_pitching_tm.queryResults.row.w;
         const losses = seasonData.sport_pitching_tm.queryResults.row.l;
         const winPct = seasonData.sport_pitching_tm.queryResults.row.wpct;
         const era = seasonData.sport_pitching_tm.queryResults.row.era;
         const gamesStarted = seasonData.sport_pitching_tm.queryResults.row.gs;
         const completeGames = seasonData.sport_pitching_tm.queryResults.row.cg;
         const shutouts = seasonData.sport_pitching_tm.queryResults.row.sho;
         const onBasePlusSlugging = seasonData.sport_pitching_tm.queryResults.row.ops;
         const battingAvg = seasonData.sport_pitching_tm.queryResults.row.avg;
         const kPer9 = seasonData.sport_pitching_tm.queryResults.row.k9;
         const strikeOuts = seasonData.sport_pitching_tm.queryResults.row.so;
         const innningsPitched = seasonData.sport_pitching_tm.queryResults.row.ip;
         const runsPer9 = seasonData.sport_pitching_tm.queryResults.row.rs9;

         const html = `<div class="row">
                         <div class="col-sm-4" id="games">
                           Games
                           <br>
                           <br>
                           ${games}
                         </div>
                         <div class="col-sm-4" id="wpct">
                           Wins-Losses, Winning Pct
                           <br> 
                           <br>
                           ${wins}-${losses}-${winPct}
                         </div>
                         <div class="col-sm-4" id="era">
                           Earned Run Average (ERA)
                           <br>
                           <br>
                           ${era}
                         </div>
                       </div>
                       <div class="row">
                         <div class="col-sm-4" id="ops">
                           On-base Slugging Pct
                           <br>
                           <br>
                           ${onBasePlusSlugging}
                         </div>
                         <div class="col-sm-4" id="avg">
                           Opponent Batting Avg. (AVG)
                           <br>
                           <br>
                           ${battingAvg}
                         </div>
                         <div class="col-sm-4" id="runsPer9">
                           Runs Per 9-Innings (rs9)
                           <br>
                           <br>
                           ${runsPer9}
                         </div>
                       </div>
                       <div class="row">
                         <div class="col-sm-4" id="games">
                           Games Started (GS)
                           <br>
                           <br>
                           ${gamesStarted}
                         </div>
                         <div class="col-sm-4" id="completeGames">
                           Complete Games (CG)
                           <br>
                           <br>
                           ${completeGames}
                         </div>
                         <div class="col-sm-4" id="shutOuts">
                           Shut Outs (SHO)
                           <br>
                           <br>
                           ${shutouts}
                         </div>
                       </div>
                         <div class="row">
                         <div class="col-sm-4" id="inningsPitched">
                           Innings Pitched (IP)
                           <br>
                           <br>
                           ${innningsPitched}
                         </div>
                         <div class="col-sm-4" id="strikeOuts">
                           Strike Outs (SO)
                           <br>
                           <br>
                           ${strikeOuts}
                         </div>
                         <div class="col-sm-4" id="kPer9">
                           Strike Outs Per 9-Innings (k9)
                           <br>
                           <br>
                           ${kPer9}
                         </div>
                       </div>`
         
       document.getElementById('stats').innerHTML = html;              
 })
 .catch(err => {
   console.log(err);
 });
} else {
   console.log("HITTER season stats");
   fetch(`https://mlb-data.p.rapidapi.com/json/named.sport_hitting_tm.bam?season='${year}'&player_id='${id}'&league_list_id='mlb'&game_type='R'`, {
         "method": "GET",
         "headers": {
         "x-rapidapi-host": "mlb-data.p.rapidapi.com",
         "x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5"
 }
   })
   .then(response => {
     return response.json();
   })
   .then(function(seasonData){
           console.log("HITTER seasonData", seasonData)

           document.getElementById('stats').innerHTML = "";

           const hr = seasonData.sport_hitting_tm.queryResults.row.hr;
           const avg = seasonData.sport_hitting_tm.queryResults.row.avg;
           const rbi = seasonData.sport_hitting_tm.queryResults.row.rbi;
           const slg = seasonData.sport_hitting_tm.queryResults.row.slg;
           const obp = seasonData.sport_hitting_tm.queryResults.row.obp;
           const r = seasonData.sport_hitting_tm.queryResults.row.r;
           const sb = seasonData.sport_hitting_tm.queryResults.row.sb;
           const so = seasonData.sport_hitting_tm.queryResults.row.so;
           const bb = seasonData.sport_hitting_tm.queryResults.row.bb;

           const html = `<div class="row">
                           <div class="col-sm-4" id="homeRuns">
                             Home Runs
                             <br>
                             <br>
                             ${hr}
                           </div>
                           <div class="col-sm-4" id="battingAvg">
                             Batting Avg.
                             <br>
                             <br>
                             ${avg}
                           </div>
                           <div class="col-sm-4" id="rbi">
                             Runs Batted In (RBI)
                             <br>
                             <br>
                             ${rbi}
                           </div>
                         </div>
                         <div class="row">
                           <div class="col-sm-4" id="slg">
                             Slugging Pct (SLG)
                             <br>
                             <br>
                             ${slg}
                           </div>
                           <div class="col-sm-4" id="obp">
                             On Base Pct (OBP)
                             <br>
                             <br>
                             ${obp}
                           </div>
                           <div class="col-sm-4" id="runs">
                             Runs (R)
                             <br>
                             <br>
                             ${r}
                           </div>
                         </div>
                         <div class="row">
                           <div class="col-sm-4" id="steals">
                             Steals (SB)
                             <br>
                             <br>
                             ${sb}
                           </div>
                           <div class="col-sm-4" id="strikeOuts">
                             Strike Outs (SO)
                             <br>
                             <br>
                             ${so}
                           </div>
                           <div class="col-sm-4" id="walks">
                             Walks (BB)
                             <br>
                             <br>
                             ${bb}
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

// ENTER button functionality
// Searches for inputted player when user presses "Enter"
// https://stackoverflow.com/questions/12955222/how-to-trigger-html-button-when-you-press-enter-in-textbox
 document.querySelector("#nameResult").addEventListener("keyup", event => {
   if(event.key !== "Enter") return; // Use `.key` instead.
   document.querySelector("#nameResult").click(); // Things you want to do.
   event.preventDefault(); // No need to `return false;`.
});

function convertToURlName(inputName){
   var urlName = inputName.toLowerCase().trim().replace(' ', '+');
   // console.log(urlName);
   return urlName;
}

function createDropDownListActive(startYear){
   var firstYear = parseInt(startYear);
   var currentYear = new Date().getFullYear();
   var yearDiff = currentYear - firstYear;
   console.log(yearDiff);
   
   var html = `<div id="dropDownList">
                 <label for="season">Season:
                 <br>
                 <select id="season">`; //onchange="refetchSeasonStats(this.value);"

   for(i=currentYear; i >= firstYear; i--){
     console.log(i);
     var option = `
                   <option value="${i}">
                   <label for="${i}">${i}</label>
                   </option>
                   `;
     html += option;
   }

   html = html + `       </select>
                       </label>
                     </div>
                   </div>`;
   return html;
}

function createDropDownListRetired(startYear, endYear){
 var firstYear = parseInt(startYear);
 var lastYear = parseInt(endYear);
 var yearDiff = lastYear - firstYear;
 console.log("Total # of years played: " + yearDiff);
 
 var html = `<div id="dropDownList">
               <label for="season">Season:
               <br>
               <select id="season">`;

 for(i=lastYear; i >= firstYear; i--){
   console.log(i);
   var option = `
                 <option value="${i}">
                 <label for="${i}">${i}</label>
                 </option>
                 `;
   html += option;
 }

 html = html + `       </select>
                     </label>
                   </div>
                 </div>`;
 return html;
}


function clearPlayerInfo(){
 document.getElementById('nameResult').innerHTML = "";
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



//#############################################################
//# Pat's Attempt at Rating System - Not Currently Working
//#############################################################

// function refetchSeasonStats(year){

//   fetchPlayerSeasonStats(id, position, year);
// }

// function addInfoToFile(id, position){
//   const fs = require('fs');
 
//   var info = id + "," + position;

//   fs.writeFile('currentPlayerOnScreen.txt', info, (err) => { 
     
//       console.log("Wrote to file successfully.");
//     // In case of a error throw err. 
//     if (err) throw err; 
// }) 
// }

// function pullInfoFromFile(){
//   const fs = require('fs')
//   fs.readFile('currentPlayerOnScreen.txt', 'utf-8', (err, data) => { 
//     if (err) throw err; 
 
//     // Converting Raw Buffer to text 
//     // data using tostring function. 
//     console.log(data); 
//     return data;
// }) 
// }

/*
function fetchTeamsFromYear(year){
  console.log("yearrrrrrr = " + year);
  fetch(`https://mlb-data.p.rapidapi.com/json/named.team_all_season.bam?sport_code='mlb'&all_star_sw='N'&sort_order={sort_order}&season='${year}'`, {
         "method": "GET",
         "headers": {
         "x-rapidapi-host": "mlb-data.p.rapidapi.com",
         "x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5"
 }
 })
 .then(response => {
   return response.json();
 })
 .then(function(teams){
   console.log('TEAMS ', teams);
   var numberOfTeams = teams.team_all_season.queryResults.totalSize;
   var allTeams = [];
   var batterIds = [];
   var pitcherIds = [];
   for (var i = 0; i < numberOfTeams; i++){
     allTeams.push(teams.team_all_season.queryResults.row[i].team_id);
 
   }
   console.log('TEAM_LIST', allTeams);
   fetchRosterFromTeams(allTeams, year);

  })
  .catch(err => {
    console.log(err);
  });
}

function fetchRosterFromTeams(team_ids, year){
  var team_id;
  var total_p= [0,0,0,0,0,0,0,0,0,0,0,0,0];
  var total_b = [0,0,0,0,0,0,0,0];
  var npitchers = 0;
  var nbatters = 0;
  var pitchers;
  var batters;
  var tracker = team_ids.length;
  for (var g = 0; g < tracker; g++){
    var numberOfPlayers = 0;
    team_id = team_ids[g];
    var playerInformation = [];
    var pitchers = new Array();
    var batters = new Array();
    pitchers.length = 0;
  batters.length = 0;
  
  console.log('team_id = ' + team_id);
  fetch(`https://mlb-data.p.rapidapi.com/json/named.roster_team_alltime.bam?start_season='${year}'&end_season='${year}'&team_id='${team_id}'`,{
         "method": "GET",
         "headers": {
         "x-rapidapi-host": "mlb-data.p.rapidapi.com",
         "x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5" 
  }
})
.then(response => {
  return response.json();
})
.then(function(rosters){
  console.log('ROSTERS ', rosters);
  var a = rosters.roster_team_alltime.queryResults.totalSize;
  a = parseInt(a);
  numberOfPlayers = a;
  console.log('AHHHHHHHH' + parseInt(numberOfPlayers));

  
  
  for (var j = 0; j < numberOfPlayers; j++){
    var c = rosters.roster_team_alltime.queryResults.row[j].player_id;
    var d = rosters.roster_team_alltime.queryResults.row[j].primary_position;
    console.log('c ' + c + ' ' + j);
    console.log('d ' + d + ' ' + j);
    if (d == 'P'){
      pitchers.push([c,d]);
      npitchers = parseInt(npitchers) + 1;}
      else{batters.push([c, d]);
      nbatters = parseInt(nbatters) + 1;}
  }

  
    var y = [];
    for (var q = 0; q < batters.length; q++){
      //var y = fetchOtherPlayerSeasonStats(batters[q][0], batters[q][1], year);
      //for (var h = 0; h < 8; h++){
       // total_b[h] += y[h];
      }
      console.log('yyyyy' + batters);

    var count = 0;
    var countt = 1;
    if (g == tracker-1){
      var array = [];
    for (var u = 0; u < pitchers.length/2; u++){
      array.push(fetchOtherPlayerSeasonStats(pitchers[count], pitchers[countt], year));
      count = count + 2;
      countt = countt + 2;}
      //console.log("zzzz"+pitchers.length);
     // for (var h = 0; h < 13; h++){
     //   total_p[h] += z[h];
      }
      console.log("zzzz"+array);

    

    for (var u = 0; u < total_p.length; u++){
      total_p[u] = total_p[u]/npitchers;
      }
      for (var u = 0; u < total_b.length; u++){
        total_b[u] = total_b[u]/nbatters;
      }
      console.log(total_p);
      console.log(total_b);
    })}}

  function fetchOtherPlayerSeasonStats(id, position, year){
    
    console.log("o position = " + position);
    var all_the_data;
    if(position == "P"){
     console.log("PITCHER season stats");
     fetch(`https://mlb-data.p.rapidapi.com/json/named.sport_pitching_tm.bam?season='${year}'&player_id='${id}'&league_list_id='mlb'&game_type='R'`, {
             "method": "GET",
             "headers": {
             "x-rapidapi-host": "mlb-data.p.rapidapi.com",
             "x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5"
     }
     })
     .then(response => {
       return response.json();
     })
     .then(function(otherSeasonData){
             console.log("PITCHER seasonData", otherSeasonData)
             var all_the_data = [];
     
             const games = otherSeasonData.sport_pitching_tm.queryResults.row.g;
             const wins = otherSeasonData.sport_pitching_tm.queryResults.row.w;
             const losses = otherSeasonData.sport_pitching_tm.queryResults.row.l;
             const winPct = otherSeasonData.sport_pitching_tm.queryResults.row.wpct;
             const era = otherSeasonData.sport_pitching_tm.queryResults.row.era;
             const gamesStarted = otherSeasonData.sport_pitching_tm.queryResults.row.gs;
             const completeGames = otherSeasonData.sport_pitching_tm.queryResults.row.cg;
             const shutouts = otherSeasonData.sport_pitching_tm.queryResults.row.sho;
             const onBasePlusSlugging = otherSeasonData.sport_pitching_tm.queryResults.row.ops;
             const battingAvg = otherSeasonData.sport_pitching_tm.queryResults.row.avg;
             const kPer9 = otherSeasonData.sport_pitching_tm.queryResults.row.k9;
             var strikeOuts = otherSeasonData.sport_pitching_tm.queryResults.row.so;
             const innningsPitched = otherSeasonData.sport_pitching_tm.queryResults.row.ip;
             const runsPer9 = otherSeasonData.sport_pitching_tm.queryResults.row.rs9;
             all_the_data = all_the_data.push([games, wins, losses, winPct, era, gamesStarted, completeGames, onBasePlusSlugging, battingAvg, kPer9, strikeOuts, innningsPitched, runsPer9]);
             console.log(ALLTHEDATA, all_the_data)
             
            })
            .catch(err => {
              console.log(err);
            });return all_the_data;}
            else{ console.log("HITTER season stats");
            fetch(`https://mlb-data.p.rapidapi.com/json/named.sport_hitting_tm.bam?season='${year}'&player_id='${id}'&league_list_id='mlb'&game_type='R'`, {
                  "method": "GET",
                  "headers": {
                  "x-rapidapi-host": "mlb-data.p.rapidapi.com",
                  "x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5"
          }
            })
            .then(response => {
              return response.json();
            })
            
            .then(function(otherSeasonData){
              var all_the_data = [];
                    console.log("HITTER seasonData", otherSeasonData);
           const hr = otherSeasonData.sport_hitting_tm.queryResults.row.hr;
           const avg = otherSeasonData.sport_hitting_tm.queryResults.row.avg;
           const rbi = otherSeasonData.sport_hitting_tm.queryResults.row.rbi;
           const slg = otherSeasonData.sport_hitting_tm.queryResults.row.slg;
           const obp = otherSeasonData.sport_hitting_tm.queryResults.row.obp;
           const r = otherSeasonData.sport_hitting_tm.queryResults.row.r;
           const sb = otherSeasonData.sport_hitting_tm.queryResults.row.sb;
           const so = otherSeasonData.sport_hitting_tm.queryResults.row.so;
           const bb = otherSeasonData.sport_hitting_tm.queryResults.row.bb;
           all_the_data.push(hr);
           all_the_data.push(avg);
           all_the_data.push(rbi);
           all_the_data.push(slg);
           all_the_data.push(obp);
           all_the_data.push(r);
           all_the_data.push(sb);
           all_the_data.push(so);
           all_the_data.push(bb);
           
          })
          .catch(err => {
            console.log(err);
          });return all_the_data;}}