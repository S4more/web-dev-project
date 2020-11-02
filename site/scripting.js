var board = document.getElementById('chess_board');

function initalizeChessBoard(board){
    var rows = [];
    for (let i = 0; i < 8; i++) {
        rows.push(document.createElement("TR"));
        for (let j = 0; j < 8; j++) {
            rows[i].appendChild(document.createElement("TD"));
        }
        board.appendChild(rows[i]);
    }
}

initalizeChessBoard(board);

board.style.height = board.offsetWidth + "px";
if(window.addEventListener) {
    window.addEventListener('resize', function() {
    board.style.height = board.offsetWidth + "px";
}, true);
}
else {
	console.log("your browser does not support window resize events, the site may display strangly if you resize the window");
}