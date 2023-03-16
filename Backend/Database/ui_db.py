import psycopg2


class DBConnection():

    def __init__(self):
        self.connection = None
        self.cursor = None

    def __del__(self):
        if self.connection is not None:
            self.connection.close()

    def connect(self) -> bool:
        try:
            self.connection = psycopg2.connect(user="postgres")
            self.connection.autocommit = True
            self.cursor = self.connection.cursor()
        except (Exception, psycopg2.DatabaseError) as err:
            print(err)
            return False
        finally:
            if self.cursor == None:
                return False
            return True

    def getArticle(self, tag: str):
        if self.connection == None or self.cursor == None:
            print("database is not connected")
            return
        return self.cursor.execute("SELECT * FROM newsaggregator.newsarticles")


DB = DBConnection()
DB.connect()
print(DB.getArticle("ECONOMIE"))
