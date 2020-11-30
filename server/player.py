class Player:
    def __init__(self, socket, name, color, board):
        self.name = name 
        self.board = board
        self.socket = socket
        self.lastMove = []
        self.isTurn = False
        #self.color = color
        self.color = 'w'

    async def init(self):
        await self.board.addPlayer(self)

    def __str__(self):
        return self.name
    def __repr__(self):
        return str(self.name)
