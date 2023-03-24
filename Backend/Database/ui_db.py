from dataclasses import dataclass
import psycopg2
import json
from . import init_db, populate_db, query_db



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

    def getArticles(self, tag: str = "") -> json:
        if not self.is_connected():
            print("database is not connected")
            return
        self.cursor.execute(query_db.get_newsarticles())
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
    add an article to the database
    """

    def addArticle(self, url: str, title: str, summary: str, published: str, image: str, rss_url: str, topic: str):
        if not self.is_connected():
            print("database is not connected")
            return -1, "database is not connected"

        self.cursor.execute(query_db.insert_newsarticle(url, title, summary, published, image, rss_url, topic))
        return 0, "success"

    """
    delete an article from the database
    """

    def deleteArticle(self, url: str):
        if not self.is_connected():
            print("database is not connected")
            return -1, "database is not connected"

        self.cursor.execute(query_db.delete_newsarticle(url))

    """
    update an article in the database
    """

    def updateArticle(self, url: str, title: str, summary: str, published: str, image: str, rss_url: str, topic: str):
        if not self.is_connected():
            print("database is not connected")
            return -1, "database is not connected"

        self.cursor.execute(query_db.update_newsarticle(url, title, summary, published, image, rss_url, topic))


    """
    get the users from the database
    """

    def getUsers(self) -> json:
        if not self.is_connected():
            print("database is not connected")
            return

        self.cursor.execute(query_db.get_users())
        data = []
        for i in self.cursor.fetchall():
            user = {}
            user["UID"] = i[0]
            user["Username"] = i[1]
            user["Email"] = i[2]
            user["Password"] = i[3]
            user["Is_Admin"] = i[4]
            data.append(user)
        return json.dumps(data)

    """
    get the user from the database with a specific email, if exists return True, else False
    """

    def getUser(self, email: str) -> bool:
        if not self.is_connected():
            print("database is not connected")
            return
        self.cursor.execute(query_db.get_user(email))
        user_data = self.cursor.fetchone()
        if user_data is None:
            return False, {}

        # return True and dict with user data
        return True, {
            "UID": user_data[0],
            "Username": user_data[1],
            "Email": user_data[2],
            "Password": user_data[3],
            "Is_Admin": user_data[4]
        }

    """
    Add a user to the database
    """

    def addUser(self, username: str, email: str, password: str, is_admin: bool) -> (bool, str):
        if not self.is_connected():
            print("database is not connected")
            return False, "database is not connected"

        try:
            print('inserting user:', username, email, password, is_admin)
            self.cursor.execute(query_db.insert_user(username, email, password, is_admin))
            return True, "success"
        except psycopg2.errors.UniqueViolation as e:
            if "users_email_key" in str(e):
                return False, f"Email '{email}' is already in use"
            elif "users_username_key" in str(e):
                return False, f"Username '{username}' is already in use"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"


    """
    Update a user in the database
    """

    def updateUser(self, id: int, username: str, email: str, password: str, is_admin: bool) -> (bool, str):
        if not self.is_connected():
            print("database is not connected")
            return False, "database is not connected"
        try:
            self.cursor.execute(query_db.update_user(id, username, email, password, is_admin))
            return True, "success"
        except psycopg2.errors.UniqueViolation as e:
            if "users_email_key" in str(e):
                return False, f"Email '{email}' is already in use"
            elif "users_username_key" in str(e):
                return False, f"Username '{username}' is already in use"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    """
    Delete a user from the database
    """

    def deleteUser(self, username: str):
        if not self.is_connected():
            print("database is not connected")
            return -1, "database is not connected"

        self.cursor.execute(query_db.delete_user(username))


    def ParseRSSFeeds(self) -> json:
        if not self.is_connected():
            print("database is not connected")
            return

        self.cursor.execute(query_db.get_rssfeeds())
        data = []
        for i in self.cursor.fetchall():
            rss_info = {}
            rss_info["URL"] = i[0]
            rss_info["Publisher"] = i[1]
            rss_info["Topic"] = i[2]
            data.append(rss_info)
        return json.dumps(data)

    def addRSSFeed(self, url: str, publisher: str, topic: str):
        if not self.is_connected():
            print("database is not connected")
            return -1, "database is not connected"

        query, params = query_db.insert_rssfeed(url, publisher, topic)
        self.cursor.execute(query, params)

    def deleteRSSFeed(self, url: str):
        if not self.is_connected():
            print("database is not connected")
            return -1, "database is not connected"

        self.cursor.execute(query_db.delete_rssfeed(url))

    def updateRSSFeed(self, url: str, publisher: str, topic: str):
        if not self.is_connected():
            print("database is not connected")
            return -1, "database is not connected"

        self.cursor.execute(query_db.update_rssfeed(url, publisher, topic))


# give terminal command for listing all the tables in the database in a specific schema
# \dt newsaggregator.*
if __name__ == "__main__":
    DB = DBConnection()
    DB.connect()
    DB.redefine()
    DB.populate()
    print(DB.getArticle())
    DB.ParseRSSFeeds()
