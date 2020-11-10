class Player:
    def __init__(self, ip, color, board):
        self.ip = ip
        self.board = board
        self.lastMove = []
        self.isTurn = False
        self.color = 'w'
        self.board.addPlayer(self)

    def __str__(self):
        return self.ip
    def __repr__(self):
        return str(self.ip)
