window.onload = function() {
	
	isLogged = (sessionStorage.userinfo ? `<a href='profile.html'> ${JSON.parse(sessionStorage.userinfo).username} <img src='${JSON.parse(sessionStorage.userinfo).profile_picture}'></a>` : `<a href="login.html">Login</a>`); 

    document.getElementById("navbar").innerHTML = 
    `
    <img src="images/logo.png" class="logo"> <div id="nav_spacer"></div>
    <a href="home.html">Home</a>
    <a href="gameList.html">Find a Match</a>
    <a href="index.html">Ongoing Matches</a>
    <a href="index.html">About</a>
	${isLogged}
    `

    document.getElementsByTagName("footer")[0].innerHTML = 
        `
        <div id="footer_content">
            <div id="footer_left">
                <p> Project contributers: <br>
                    <ul>
                        <li><a href="">Guilherme Corrêa (student#)</a><br></li>
                        <li><a href="">Noah Labrecque (1931815)</a><br></li>
                    </ul>
                </p>
            </div>
            <div id="footer_center">
                <p>
                    2020-12-01<br>
                    Web-Dev-1-sect:00001<br>
                    Dawson College(Fall-2020) <br>
                    © 2020 Guilherme Corrêa. Noah Labrecque.
                </p>
            </div>
            <div id="footer_right">
                <p>
                    Made using: <br> 
                    JS, CSS, Python server <br> 
                    View on github <a href="">here</a>
                </p>
            </div>    
        </div>
        `
};

function loadProfile() {
	// Returns an HTML string


}
