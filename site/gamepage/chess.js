
function chessBoard(){
    this.table = document.getElementById('chess_board');
    this.board = [];
    this.initalize = function(){
        for (let i = 0; i < 8; i++) {
            let row = document.createElement("TR");
            testChild = document.createElement("TD");
            testChild.innerHTML = toAB(i,2)[0];
            testChild.class = "letter_marker"
            row.appendChild(testChild);
            this.board.push([]);
            for (let j = 0; j < 8; j++) {
                this.board[i].push(new square(toAB(i, j)));
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


    this.getPiece = function(cords){
        cords = cords.toLowerCase();
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
}

function square(cords){
    this.elem = document.createElement("TD");
    this.piece = null;
    this.cords = cords;
    //this.elem.innerHTML = this.cords;
    this.elem.onclick = function(){
            this.innerHTML = getRandPiece();
        };
    }


function toAB(x, y){
    var code = "";
    code += (String.fromCharCode(x + 97));
    code += (y+1);
    return code;
}

function piece(name, color){
    this.name = name;
    this.color = color;
    this.charCode = this.getCharCode(this.color, this.name);
    this.getCharCode = function(color, piece){
        if(color == "black"){
            if(piece == "KING")return "&#9812";
            if(piece == "QUEEN")return "&#9813";
            if(piece == "ROOK")return "&#9814";
            if(piece == "BISHOP")return "&#9815";
            if(piece == "KNIGHT")return "&#9816";
            if(piece == "PAWN")return "&#9817";
        } else{
            if(piece == "KING")return "&#9818";
            if(piece == "QUEEN")return "&#9819";
            if(piece == "ROOK")return "&#9820";
            if(piece == "BISHOP")return "&#9821";
            if(piece == "KNIGHT")return "&#9822";
            if(piece == "PAWN")return "&#9823";
        }
    }
}

//Get char code corrisponding to the chess piece based on name and color


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