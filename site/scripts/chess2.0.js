import {API} from './api.js';
let api = new API();

const pieces = {
    white_pawn: {color: "white", type: "pawn", charcode: "wpawn.svg"},
    white_rook: {color: "white", type: "rook", charcode: "wrook.svg"},
    white_knight: {color: "white", type: "knight", charcode: "wknight.svg"},
    white_bishop: {color: "white", type: "bishop", charcode: "wbishop.svg"},
    white_queen: {color: "white", type: "queen", charcode: "wqueen.svg"},
    white_king: {color: "white", type: "king", charcode: "wking.svg"},

    black_pawn: {color: "black", type: "pawn", charcode: "bpawn.svg"},
    black_rook: {color: "black", type: "rook", charcode: "brook.svg"},
    black_knight: {color: "black", type: "knight", charcode: "bknight.svg"},
    black_bishop: {color: "black", type: "bishop", charcode: "bbishop.svg"},
    black_queen: {color: "black", type: "queen", charcode: "bqueen.svg"},
    black_king: {color: "black", type: "king", charcode: "bking.svg"},
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

function game(color, player_id, game_id){
	console.log(player_id, game_id);
	this.turn;
    this.color = color;
    this.selectedSquare = null;
	this.player_id = player_id;
	this.game_id = game_id;

	this.initalizeGui = function(){
        this.turnMarker = document.createElement("P")
        this.turnMarker.id  = "turn_marker";
        let guiSquares = [];
        let container = document.getElementById("chess_board");
        for (let i = 0; i < 9; i++) {
            let row = document.createElement("TR");
            guiSquares.push([]);
            for (let j = 0; j < 9; j++) {
                let cell = document.createElement("TD");
                row.appendChild(cell);
                guiSquares[i].push(cell);
            }
            container.appendChild(row);
        }
        document.getElementById("center").appendChild(this.turnMarker);
        return guiSquares;
    }

    this.initalizeSquares = function(){
        let squares = [];
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

    this.placePieces = function(squares, piecelist){
        for (let i = 0; i < piecelist.length; i++) {
            squares[piecelist[i].y][piecelist[i].x].setPiece(piecelist[i].piece);
        }
    }

	this.onEnemyMove = function(from=null, to=null) {
		if (from === null && to === null) {
			console.log("here");
			this.startTurn();
			return; 
		}

		console.log(from, to);
		var from = this.squares[from[1]][from[0]];
		var to = this.squares[to[1]][to[0]];	
		this.move(from, to, true);
		this.startTurn();
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


    this.startTurn = function(){
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
			let validMoves = this.getValidMoves(from);
			if(from.piece){
				for (let i = 0; i < validMoves.length; i++) {
					if(validMoves[i] == to){
						console.log("oving own piece");
						api.sendMoves(this, [from, to], this.player_id, this.game_id);
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
        let validMoves = [];
        if(square.piece == null){
            return false;
        }
        if(square.piece.type == "rook"){
            var directions = [[1,0], [-1,0], [0,1], [0,-1]];
        }
        else if(square.piece.type == "bishop"){
            var directions = [[1,1], [-1,-1], [-1,1], [1,-1]];
        }
        else if(square.piece.type == "queen"){
            var directions = [[1,1], [-1,-1], [-1,1], [1,-1], [1,0], [-1,0], [0,1], [0,-1]];
        } 
        else if(square.piece.type == "knight"){
            var moveOptions = [[2,1], [2,-1], [-2,-1], [-2,1], [1,2], [1,-2], [-1,2], [-1,-2]];
            for (let i = 0; i < moveOptions.length; i++) {
                let x = square.x + (moveOptions[i][0]);
                let y = square.y + (moveOptions[i][1]);

                if (this.squareExists(x, y)){
                    if(this.squares[y][x].piece){
                        if(this.squares[y][x].piece.color != square.piece.color){
                            validMoves.push(this.squares[y][x]);
                        } 
                    } else{
                        validMoves.push(this.squares[y][x]);
                    }
                }
            }
            return validMoves;
        }
        else if(square.piece.type == "king"){
            let moveOptions = [[1,1], [-1,-1], [-1,1], [1,-1], [1,0], [-1,0], [0,1], [0,-1]];
            for (let i = 0; i < moveOptions.length; i++) {
                var x = square.x + (moveOptions[i][0]);
                var y = square.y + (moveOptions[i][1]);

                if (this.squareExists(x, y)){
                    if(this.squares[y][x].piece){
                        if(this.squares[y][x].piece.color != square.piece.color){
                            validMoves.push(this.squares[y][x]);
                        } 
                    } else{
                        validMoves.push(this.squares[y][x]);
                    }
                }
            }
            return validMoves;

        } else if(square.piece.type == "pawn"){

            if(square.piece.color == "white"){var dir = 1}
            else{var dir = -1};

            if((this.squareExists(square.y + dir*2,square.x)) && (square.y == 6) || (square.y == 1)){
                if(!this.squares[square.y + dir*2][square.x].piece){
                    validMoves.push(this.squares[square.y + dir*2][square.x]);
                }
            }

            if(this.squareExists(square.y + dir,square.x)){
                if(!this.squares[square.y + dir][square.x].piece){
                    validMoves.push(this.squares[square.y + dir][square.x]);
                }
            }

            if(this.squareExists(square.y + dir,square.x + 1)){
                if(this.squares[square.y + dir][square.x + 1].piece){
                    if(this.squares[square.y + dir][square.x + 1].piece.color != square.piece.color){
                        validMoves.push(this.squares[square.y+dir][square.x+1]);
                    }
                }
            }

            if(this.squareExists(square.y + dir,square.x - 1)){
                if(this.squares[square.y + dir][square.x - 1].piece){
                    if(this.squares[square.y + dir][square.x - 1].piece.color != square.piece.color){
                        validMoves.push(this.squares[square.y + dir][square.x-1]);
                    }
                }
            }


            return validMoves;
        } else{
            return validMoves;
        }

        for (let j = 0; j < directions.length; j++) {
            for (let i = 1; i < 8; i++) {
                let x = square.x+(directions[j][0] * i);
                let y = square.y+(directions[j][1] * i);
                if (this.squareExists(x, y)){
                    if(this.squares[y][x].piece){
                        if(this.squares[y][x].piece.color != square.piece.color){
                            validMoves.push(this.squares[y][x]);
                        } 
                        break;
                    } else{
                        validMoves.push(this.squares[y][x]);
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
            this.cell.innerHTML = `<img src='images/pieces/${piece.charcode}'>`;
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

if (sessionStorage.action == "create_game"){
	api.createGame(createGame, sessionStorage.player_id, sessionStorage.room_id);
} else if (sessionStorage.action == "join_game"){
	api.joinGame(joinGame, sessionStorage.player_id, sessionStorage.room_id);
}

function createGame(bool) {
	if (bool) {
		let gameInstance = new game("white", sessionStorage.player_id, sessionStorage.room_id);
		sessionStorage.clear();
		gameInstance.turn = true;
		return gameInstance;
	}
}

function joinGame(bool) {
	if (bool) {
		let gameInstance = new game("black", sessionStorage.player_id, sessionStorage.room_id);
		gameInstance.turn = false;
		sessionStorage.clear();
		return gameInstance;
	}
}
