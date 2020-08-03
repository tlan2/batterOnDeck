// Tom Lancaster & Pat Rademacher (c) 2020
// Batter On Deck
// career.js

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
                  const id = data.search_player_all.queryResults.row.player_id;
                  const name = data.search_player_all.queryResults.row.name_display_first_last;
                  const position = data.search_player_all.queryResults.row.position;
                  const team = data.search_player_all.queryResults.row.team_full;
                  var firstYear = data.search_player_all.queryResults.row.pro_debut_date;

                  var firstYear = firstYear.substring(0,4);

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
                  fetchPlayerSeasonStats(id, position, currentYear.toString());

                  const selectElement = document.getElementById("dropDownList");

                  selectElement.addEventListener('change', (event) => {
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



            const name = data.player_info.queryResults.row.name_display_first_last;
            const position = data.player_info.queryResults.row.primary_position_txt;
            const team = data.player_info.queryResults.row.team_name;
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


            fetchPlayerSeasonStats(id, position, lastYear);

            const selectElement = document.getElementById("dropDownList");
            selectElement.addEventListener('change', (event) => {
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

