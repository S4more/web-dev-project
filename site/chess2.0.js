function client(name, ip){
    this.status = "starting"
    joinGame = function(playerName, color){
        return;
    }  
    this.initalizeGame = function(color){

    }
}
function board(color){
    this.status = "none";
    this.selectedSquare = null;
    this.squares = [];
    this.gui = document.getElementById("chess_board");
    this.color = color;
    this.getSquare = function(cords){
        if(this.color == "black"){
            var vOffset = 0;
            var hOffset = 7;
        } else{
            var vOffset = 7;
            var hOffset = 0;
        }
        let pos = toXY(cords);
        pos.x = Math.abs(hOffset-pos.x);
        pos.y = Math.abs(vOffset-pos.y);
        return this.squares[pos.x][pos.y];
    }


    this.initalizeBoard = function(color){
        if(this.color == "black"){
            var vOffset = 7;
            var hOffset = 0;
        } else{
            var vOffset = 0;
            var hOffset = 7;
        }
        //Define row
        for (let i = 0; i < 8; i++) {
            let row = document.createElement("TR");
            let verticalMarker = document.createElement("TD");
            verticalMarker.innerHTML = Math.abs(hOffset-i)+1;
            verticalMarker.class = "number_marker";
            row.appendChild(verticalMarker);
            this.squares.push([]);
            //Define cell in row
            for (let j = 0; j < 8; j++) {
                let newSquare = new square(toAB(Math.abs(vOffset-j), Math.abs(hOffset-i)), this);
                this.squares[i].push(newSquare);
                row.appendChild(this.squares[i][j].elem);
            }
            this.gui.appendChild(row);
        }
        //Create bottom letter marker row
        row = document.createElement("TR");
        row.appendChild(document.createElement("TD"));
        for (let i = 0; i < 8; i++) {
            let cell = document.createElement("TD");
            cell.class = "letter_marker";
            cell.innerHTML = toAB(Math.abs(vOffset-i), 0)[0];
            row.appendChild(cell);
        }
        this.gui.appendChild(row);
    }
    this.initalizeBoard(this.color);

    tempPieces = setupPieces();
    for (let i = 0; i < tempPieces.length; i++) {
        this.getSquare(tempPieces[i].cords).setPiece(tempPieces[i]);
    }
}
function square(cords, board){
    this.cords = cords;
    this.pos = toXY(cords);
    this.piece;
    this.elem = document.createElement("TD");
    this.elem.parentSquare = this;
    this.board = board;
    this.setPiece = function(piece){
        this.piece = piece;
        if(this.piece){
            this.elem.innerHTML = this.piece.charCode;
        } else{
            this.elem.innerHTML = "";
        }
        
    }
    this.click = function(){
        console.log("Clicked cords are: " + this.cords);
        this.getValidMoves();
        if (!this.board.selectedSquare){
            this.board.selectedSquare = this;
            this.elem.classList.add('selected');
            console.log(this.elem);
        } else{
            if (this.piece){
                this.board.selectedSquare.elem.classList.remove('selected');
                this.board.selectedSquare = null;
                console.log("invalid move");
            } else{
                this.setPiece(this.board.selectedSquare.piece);
                this.board.selectedSquare.setPiece(null);
                this.board.selectedSquare.elem.classList.remove('selected');
                this.board.selectedSquare = null;
            }
        }
    }

    this.elem.onclick = function(){
        this.parentSquare.click();
    }

    this.getValidMoves = function(){
        let movesList = [];
        if (this.piece) {
            if (this.piece.name == "ROOK") {
                let directions = [[1,0],[-1,0],[0,1],[0,-1]];
                for(let i = 0; i < directions.length - 1; i ++){
                    for(let j = 1; j <= 7; j++){
                        try {
                            toCheck = this.board.squares[this.pos.x + (j * directions[i][0])] [this.pos.y + (j * directions[i][1])];
                        }
                        catch(error) {
                            break;
                        }
                        if(toCheck){
                            if(toCheck.piece){
                                console.log("hit: " + toCheck.piece.name);
                                console.log("at: " + toCheck.cords);
                                if(toCheck.piece.color == this.piece.color){
                                    break;
                                } else{
                                    movesList.push(toAB(this.pos.x + j*directions[i][0], this.pos.y + j*directions[i][1]));
                                    break;
                                }
                            } else{
                                movesList.push(toAB(this.pos.x + j*directions[i][0], this.pos.y + j*directions[i][1]));
                            }
                        } else{
                            break;
                        }
                    }
                }
                console.log(movesList);
            }
        }
    }
}    


