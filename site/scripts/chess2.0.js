import {PlayerAPI} from './api.js';
export default BoardDisplay;

const pieces = {
    white_pawn: {color: "white", type: "pawn", charcode: "wpawn.svg", charType: "p", charColor: "w"},
    white_rook: {color: "white", type: "rook", charcode: "wrook.svg", charType: "r", charColor: "w"},
    white_knight: {color: "white", type: "knight", charcode: "wknight.svg", charType: "n", charColor: "w" },
    white_bishop: {color: "white", type: "bishop", charcode: "wbishop.svg", charType: "b", charColor: "w"},
    white_queen: {color: "white", type: "queen", charcode: "wqueen.svg", charType: "q", charColor: "w"},
    white_king: {color: "white", type: "king", charcode: "wking.svg", charType: "k", charColor: "w"},

    black_pawn: {color: "black", type: "pawn", charcode: "bpawn.svg", charType: "p", charColor: "b"},
    black_rook: {color: "black", type: "rook", charcode: "brook.svg", charType: "r", charColor: "b"},
    black_knight: {color: "black", type: "knight", charcode: "bknight.svg", charType: "n", charColor: "b"},
    black_bishop: {color: "black", type: "bishop", charcode: "bbishop.svg", charType: "b", charColor: "b"},
    black_queen: {color: "black", type: "queen", charcode: "bqueen.svg", charType: "q", charColor: "b"},
    black_king: {color: "black", type: "king", charcode: "bking.svg", charType: "k", charColor: "b"},
}

function boardStateToString(statePieces){
    let outputString = "";
    for (let i = 0; i < statePieces.length; i++) {
        outputString += statePieces[i].piece.charColor;
        outputString += statePieces[i].piece.charType;
        outputString += statePieces[i].x;
        outputString += statePieces[i].y;
    }
    return outputString;
}

function squaresToBoardState(squares) {
	let outputString = ""
	for (let i = 0; i < squares.length; i++) {
		for (let j = 0; j < squares[i].length; j++) {
			if (squares[i][j].piece) {
				outputString += squares[i][j].piece.charColor;
				outputString += squares[i][j].piece.charType;
				outputString += squares[i][j].x;
				outputString += squares[i][j].y;
			}
		}
	}
	return outputString;
}

function stringToBoardState(string){
    let boardState = [];
    for (let i = 0; i < string.length; i+=4) {
        let PObj = {};
        if(string.charAt(i) == "w"){
            if(string.charAt(i+1) == "p"){
                PObj.piece = pieces.white_pawn;
            } else if(string.charAt(i+1) == "r"){
                PObj.piece = pieces.white_rook;
            } else if(string.charAt(i+1) == "n"){
                PObj.piece = pieces.white_knight;
            } else if(string.charAt(i+1) == "k"){
                PObj.piece = pieces.white_king;
            } else if(string.charAt(i+1) == "q"){
                PObj.piece = pieces.white_queen;
            } else if(string.charAt(i+1) == "b"){
                PObj.piece = pieces.white_bishop;
            }
        } else{
            if(string.charAt(i+1) == "p"){
                PObj.piece = pieces.black_pawn;
            } else if(string.charAt(i+1) == "r"){
                PObj.piece = pieces.black_rook;
            } else if(string.charAt(i+1) == "n"){
                PObj.piece = pieces.black_knight;
            } else if(string.charAt(i+1) == "k"){
                PObj.piece = pieces.black_king;
            } else if(string.charAt(i+1) == "q"){
                PObj.piece = pieces.black_queen;
            } else if(string.charAt(i+1) == "b"){
                PObj.piece = pieces.black_bishop;
            }
        }
        PObj.x = parseInt(string.charAt(i+2));
        PObj.y = parseInt(string.charAt(i+3));
        boardState.push(PObj);
    }
    return boardState;
}

const toLetter = ['a','b','c','d','e','f','g','h'];

