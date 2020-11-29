window.onload = function() {
	
	isLogged = (sessionStorage.userinfo != null? `<a href='profile.html'> ${JSON.parse(sessionStorage.userinfo).username} <img src='${JSON.parse(sessionStorage.userinfo).profile_picture}'></a>` : `<a href="login.html">Login</a>`); 

    document.getElementById("navbar").innerHTML = 
    `
    <img src="images/logo.png" class="logo"> <div id="nav_spacer"></div>
    <a href="home.html">Home</a>
    <a href="gameList.html">Find a Match</a>
    <a href="index.html">Ongoing Matches</a>
    <a href="index.html">About</a>
	${isLogged}
    `
};

function loadProfile() {
	// Returns an HTML string


}
