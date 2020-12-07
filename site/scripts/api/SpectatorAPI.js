import {API} from "../api.js";
export function SpectatorAPI(callback) {
	API.call(this, callback);	
	let that = this;
	this.boards = []
}
