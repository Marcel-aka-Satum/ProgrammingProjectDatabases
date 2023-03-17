import psycopg2
import json

"""
    An interface of the DataBase
"""
class DBConnection():
    def __init__(self):
        self.connection: psycopg2.connection = None
        self.cursor: psycopg2.cursor = None

    """
    closes connection when deleted
    """
    def __del__(self):
        if self.connection is not None:
            self.connection.close()

    """
    try to open the connection with the database
    """
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

    """
    get the articles from the database with a specific tag
    !!! Tag are currently not in the database, you get all the articles !!! 
    """
    def getArticle(self, tag: str) -> json:
        if self.connection == None or self.cursor == None:
            print("database is not connected")
            return

        self.cursor.execute("SELECT * FROM newsaggregator.newsarticles;")
        data = []
        for i in self.cursor.fetchall():
            Article = {}
            Article["URL"] = i[0]
            Article["Title"] = i[1]
            Article["Summary"] = i[2]
            Article["Published"] = i[3]
            Article["Image"] = i[4]
            data.append(Article)
        return json.dumps(data)

DB = DBConnection()
DB.connect()
print(DB.getArticle("ECONOMIE"))
