// Tom Lancaster & Pat Rademacher (c) 2020
// Batter On Deck
// originalFetch.js


function fetchPlayer(id){

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
          if(!data.name_display_first_last){
                        return;
                    }
                    
                    const name = data.name_display_first_last;
                    const position = data.position;
            
                    const html = `<li>${name} - ${position} </li>`;
            
                    document.getElementById('results').insertAdjacentHTML('beforebegin', html);
  })
  .catch(err => {
    console.log(err);
  });
}

// for(var i=1; i < 10;i++){
//   fetchPlayer(i);
// }

fetchPlayer(493227);

// ======== TO USE LATER ===========

// function fetchPlayer(active,lastName){
//     var url;

//   if(active){
//     url = `http://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'&active_sw='Y'&name_part=${lastName}%25`;
//   } else {
//     url = `http://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'&active_sw='N'&name_part=${lastName}%25`;
//   }

//   fetch(url, {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "mlb-data.p.rapidapi.com",
// 		"x-rapidapi-key": "99277645d6msh6f62f53f4354a9fp1bbe68jsnfe46c1d9dfb5"
// 	}
// })
// .then(function(response){
//   return response.json();
// })
// .then(function(data){
//   console.log("data", data)
  
// // .catch(err => {
// // 	console.log(err);
// });

//   fetch(url)
//     .then(function(response){
//           return response.json()
//     })
//     .then(function(data){
//         console.log("data", data)

//         if(!data.name_display_first_last){
//             return;
//         }
        
//         const name = data.name_display_first_last;
//         const position = data.position;

//         const html = `<li>${name} - ${position} </li>`;

//         document.getElementById('results').insertAdjacentHTML('beforebegin', html);
//     })
// }

// function test(active, fullName){
//   var lastNameStr =  fullName.split(" ");
//   console.log(lastNameStr[1]);
//   var lastName = lastNameStr[1].toLowerCase();
//   console.log(lastName);
//   fetchPlayer(true, lastName);
// }

// var retiredPlayers = ["Greg Maddux",  "Pedro Martinez", "John Smoltz", 
//                       "Johnny Damon","Randy Johnson",  "Mariano Rivera",
//                       "Edgar Martinez", "Johnny Bench", "Lou Gehrig", 
//                       "Rogers Hornsby", "Honus Wagner", "Mike Schmidt",
//                         "Ted Williams", "Willie Mays", "Babe Ruth",
//                       ]

// var activePlayers = ["Mike Trout", "Mookie Betts", "Alex Bregman",
//                     "Aroldis Chapman", "Francisco Lindor", "Jacob deGrom",
//                     "Buster Posey", "Jose Altuve", "Freddie Freeman",
//                     "Giancarlo Stanton"]

// var testPlayer = "Yoenis Cespedes";

// test(true, testPlayer);

// for (var p in retiredPlayers){
//   var lastNameStr =  p.split(" ", 1,1);
//   console.log(lastNameStr);
//   var lastName = lastNameStr.toLowerCase();
//   console.log(lastName);
//   fetchPlayer(false, lastName);
// }
