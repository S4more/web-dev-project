function API(){
	this.xmlhttp = new XMLHttpRequest();
	this.url = "http://70.26.238.78:34568";
	//Should API have a board instance? API is a static class but I don't know how
	//to use it in JS properly. I think it will be ok to use it for now.
    this.gameInstance;

	this.getMatches = function() {
		this.xmlhttp.readystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				if (response.answer !== 1) {
					return response.answer;
				} else {
					console.log("Empty.");
				}
			}
		}

		this.xmlhttp.open("POST", this.url, true);
		this.xmlhttp.send(JSON.stringify({"get_matches":"_"}));
	}
}

function createMatch(key, value) {
	let listElement = document.createElement("li");
	listElement.className = "game_lobby";
	listElement.innerHTML = `${key} - Players ${value["players"].length}/2`;
	let button = document.createElement("button");
	button.className = "join_button";
	button.innerHTML = "Join";
	button.addEventListener("click", function() {
		sessionStorage.setItem('room_id', key);
		document.location.href = "/";
	});
	listElement.appendChild(button);
	return listElement;
}

function populateList(dic) {
	list = document.getElementById("games_list");
	for (let key in dic) {
		list.appendChild(createMatch(key, dic[key]));
	}
}

let listExample = {"room_id":{"players":["white_id", "black_id"]}};

//populateList(listExample);
