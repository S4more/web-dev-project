function API(){
	this.socket = new WebSocket('ws://localhost:5000');

	this.gameInstance;

	this.socket.addEventListener('open', function(event) {
		console.log("Connected to the server.")
		api.getMatches();
	});

	this.socket.addEventListener('close', function(event) {
		console.log('Disconnected from the server.');
	});

	this.socket.addEventListener('message', function(event) {
		populateList(JSON.parse(event.data).answer);
	});

	this.getMatches = function() {
		this.socket.send(JSON.stringify({"action":"get_matches"}));
	}
}
function createCard(key, value) {
	let card = document.createElement("card");
	card.className = "card create";

	let documentFragment = document.createRange().createContextualFragment(`
			<div class="bar player">
				<img src="images/white_pawn">
				<p> ${value["players"][0]} </p>
			</div>
			<div class="mid">
				<img src="images/Chess-Board.jpg">
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
	list = document.getElementById("games_list");
	for (let key in dic) {
		list.appendChild(createCard(key, dic[key]));
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

api = new API();
document.getElementById("new_game_container").appendChild(createMatch());
