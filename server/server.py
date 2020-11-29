from Database import Database
from player import Player
from board import Board, FullBoardError, PlayerAlreadyInBoard, WrongTurn, InsuficientPlayers
from _thread import start_new_thread
import socket
import json
import sys, traceback
import time
#Simple Socket server for chess web-admin project.
#
class Server:
    def __init__(self, ip, port):
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.ip = ip
        self.matches = {}
        self.connections = {}
        self.timeoutTime = int(60 / 0.5)
        self.database = Database(ip, port)

        try:
            self.s.bind(("", 5555))
        except socket.error as e:
            str(e)

        self.s.listen(2)
    
    def request_validation(self, data):
        #get_moves : [from, to] -> [str, str]
        if "get_moves" in data:
            for i in range(0, self.timeoutTime):
                try:
                    player = self.connections[data['player_id']]
                    return player.board.getMoves(player.name)
                except WrongTurn:
                    # It's the player turn and there is no reason to ask for moves.
                    # The only reason this exception is handled separately is because
                    # Other wise it would repeat the same movement on the client.
                    return -1

                except Exception as e:
                    #print(data['player_id'], e.message)
                    time.sleep(0.5)
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
                state = data["board_state"]
                player.board.state = state
                return 1
            except Exception as e:
                #print(e.message)
                return -1

        #join_game : id -> str
        elif "join_game" in data:
            try:
                #print(data)
                id = data["join_game"]
                if id in self.matches:
                    self.connections[data['player_id']] = Player(data['player_id'], 'black', self.matches[id])
                    # If it is a reconnect and it's not the player turn 
                    # or if it's the first time joining the game.
                    if self.matches[id].lastName == self.connections[data['player_id']].name or self.matches[id]._lastMove == []:
                        return 1
                    return 2
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
            # Reconnects.
            else:
                try:
                    self.connections[data['player_id']] = Player(data['player_id'], 'white', self.matches[id])
                    #If it's a reconnect and it's the opponent's turn
                    if self.matches[id].lastName == self.connections[data['player_id']].name:
                        return 1
                    return 2
                except Exception as e:
                    print(e)
                    return -1

        elif "board_state" in data:
            state = data["board_state"]
            #state = [state[i:i+4] for i in range(0, len(state), 4)]
            id = data["room_id"]
            if id in self.matches:
                self.matches[id].state = state
                return 1
            else:
                print("The game does not exist")
                return -1

        elif "get_board_state" in data:
            id = data["get_board_state"]
            if id in self.matches:
                return self.matches[id].state
            else:
                return -1

        #register: username, password
        elif "register" in data:
            if self.database.registerUser(data['username'], data['password']):
                info = self.database.connectUser(data['username'], data['password'])
                del info["password"]
            else:
                return -1

        elif "login" in data:
            info = self.database.connectUser(data['username'], data['password'])
            del info["password"]
            return info
            

        elif "change_user" in data:
            self.database.updateProfilePicture(data) 
            return "Data changed successfully." 
        

        else:
            print("non-identified POST")
            print(data)
            pass

    def recvall(self, sock):
        BUFF_SIZE = 2048 # 4 KiB
        data = b''
        while True:
            part = sock.recv(BUFF_SIZE)
            data += part
            if len(part) < BUFF_SIZE:
                # either 0 or end of data
                break
        return data
    def threaded_handle_connection(self, conn, addr):
        try:
            data = self.recvall(conn).decode()
            data = data.split("\n")[-1] #post request
            data = json.loads(data)
            message = self.request_validation(data)

        except Exception as e:
            print("disconecting")
            conn.close()
            

        response = self.generateResponse(message)
        try:
            for info in response:
                conn.send(str.encode(info))
        except:
            print("disconnected")
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
    try:
        server = Server(sys.argv[1], int(sys.argv[2]))
        print(f"Attatched to database on port {sys.argv[2]}.")
    except Exception as e:
        print("Couldn't attach to local database.")
        print("Usage: server.py IP PORT")
        sys.exit()

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
