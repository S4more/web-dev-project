import json
from player import Player
from board import Board, FullBoardError, PlayerAlreadyInBoard, WrongTurn  
import socket
from _thread import start_new_thread
import sys, traceback

#Simple Socket server for chess web-admin project.
#
class Server:
    def __init__(self, ip, port):
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.ip = ip
        self.port = port
        self.matches = {}

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

    def threaded_handle_connection(self, conn, addr):
        print(f"new connection from {addr}")
        try:
            data = conn.recv(2048).decode()
            data = data.split("\n")[-1] #post request
            data = json.loads(data)

            #If the board does not exist, creates it and then put player inside of it.
            if data['board'] not in self.matches:
                self.matches[data['board']] = Board([data['board']])
            self.matches[data['board']].addPlayer(Player(data['id'], 'white', data['board']))

        except FullBoardError:
            message = "There are already two players on this board."

        # All the turn logic happens here
        except PlayerAlreadyInBoard:
            try:
                self.matches[data['board']].addPiece(data['square'], data['piece'], data['id'])
                message = "..." 
            except WrongTurn:
                message = "It's not your turn. Please wait"

        except Exception as e:
            traceback.print_exc(file=sys.stdout)
        
        else: 
            #message = self.client_handler(conn, addr)
            message = "here"

        response = self.generateResponse("{'answer':'%s'}" % message)
        for info in response:
            conn.send(str.encode(info))
        conn.close()
    
    def generateResponse(self, msg):
        '''Creates the right headers so javascript will accept the informations.'''
        msg = f"\"{msg}\""
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
