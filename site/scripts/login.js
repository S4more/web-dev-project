import {API} from './api.js';
var api = new API();

const pageName = location.href.split("/").slice(-1)[0];

function updateProfile() {
	const XHR = new XMLHttpRequest();
	const FD = new FormData( form );
	XHR.addEventListener( "load", function(event) {
		api.login(JSON.parse(sessionStorage.userinfo)["username"], FD.get('password'));
	} );
	XHR.addEventListener( "error", function( event ) {
		alert( 'Oops! Something went wrong.' );
	} );
	XHR.open( "POST", "http://localhost:5555" );
	let user_id = JSON.parse(sessionStorage.userinfo)["user_id"];
	let toSend = {"change_user":user_id};
	//toSend["username"] = FD.get('username')
	toSend["password"] = FD.get('password');
	toSend["profile_picture"] = FD.get('pp');	
	XHR.send(JSON.stringify(toSend));
}

function sendData(form, command) {
	const XHR = new XMLHttpRequest();
	const FD = new FormData( form );
	XHR.addEventListener( "load", function(event) {
		console.log(JSON.parse(event.target.responseText));
		sessionStorage.setItem("userinfo", JSON.stringify(JSON.parse(event.target.responseText).answer));
		location.reload()
	} );
	XHR.addEventListener( "error", function( event ) {
		alert( 'Oops! Something went wrong.' );
	} );

	XHR.open( "POST", "http://localhost:5555" );
	let toSend = (command == "register") ? {"register":"_"} : {"login":"_"};
	toSend["username"] = FD.get('username')
	toSend["password"] = FD.get('password');
	console.log(toSend);
	XHR.send(JSON.stringify(toSend));
}
if (pageName == "profile.html") {
	window.addEventListener( "load", function () {

		// Access the form element...
		const form = document.getElementById( "form" );

		// ...and take over its submit event.
		form.addEventListener( "submit", function ( event ) {
			event.preventDefault();
			updateProfile();
		} );
	} );
}

if (pageName == "login.html") {
	window.addEventListener( "load", function () {

		// Access the form element...
		const register = document.getElementById( "register" );
		const login = document.getElementById("connect");
		// ...and take over its submit event.
		register.addEventListener( "submit", function ( event ) {
			event.preventDefault();

			sendData(register, "register");
		} );
		login.addEventListener("submit", function (event) {
			event.preventDefault();
			sendData(login, "login");
		} );
	});
}
