import psycopg2
import json
import init_db as init_db
import populate_db as populate_db
import querry_db as query

"""
    An interface of the DataBase
"""


class DBConnection:
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
    checks if the connection to the database exists
    """

    def is_connected(self) -> bool:
        if self.connection is None or self.cursor is None:
            return False
        return True

    """
    recreates the database, the database will be empty
    """

    def redefine(self):
        if not self.is_connected():
            print("database is not connected")
            return
        init_db.initialize_db(self.cursor)

    """
    populates the database with hardcoded data
    """

    def populate(self):
        if not self.is_connected():
            print("database is not connected")
            return
        populate_db.populate_db(self.connection, self.cursor)

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
        if not self.is_connected():
            print("database is not connected")
            return

        self.cursor.execute("SELECT * FROM newsaggregator.newsarticles;")
        data = []
        for i in self.cursor.fetchall():
            Article = {}
            Article["URL"] = i[0]
            Article["Title"] = i[0]
            Article["Summary"] = i[0]
            Article["Published"] = i[0]
            Article["Image"] = i[0]
            data.append(Article)
        return json.dumps(data)


DB = DBConnection()
DB.connect()
DB.redefine()
DB.cursor.execute(query.insert_newsarticles("1", "2", "3", "4", "5", "6"))
DB.cursor.execute(query.insert_rssfeeds("1", "2", "3"))
DB.cursor.execute("SELECT * FROM newsaggregator.rssfeeds;")
print(DB.cursor.fetchall())
# DB.populate()
#print(DB.getArticle(""))
