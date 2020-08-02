// Tom Lancaster & Pat Rademacher (c) 2020
// Batter On Deck
// functions.js

function searchByPlayerName(event){
   clearPlayerInfo();
   var inputPlayer = document.getElementById('getPlayer').value;
   console.log(inputPlayer);
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
        console.log("data", data);
        console.log("Active totalSize = " + data.search_player_all.queryResults.totalSize)

        if(data.search_player_all.queryResults.totalSize == 0){
              console.log("Not active.")
              fetchRetiredPlayerInfo(urlName);
        } else {
                  const id = data.search_player_all.queryResults.row.player_id;
                  const name = data.search_player_all.queryResults.row.name_display_first_last;
                  const position = data.search_player_all.queryResults.row.position;
          
                  const player = `<h1 id="name">${name} - ${position}</h1>`;

                  console.log(name);
                  console.log(position);
          
                  document.getElementById('nameResult').innerHTML = player;

                  fetchPlayerCareerStats(id);
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
        console.log(typeof totalSize)
      
        if(totalSize == "0"){
          console.log("in totalSize condition");
          document.getElementById('nameResult').innerHTML = playerDoesNotExist();
          return;
        }

        console.log("Retired Player stats retrieval.");
        const id = retiredData.search_player_all.queryResults.row.player_id;
        console.log("id = " + id);
        const name = retiredData.search_player_all.queryResults.row.name_display_first_last;
        const position = retiredData.search_player_all.queryResults.row.position;
  
        const player = `<h1 id="name">${name} - ${position}</h1>`;

        console.log(name);
        console.log(position);
  
        document.getElementById('nameResult').innerHTML = player;
  
        fetchPlayerCareerStats(id);
            
    })
    .catch(err => {
      console.log(err);
    });
  }

function fetchPlayerCareerStats(id){
// Fetches player's CAREER REGULAR SEASON STATS
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
          console.log("careerData", careerData)

          const hr = careerData.sport_career_hitting.queryResults.row.hr;
          const avg = careerData.sport_career_hitting.queryResults.row.avg;
          const rbi = careerData.sport_career_hitting.queryResults.row.rbi;
          const slg = careerData.sport_career_hitting.queryResults.row.slg;
          const obp = careerData.sport_career_hitting.queryResults.row.obp;
          const r = careerData.sport_career_hitting.queryResults.row.r;
          const sb = careerData.sport_career_hitting.queryResults.row.sb;
          const so = careerData.sport_career_hitting.queryResults.row.so;
          const bb = careerData.sport_career_hitting.queryResults.row.bb;

          const html = `<div class="row">
                          <div class="col-sm-4" id="homeRuns">
                            Home Runs - ${hr}
                          </div>
                          <div class="col-sm-4" id="battingAvg">
                            Batting Avg. - ${avg}
                          </div>
                          <div class="col-sm-4" id="rbi">
                            Runs Batted In (RBI) - ${rbi}
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-sm-4" id="slg">
                            Slugging Pct (SLG) - ${slg}
                          </div>
                          <div class="col-sm-4" id="obp">
                            On Base Pct (OBP) - ${obp}
                          </div>
                          <div class="col-sm-4" id="runs">
                            Runs (R) - ${r}
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-sm-4" id="steals">
                            Steals (SB) - ${sb}
                          </div>
                          <div class="col-sm-4" id="strikeOuts">
                            Strike Outs (SO) - ${so}
                          </div>
                          <div class="col-sm-4" id="walks">
                            Walks (BB) - ${bb}
                          </div>
                        </div>`
          
        document.getElementById('stats').innerHTML = html;              
  })
  .catch(err => {
    console.log(err);
  });
}

//============================================================================
//           SUB FUNCTIONS / HELPER FUNCTIONS
//============================================================================

// Searches inputted player when user presses "Enter"
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

function clearPlayerInfo(){
  document.getElementById('nameResult').innerHTML = "";
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
    subheader = "<h5 id=\"name\">This is awkward....</h5>"
  } else if(j == 1){
    subheader = "<h5 id=\"name\">Maybe they've gone missing.</h5>"
  } else if(j == 2){
    subheader = "<h5 id=\"name\">There are plenty of wannabes out there though.</h5>"
  } else if(j == 3){
    subheader = "<h5 id=\"name\">Sorry to break it to you.</h5>"
  }
  var html = `<br>
              <h3 id="name">Player Does Not Exist.</h3>
              <br>
              ${subheader}
              <br>
              <img src="images/missing/${missing[i-1]}" id="missing" alt="Player Does Not Exist">`;

  return html;
}

//============================================================================
//           DEPRECATED?
//============================================================================

function fetchPlayerByID(id){
// Provides more PERSONAL info the player including twitter handle

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



