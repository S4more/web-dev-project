import json
from player import Player
from board import Board, FullBoardError, PlayerAlreadyInBoard, WrongTurn, InsuficientPlayers
import socket
from _thread import start_new_thread
import sys, traceback
import time

#Simple Socket server for chess web-admin project.
#
class Server:
    def __init__(self, ip, port):
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.ip = ip
        self.port = port
        self.matches = {}
        self.connections = []
        self.timeoutTime = int(60 / 0.2)

        #Tries to open the server at the specified port
        try:
            self.s.bind((self.ip, self.port))
        except socket.error as e:
            str(e)

        self.s.listen(2)

    def client_handler(self, conn, addr) -> str:
        if addr[0] not in self.matches:
            #Each IP will be associated with a Player object.
            #And ideally with a chess board object as well.
            self.matches[addr[0]] = "k"
            return "registered"
        else:
            return "already in game"
    
    def request_validation(self, data):
        #get_moves : [from, to] -> [str, str]
        if "get_moves" in data:
            for i in range(0, self.timeoutTime):
                try:
                    player = self.connections[data['player_id']]
                    return player.board.getMoves(player.ip)
                except Exception as e:
                    print(data['player_id'], e.message)
                    time.sleep(0.2)
            return -1
            
        elif "get_status" in data:
            for i in range(0, self.timeoutTime):
                if len(player.board.players) != 2: 
                    print("waiting for player")
                    time.sleep(2)
                else:
                    return 1
            return -1

        elif "get_matches" in data:
            message = {}
            for match in self.matches:
                message[match] = len(self.matches[match].players)

            return message

        #make_move : [from, to] -> [str,str]
        elif "make_move" in data:
            try:
                player = self.connections[data['player_id']]
                move = data["make_move"]
                player.board.movePiece(move, player.ip)
                return 1
            except Exception as e:
                print(e.message)
                return -1

        #join_game : id -> str
        elif "join_game" in data:
            try:
                print(data)
                id = data["join_game"]
                if id in self.matches:
                    self.connections.append(Player(data['player_id'], 'black', self.matches[id]))
                    return 1
                else:
                    print("The game does not exist")
                    return -1

            except Exception as e:
                print(e)
                return -1

        #create_game : id -> str
        elif "create_game" in data:
            print(data)
            id = data['create_game']
            if id  not in self.matches:
                board = Board(id)
                self.matches[id] = board 
                self.connections.append(Player(data['player_id'], 'white', board))
                return 1
            else:
                print("Player is already in match")
                return -1

        else:
            print("non-identified POST")
            print(data)

    def threaded_handle_connection(self, conn, addr):

        try:
            data = conn.recv(2048).decode()
            data = data.split("\n")[-1] #post request
            data = json.loads(data)
            message = self.request_validation(data)
            #If the board does not exist, creates it and then put player inside of it.
            #message = self.matches[data['board']].handlePost(data)
            
            print(message)


        except Exception as e:
            traceback.print_exc(file=sys.stdout)

        response = self.generateResponse(message)
        for info in response:
            conn.send(str.encode(info))
        conn.close()
    
    def generateResponse(self, msg):
        '''Creates the right headers so javascript will accept the informations.'''
        #msg = "\"{\"answer\":\"{}\"}\"".format(msg)
        msg = {"answer":msg}
        msg = json.dumps(msg)
        response_headers = {
                'Content-Type': 'text/html; encoding=ut8',
                'Content-Length': len(msg),
                'Connection': 'close',
                'Access-Control-Allow-Origin' : '*'
                }
        response_headers_raw = ''.join('%s: %s\r\n' % (k, v) for k, v in response_headers.items())
        response_proto = 'HTTP/1.1'
        response_status = '200'
        response_status_text = 'OK'
        r = '%s %s %s\r\n' % (response_proto, response_status, response_status_text)
        return [r, response_headers_raw, '\r\n', msg]

if __name__ == '__main__':
    server = Server("localhost", 5555)
    #For some reason, I can't listen inside class. Maybe it's some thread/self problem 
    while True:
        try:
            '''listen for new connections'''
            conn, addr = server.s.accept()
            # Creates a thread for each new connection. The thread should exist for less than a second
            # So it's not really an issue.
            start_new_thread(server.threaded_handle_connection, (conn, addr))

        except Exception as e:
            print(e)
            traceback.print_exc(file=sys.stdout)
            conn.close()
            break
