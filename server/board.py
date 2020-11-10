from player import Player
class WrongTurn(Exception):
    def __init__(self):
        self.message = "board.WrongTurn"
class InsuficientPlayers(Exception):
    def __init__(self):
        self.message = "board.insuficientPlayers"

class FullBoardError(Exception):
    pass

class PlayerAlreadyInBoard(Exception):
    pass

class moveNotYetMade(Exception):
    def __init__(self):
        self.message = "board.moveNotYetMade"

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
        self.moves = 0
        self._lastMove = []
        self.lastIp = None
        self.players = []
        self.cols = [letter for letter in char_range('a', 'h')]
        self.rows = [str(number) for number in range(1,9)]
        self.board = [[] for i in range(0, 8)]
        self.start()
    
    def flipSide(self):
        lastMove = self._lastMove
        print(lastMove)
        for key in self._lastMove:
            for cord in self._lastMove[key]:
                lastMove[key][0] = 8 - cord

        return lastMove

    def getMoves(self, ip):
        if len(self.players) < 2:
            raise InsuficientPlayers
        if self.lastIp == ip or self._lastMove == []:
            raise moveNotYetMade
        return self._lastMove

    def start(self):
        '''Populates the board with cols-rows list'''
        for row in reversed(range(0,8)):
            for col in range(0,8):
                self.board[7-row].append(self.cols[col] + self.rows[row])
    
    def handlePost(self, data):
        try:
            self.addPlayer(Player(data['id'], 'w', self))
            return f"You are now in board {self.id}"
        except FullBoardError:
            return "There are already two players on this board."

        # All the turn logic happens here
        except PlayerAlreadyInBoard:
            try:
                self.addPiece(data['square'], data['piece'], data['id'])
                return "piece moved" 
            except WrongTurn:
                return "It's not your turn. Please wait"

            except InsuficientPlayers:
                return "Please wait for another player to join."

    
    def addPlayer(self, player):
        '''add player to board'''
        if player.ip in [player.ip for player in self.players]:
            raise PlayerAlreadyInBoard
        if len(self.players) >= 2: # If there are two players, make sure that no one else is added
            raise FullBoardError
        self.players.append(player)

    def movePiece(self, move, ip):
        '''Adds a piece at an specific square'''
        print(f"ip {ip}, lastIp {self.lastIp}")
        # If there is no ip and it is not players[0] 
        if self.lastIp == None and not self.players[0].ip == ip:
            raise WrongTurn
        if ip == self.lastIp:
            raise WrongTurn
        if len(self.players) < 2:
            raise InsuficientPlayers
        self.lastIp = ip
        #piece += 'w' if self.moves % 2 == 0 else 'b'
        #self.board[8-int(squarePos[1])][letterToNumber(squarePos[0])] = piece
        self._lastMove = move
        self.moves += 1

    def getPiecePosition(self, piece):
        for row in range(0, 8):
           for col in range(0, 8):
               if self.board[row][col] == piece:
                   return numberToLetter(col), 8-row
    
    def getPieceAtPosition(self, position):
        return self.board[8-int(position[1])][letterToNumber(position[0])]

    def printBoard(self):
        print(self.players)
        for row in self.board:
            print(row)

if __name__ == '__main__':
    board = Board(1)
    board.start()
    board.printBoard()
