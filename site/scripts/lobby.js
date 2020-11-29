function API(){
	this.xmlhttp = new XMLHttpRequest();
	this.url = "http://localhost:5555"
	//Should API have a board instance? API is a static class but I don't know how
	//to use it in JS properly. I think it will be ok to use it for now.
    this.gameInstance;

	this.getMatches = function() {
		this.xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				if (response.answer !== 1) {
					console.log(response);
					populateList(response.answer);
				} else {
					console.log("Empty.");
				}
			}
		}

		this.xmlhttp.open("POST", this.url, true);
		this.xmlhttp.send(JSON.stringify({"get_matches":"_"}));
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
api.getMatches();
document.getElementById("new_game_container").appendChild(createMatch());
