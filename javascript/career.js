// Tom Lancaster & Pat Rademacher (c) 2020
// Batter On Deck
// career.js

var team_names_colors = [
                  ["Arizona Diamondbacks",[167,25,48],[227,212,173],[0,0,0]], 
                  ["Atlanta Braves", [206,17,65], [19, 39, 79], [234,170,0]],
                  ["Baltimore Orioles", [223,70,1], [39, 37, 31],[255,255,255]],
                  ["Boston Red Sox", [189, 48, 57], [12,35,64],[255,255,255]],
                  ["Chicago Cubs", [14,51,134], [204,52,51],[255,255,255]],
                  ["Chicago White Sox", [39,37,31], [196,206,212],[255,255,255]],
                  ["Cincinnati Reds", [198,1,31],[0,0,0],[255,255,255]], 
                  ["Cleveland Indians", [12,35,64],[227,25,55],[255,255,255]], 
                  ["Colorado Rockies", [51,0,111], [196,206,212], [0,0,0]], 
                  ["Detroit Tigers", [12,35,64],[250,70,22],[255,255,255]], 
                  ["Houston Astros",[0,45,98], [235,110,31], [244,145,30]], 
                  ["Kansas City Royals", [0,70,135],[189,155,96],[255,255,255]], 
                  ["Los Angeles Angels", [0,50,99], [186,0,33], [134,38,51]], 
                  ["Los Angeles Dodgers", [0,90,156], [239,62,66], [191,192,191]], 
                  ["Miami Marlins", [0,163,224], [239,51,64], [65,116,141]],  
                  ["Milwaukee Brewers", [255, 197, 47], [18, 40, 75], [255, 255, 255]], 
                  ["Minnesota Twins", [0,43,92],[211,17,69],[185,151,91]], 
                  ["New York Mets", [0,45, 114], [252,89,16],[255,255,255]], 
                  ["New York Yankees", [0,48,135], [228,0,44],[255,255,255]], 
                  ["Oakland Athletics",[0,56,49],[239,178,30],[162,170,173]], 
                  ["Philadelphia Phillies",[232,24,40],[0,45,114],[255,255,255]], 
                  ["Pittsburgh Pirates",[39,37,31],[253,184,39],[255,255,255]], 
                  ["St. Louis Cardinals",[196,30,58],[12,35,64],[254,219,0]], 
                  ["San Diego Padres",[47,36,29],[255,196,37],[255,255,255]], 
                  ["San Francisco Giants", [253,90,30], [39,37,31],[255,255,255]], 
                  ["Seattle Mariners", [12,44,86],[0,92,92],[255,255,255]], 
                  ["Tampa Bay Rays",[9,44,92],[143,188,230],[245,209,48]], 
                  ["Texas Rangers",[0,50,120],[192,17,31],[255,255,255]],
                  ["Toronto Blue Jays", [19,74,142], [29,45,92], [232,41,28]] 
                  ["Washington Nationals",[171,0,3],[20,34,90],[255,255,255]]];
function searchByPlayerName(event){
   clearPlayerInfo();
   var inputPlayer = document.getElementById('getPlayer').value;
   console.log(inputPlayer);
   fetchAllPlayerInfo(inputPlayer);
   event.preventDefault();
}

function fetchAllPlayerInfo(name){

  var urlName = convertToURlName(name);
  var spectrum_of_all = [0, 0, 0, 0, 0, 0, 0, 0, 0];


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
          
                  const player = `
                                  <h1 id="active">${name} - ${position}</h1>
                                  <h2 id="active">${team}</h2>
                                  <br>`;

                  console.log(name);
                  console.log(position);
                  console.log('Team Name: ' + team);
          
                  document.getElementById('home').innerHTML = player;
                  
                  for (var q = 0; q < team_names_colors.length; q++){
                    if(team == team_names_colors[q][0]){
                      for (var r = 0; r < 9; r++){
                        spectrum_of_all[r] = team_names_colors[r+1];
                      }
                      break;
                    }
                  }
               
                  fetchPlayerCareerStats(id, position, spectrum_of_all);
            }
            
    })
    .catch(err => {
      console.log(err);
    });
  }


