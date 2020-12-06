const pageName = location.href.split("/").slice(-1)[0];
window.onload = function() {
	
	isLogged = (sessionStorage.userinfo != null? `<a href='profile.html'> ${JSON.parse(sessionStorage.userinfo).username} <img src='${JSON.parse(sessionStorage.userinfo).profile_picture}'></a>` : `<a href="login.html">Login<svg width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#453F35" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <circle cx="12" cy="7" r="4" />
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
  </svg></a>`); 

    document.getElementById("navbar").innerHTML = 
    `
    <img src="images/logo.png" class="logo"> <div id="nav_spacer"></div>
    <a href="home.html">Home
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-home" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#453F35" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <polyline points="5 12 3 12 12 3 21 12 19 12" />
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
        </svg>
    </a>
    <a href="gameList.html">Find a Match 
        <svg width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#453F35" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <circle cx="10" cy="10" r="7" />
        <line x1="21" y1="21" x2="15" y2="15" />
        </svg>
    </a>
    <a href="ongoingMatches.html">Ongoing Matches
        <svg width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#453F35" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
    </a>
    <a href="index.html">About
        <svg width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#453F35" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
        <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
        <line x1="3" y1="6" x2="3" y2="19" />
        <line x1="12" y1="6" x2="12" y2="19" />
        <line x1="21" y1="6" x2="21" y2="19" />
        </svg>
    </a>
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
                    View on github <a href="https://github.com/S4more/web-dev-project">here</a>
                </p>
            </div>    
        </div>
        `
};

function loadProfile() {
	// Returns an HTML string


}
