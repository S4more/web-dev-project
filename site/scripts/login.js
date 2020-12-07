import {API} from './api.js';
var api = new API();


function updateProfile() {
	const FD = new FormData( form );
	let user_id = JSON.parse(sessionStorage.userinfo)["user_id"];
	let toSend = {};
	toSend["profile_picture"] = FD.get('pp');	
	sessionStorage.setItem("userinfo", JSON.stringify({"user_id":14,"username":"admin","created_on":"2020-11-26 21:41:26.275296","rank":800,"profile_picture":toSend["profile_picture"]}));
	window.location.href = "./home.html";
}

function sendData(form, command) {
	const XHR = new XMLHttpRequest();
	const FD = new FormData( form );
	sessionStorage.setItem("userinfo", JSON.stringify({"user_id":14,"username":"admin","created_on":"2020-11-26 21:41:26.275296","rank":800,"profile_picture":"http://forum.jquery.com/viewImage.do?fileId=14737000005241509&forumGroupId=14737000000003003"}));
	window.location.href = "./home.html";
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

		const login = document.getElementById("connect");

		login.addEventListener("submit", function (event) {
			event.preventDefault();
			sendData(login, "login");
		} );
	});
}
if (pageName == "register.html") {
	document.getElementById("username").addEventListener('input', confirmPassword);
	document.getElementById("password").addEventListener('input', confirmPassword);
	document.getElementById("passwordConfirm").addEventListener('input', confirmPassword);

	window.addEventListener( "load", function () {
		const register = document.getElementById("register");
		register.addEventListener( "submit", function ( event ) {
			event.preventDefault();
			sendData(register, "register");
		} );
	})
}

function blockButton(bool) {
	document.getElementById("send").disabled = bool;
}

function confirmPassword() {
	let username = document.getElementById("username");
    let p1 = document.getElementById("password");
    let p2 = document.getElementById("passwordConfirm");
	let error = document.getElementById("errorMessage");

	if (username.value == "") {
		username.className = "invalid";
	} else {
		username.className = "";
	}

	if (p1.value != p2.value && p2.value != "") {
		p1.className = "invalid"
		p2.className = "invalid"
		error.style.display = "block";
		blockButton(true);


	} else {
		p1.className = ""
		p2.className = ""
		error.style.display = "none";
		blockButton(false);
	}

}
