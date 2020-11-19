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
					populateList(response.answer);
				} else {
					console.log("Empty.");
				}
			}
		}

		this.xmlhttp;
		this.xmlhttp.open("POST", this.url, true);
		this.xmlhttp.send(JSON.stringify({"get_matches":"_"}));
	}
}


function createMatch(key, value) {
	console.log(key, value);
	let card = document.createElement("div");
	card.className = "card";
	let top = document.createElement("div");
	top.className = "card top";
	let bot = document.createElement("div");
	bot.className = "card bot";

	let image = document.createElement("IMG");
	image.setAttribute("src", "images/white_pawn");

	let playerOne = document.createElement("p");
	playerOne.innerHTML = value["players"][0];

	let button = document.createElement("button");

	button.className = "join_button";
	button.innerHTML = "Join";
	button.addEventListener("click", function() {
		sessionStorage.setItem('room_id', key);
		document.location.href = "/";
	});

	top.appendChild(image);
	top.appendChild(playerOne);
	bot.appendChild(button);
	card.append(top, bot);

	return card;
}

function populateList(dic) {
	list = document.getElementById("games_list");
	for (let key in dic) {
		list.appendChild(createMatch(key, dic[key]));
	}
}

let listExample = {"room_id":{"players":["white_id", "black_id"]}};


api = new API();
api.getMatches();
