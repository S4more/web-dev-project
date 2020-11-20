var player_id = null;
api = new API();
if (sessionStorage.action == "create game"){
	api.createGame(sessionStorage.room_id);
} else if (sessionStorage.action == "join game"){
	api.joinGame(sessionStorage.room_id);
}
sessionStorage.clear()

function API(){
	this.xmlhttp = new XMLHttpRequest();
	this.url = "http://localhost:5555";
	//Should API have a board instance? API is a static class but I don't know how
	//to use it in JS properly. I think it will be ok to use it for now.
    this.gameInstance;
    

	this.sendMoves = function(args){
		this.xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				api.getMoves();
			}}

		// I HATE JAVASCRIPT
		// IT'S HORRENDOUS. WHY DO I NEED TO DO ALL THIS STUFF

		var withMethod = {};
		withMethod["player_id"] = player_id;
		withMethod["make_move"] = {}
		withMethod["make_move"]["from"] = [args[0].x, args[0].y];
		withMethod["make_move"]["to"] =  [args[1].x, args[1].y];

		this.xmlhttp.abort();
		this.xmlhttp.open("POST", this.url, true);
		this.xmlhttp.send(JSON.stringify(withMethod));
	}

	this.getMoves = function() {
		//console.log("called by: ", new Error().stack);
        try{
            this.xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    if (response.answer == 1) {
					//This will happens only in the first move
						this.gameInstance.startTurn();
					} else if (response.answer != -1) {
                        var from = this.gameInstance.squares[response.answer.from[1]][response.answer.from[0]];
                        var to = this.gameInstance.squares[response.answer.to[1]][response.answer.to[0]];	
						console.log("answer received... calling move");
                        this.gameInstance.move(from, to, true);
                        this.gameInstance.startTurn();
                    } else {
						console.log("else");
						api.getMoves();
					} 
				}
			}
        } catch{
			console.log("HERE!");
            console.log("Could not connect to server");
        }
		
            
		this.xmlhttp.open("POST", this.url, true);
		this.xmlhttp.send(JSON.stringify({"player_id":player_id, "get_moves": "0"}));
	}

	this.createGame = function(player_id) {
		//player_id is set to 0 purely for test purposes.
		this.xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				if (response.answer == 1) {
                    this.gameInstance = new game("white", 0);
                    this.gameInstance.turn = true;
					api.getMoves();
				};
			}}

		this.xmlhttp.open("POST", this.url, true);
		this.xmlhttp.send(JSON.stringify({"player_id":player_id, "create_game": "0"}));
	}
	
	this.joinGame = function(player_id) {
		this.xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				if (response.answer == 1){
                    this.gameInstance = new game("black", 1);
                    this.gameInstance.turn = false;
					api.getMoves();
				};
			}}
		
		this.xmlhttp.open("POST", this.url, true);
		this.xmlhttp.send(JSON.stringify({"player_id": player_id, "join_game": "0"}));
	}

}





const pieces = {
    white_pawn: {color: "white", type: "pawn", charcode: "&#9817"},
    white_rook: {color: "white", type: "rook", charcode: "&#9814"},
    white_knight: {color: "white", type: "knight", charcode: "&#9816"},
    white_bishop: {color: "white", type: "bishop", charcode: "&#9815"},
    white_queen: {color: "white", type: "queen", charcode: "&#9813"},
    white_king: {color: "white", type: "king", charcode: "&#9812"},

    black_pawn: {color: "black", type: "pawn", charcode: "&#9823"},
    black_rook: {color: "black", type: "rook", charcode: "&#9820"},
    black_knight: {color: "black", type: "knight", charcode: "&#9822"},
    black_bishop: {color: "black", type: "bishop", charcode: "&#9821"},
    black_queen: {color: "black", type: "queen", charcode: "&#9819"},
    black_king: {color: "black", type: "king", charcode: "&#9818"},
}

