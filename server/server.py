import json
from Database import Database
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
        self.connections = {}
        self.timeoutTime = int(60 / 0.5)
        self.database = Database("192.168.2.12", 5432);


        #Tries to open the server at the specified port
        try:
            self.s.bind((self.ip, self.port))
        except socket.error as e:
            str(e)

        self.s.listen(2)
    
    def request_validation(self, data):
        #get_moves : [from, to] -> [str, str]
        print(data)
        if "get_moves" in data:
            for i in range(0, self.timeoutTime):
                try:
                    player = self.connections[data['player_id']]
                    print(player)
                    return player.board.getMoves(player.name)
                except Exception as e:
                    print(data['player_id'], e.message)
                    time.sleep(0.5)
                    print("t")
            return -1
            
        elif "get_status" in data:
            for i in range(0, self.timeoutTime):
                if len(player.board.players) != 2: 
                    #print("waiting for player")
                    time.sleep(0.5)
                else:
                    return 1
            return -1

        elif "get_matches" in data:
            message = {}
            for match in self.matches:
                message[match] = self.matches[match].getInfo();
            if message == {}:
                message["empty"] = "empty"

            return message

        #make_move : [from, to] -> [str,str]
        elif "make_move" in data:
            try:
                player = self.connections[data['player_id']]
                move = data["make_move"]
                player.board.movePiece(move, player.name)
                return 1
            except Exception as e:
                #print(e.message)
                return -1

        #join_game : id -> str
        elif "join_game" in data:
            print("join game")
            try:
                #print(data)
                id = data["join_game"]
                if id in self.matches:
                    self.connections[data['player_id']] = Player(data['player_id'], 'black', self.matches[id])
                    return 1
                else:
                    print("The game does not exist")
                    return -1

            except Exception as e:
                print("exception", e)
                return -1

        #create_game : id -> str
        elif "create_game" in data:
            #print(dat)
            #print("create game")
            id = data['create_game']
            if id not in self.matches:
                board = Board(id)
                self.matches[id] = board 
                self.connections[data['player_id']] = Player(data['player_id'], 'white', board)
                return 1
            else:
                #print("Player is already in match")
                return -1

        #register: username, password
        elif "register" in data:
            return 1 if self.database.registerUser(data['username'], data['password']) else -1

        elif "login" in data:
            return self.database.connectUser(data['username'], data['password']); 
               
        elif "user_id" in data:
            return 



        else:
            print("non-identified POST")
            print(data)
            pass

    def threaded_handle_connection(self, conn, addr):

        try:
            data = conn.recv(2048).decode()
            data = data.split("\n")[-1] #post request
            data = json.loads(data)
            message = self.request_validation(data)
            #If the board does not exist, creates it and then put player inside of it.
            #message = self.matches[data['board']].handlePost(data)
            
            #print(message)


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
        msg = json.dumps(msg, default=str)
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
    server = Server("", 5555)
    #For some reason, I can't listen inside class. Maybe it's some thread/self problem 
    while True:
        try:
            '''listen for new connections'''
            conn, addr = server.s.accept()
            # Creates a thread for each new connection. The thread should exist for less than a second
            # So it's not really an issue.
            start_new_thread(server.threaded_handle_connection, (conn, addr))

        except Exception as e:
            #print(e)
            traceback.print_exc(file=sys.stdout)
            conn.close()
            break
