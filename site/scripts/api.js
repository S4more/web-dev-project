export function API(){
	this.xmlhttp = new XMLHttpRequest();
	this.url = "http://localhost:5555";

	this.sendMoves = function(gameInstance, args, player_id, game_id){
		let that = this;
		this.xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				that.getMoves(gameInstance, player_id, game_id);
			}}

		var withMethod = {};
		withMethod["player_id"] = player_id;
		withMethod["make_move"] = {}
		withMethod["make_move"]["from"] = [args[0].x, args[0].y];
		withMethod["make_move"]["to"] =  [args[1].x, args[1].y];

		this.xmlhttp.abort();
		this.xmlhttp.open("POST", this.url, true);
		this.xmlhttp.send(JSON.stringify(withMethod));
	}

	this.getMoves = function(gameInstance, player_id, game_id) {
        try{
			let that = this;
            this.xmlhttp.onreadystatechange = function() {
				console.log(new Error().stack);
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    if (response.answer == 1) {
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

	this.createGame = function(callback, player_id, game_id) {
		let that = this;
		this.xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				if (response.answer == 1) {
                    let gameInstance = callback(true);
					that.getMoves(gameInstance, player_id, game_id);
				};
			}}

		this.xmlhttp.open("POST", this.url, true);
		this.xmlhttp.send(JSON.stringify({"player_id":player_id, "create_game": game_id}));
	}
	
	this.joinGame = function(callback, player_id, game_id) {
		let that = this;
		this.xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				if (response.answer == 1){
					let gameInstance = callback(true);
					that.getMoves(gameInstance, player_id, game_id);
				};
			}}
		this.xmlhttp.open("POST", this.url, true);
		this.xmlhttp.send(JSON.stringify({"player_id": player_id, "join_game": game_id}));
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
				if (response.answer != 1){
					console.log("logged");
					sessionStorage.setItem('userinfo', this.responseText);
				}
			}
		}
		this.xmlhttp.open("POST", this.url, false);
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
}
