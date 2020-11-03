import socket
from _thread import start_new_thread
import sys

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

    def threaded_client_handler(self, conn):
        conn.send(str.encode("Connected successfuly"))
        while True:
            try:
                data = conn.recv(2048)
                reply = "message received"
                
                #If there's no answer, close the connection.
                if not data:
                    break

                else:
                    print(f"Received: {reply}")

                conn.sendall(str.encode(reply))
            except:
                break

        print("Connection lost.")
        conn.close()


if __name__ == '__main__':
    server = Server("192.168.2.19", 5555)
    #For some reason, I can't listen inside class. Maybe it's some thread/self problem 
    while True:
        try:
            '''listen for new connections'''
            conn, addr = server.s.accept()
            print(f"new connection from {addr}")
            conn.send(str.encode("welcome"))
            start_new_thread(server.threaded_client_handler, (conn, ))
        except e:
            print(e)
            break
