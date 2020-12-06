import {API} from "../api.js";
export function SpectatorAPI(callback) {
	API.call(this, callback);	
	let that = this;
	this.boards = []


	this.socket.addEventListener('message', function(event) {
		var message = JSON.parse(event.data);
		console.log(that.boards);
		if (message.action == "new_move") {
			console.log(that.boards);
			for (let i = 0; i < that.boards.length; i++) {
				that.boards[i].move(message.answer.from, message.answer.to);
			}
		}
	});
}
