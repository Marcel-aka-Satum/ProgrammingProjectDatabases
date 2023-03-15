import psycopg2

# Connect to your postgres DB
conn = psycopg2.connect(user="postgres")
conn.autocommit = True

# Open a cursor to perform database operations
cur = conn.cursor()

#SQL to initialize db
sql0 = """
        DROP TABLE IF EXISTS RSSFeeds CASCADE;
        DROP TABLE IF EXISTS NewsArticles CASCADE;
        DROP TABLE IF EXISTS Users CASCADE;
        DROP TABLE IF EXISTS HasClicked CASCADE;"""

sql1 = """
        DROP DATABASE IF EXISTS my_db;"""

sql2 = """
        CREATE DATABASE my_db;"""

sql3 = """
        CREATE TABLE RSSFeeds (
            URL varchar PRIMARY KEY, 
            Publisher varchar, 
            Topic varchar);

        CREATE TABLE NewsArticles (
            URL varchar PRIMARY KEY, 
            Title varchar, 
            Summary varchar,
            Published varchar,
            Image_URL varchar,
            RSS_URL varchar REFERENCES RSSFeeds(URL));
        
        CREATE TABLE Users (
            Username varchar PRIMARY KEY, 
            Password varchar, 
            Is_Admin boolean);

        CREATE TABLE HasClicked (
            _User varchar REFERENCES Users(Username),
            Article varchar REFERENCES NewsArticles(URL),
            PRIMARY KEY(_User, Article));

        """

#Executing SQL statements
cur.execute(sql0)
print("tables dropped........")
cur.execute(sql1)
print("db dropped........")
cur.execute(sql2)
print("db made........")
cur.execute(sql3)
print("table added........")

#Closing the connection
conn.close()