function BoardDisplay(game_id){// Element is the HTML dom element the board will be created in, Must be a table element.
    this.element  = document.getElementById(game_id);
    this.game_id = game_id;
    this.init = function(board_state) {
        this.boardGUI = this.initalizeGui();
		this.squares = this.initalizeSquares();
		this.linkGameBoard(this.squares, this.boardGUI);
		this.board_state = stringToBoardState(board_state);
        this.placePieces(this.squares, this.board_state);
    } 

    this.placePieces = function(squares, piecelist){
        for (let i = 0; i < piecelist.length; i++) {
            squares[piecelist[i].y][piecelist[i].x].setPiece(piecelist[i].piece);
        }
    }
    this.move = function(from, to){
		console.log("Moving Piece as Spectator");
		from = this.squares[from[1]][from[0]];
		to = this.squares[to[1]][to[0]];	
		to.setPiece(from.piece);
		from.clear();
		this.board_state = squaresToBoardState(this.squares);
    }

    this.initalizeGui = function(){
        let guiSquares = [];
        let container = this.element;
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

    this.linkGameBoard = function(squares, boardGUI){
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                squares[i][j].cell = boardGUI[(8-(i+1))][j+1];
            }
        }
    }

    this.setMarkers = function(boardGUI){
        for(let i = 0; i < 8; i++){
            boardGUI[i][0].innerHTML = 8-i;
        }
        for(let i = 1; i < 9; i++){
            boardGUI[8][i].innerHTML = toLetter[i-1];
        }
    }
}