function toAB(x, y){
    var code = "";
    code += (String.fromCharCode(x + 97));
    code += (y+1);
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

piece = function(color, name, cords){
    this.name = name;
    this.color = color;
    this.cords = cords;
    if(this.color == "black"){
        if(this.name == "KING")this.charCode = "&#9818";
        if(this.name == "QUEEN")this.charCode = "&#9819";
        if(this.name == "ROOK")this.charCode = "&#9820";
        if(this.name == "BISHOP")this.charCode = "&#9821";
        if(this.name == "KNIGHT")this.charCode = "&#9822";
        if(this.name == "PAWN")this.charCode = "&#9823";
    } else{
        if(this.name == "KING")this.charCode = "&#9812";
        if(this.name == "QUEEN")this.charCode = "&#9813";
        if(this.name == "ROOK")this.charCode = "&#9814";
        if(this.name == "BISHOP")this.charCode = "&#9815";
        if(this.name == "KNIGHT")this.charCode = "&#9816";
        if(this.name == "PAWN")this.charCode = "&#9817";
    }
}

setupPieces = function(){
    let pieces = [];
    pieces.push(new piece("white", "PAWN", "g1"));
    pieces.push(new piece("white", "PAWN", "g2"));
    pieces.push(new piece("white", "PAWN", "g3"));
    pieces.push(new piece("white", "PAWN", "g4"));
    pieces.push(new piece("white", "PAWN", "g5"));
    pieces.push(new piece("white", "PAWN", "g6"));
    pieces.push(new piece("white", "PAWN", "g7"));
    pieces.push(new piece("white", "PAWN", "g8"));
    pieces.push(new piece("white", "ROOK", "h1"));
    pieces.push(new piece("white", "ROOK", "h8"));
    pieces.push(new piece("white", "KNIGHT", "h2"));
    pieces.push(new piece("white", "KNIGHT", "h7"));
    pieces.push(new piece("white", "BISHOP", "h3"));
    pieces.push(new piece("white", "BISHOP", "h6"));
    pieces.push(new piece("white", "QUEEN", "h4"));
    pieces.push(new piece("white", "KING", "h5"));

    pieces.push(new piece("black", "PAWN", "b1"));
    pieces.push(new piece("black", "PAWN", "b2"));
    pieces.push(new piece("black", "PAWN", "b3"));
    pieces.push(new piece("black", "PAWN", "b4"));
    pieces.push(new piece("black", "PAWN", "b5"));
    pieces.push(new piece("black", "PAWN", "b6"));
    pieces.push(new piece("black", "PAWN", "b7"));
    pieces.push(new piece("black", "PAWN", "b8"));
    pieces.push(new piece("black", "ROOK", "a1"));
    pieces.push(new piece("black", "ROOK", "a8"));
    pieces.push(new piece("black", "KNIGHT", "a2"));
    pieces.push(new piece("black", "KNIGHT", "a7"));
    pieces.push(new piece("black", "BISHOP", "a3"));
    pieces.push(new piece("black", "BISHOP", "a6"));
    pieces.push(new piece("black", "QUEEN", "a4"));
    pieces.push(new piece("black", "KING", "a5"));
    return pieces;
}

myBoard = new board("white");