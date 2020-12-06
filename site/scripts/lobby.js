import {SpectatorAPI} from "./api.js";
import BoardDisplay from "./chess2.0.js";


function createCard(key, value) {
	let card = document.createElement("card");
	card.className = "card create";

	let documentFragment = document.createRange().createContextualFragment(`
			<div class="bar player">
				<img src="images/white_pawn">
				<p> ${value["players"][0]} </p>
			</div>
			<div class="mid">
				<table id="${key}"></table>
				<div class=hidden>
					<p> this is </p>
					<p> loss </p>
					<p> this is some info about the game</p>
				</div>
			</div>
			<div class="join">
				<button> JOIN BOARD</button>
			</div>
				</div>
			</div>`)
	card.append(documentFragment);

	card.querySelector("button").addEventListener("click", function() {
		sessionStorage.setItem('room_id', key);
		sessionStorage.setItem('action', "join_game");
		sessionStorage.setItem('player_id', "enemy");
		document.location.href = "/";
	});


	return card;
}

function populateList(dic) {
	let list = document.getElementById("games_list");
	for (let key in dic) {
		list.appendChild(createCard(key, dic[key]));
			let board = new BoardDisplay(key);
			board.init(dic[key].state);
			api.boards.push(board);
	}
}

function createMatch() {

	let card = document.createElement("card");
	card.className = "card create";
	card.id = "create_game";

	let documentFragment = document.createRange().createContextualFragment(`
			<div class="mid">
				<label>
					<input type="checkbox" checked>
					10 minutes
				</label>
				<label> 
					<input type="checkbox" checked>
					Public
				</label>
				<label> 
					<input type="checkbox" checked>
					Show Full
				</label>
			</div>
			
			<div class="join">
				<button> CREATE GAME </button>
			</div>`)
	card.append(documentFragment);

	card.querySelector("button").addEventListener("click", function() {
		if(sessionStorage.userinfo == null){
			alert("You must be logged in to create a game");
			return;
		}
		sessionStorage.setItem('room_id', Math.floor(Math.random() * Math.floor(50000)));
		sessionStorage.setItem('action', "create_game");
		document.location.href = "/";
	});
	
	return card;
}




var api = new SpectatorAPI(populateList);
api.socket.onopen = () => api.getMatches();
document.getElementById("new_game_container").appendChild(createMatch());