function game(color, player_id, game_id){
	this.turn;
    this.color = color;
    this.selectedSquare = null;
	this.player_id = player_id;
	this.game_id = game_id;

	this.init = function(board_state) { 
		this.boardGUI = this.initalizeGui();
		this.setMarkers(this.boardGUI, this.color);
		this.squares = this.initalizeSquares();
		this.linkGameBoard(this.squares, this.boardGUI, this.color);
		this.board_state = stringToBoardState(board_state);
		this.placePieces(this.squares, this.board_state);

		if (this.color == 'white'){
			console.log("Waiting for opponent");
		} else{
			this.endTurn();
		}
	}

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

	this.startFirstTurn  = function() {	
		console.log("first turn started");
		this.startTurn();
	}

	this.onEnemyMove = function(from=null, to=null) {
		if (from === null && to === null) {
			console.log("here");
			return
		}

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
        } else if(square.piece.color == this.color){
            this.selectedSquare = square;
			square.select();
        }
    }


    this.startTurn = function(){
		this.turnMarker.innerHTML = "YOUR TURN";
        this.turn = true;
		this.checkForMate(this.color);
    }

    this.endTurn = function(){
        console.log("Turn ended")
        this.turnMarker.innerHTML = "OPPONENTS TURN";
        this.turn = false;
    }

    this.move = function(from, to, isEnemy = false){
		if (isEnemy) {
			console.log("Moving enemy");
			console.log(from);
			to.setPiece(from.piece);
			from.clear();
			this.board_state = squaresToBoardState(this.squares);
		} else {
			if (this.turn) {
				let possibleMoves = this.getPossibleMoves(from);
				if(from.piece){
					for (let i = 0; i < possibleMoves.length; i++) {
						if(possibleMoves[i] == to){
							//Removing the problem square class from any elements that might have it from a previous attempt
							let problemSquares = document.getElementsByClassName("problem_square");
							while (problemSquares.length)
								problemSquares[0].classList.remove("problem_square");
							let from_lastState = from.piece;
							let to_lastState = to.piece;
							to.setPiece(from.piece);
							from.clear();
							let validationOutcome = this.validateCheck(this.color);
							if (validationOutcome.safe == true) {
								console.log("Valid move!");
								this.board_state = squaresToBoardState(this.squares);
								api.sendMoves([from, to], this.player_id, this.game_id, this.board_state);
								this.endTurn();
							} else {
								console.log("Invalid Move");
								for (let i =0; i < validationOutcome.offendingPieces.length; i++) {
									validationOutcome.offendingPieces[i].cell.classList.add("problem_square");
								}
								from.setPiece(from_lastState);
								to.setPiece(to_lastState);
							}
						}
					}           
				}
            } else {
				console.log("Not your turn");
			}
		}
    }


	this.checkForMate = function(color) {
		let possibleSquaresToMove = this.getSquaresWithPiecesOfColor(color);
		for (let i =0; i < possibleSquaresToMove.length; i++) {
			let squareMoves = this.getPossibleMoves(possibleSquaresToMove[i]);
			var from = possibleSquaresToMove[i];
			var lastPiece_from = from.piece;
			
			for (let j = 0; j < squareMoves.length; j++) {
				var to = squareMoves[j];
				var lastPiece_to = to.piece;

				to.setPiece(from.piece);
				from.clear();
				let validationOutcome = this.validateCheck(this.color);
				if (validationOutcome.safe == true) {
					from.setPiece(lastPiece_from);
					to.setPiece(lastPiece_to);
					return false;
				} else {
					from.setPiece(lastPiece_from);
					to.setPiece(lastPiece_to);
				}
			}
		}
		console.log("Check-Mate");
		return true;
	}

	this.findKing = function(color) {
		var squareList = this.getSquaresWithPieces();
		for (let i = 0; i < squareList.length; i++) {
			if (squareList[i].piece.type == "king" && squareList[i].piece.color == color) {
				return squareList[i];
			}
		}
		console.log("ERROR no king found");
		return 0;
	}

	this.getSquaresWithPiecesOfColor = function(color) {
		let squareList = this.getSquaresWithPieces();
		let rightColorSquareList = [];
		for (let i = 0; i < squareList.length; i++) {
			if(squareList[i].piece.color == color) {
				rightColorSquareList.push(squareList[i]);
			}
		}
		return rightColorSquareList;
	}

	// TODO - fix loop performance. Length shoulnd't be recalculated.
	this.getSquaresWithPieces = function() {
		let squaresWithPieces = [];
		for (let i = 0; i < this.squares.length; i++) {
			for (let j = 0; j < this.squares[i].length; j++) {
				if (this.squares[i][j].piece) {
					squaresWithPieces.push(this.squares[i][j]);
				}
			}
		}
		return squaresWithPieces;
	}

    this.validateCheck = function(color){
		var kingSafe = true;
		var problemPieces = [];
		let kingSquare = this.findKing(color);
		if (!kingSquare) {
			console.log("no king found?!")
			return 0;
		}

		if (color == "white") { var enemyColor = "black"; }
		else { var enemyColor = "white";}
		
		let enemySquares = this.getSquaresWithPiecesOfColor(enemyColor);

		// Finding every valid enemy move.
		for (let i =0; i < enemySquares.length; i++) {
			let possibleMoves = this.getPossibleMoves(enemySquares[i]);
			for (let j = 0; j < possibleMoves.length; j++) {
				if (possibleMoves[j] == kingSquare) {
					kingSafe = false;
					problemPieces.push(enemySquares[i]);
				}
			}
		}
		return {safe: kingSafe, offendingPieces: problemPieces};
	}

    this.getPossibleMoves = function(square){
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
                if(!this.squares[square.y + dir*2][square.x].piece && !this.squares[square.y + dir][square.x].piece){
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
        } else {
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

//TODO -> CLEAR ACTION STORAGE.
if (pageName == "") {
	if (sessionStorage.action == "create_game"){
		var api = new PlayerAPI(createGame);
		api.socket.onopen = () => api.createGame(JSON.parse(sessionStorage.userinfo)['username'], sessionStorage.room_id);

	} else if (sessionStorage.action == "join_game"){
		var api = new PlayerAPI(joinGame);
		api.socket.onopen = () => api.joinGame(JSON.parse(sessionStorage.userinfo)['username'], sessionStorage.room_id);
	}
} else {
	sessionStorage.removeItem("action");
}

function createGame(bool, boardstate) {
	if (bool) {
		let gameInstance = new game("white",  JSON.parse(sessionStorage.userinfo)['username'], sessionStorage.room_id);
		gameInstance.turn = true;
		gameInstance.init(boardstate)
		return gameInstance;
	}
}

function joinGame(bool, boardstate) {
	if (bool) {
		let gameInstance = new game("black", JSON.parse(sessionStorage.userinfo)['username'], sessionStorage.room_id);
		gameInstance.turn = false;
		gameInstance.init(boardstate);
		return gameInstance;
	}
}