const initalState = [
    {piece: pieces.white_pawn, x:0, y:1},
    {piece: pieces.white_pawn, x:1, y:1},
    {piece: pieces.white_pawn, x:2, y:1},
    {piece: pieces.white_pawn, x:3, y:1},
    {piece: pieces.white_pawn, x:4, y:1},
    {piece: pieces.white_pawn, x:5, y:1},
    {piece: pieces.white_pawn, x:6, y:1},
    {piece: pieces.white_pawn, x:7, y:1},
    {piece: pieces.white_rook, x:0, y:0},
    {piece: pieces.white_rook, x:7, y:0},
    {piece: pieces.white_knight, x:1, y:0},
    {piece: pieces.white_knight, x:6, y:0},
    {piece: pieces.white_bishop, x:2, y:0},
    {piece: pieces.white_bishop, x:5, y:0},
    {piece: pieces.white_queen, x:3, y:0},
    {piece: pieces.white_king, x:4, y:0},
    {piece: pieces.black_pawn, x:0, y: 6},
    {piece: pieces.black_pawn, x:1, y: 6},
    {piece: pieces.black_pawn, x:2, y: 6},
    {piece: pieces.black_pawn, x:3, y: 6},
    {piece: pieces.black_pawn, x:4, y: 6},
    {piece: pieces.black_pawn, x:5, y: 6},
    {piece: pieces.black_pawn, x:6, y: 6},
    {piece: pieces.black_pawn, x:7, y: 6},
    {piece: pieces.black_rook, x:0, y: 7},
    {piece: pieces.black_rook, x:7, y: 7},
    {piece: pieces.black_knight, x:1, y: 7},
    {piece: pieces.black_knight, x:6, y: 7},
    {piece: pieces.black_bishop, x:2, y: 7},
    {piece: pieces.black_bishop, x:5, y: 7},
    {piece: pieces.black_queen, x:3, y: 7},
    {piece: pieces.black_king, x:4, y: 7}];

const toLetter = ['a','b','c','d','e','f','g','h'];

