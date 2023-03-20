from dataclasses import dataclass
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

    def getArticle(self, tag: str = "") -> json:
        if not self.is_connected():
            print("database is not connected")
            return
        self.cursor.execute(query.get_newsarticles())
        data = []
        for i in self.cursor.fetchall():
            Article = {}
            Article["URL"] = i[0]
            Article["Title"] = i[1]
            Article["Summary"] = i[2]
            Article["Published"] = i[3]
            Article["Image"] = i[4]
            Article["RSS_URL"] = i[5]
            Article["Topic"] = i[6]
            data.append(Article)
        return json.dumps(data)

    """
    get the users from the database
    """

    def getUsers(self) -> json:
        if not self.is_connected():
            print("database is not connected")
            return

        self.cursor.execute(query.get_users())
        data = []
        for i in self.cursor.fetchall():
            user = {}
            user["Username"] = i[0]
            user["Email"] = i[1]
            user["Password"] = i[2]
            user["Is_Admin"] = i[3]
            data.append(user)
        return json.dumps(data)

    def ParseRSSFeeds(self) -> json:
        if not self.is_connected():
            print("database is not connected")
            return

        self.cursor.execute(query.get_rssfeeds())
        data = []
        for i in self.cursor.fetchall():
            rss_info = {}
            rss_info["URL"] = i[0]
            rss_info["Publisher"] = i[1]
            rss_info["Topic"] = i[2]
            data.append(rss_info)
        return json.dumps(data)



DB = DBConnection()
DB.connect()
DB.redefine()
DB.populate()
import Scraper
print(DB.getArticle())
DB.ParseRSSFeeds()

