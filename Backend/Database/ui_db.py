from typing import Any, Tuple
import os
import psycopg2
import json
import datetime
from . import init_db, populate_db, query_db


def is_connected(func):
    """
    @brief: checks if the connection to the database exists.
    """

    def wrapper_func(self, *args) -> tuple[bool, Any]:
        if self.connection is None or self.cursor is None:
            print("Database is not connected\nConnecting to database")
            try:
                self.connect()
                if self.connection is None or self.cursor is None:
                    raise Exception("Database is not connected")
            except Exception as e:
                print("Can not connect to database")
                print(e)
                return False, f"{e}"
            print("Database is connected")
        try:
            result = func(self, *args)
        except Exception as e:
            return False, f"{e}"
        return True, result

    return wrapper_func


def getCWD(func):
    """
    @brief: gives the absolute address to the root directory.
    """

    def wrapper_func(self, *args):
        seperator = "/"
        cwd = os.getcwd().split(seperator)
        while cwd[-1] != "ProgrammingProjectDatabases":
            cwd.pop(-1)
        if not cwd:
            raise Exception("No valid address found")
        return func(self, seperator.join(cwd), *args)

    return wrapper_func


class DBConnection:
    """
    @brief: An interface class of the DataBase.
    """

    ########################## SETUP ###########################
    staticVar = -1

    def __init__(self):
        """
        @brief: default constructor.
        """
        self.connection = None
        self.cursor = None

    def __del__(self):
        """
        @brief: closes connection when deleted.
        """
        if self.connection is not None:
            self.connection.close()

    @is_connected
    def redefine(self):
        """
        @brief: recreates the database, the database will be empty.
        """
        init_db.initialize_db(self.cursor)
        """
        print(self.addRSSFeed("RSSURL", "Publisher", "Topic"))
        print(self.addNewsArticle("URL", "Title", "Summary", "Publisher", "Image", "RSSURL", "Topic"))
        print(self.addVisitor("1"))
        print(self.addUser("1", "username", "email", "password", True))
        print(self.addCookie("cookie", "1"))
        print(self.addHasClicked("1", "URL"))
        print(self.deleteNewsArticle("URL"))
        print(self.deleteVisitor("1"))
        print(self.deleteRSSFeed("RSSURL"))

        """

    @is_connected
    def populate(self):
        """
        @brief: populates the database with hardcoded data.
        """
        populate_db.populate_db(self.connection, self.cursor)

    def connect(self) -> bool:
        """
        @brief: try to open the connection with the database.
        """
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

    @is_connected
    @getCWD
    def createBackup(self,cwd):
        """
        @brief: create a file and write a json formatted backup from the database to it.
        """
        now = datetime.datetime.now()
        filename = f'{cwd}/Backend/Database/Backups/{now.strftime("%Y")[2:]}{now.strftime("%m%d_%H_%M")}.txt'
        f = open(filename, "w")
        d = {}
        for (tabel, name) in {self.getRSSFeeds: "rssfeed", self.getVisitors: "visitor", self.getUsers: "users",
                              self.getCookies: "cookies", self.getHasClicked: "hasclicked"}.items():
            data = tabel()[1]
            if not len(data):
                continue
            v = []
            for i in data:
                li = []
                for j in i.values():
                    li.append(j)
                v.append(li)
            d[name] = v
        f.write(json.dumps(d))

    @is_connected
    @getCWD
    def loadBackup(self,cwd, file: str):
        """
        @brief: load a backup from a file, the database will be cleared.
        """
        self.redefine()
        try:
            d = {"rssfeed": query_db.insert_rssfeed, "visitor": query_db.insert_visitor,
                 "users": query_db.insert_user,
                 "cookies": query_db.insert_cookie, "hasclicked": query_db.insert_hasclicked}
            f = open(f"{cwd}/Backend/Database/Backups/{file}", "r")
            self.connection.autocommit = True
            for i in f:
                data = json.loads(i)
                for j in data:
                    insert = d[j]
                    for k in data[j]:
                        self.cursor.execute(insert(k))
        except Exception as e:
            print("Can not load backup")
            print(e)
        print("backup is loaded")

    @is_connected
    def generateUID(self) -> int:
        """
        @brief: gegnerate a unique UID that can be used in the Database.
        """
        if self.staticVar < 0:
            self.cursor.execute(query_db.get_maxUID())
            self.staticVar = self.cursor.fetchall()[0][0] + 1
        while self.getVisitor(self.staticVar)[1][0]:
            self.staticVar += 1
        UID = self.staticVar
        self.staticVar += 1
        return UID

    ########################### GET ############################

    @is_connected
    def getVisitor(self, UID: str) -> tuple[bool, str]:
        """
        @brief: get the UID of the Visitor if it exists.
        """
        self.cursor.execute(query_db.get_visitor(UID))
        data = self.cursor.fetchall()
        return len(data) == 1, UID

    ########################## UPDATE ##########################

    @is_connected
    def updateArticle(self, url: str, title: str, summary: str, publisher: str, image: str, rss_url: str, topic: str):
        """
        @brief: update a newsarticle in the database.
        """
        self.cursor.execute(query_db.update_newsarticle(url, title, summary, publisher, image, rss_url, topic))

    @is_connected
    def updateUser(self, id: int, username: str, email: str, password: str, is_admin: bool) -> (bool, str):
        """
        @brief: update a user in the database.
        """
        try:
            self.cursor.execute(query_db.update_user(id, username, email, password, is_admin))
            return True, "success"
        except psycopg2.errors.UniqueViolation as e:
            if "users_email_key" in str(e):
                return False, f"Email '{email}' is already in use"

    @is_connected
    def updateRSSFeed(self, url: str, publisher: str, topic: str) -> (bool, str):
        """
        @brief: update a RSSFeed in the database.
        """
        try:
            self.cursor.execute(query_db.update_rssfeed(url, publisher, topic))
            return True, "success"
        except psycopg2.errors.UniqueViolation as e:
            if "rssfeeds_pkey" in str(e):
                return False, f"URL '{url}' is already in use"
            else:
                return False, f"A unique constraint violation occurred: {e}"

    ########################## DELETE ##########################

    @is_connected
    def deleteRSSFeed(self, URL: str) -> (bool, str):
        try:
            self.cursor.execute(query_db.delete_rssfeed(URL))
            return True, "success"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @is_connected
    def deleteNewsArticle(self, URL: str) -> (bool, str):
        try:
            self.cursor.execute(query_db.delete_newsarticle(URL))
            return True, "success"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @is_connected
    def deleteVisitor(self, UID: str) -> (bool, str):
        try:
            self.cursor.execute(query_db.delete_visitor(UID))
            return True, "success"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @is_connected
    def deleteUser(self, UID: str) -> (bool, str):
        try:
            self.cursor.execute(query_db.delete_user(UID))
            return True, "success"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @is_connected
    def deleteCookie(self, UID: str) -> (bool, str):
        self.cursor.execute(query_db.delete_cookie(UID))
        return True, "success"

    ############################ Add ###########################

    @is_connected
    def addRSSFeed(self, URL: str, Publisher: str, Topic: str) -> (bool, str):
        """
        @brief: add a RSSFeed to the database.
        """
        try:
            self.cursor.execute(query_db.insert_rssfeed([URL, Publisher, Topic]))
            return True, "success"
        except Exception as e:
            return False, str(e)

    @is_connected
    def addNewsArticle(self, url, title: str, summary: str, publisher: str, image: str, rss_url: str, topic: str) -> (
            bool, str):
        """
        @brief: add a NewsArticle to the database.
        """
        try:
            self.cursor.execute(query_db.insert_newsarticle([url, title, summary, publisher, image, rss_url, topic]))
            return True, "success"
        except Exception as e:
            return False, str(e)

    @is_connected
    def addVisitor(self, UID: str) -> (bool, str):
        """
        @brief: add a Visitor to the database.
        """
        try:
            self.cursor.execute(query_db.insert_visitor([UID]))
            return True, "success"
        except Exception as e:
            return False, str(e)

    @is_connected
    def addUser(self, UID: str, Username: str, Email: str, Password: str, Is_admin: bool = False) -> (bool, str):
        """
        @brief: add a User to the database.
        """
        try:
            self.cursor.execute(query_db.insert_user([UID, Username, Email, Password, Is_admin]))
            return True, "success"
        except Exception as e:
            return False, str(e)

    @is_connected
    def addCookie(self, cookie: str, UID: str) -> (bool, str):
        """
        @brief: add a Cookie to the database.
        """
        try:
            self.cursor.execute(query_db.insert_cookie([cookie, UID]))
            return True, "success"
        except Exception as e:
            return False, str(e)

    @is_connected
    def addHasClicked(self, UID: str, URL: str) -> (bool, str):
        """
        @brief: add a Cookie to the database.
        """
        try:
            self.cursor.execute(query_db.insert_hasclicked([UID, URL]))
            return True, "success"
        except Exception as e:
            return False, str(e)

    ######################### GetTables ########################

    @is_connected
    def getRSSFeeds(self) -> list[dict[str, str]]:
        """
        @brief: get the table RSSFeed.
        """
        self.cursor.execute(query_db.get_rssfeeds())
        data = []
        for i in self.cursor.fetchall():
            data.append({"URL": i[0], "Publisher": i[1], "Topic": i[2]})
        return data

    @is_connected
    def getNewsArticles(self) -> list[dict[str, str]]:
        """
        @brief: get the table NewsArticles.
        """
        self.cursor.execute(query_db.get_newsarticles())
        data = []
        for i in self.cursor.fetchall():
            data.append(
                {"URL": i[0], "Title": i[1], "Summary": i[2], "Published": i[3], "Image_URL": i[4], "Topic": i[5],
                 "RSS_URL": i[6]})
        return data

    @is_connected
    def getVisitors(self) -> list[dict[str, str]]:
        """
        @brief: get the table Visitors.
        """
        self.cursor.execute(query_db.get_visitors())
        data = []
        for i in self.cursor.fetchall():
            data.append({"UID": i[0]})
        return data

    @is_connected
    def getUsers(self) -> list[dict[str, str]]:
        """
        @brief: get the table Users.
        """
        self.cursor.execute(query_db.get_users())
        data = []
        for i in self.cursor.fetchall():
            data.append({"UID": i[0], "Username": i[1], "Email": i[2], "Password": i[3], "Is_Admin": i[4]})
        return data

    @is_connected
    def getCookies(self) -> list[dict[str, str]]:
        """
        @brief: get the table Cookies.
        """
        self.cursor.execute(query_db.get_cookies())
        data = []
        for i in self.cursor.fetchall():
            data.append({"cookie": i[0], "UID": i[1]})
        return data

    @is_connected
    def getHasClicked(self) -> list[dict[str, str]]:
        """
        @brief: get the table HasClicked.
        """
        self.cursor.execute(query_db.get_hasclicked())
        data = []
        for i in self.cursor.fetchall():
            data.append({"User": i[0], "Article": i[1]})
        return data

    ############################################################


# give terminal command for listing all the tables in the database in a specific schema
# \dt newsaggregator.*
if __name__ == "__main__":
    DB = DBConnection()
    DB.connect()
    DB.redefine()
    DB.populate()
    DB.cursor.execute(query_db.get_newsarticles())
    print(DB.cursor.fetchall())
