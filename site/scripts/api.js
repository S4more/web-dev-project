export function API(createGame){
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
		console.log(event.data);
		var message = JSON.parse(event.data);
		if (message.action == "opponent_joined") {	
			this.gameInstance.startFirstTurn();
		} else if (message.action == "opponent_disconnect"){
			document.getElementById("turn_marker").innerHTML = "Opponent disconnected. Win by resignation in 60 seconds,"
		} else if (message.action == "opponent_reconnected") {
			document.getElementById("turn_marker").innerHTML = "Opponent Reconnected."
		} else if (message.action == "opponent_moves") {
			this.gameInstance.onEnemyMove(message.answer.from, message.answer.to);
		} else if (message.action == "game_created") {	
            this.gameInstance = createGame(true, message.answer.state);
			// 2 is when it is rejoining a game that already exists with the same call
			// Not the optimal way but time constraints...
			if (message.answer.type == 2) {
				this.gameInstance.startTurn();
			}
		} else if (message.action == "game_joined") {
			this.gameInstance = createGame(true, message.answer.state)
			// 2 is when you rejoin a game that already exists and it's your turn.
			if (message.answer.type == 2) {
				this.gameInstance.startTurn();
			}
		} else if (message.action == "get_board_state") {
			console.log("here...");
		} else if (message.action == "login" || message.action == "register") {
			sessionStorage.setItem('userinfo', JSON.stringify(message.answer));
			window.location.href = "/";
		}
	});

	this.sendMoves = function(args, player_id, game_id, board_state){
		var withMethod = {"action":"make_move"};
		withMethod["player_id"] = player_id;
		withMethod["from"] = [args[0].x, args[0].y];
		withMethod["to"] =  [args[1].x, args[1].y];
		withMethod["board_state"] = board_state;
		this.socket.send(JSON.stringify(withMethod));
	}

	// TODO DELETE
	this.getMoves = function(gameInstance, player_id, game_id) {
        try{
            this.xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    if (response.answer == 1) {
						// If someone else joined the game.
						gameInstance.onEnemyMove();
					} else if (response.answer != -1) {
						console.log("answer received... calling move");
						gameInstance.onEnemyMove(response.answer.from, response.answer.to);
                    } else {
						that.getMoves(gameInstance, player_id, game_id);
					} 
				}
			}
        } catch{
            console.log("Could not connect to server");
        }
		
            
		this.xmlhttp.open("POST", this.url, true);
		this.xmlhttp.send(JSON.stringify({"player_id":player_id, "get_moves": game_id}));
	}

	this.createGame = function(player_id, game_id) {
		this.socket.send(JSON.stringify({"action":"game_created", "player_id":player_id, "game_id":game_id}));
	}
	
	this.joinGame = function(player_id, game_id) {
		this.socket.send(JSON.stringify({"action":"game_joined", "player_id": player_id, "game_id":game_id}));
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

	this.sendBoardState = function(board_state) {
		this.xmlhttp.send(JSON.stringify({"action":"board_state", "room_id":sessionStorage.room_id, "state":board_state}));
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
