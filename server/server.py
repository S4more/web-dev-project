import socket
from _thread import start_new_thread
import sys, traceback

#Simple Socket server for chess web-admin project.
#
class Server:
    def __init__(self, ip, port):
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.ip = ip
        self.port = port
        self.matches = {}

        #Tries to open the server at the specified port
        try:
            self.s.bind((self.ip, self.port))
        except socket.error as e:
            str(e)

        self.s.listen(2)

    def client_handler(self, conn, addr):
        if addr[0] not in self.matches:
            #Each IP will be associated with a Player object.
            #And ideally with a chess board object as well.
            self.matches[addr[0]] = "Dummy Object" 
            message = "0"
        else:
            message = "1"

        return message

    def threaded_connection_killer(self, conn):
        try:
            data = conn.recv(2048).decode()
            data = data.split("\n")[0].split("?" #Get arguments from post request
            if data:
                )
               # print("received: ", data)
        except Exception as e:
            print(e)
        print("closing connection!")
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
            message = server.client_handler(conn, addr)
            response = server.generateResponse("{'thing':'another-thing'}")
            print(f"new connection from {addr}")

            for m in response:
                conn.send(str.encode(m))
            
            start_new_thread(server.threaded_connection_killer, (conn, ))

           
        except Exception as e:
            print(e)
            traceback.print_exc(file=sys.stdout)
            conn.close()
            break
