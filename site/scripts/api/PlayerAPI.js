import {API} from "../api.js";
export function PlayerAPI(createGame) {
	API.call(this, createGame);
	this.sendMoves = function(args, player_id, game_id, board_state){
		var withMethod = {"action":"make_move"};
		withMethod["player_id"] = player_id;
		withMethod["from"] = [args[0].x, args[0].y];
		withMethod["to"] =  [args[1].x, args[1].y];
		withMethod["board_state"] = board_state;
		this.socket.send(JSON.stringify(withMethod));
	}

	this.sendBoardState = function(board_state) {
		this.xmlhttp.send(JSON.stringify({"action":"board_state", "room_id":sessionStorage.room_id, "state":board_state}));
	}

	this.socket.addEventListener('message', function(event) {
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
		} else {
			console.log("unhandled.");
			console.log(message.answer);
		}
	});
}
