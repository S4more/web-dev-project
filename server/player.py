class Player:
    def __init__(self, ip, color, board):
        self.ip = ip
        self.board = board
        self.isTurn = False
        self.color = 'w'

    def __str__(self):
        return self.ip
    def __repr__(self):
        return self.ip
