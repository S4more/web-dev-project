from Database import Database
import datetime
from player import Player
from board import Board, FullBoardError, PlayerAlreadyInBoard, WrongTurn, InsuficientPlayers
import json
import sys, traceback
import time
import asyncio
import websockets, websockets.exceptions
from _thread import start_new_thread

class Server:
    def __init__(self):
        self.ip = "192.168.2.12"
        self.ll = []
        self.matches = {}
        self.connections = {}
        self.timeoutTime = int(60 / 0.5)
        self.database = Database(self.ip, 5432)

    
    async def request_validation(self, data, websocket):
        action = data["action"]
        if "get_moves" == action:
            for i in range(0, self.timeoutTime):
                try:
                    player = self.connections[websocket]
                    return player.board.getMoves(player.name)
                except WrongTurn:
                    # It's the player turn and there is no reason to ask for moves.
                    # The only reason this exception is handled separately is because
                    # Other wise it would repeat the same movement on the client.
                    return -1

                except Exception as e:
                    time.sleep(0.5)
            return -1
            
        elif "get_status" == action:
            for i in range(0, self.timeoutTime):
                if len(player.board.players) != 2: 
                    #print("waiting for player")
                    time.sleep(0.5)
                else:
                    return 1
            return -1

        elif "get_matches" == action:
            message = {}
            for match in self.matches:
                message[match] = self.matches[match].getInfo();
            if message == {}:
                message["empty"] = "empty"

            return message

        #make_move : [from, to] -> [str,str]
        elif "make_move" == action:
            try:
                player = self.connections[websocket]
                move = [data["from"], data["to"]]
                player.board.movePiece(move, player.name)
                state = data["board_state"]
                player.board.state = state
                await player.board.sendToOpponent(data["from"], data["to"]);
                return 1
            except Exception as e:
                print(e.message)
                return -1

        #join_game : id -> str
        elif "game_joined" == action:
            try:
                #print(data)
                id = data["game_id"]
                if id in self.matches:
                    self.connections[websocket] = Player(websocket, data['player_id'], 'black', self.matches[id])
                    await self.connections[websocket].init()
                    # If it is a reconnect and it's not the player turn 
                    # or if it's the first time joining the game.
                    if self.matches[id].lastName == self.connections[websocket].name or self.matches[id]._lastMove == []:
                        return {"type": 1, "state":self.matches[id].state} 
                    return {"type": 2, "state":self.matches[id].state} 
                else:
                    print("The game does not exist")
                    return -1

            except Exception as e:
                print(e)
                return -1

        #create_game : id -> str
        elif "game_created" == action:
            #print(dat)
            #print("create game")
            id = data['game_id']
            if id not in self.matches:
                board = Board(id)
                self.matches[id] = board 
                self.connections[websocket] = Player(websocket, data['player_id'], 'white', board)
                await self.connections[websocket].init()
                return {"type": 1, "state": board.state} 
            # Reconnects.
            else:
                try:
                    self.connections[websocket] = Player(websocket, data['player_id'], 'white', self.matches[id])
                    await self.connections[websocket].init()
                    #If it's a reconnect and it's the opponent's turn
                    if self.matches[id].lastName == self.connections[websocket].name:
                        return {"type": 1, "state": self.matches[id].state}
                    return {"type": 2, "state": self.matches[id].state} 
                except Exception as e:
                    print(e)
                    return -1

        elif "get_board_state" == action:
            id = data["board_id"]
            if id in self.matches:
                return self.matches[id].state
            else:
                return -1

        elif "board_state" == action:
            state = data["state"]
            #state = [state[i:i+4] for i in range(0, len(state), 4)]
            id = data["room_id"]
            if id in self.matches:
                self.matches[id].state = state
                return 1
            else:
                print("The game does not exist")
                return -1


        #register: username, password
        elif "register" == action:
            if self.database.registerUser(data['username'], data['password']):
                info = self.database.connectUser(data['username'], data['password'])
                print(info)
                del info["password"]
                return info
            else:
                return -1

        elif "login" == action:
            info = self.database.connectUser(data['username'], data['password'])
            del info["password"]
            return info
            

        elif "change_user" == action:
            self.database.updateProfilePicture(data) 
            return "Data changed successfully." 
        

        else:
            print("non-identified POST")
            print(data)
            pass

    async def async_connection(self, websocket, path):
        received = await websocket.recv()
        received = json.loads(received)
        message = await self.request_validation(received, websocket)
        response = self.generateResponse(message, received)
        await websocket.send(response)

    def generateResponse(self, ans, received):
        '''Creates the right headers so javascript will accept the informations.'''
        try:
            msg = {"action":received["action"], "answer" : ans}
            msg = json.dumps(msg, default=str)
            return msg
        except:
            return "Error"

serverH = Server()
async def server(websocket, path):
    try:
        while True:
            await serverH.async_connection(websocket, path)        
    except websockets.exceptions.ConnectionClosedOK:
        if websocket in serverH.connections:
            await serverH.connections[websocket].board.removePlayer(serverH.connections[websocket])
            del serverH.connections[websocket]

def removeInactiveGames():
    while True:
        toDelete = None
        time.sleep(10)
        for match in serverH.matches.copy():
            print("verifying")
            if serverH.matches[match].lastActionTime == None:
                continue

            if (datetime.datetime.now() - serverH.matches[match].lastActionTime).total_seconds() > 60:
                print("deleted")
                del serverH.matches[match]
        

start_server = websockets.serve(server, "localhost", 5000)
start_new_thread(removeInactiveGames, ())
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

