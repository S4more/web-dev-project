function client(name, ip){
    this.status = "starting"
    joinGame = function(playerName, color){
        return;
    }  
    this.initalizeGame = function(color){

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

function game(color){
    this.color = color;
    this.selectedSquare = null;
    
    this.initalizeGui = function(){
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
        return guiSquares;
    }

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
                squares[i][j].cell.square = squares[i][j];
                squares[i][j].cell.onclick = function(){
                    this.square.board.clickOn(this.square);
                }
            }
        }
    }

    this.setMarkers = function(boardGUI, color){
        console.log(boardGUI);
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

    this.boardGUI = this.initalizeGui();
    this.setMarkers(this.boardGUI, this.color);
    this.squares = this.initalizeSquares();
    this.linkGameBoard(this.squares, this.boardGUI, this.color);
    this.placePieces(this.squares, initalState);

    this.move = function(from, to){
        validMoves = this.getValidMoves(from);
        if(from.piece){
            for (let i = 0; i < validMoves.length; i++) {
                if(validMoves[i] == to){
                    to.setPiece(from.piece);
                    from.clear();
                }
            }           
        }
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
            if(square.piece.color == "white"){
                dir = 1;
            } else{
                dir = -1;
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
    this.board = board;

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
function toAB(x, y){
    var code = "";
    code += (String.fromCharCode(x + 97));
    code += (y + 1);
    return code;
}

//Converts from letter:number notation to indexes on the board: Returns null if the position is invalid
function toXY(cords){
    if(96 < cords.charCodeAt(0) < 105){
        var x = cords.charCodeAt(0) - 97;
    } else{
        return null;
    }
    if(0 < Number(cords.charAt(1)) < 9){
        var y = Number(cords.charAt(1)) -1;
    } else{
        return null;
    }
    return {x:x, y:y};
}

myGame = new game("black");