function fetchRetiredPlayerInfo(urlName){
// Returns RETIRED players PERSONAL info including ID

  console.log("retired player fetch.")
  var spectrum_of_all = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

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
          document.getElementById('home').innerHTML = playerDoesNotExist();
          const id = retiredData.search_player_all.queryResults.row['0'].player_id;
          const name = retiredData.search_player_all.queryResults.row['0'].name_display_first_last;
          const position = retiredData.search_player_all.queryResults.row['0'].position;
          const team = retiredData.search_player_all.queryResults.row['0'].team_full;

          console.log("first id of 2 players = " + id);
          console.log("Retired name" + name);
          console.log("Retired positon" + position);
          return;

        } else if(totalSize > 1){
          console.log("More than 1 player with same name.");

          const id = retiredData.search_player_all.queryResults.row['0'].player_id;
          const name = retiredData.search_player_all.queryResults.row['0'].name_display_first_last;
          const position = retiredData.search_player_all.queryResults.row['0'].position;
          const team = retiredData.search_player_all.queryResults.row['0'].team_full;

          console.log("first id of 2 players = " + id);
          console.log("Retired name" + name);
          console.log("Retired positon" + position);

          const player = `
                          <h1 id="retired">${name} - ${position}</h1>
                          <h2 id="retired">${team}</h2>
                          <br>`;
     
                        for (var q = 0; q < team_names_colors.length; q++){
                            if(team == team_names_colors[q][0]){
                              for (var r = 0; r < 9; r++){
                                spectrum_of_all[r] = team_names_colors[r+1];
                              }
                              break;
                            }
                          }
          console.log(name);
          console.log(position);
          console.log('Team Name: ' + team);           

          document.getElementById('home').innerHTML = player;
          fetchPlayerCareerStats(id, position, spectrum_of_all);

        } else {
          console.log("Retired Player stats retrieval.");

          const id = retiredData.search_player_all.queryResults.row.player_id;
          const name = retiredData.search_player_all.queryResults.row.name_display_first_last;
          const position = retiredData.search_player_all.queryResults.row.position;
          const team = retiredData.search_player_all.queryResults.row.team_full;
  
          console.log("retired id = " + id);
          console.log("Retired name" + name);
          console.log("Retired position " + position);
          console.log("team: " + team);
          console.log("count YEAH: " + team_names_colors.length);
          console.log("test: " + team_names_colors[25][0]);
          console.log("equality test: " + (team == team_names_colors[25][0]));
          for (var q = 0; q < team_names_colors.length; q++){
            if(team == team_names_colors[q][0]){
              for (var r = 0; r < 3; r++){
                spectrum_of_all[r] = team_names_colors[q][r+1];
              }
              break;
            }
          }
           console.log('after loop spectrum is: ' + spectrum_of_all[0]); 
           var filler = 'rgb(' + spectrum_of_all[0]+ ')'; 
           console.log('filler = ' + filler);
           document.getElementById("stats").style.backgroundColor = 'rgb(' + spectrum_of_all[0]+ ')';  
           document.getElementById("stats").style.border = 'solid 1px' + 'rgb(' + spectrum_of_all[2]+ ')';  
           document.getElementById("stats").style.color = 'rgb(' + spectrum_of_all[1]+ ')';  
      
          

            
          
          const player = `
                          <h1 id="retired">${name} - ${position}</h1>
                          <h2 id="retired">${team}</h2>
                          <br>`;
          
          document.getElementById('home').innerHTML = player;
          document.getElementById('home').innerHTML = player;
   
          fetchPlayerCareerStats(id, position, spectrum_of_all);
        }

        
            
    })
    .catch(err => {
      console.log(err);
    });
  }

function fetchPlayerCareerStats(id, position, colors_of_choice){
// Fetches player's CAREER REGULAR SEASON STATS
console.log("position = " + position);
console.log("colors = " + colors_of_choice);
if(position == "P"){
  console.log("PITCHER career stats");
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
          console.log("PITCHER careerData", careerData)

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

          const html = `<div class="row" id="myDIV"
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
                            ${wins}-${losses},${winPct}
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
    console.log("HITTER career stats");
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
            console.log("HITTER careerData", careerData)

            const hr = careerData.sport_career_hitting.queryResults.row.hr;
            const avg = careerData.sport_career_hitting.queryResults.row.avg;
            const rbi = careerData.sport_career_hitting.queryResults.row.rbi;
            const slg = careerData.sport_career_hitting.queryResults.row.slg;
            const obp = careerData.sport_career_hitting.queryResults.row.obp;
            const r = careerData.sport_career_hitting.queryResults.row.r;
            const sb = careerData.sport_career_hitting.queryResults.row.sb;
            const so = careerData.sport_career_hitting.queryResults.row.so;
            const bb = careerData.sport_career_hitting.queryResults.row.bb;

            const html = `<div class="row" id="myDIV">
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

// Searches inputted player when user presses "Enter"
  // https://stackoverflow.com/questions/12955222/how-to-trigger-html-button-when-you-press-enter-in-textbox
  document.querySelector("#home").addEventListener("keyup", event => {
    if(event.key !== "Enter") return; // Use `.key` instead.
    document.querySelector("#home").click(); // Things you want to do.
    event.preventDefault(); // No need to `return false;`.
});

function convertToURlName(inputName){
    var urlName = inputName.toLowerCase().trim().replace(' ', '+');
    // console.log(urlName);
    return urlName;
}

function clearPlayerInfo(){
  document.getElementById('home').innerHTML = "";
  document.getElementById('stats').innerHTML = "";
}

function playerDoesNotExist(){
  var i = Math.floor(Math.random() * 4) + 1;
  // console.log("random # = " + i);
  var missing = ["1.jpg", "2.jpg", "3.jpg", "4.jpg"];
  // var missing = ["1.jpg", "2a.jpg", "3a.jpg", "4a.jpg"];
  // console.log("missing[i+1] = " + missing[i-1]);
  
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



