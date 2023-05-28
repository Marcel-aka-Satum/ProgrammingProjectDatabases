import datetime
import random
import string

import psycopg2
import json
from collections import defaultdict

try:
    from . import init_db, populate_db, query_db
    from . import db_functions as func
except:
    import init_db, populate_db, query_db
    import db_functions as func


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

    def __del__(self):
        """
        @brief: closes connection when deleted.
        """
        if self.connection is not None:
            self.connection.close()

    @func.is_connected
    def redefine(self):
        """
        @brief: recreates the database, the database will be empty.
        """
        init_db.initialize_db(self.connection.cursor())

    @func.is_connected
    @func.getCWD
    def populate(self, cwd):
        """
        @brief: populates the database with hardcoded data.
        """
        populate_db.populate_db(self.connection, self.connection.cursor(), cwd)

    def connect(self) -> bool:
        """
        @brief: try to open the connection with the database.
        """
        try:
            self.connection = psycopg2.connect(user="postgres")
            self.connection.autocommit = True
            cursor = self.connection.cursor()
        except (Exception, psycopg2.DatabaseError) as err:
            print(err)
            return False
        if cursor is None:
            return False
        return True

    @func.is_connected
    @func.getCWD
    def createBackup(self,cwd):
        """
        @brief: create a file and write a json formatted backup from the database to it.
        """
        try:
            now = datetime.datetime.now()
            filename = f'{cwd}/Backend/Database/Backups/{now.strftime("%Y")[2:]}{now.strftime("%m%d_%H_%M")}.txt'
            f = open(filename, "w")
            d = {}
            for (tabel, name) in {self.getRSSFeeds: "rssfeed",self.getNewsArticles: "newsaricles",
                                  self.getVisitors: "visitor", self.getUsers: "users",
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
        except Exception as e:
            print(e)
            return e
        return "Backup Created"

    @func.is_connected
    @func.getCWD
    def loadBackup(self, cwd, file: str):
        """
        @brief: load a backup from a file, the database will be cleared.
        """
        self.redefine()
        try:
            cursor = self.connection.cursor()
            d = {"rssfeed": query_db.insert_rssfeed, "newsaricles" : query_db.insert_newsarticle ,"visitor": query_db.insert_visitor,
                 "users": query_db.insert_user, "cookies": query_db.insert_cookie,
                 "hasclicked": query_db.insert_hasclicked, "favored": query_db.insert_favored}
            f = open(f"{cwd}/Backend/Database/Backups/{file}", "r")
            self.connection.autocommit = True
            for i in f:
                data = json.loads(i)
                for j in data:
                    insert = d[j]
                    for k in data[j]:
                        cursor.execute(insert(k))
        except Exception as e:
            print("Can not load backup")
            print(e)
            return
        print("backup is loaded")

    @func.is_connected
    def generateUID(self) -> int:
        """
        @brief: gegnerate a unique UID that can be used in the Database.
        """
        if self.staticVar < 0:
            cursor = self.connection.cursor()
            cursor.execute(query_db.get_maxUID())
            self.staticVar = cursor.fetchall()[0][0] + 1
        while self.getVisitor(self.staticVar)[1][0]:
            self.staticVar += 1
        UID = self.staticVar
        self.staticVar += 1
        return UID

    @func.is_connected
    def generateCookie(self) -> str:
        """
        @brief: generate a unique Cookie that can be used in the by a visitor.
        """
        now = datetime.datetime.now()
        cookie = f"{''.join(random.choices(string.ascii_letters + string.digits, k=12))}{now.strftime('%Y')[2:]}{now.strftime('%m%d%H%M%S')}"
        return cookie

    ########################### GET ############################

    @func.is_connected
    def getTopics(self):
        """
        @brief: get the Topics of the Articles.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_topics())
        data = cursor.fetchall()

        c = []
        for i in data:
            c.append(i[0])
        return c

    @func.is_connected
    def getNewsArticlesTopic(self, Topic: str) -> list:
        """
        @brief: get the table NewsArticles.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_newsarticlesTopic(Topic))
        data = []
        for i in cursor.fetchall():
            data.append(
                {"URL": i[0], "Title": i[1], "Summary": i[2], "Published": i[3], "Image": i[4], "Topic": i[5],
                 "RSS_URL": i[6]})
        return data

    @func.is_connected
    def getArticlesDict(self) -> list:
        """
        @brief: get articles for the homepage.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_ArticlesDict())
        return cursor.fetchall()

    @func.is_connected
    def getVisitor(self, UID: str) -> tuple:
        """
        @brief: get the UID of the Visitor if it exists.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_visitor(UID))
        data = cursor.fetchall()
        return len(data) == 1, UID

    """
    get the user from the database with a specific email, if exists return True, else False
    """

    @func.is_connected
    def getUser(self, email: str) -> tuple:
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_user(email))
        user_data = cursor.fetchone()
        if user_data is None:
            return False, ""

        # return True and dict with user data
        return True, {
            "UID": user_data[0],
            "Username": user_data[1],
            "Email": user_data[2],
            "Password": user_data[3],
            "Is_Admin": user_data[4]
        }

    @func.is_connected
    def getArticle(self, url: str) -> tuple:
        """
        @brief: get the article from the database with a specific url, if exists return True, else False
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_newsarticle(url))
        data = cursor.fetchone()
        if data is None:
            return False, ""

        # return True and dict with article data
        return True, {
            "URL": data[0],
            "Title": data[1],
            "Summary": data[2],
            "Published": data[3],
            "Image": data[4],
            "RSS_URL": data[6],
            "Topic": data[5],
            "Clicked": data[7],
            "Language": data[8]
        }

    @func.is_connected
    def getCluster(self, cluster_id: int) -> tuple:
        """
        @brief: get the articles from the database with a specific cluster_id, if exists return True, else False
        """
        cursor = self.connection.cursor()
        query = query_db.get_cluster(cluster_id)
        cursor.execute(query)
        data = cursor.fetchall()
        if data is None:
            return False, ""

        # return True and dict with article data
        return True, data

    @func.is_connected
    def getAllClusters(self) -> tuple:
        """
        @brief: get all records from the relatedcluster table
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_all_clusters())
        data = cursor.fetchall()

        if data is None:
            return False, ""

        return True, data

    @func.is_connected
    def getAllClustersGenre(self, genre) -> tuple:
        """
        @brief: get all records from the relatedcluster table
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_all_clusters_genre(genre))
        data = cursor.fetchall()

        if data is None:
            return False, ""

        return True, data

    ########################## UPDATE ##########################

    @func.is_connected
    def updateArticle(self, url: str, title: str, summary: str, publisher: str, image: str, rss_url: str, topic: str):
        """
        @brief: update a newsarticle in the database.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.update_newsarticle(url, title, summary, publisher, image, rss_url, topic))

    @func.is_connected
    def updateUser(self, id: int, username: str, email: str, password: str, is_admin: bool) -> tuple:
        """
        @brief: update a user in the database.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.update_user(id, username, email, password, is_admin))
            return True, "success"
        except psycopg2.errors.UniqueViolation as e:
            if "users_email_key" in str(e):
                return False, f"Email '{email}' is already in use"
            elif "users_username_key" in str(e):
                return False, f"Username '{username}' is already in use"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @func.is_connected
    def updateRSSFeed(self, url: str, publisher: str, topic: str) -> tuple:
        """
        @brief: update a RSSFeed in the database.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.update_rssfeed(url, publisher, topic))
            return True, "success"
        except psycopg2.errors.UniqueViolation as e:
            if "rssfeeds_pkey" in str(e):
                return False, f"URL '{url}' is already in use"
            else:
                return False, f"A unique constraint violation occurred: {e}"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @func.is_connected
    def updateSetting(self, setting: str, value: str) -> tuple:
        """
        @brief: update a setting in the database.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.update_setting(setting, value))
            return True, "success"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    ########################## DELETE ##########################

    @func.is_connected
    def deleteRSSFeed(self, URL: str) -> tuple:
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.delete_rssfeed(URL))
            return True, "success"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @func.is_connected
    def deleteNewsArticle(self, URL: str) -> tuple:
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.delete_newsarticle(URL))
            return True, "success"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @func.is_connected
    def deleteVisitor(self, UID: str) -> tuple:
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.delete_visitor(UID))
            return True, "success"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @func.is_connected
    def deleteUser(self, UID: str) -> tuple:
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.delete_user(UID))
            return True, "success"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @func.is_connected
    def deleteCookie(self, UID: str) -> tuple:
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.delete_cookie(UID))
            return True, "success"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"
    @func.is_connected
    def deleteFavored(self, UID: str, URL: str) -> tuple:
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.delete_favored(UID, URL))
            return True, "success"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @func.is_connected
    def deleteAllFavored(self, UID: str) -> tuple:
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.delete_all_favored(UID))
            return True, "success"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    ############################ Add ###########################

    @func.is_connected
    def addRSSFeed(self, URL: str, Publisher: str, Topic: str) -> tuple:
        """
        @brief: add a RSSFeed to the database.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.insert_rssfeed([URL, Publisher, Topic]))
            return True, "success"
        except psycopg2.errors.UniqueViolation as e:
            if "rssfeeds_pkey" in str(e):
                return False, f"URL '{URL}' is already in use"
            else:
                return False, f"A unique constraint violation occurred: {e}"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @func.is_connected
    def addNewsArticle(self, url, title: str, summary: str, publisher: str, image: str, rss_url: str, topic: str, language: str) -> tuple:
        """
        @brief: add a NewsArticle to the database.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(*query_db.insert_newsarticle([url, title, summary, publisher, image, rss_url, topic, language]))
            return True, "success"
        except Exception as e:
            return False, str(e)

    @func.is_connected
    def addVisitor(self, UID: str) -> tuple:
        """
        @brief: add a Visitor to the database.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.insert_visitor([UID]))
            return True, "success"
        except Exception as e:
            return False, str(e)


    @func.is_connected
    def addUser(self, UID: int, Username: str, Email: str, Password: str, Is_admin: bool = False) -> tuple:
        """
        @brief: add a User to the database.
        """
        try:
            print('inserting user:', UID, Username, Email, Password, Is_admin)
            cursor = self.connection.cursor()
            cursor.execute(query_db.insert_visitor([UID]))
            cursor.execute(query_db.insert_user([UID, Username, Email, Password, Is_admin]))
            return True, "success"
        except psycopg2.errors.UniqueViolation as e:
            if "users_email_key" in str(e):
                return False, f"Email '{Email}' is already in use"
            elif "users_username_key" in str(e):
                return False, f"Username '{Username}' is already in use"
        except Exception as e:
            return False, f"An unexpected error occurred: {e}"

    @func.is_connected
    def addCookie(self, cookie: str, UID: str) -> tuple:
        """
        @brief: add a Cookie to the database.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.insert_cookie([cookie, UID]))
            return True, "success"
        except Exception as e:
            return False, str(e)

    @func.is_connected
    def addHasClicked(self, UID: str, URL: str) -> tuple:
        """
        @brief: add a user interaction to the database.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.insert_hasclicked([UID, URL]))
            return True, "success"
        except Exception as e:
            return False, str(e)

    @func.is_connected
    def addHasClickedCookie(self, URL: str, Cookie: str) -> tuple:
        """
        @brief: add a user interaction to the database.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.insert_hasclickedcookie([URL, Cookie]))
            cursor.execute(query_db.addCountArticle([URL]))
            return True, "success"
        except psycopg2.errors.UniqueViolation as e:
            if "hasclicked_pkey" in str(e):
                return False, f"User has already clicked on this article"
            else:
                return False, f"A unique constraint violation occurred: {e}"
        except Exception as e:
            return False, str(e)

    @func.is_connected
    def addFavored(self, UID: str, URL: str) -> tuple:
        """
        @brief: add a favored article of a user to the database.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.insert_favored([UID, URL]))
            return True, "success"

        except psycopg2.errors.UniqueViolation as e:
            if "favored_pkey" in str(e):
                return False, f"Article is already in favorites"
            else:
                return False, f"A unique constraint violation occurred: {e}"

        except Exception as e:
            return False, str(e)

    @func.is_connected
    def addFavorite(self, Cookie: str, URL: str) -> tuple:
        """
        @brief: add a favorite article of a user to the database.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.insert_favorite([Cookie, URL]))
            return True, "success"
        except Exception as e:
            return False, str(e)

    @func.is_connected
    def addSetting(self, SettingType: str, Value: str) -> tuple:
        """
        @brief: add a favorite article of a user to the database.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query_db.insert_setting([SettingType, Value]))
            return True, "success"
        except Exception as e:
            return False, str(e)
        
   #@func.is_connected
    def addArticleCluster(self, URL: str, Cluster_ID: int) -> tuple:
        """
        @brief: add an article to a cluster in the database.
        """
        try:
            cursor = self.connection.cursor()
            query = query_db.insert_cluster(URL, Cluster_ID)
            cursor.execute(query)  
            query_db.insert_cluster(URL, Cluster_ID)
            self.connection.commit()  
            return True, "success"
        except Exception as e:
            return False, str(e)


    ######################### GetTables ########################

    @func.is_connected
    def getRSSFeeds(self) -> list:
        """
        @brief: get the table RSSFeed.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_rssfeeds())
        data = []
        for i in cursor.fetchall():
            data.append({"URL": i[0], "Publisher": i[1], "Topic": i[2]})
        return data

    @func.is_connected
    def getNewsArticles(self) -> list:
        """
        @brief: get the table NewsArticles.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_newsarticles())
        data = []
        for i in cursor.fetchall():
            data.append(
                {"URL": i[0], "Title": i[1], "Summary": i[2], "Published": i[3], "Image": i[4], "Topic": i[5],
                 "RSS_URL": i[6], "Clicked": i[7]})
        return data
    
    @func.is_connected
    def getFavorites(self, URL: string) -> list:
        """
        @brief: get the table NewsArticles.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_favorites(URL))
        data = []
        for i in cursor.fetchall():
            data.append(
                {"URL": i[0], "Title": i[1], "Summary": i[2], "Published": i[3], "Image": i[4], "Topic": i[5],
                 "RSS_URL": i[6]})
        return data

    @func.is_connected
    def getVisitors(self) -> list:
        """
        @brief: get the table Visitors.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_visitors())
        data = []
        for i in cursor.fetchall():
            data.append({"UID": i[0]})
        return data

    @func.is_connected
    def getUsers(self) -> list:
        """
        @brief: get the table Users.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_users())
        data = []
        for i in cursor.fetchall():
            data.append({"UID": i[0], "Username": i[1], "Email": i[2], "Password": i[3], "Is_Admin": i[4]})
        return data

    @func.is_connected
    def getCookies(self) -> list:
        """
        @brief: get the table Cookies.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_cookies())
        data = []
        for i in cursor.fetchall():
            data.append({"cookie": i[0], "UID": i[1]})
        return data

    @func.is_connected
    def getHasClicked(self, cookie: str) -> list:
        """
        @brief: get the table HasClicked based on the given cookie.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_hasclicked(cookie))
        data = []
        for i in cursor.fetchall():
            data.append({"User": i[0], "Article": i[1]})
        return data


    @func.is_connected
    def getAllHasClicked(self) -> list:
        """
        @brief: get the table HasClicked.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_all_hasclicked())
        data = []
        for i in cursor.fetchall():
            data.append({"User": i[0], "Article": i[1]})
        return data


    @func.is_connected
    def getFavored(self) -> list:
        """
        @brief: get the table favored.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_favored())
        data = defaultdict(list)
        for i in cursor.fetchall():
            data[i[0]].append(i[1])
        return data

    @func.is_connected
    def getSettings(self) -> dict:
        """
        @brief: get the table settings.
        """
        cursor = self.connection.cursor()
        cursor.execute(query_db.get_settings())
        data = {}
        for i in cursor.fetchall():
            data[i[0]] = i[1]
        return data

    ############################################################


# give terminal command for listing all the tables in the database in a specific schema
# \dt newsaggregator.*
if __name__ == "__main__":
    DB = DBConnection()
    DB.connect()
    DB.redefine()
    DB.populate()
    DB.getNewsArticles()
    DB.getRSSFeeds()
