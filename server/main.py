import socket
from _thread import start_new_thread
import sys

#Simple Socket server for chess web-admin project.
#

server = "192.168.2.19"
port = 5555

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    s.bind((server, port))

except socket.error as e:
    str(e)


#Listen for the first time
s.listen(4)
print("Waiting for connections...")

def threaded_client(conn): #add type
    conn.send(str.encode("Connected successfuly"))
    #While connection is not closed
    while True:
        try:
            data = conn.recv(2048)
            reply = data.decode("utf-8")
            
            if not data:
                print("Disconnected")
                break

            else:
                print(f"Received: {reply}")
                print(f"Seinding: {reply}") 

            conn.sendall(str.encode(reply))
        except:
           break

    print("Lost connection")
    conn.close()


while True:
    conn, addr = s.accept()
    print(f"{addr} just connected.")

    start_new_thread(threaded_client, (conn,))
