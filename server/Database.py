import psycopg2, psycopg2.extras, psycopg2.errors

class Database:
    def __init__(self, ip, port):
        self.connector = psycopg2.connect(user="u0_a340",
        host = ip,
        port = port,
        database = "chess")
        self.cursor = self.connector.cursor(cursor_factory= psycopg2.extras.RealDictCursor)
        
    #      Users Scheme:
    #  user_id | username | password | created_on | rank 
    # ---------+----------+----------+------------+------
    #  int     | string   | string   | datetime   | int

    def registerUser(self, username:str , password:str ) -> bool:
        try:
            self.cursor.execute("INSERT INTO users (username, password, created_on, rank) VALUES (%s, %s, current_timestamp, 800)", (username, password))
            self.connector.commit()
            return 1
        except psycopg2.errors.UniqueViolation as e:
            print(f"Username \"{username}\" already in use.")
            return -1


    def connectUser(self, username:str, password:str) ->bool:
        try:
            self.cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
            return dict(self.cursor.fetchone())
        except:
            return -1

    def getUserInfo(self, user_id: int) ->bool: 
        try:
            self.cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id))
            return dict(self.cursor.fetchone())
        except:
            return -1

    def updateUserInfo(self, info: dict) -> bool:
        try:
            self.cursor.execute("UPDATE users SET username = %s, password = %s, profile_picture = %s WHERE user_id = %s", (info["username"], info["password"], info["profile_picture"], info["change_user"]));
            self.connector.commit();
        except Exception as e:
            print(e)

        return False

if __name__ == "__main__":
    database = Database("192.168.2.12", 5432)
    print(database.connectUser("guilherme", "123"))
