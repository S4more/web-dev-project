
def char_range(char1, char2):
    '''Generator to loop through characters'''
    for character in range (ord(char1), ord(char2)+1):
            yield chr(character)

def letterToNumber(letter):
    return int(ord(letter) - 97)

def numberToLetter(number):
    return(chr(97 + number))

class Board:
    def __init__(self, id):
        self.id = id
        # Every board needs to have 2 players to start the game.
        # Player 0 will be white and player 1 will be black.
        self.pieces = [0, 1]
        self.players = []
        self.cols = [letter for letter in char_range('a', 'h')]
        self.rows = [str(number) for number in range(1,9)]
        self.board = [[] for i in range(0, 8)]

    def start(self):
        '''Populates the board with cols-rows list'''
        for row in reversed(range(0,8)):
            for col in range(0,8):
                self.board[7-row].append(self.cols[col] + self.rows[row])

    def addPiece(self, squarePos, piece):
        '''Adds a piece at an specific square'''
        self.board[8-int(squarePos[1])][letterToNumber(squarePos[0])] = piece

    def getPiecePosition(self, piece):
        for row in range(0, 8):
           for col in range(0, 8):
               if self.board[row][col] == piece:
                   return numberToLetter(col), 8-row
    
    def getPieceAtPosition(self, position):
        return self.board[8-int(position[1])][letterToNumber(position[0])]

    def printBoard(self):
        for row in self.board:
            print(row)

if __name__ == '__main__':
    board = Board(1)
    board.start()
    board.printBoard()
