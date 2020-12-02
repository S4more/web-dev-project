import {PlayerAPI} from "./api/PlayerAPI.js";
import {SpectatorAPI} from "./api/SpectatorAPI.js";
export {PlayerAPI, SpectatorAPI};

export function API(createGame){
	/*
	 * Base class for all API classes.
	 * Connects to the server and creates a api socket.
	 * Holds only eventListeners common to all classes.
	 *
	 */
	this.socket = new WebSocket('ws://localhost:5000');
	this.createGame = createGame;

	this.gameInstance;

	this.socket.addEventListener('open', function(event) {
		console.log("Connected to the server.")
	});

	this.socket.addEventListener('close', function(event) {
		console.log('Disconnected from the server.');
	});

	this.socket.addEventListener('message', function(event) {
		var message = JSON.parse(event.data);
		if (message.action == "get_matches") {
			console.log(message);
			this.gameInstance = createGame(message.answer);
		} else if (message.action == "change_user") {
			sessionStorage.setItem('userinfo', JSON.stringify(message.answer));
			location.reload();
		} else if (message.action == "get_board_state") {
			console.log("here...");
		} else if (message.action == "login" || message.action == "register") {
			sessionStorage.setItem('userinfo', JSON.stringify(message.answer));
			window.location.href = "/";
		}
	});



	this.createGame = function(player_id, game_id) {
		this.socket.send(JSON.stringify({"action":"game_created", "player_id":player_id, "game_id":game_id}));
	}

	this.getMatches = function() {
		this.socket.send(JSON.stringify({"action":"get_matches"}));
	}
	

	this.register = function(username, password) {
		let that = this;
		this.xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				if (response.answer == 1){
					console.log("registered!");
					that.login(username, password)
				} else {
					console.log(response);	
				}
			}
		}
		this.xmlhttp.open("POST", this.url, false);
		this.xmlhttp.send(JSON.stringify({"register":"_", "username":username, "password":password}));
	}


	this.login = function(username, password) {
		this.xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				if (response.answer != -1){
					console.log("logged");
					sessionStorage.setItem('userinfo', JSON.stringify(response.answer));
				}
			}
		}
		this.xmlhttp.open("POST", this.url, true);
		console.log(username, password);
		this.xmlhttp.send(JSON.stringify({"login":"_", "username":username, "password":password}));
	}

	this.getUser = function(userid) {
		this.xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				if (response.answer != -1){
					console.log(response.answer);
				}
			}
		}
		this.xmlhttp.open("POST", this.url, false);
		this.xmlhttp.send(JSON.stringify({"user_id":userid}));
	}

	this.joinGame = function(player_id, game_id) {
		this.socket.send(JSON.stringify({"action":"game_joined", "player_id": player_id, "game_id":game_id}));
	}

	this.getBoardState = function(room_id, callback) {
		this.xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				if (response.answer != -1){
					if (callback) {callback.init(response.answer)};
				}
			}
		}
		this.xmlhttp.open("POST", this.url, false);
		this.xmlhttp.send(JSON.stringify({"action":"get_board_state", "board_id":room_id}));
	}
}


