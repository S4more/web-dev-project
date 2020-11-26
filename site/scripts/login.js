import {API} from './api.js';
let api = new API();
function sendRegister() {
	let name = document.getElementById("usernameRegister").value;
	let password = document.getElementById("passwordRegister").value;

	if (name != "" && password != ""){
		api.register(name, password);
	}

}
function sendLogin() {
	let name = document.getElementById("usernameLogin").value;
	let password = document.getElementById("passwordLogin").value;

	if (name != "" && password != ""){
		api.login(name, password);
	}

}
document.getElementById("register").addEventListener("click", sendRegister);
document.getElementById("login").addEventListener("click", sendLogin);
