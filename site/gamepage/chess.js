
function chessBoard(){
    this.table = document.getElementById('chess_board');
    this.board = [];
    //Creates the HTML elements and initalizes the square objects for the board
    this.initalize = function(){
        for (let i = 0; i < 8; i++) {
            let row = document.createElement("TR");
            testChild = document.createElement("TD");
            testChild.innerHTML = toAB(i,2)[0];
            testChild.class = "letter_marker"
            row.appendChild(testChild);
            this.board.push([]);
            for (let j = 0; j < 8; j++) {
                let newSquare = new square(toAB(i, j), this);
                newSquare.piece = new piece("white", "PAWN");
                this.board[i].push(newSquare);
                row.appendChild(this.board[i][j].elem);
            }
            this.table.appendChild(row);
        }
        let row = document.createElement("TR");
        row.appendChild(document.createElement("TD"));
        for (let i = 1; i <= 8; i++) {
            td = document.createElement("TD");
            td.innerHTML = i;
            td.class = "number_marker"
            row.appendChild(td);
        }
        this.table.appendChild(row); 
        console.log(this.board);
    }

    this.setupPieces = function(){
        //Pawns
        for (let i = 0; i < 8; i++) {
            this.board[6][i].setPiece(new piece("white", "PAWN", this.board[i][6]));
            this.board[1][i].setPiece(new piece("black", "PAWN", this.board[i][1]));
        }

        //WHITE
        //Rooks
        this.board[7][0].setPiece(new piece("white", "ROOK", this.board[7][0]));
        this.board[7][7].setPiece(new piece("white", "ROOK", this.board[7][7]));
        //Knights
        this.board[7][1].setPiece(new piece("white", "KNIGHT", this.board[7][1]));
        this.board[7][6].setPiece(new piece("white", "KNIGHT", this.board[7][6]));
        //Bishops
        this.board[7][2].setPiece(new piece("white", "BISHOP", this.board[7][2]));
        this.board[7][5].setPiece(new piece("white", "BISHOP", this.board[7][5]));
        //King&Queen
        this.board[7][3].setPiece(new piece("white", "QUEEN", this.board[7][3]));
        this.board[7][4].setPiece(new piece("white", "KING", this.board[7][4]));

        //BLACK
        //Rooks
        this.board[0][0].setPiece(new piece("black", "ROOK", this.board[0][0]));
        this.board[0][7].setPiece(new piece("black", "ROOK", this.board[0][7]));
        //Knights
        this.board[0][1].setPiece(new piece("black", "KNIGHT", this.board[0][1]));
        this.board[0][6].setPiece(new piece("black", "KNIGHT", this.board[0][6]));
        //Bishops
        this.board[0][2].setPiece(new piece("black", "BISHOP", this.board[0][2]));
        this.board[0][5].setPiece(new piece("black", "BISHOP", this.board[0][5]));
        //Bishops
        this.board[0][3].setPiece(new piece("black", "QUEEN", this.board[0][3]));
        this.board[0][4].setPiece(new piece("black", "KING", this.board[0][4]));
    }


    //Cords must be entered using only lower case letters ex "a5" not "A5".
    //The order must be "letter:Number" not the reverse.
    this.getPiece = function(cords){
        if(96 < cords.charCodeAt(0) < 105){
            var x = cords.charCodeAt(0) - 97;
        } else{
            return 0;
        }
        if(0 < Number(cords.charAt(1)) < 9){
            var y = Number(cords.charAt(1)) -1;
        } else{
            return 0;
        }
        return this.board[x][y];
    }
    //Cords must be entered using only lower case letters ex "a5" not "A5".
    //The order must be "letter:Number" not the reverse.
    //piece must be a piece object
    this.setPiece = function(cords, piece){
        console.log(cords);
        let indexes = toXY(cords);
        
    }

    
}

function square(cords, board){
    this.board = board;
    this.elem = document.createElement("TD");
    this.elem.pSquare = this;
    this.piece = null;
    this.cords = cords;

    this.click = function(){
        console.log(this.cords);
    }
    this.elem.onclick = function(){
        this.pSquare.click();
    }
    this.setPiece = function(piece){
        this.piece = piece;
        console.log(this.piece.charCode);
        this.elem.innerHTML = this.piece.charCode;
    }
}  
//Convers from array indexes on the board to letter:number notation
function toAB(x, y){
    var code = "";
    code += (String.fromCharCode(x + 97));
    code += (y+1);
    return code;
}

//Convers from letter:number notation to indexes on the board: Returns null if the position is invalid
function toXY(cords){
    console.log(cords);
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
    return [x, y];
}

// object to define an indevidual piece given color and name: name must be all caps string ex "KING"
// color is given as all non-caps string "white" or "black", if an invalid color is given it will default to white
// @peram tile parent board tile containing piece
function piece(color,name , square){
    this.square = square;
    this.name = name;
    this.color = color;

    //returns char code associated with color and piece type
    this.getCharCode = function(color, name){
        if(color == "black"){
            if(name == "KING")return "&#9818";
            if(name == "QUEEN")return "&#9819";
            if(name == "ROOK")return "&#9820";
            if(name == "BISHOP")return "&#9821";
            if(name == "KNIGHT")return "&#9822";
            if(name == "PAWN")return "&#9823";
        } else{
            if(name == "KING")return "&#9812";
            if(name == "QUEEN")return "&#9813";
            if(name == "ROOK")return "&#9814";
            if(name == "BISHOP")return "&#9815";
            if(name == "KNIGHT")return "&#9816";
            if(name == "PAWN")return "&#9817";
        }
    }
    this.charCode = this.getCharCode(this.color, this.name);
}

function getRandPiece(){
    var pieces = 
    ["&#9812",
    "&#9813",
    "&#9814",
    "&#9815",
    "&#9816",
    "&#9817",
    "&#9818",
    "&#9819",
    "&#9820",
    "&#9821",
    "&#9822",
    "&#9823"]
    return pieces[Math.floor(Math.random()*pieces.length)];
}


myBoard = new chessBoard();
myBoard.initalize();
myBoard.setupPieces();