function game(color, id){
    this.turn;
    this.color = color;
    this.selectedSquare = null;
    
	this.initalizeGui = function(){
        this.turnMarker = document.createElement("P")
        this.turnMarker.id  = "turn_marker";
        guiSquares = [];
        container = document.getElementById("chess_board");
        for (let i = 0; i < 9; i++) {
            let row = document.createElement("TR");
            guiSquares.push([]);
            for (let j = 0; j < 9; j++) {
                cell = document.createElement("TD");
                row.appendChild(cell);
                guiSquares[i].push(cell);
            }
            container.appendChild(row);
        }
        document.getElementById("center").appendChild(this.turnMarker);
        return guiSquares;
    }

	this.manageInterval = function(flag){
		if (flag) {
			getInterval = setInterval(function(){this.api.getMoves(id);}, 1000)
		} else {
			clearInterval(getInterval);
		}
	}
	//Starts loop waiting for other player of first move.
	//this.manageInterval(true);
    

    this.initalizeSquares = function(){
        squares = [];
        for (let i = 0; i < 8; i++) {
            squares.push([]);
            for (let j = 0; j < 8; j++) {
                squares[i].push(new square(this, j, i));
            }
        }
        return squares;
    }

    this.linkGameBoard = function(squares, boardGUI, color){
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(color == "white"){
                    squares[i][j].cell = boardGUI[(8-(i+1))][j+1];
                } else{
                    //Black
                    squares[i][j].cell = boardGUI[i][(8-(j))];
                }
				var that = this;
                squares[i][j].cell.onclick = function(){
                    that.clickOn(squares[i][j]);
                }
            }
        }
    }

    this.setMarkers = function(boardGUI, color){
        for(let i = 0; i < 8; i++){
            if(color == "white"){
                boardGUI[i][0].innerHTML = 8-i;
            } else{
                boardGUI[i][0].innerHTML = i+1;
            }
        }
        for(let i = 1; i < 9; i++){
            if(color == "white"){
                boardGUI[8][i].innerHTML = toLetter[i-1];
            } else{
                boardGUI[8][i].innerHTML = toLetter[8-i];
            }
        }
    }

    this.clickOn = function(square){
        if(this.selectedSquare){
            this.move(this.selectedSquare, square);
            this.selectedSquare.unselect();
            this.selectedSquare = null;
        } else {
            this.selectedSquare = square;
			square.select();
        }
    }

    this.placePieces = function(squares, piecelist){
        for (let i = 0; i < piecelist.length; i++) {
            squares[piecelist[i].y][piecelist[i].x].setPiece(piecelist[i].piece);
        }
    }

    this.startTurn = function(){
        //console.log("It's your turn")
		this.turnMarker.innerHTML = "YOUR TURN";
        this.turn = true;
    }

    this.endTurn = function(){
        console.log("Turn ended")
        this.turnMarker.innerHTML = "OPPONENTS TURN";
        this.turn = false;
    }

    this.boardGUI = this.initalizeGui();
    this.setMarkers(this.boardGUI, this.color);
    this.squares = this.initalizeSquares();
    this.linkGameBoard(this.squares, this.boardGUI, this.color);
    this.placePieces(this.squares, initalState);

    if (this.color == 'white'){
		//api.getMoves();
        //this.startTurn();
		console.log("Waiting for opponent");
	} else{
        this.endTurn();
    }

    this.move = function(from, to, isEnemy = false){
		if (isEnemy) {
			// If it is the enemy move that the board is handling,
			// set off the get_move loop and don't send it back to the
			// server.
			//this.manageInterval(false);
			console.log("Moving enemy");
			to.setPiece(from.piece);
			from.clear();
		} else {
			if (this.turn) {
			//Noah, i honestly hope this never finds you.
			//I'm canceling the interval before making a move just because
			//otherwise white would always have the first loop running.
			//It is def not the optimal way of doing it but I'm too tired
			//to do anything better.
			//this.manageInterval(false);
			validMoves = this.getValidMoves(from);
			if(from.piece){
				for (let i = 0; i < validMoves.length; i++) {
					if(validMoves[i] == to){
						console.log("oving own piece");
						api.sendMoves([from, to]);
						to.setPiece(from.piece);
						from.clear();
						this.endTurn();
						}
					}           
				}
            } else {
				console.log("Not your turn");
			}
		}
    }


    this.validateCheck = function(from, to){
        kingSquare;
        mighty_king_moves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if(board[i][j].piece){
                    if(board[i][j].piece.type = "king"){
                        kingSquare = board[i][j];
                    }
                }
            }
        }
        if(!kingSquare) return 0;

        directions = [[1,1], [-1,-1], [-1,1], [1,-1], [1,0], [-1,0], [0,1], [0,-1]];
        moveOptions = [[2,1], [2,-1], [-2,-1], [-2,1], [1,2], [1,-2], [-1,2], [-1,-2]];

        for (let i = 0; i < moveOptions.length; i++) {
            x = square.x + (moveOptions[i][0]);
            y = square.y + (moveOptions[i][1]);

            if (this.squareExists(x, y)){
                if(squares[y][x].piece){
                    if(squares[y][x].piece.color != square.piece.color){
                        mighty_king_moves.push(squares[y][x]);
                    } 
                } else{
                    mighty_king_moves.push(squares[y][x]);
                }
            }
        }

        for (let j = 0; j < directions.length; j++) {
            for (let i = 1; i < 8; i++) {
                x = square.x+(directions[j][0] * i);
                y = square.y+(directions[j][1] * i);
                if (this.squareExists(x, y)){
                    if(squares[y][x].piece){
                        if(squares[y][x].piece.color != square.piece.color){
                            mighty_king_moves.push(squares[y][x])
                        } 
                        break;
                    } else{
                        mighty_king_moves.push(squares[y][x])
                    }
                } else{
                    break;
                }
            }
        }
        
        console.log(mighty_king_moves);
        
    }

    this.getValidMoves = function(square){
        validMoves = [];
        if(square.piece == null){
            return false;
        }
        if(square.piece.type == "rook"){
            directions = [[1,0], [-1,0], [0,1], [0,-1]];
        }
        else if(square.piece.type == "bishop"){
            directions = [[1,1], [-1,-1], [-1,1], [1,-1]];
        }
        else if(square.piece.type == "queen"){
            directions = [[1,1], [-1,-1], [-1,1], [1,-1], [1,0], [-1,0], [0,1], [0,-1]];
        } 
        else if(square.piece.type == "knight"){
            moveOptions = [[2,1], [2,-1], [-2,-1], [-2,1], [1,2], [1,-2], [-1,2], [-1,-2]];
            for (let i = 0; i < moveOptions.length; i++) {
                x = square.x + (moveOptions[i][0]);
                y = square.y + (moveOptions[i][1]);

                if (this.squareExists(x, y)){
                    if(squares[y][x].piece){
                        if(squares[y][x].piece.color != square.piece.color){
                            validMoves.push(squares[y][x]);
                        } 
                    } else{
                        validMoves.push(squares[y][x]);
                    }
                }
            }
            return validMoves;
        }
        else if(square.piece.type == "king"){
            moveOptions = [[1,1], [-1,-1], [-1,1], [1,-1], [1,0], [-1,0], [0,1], [0,-1]];
            for (let i = 0; i < moveOptions.length; i++) {
                x = square.x + (moveOptions[i][0]);
                y = square.y + (moveOptions[i][1]);

                if (this.squareExists(x, y)){
                    if(squares[y][x].piece){
                        if(squares[y][x].piece.color != square.piece.color){
                            validMoves.push(squares[y][x]);
                        } 
                    } else{
                        validMoves.push(squares[y][x]);
                    }
                }
            }
            return validMoves;

        } else if(square.piece.type == "pawn"){

            if(square.piece.color == "white"){dir = 1}
            else{ dir = -1};

            if((this.squareExists(square.y + dir*2,square.x)) && (square.y == 6) || (square.y == 1)){
                if(!squares[square.y + dir*2][square.x].piece){
                    validMoves.push(squares[square.y + dir*2][square.x]);
                }
            }

            if(this.squareExists(square.y + dir,square.x)){
                if(!squares[square.y + dir][square.x].piece){
                    validMoves.push(squares[square.y + dir][square.x]);
                }
            }

            if(this.squareExists(square.y + dir,square.x + 1)){
                if(squares[square.y + dir][square.x + 1].piece){
                    if(squares[square.y + dir][square.x + 1].piece.color != square.piece.color){
                        validMoves.push(squares[square.y+dir][square.x+1]);
                    }
                }
            }

            if(this.squareExists(square.y + dir,square.x - 1)){
                if(squares[square.y + dir][square.x - 1].piece){
                    if(squares[square.y + dir][square.x - 1].piece.color != square.piece.color){
                        validMoves.push(squares[square.y + dir][square.x-1]);
                    }
                }
            }


            return validMoves;
        } else{
            return validMoves;
        }

        for (let j = 0; j < directions.length; j++) {
            for (let i = 1; i < 8; i++) {
                x = square.x+(directions[j][0] * i);
                y = square.y+(directions[j][1] * i);
                if (this.squareExists(x, y)){
                    if(squares[y][x].piece){
                        if(squares[y][x].piece.color != square.piece.color){
                            validMoves.push(squares[y][x]);
                        } 
                        break;
                    } else{
                        validMoves.push(squares[y][x]);
                    }
                } else{
                    break;
                }
            }
        }
        return validMoves;
    }

    this.squareExists = function(x, y){
        if((x <= 7)&&(x >= 0)&&(y <= 7)&&(y >= 0)){
            return true;
        } else{
            return false;
        }
    }
}

function square(board, x, y){
    //New and improved square method
    this.x = x;
    this.y = y;

    this.setPiece = function(piece){
        this.piece = piece;
        if(this.piece){
            this.cell.innerHTML = this.piece.charcode;
        } else{
            this.cell.innerHTML = "";
        }
    }



    this.clear = function(){
        this.setPiece(null);
    }
    this.select = function(){
        this.cell.classList.add('selected');
    }
    this.unselect = function(){
        this.cell.classList.remove('selected');
    }
}
