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
// Element must be a table element that the board will be created in
// Squares must be a 2d array of squares in the same format as the board object type
function drawBoard(element, squares){
    let guiSquares = [];
        for (let i = 0; i < 9; i++) {
            let row = document.createElement("TR");
            guiSquares.push([]);
            for (let j = 0; j < 9; j++) {
                let cell = document.createElement("TD");
                row.appendChild(cell);
                cell.innerHTML = squares[i][j].piece.charcode;
                guiSquares[i].push(cell);
            }
        element.appendChild(row);
    }
}