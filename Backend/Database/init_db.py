import psycopg2
#testing smth git related
# Connect to your postgres DB 
conn = psycopg2.connect(user="postgres")
conn.autocommit = True

# Open a cursor to perform database operations
cur = conn.cursor()

#SQL to initialize db
sql0 = '''
        DROP SCHEMA IF EXISTS newsaggregator CASCADE;
        DROP TABLE IF EXISTS rssfeeds CASCADE;
        DROP TABLE IF EXISTS newsarticles CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        DROP TABLE IF EXISTS hasclicked CASCADE;
        '''

sql1 = '''
        DROP DATABASE IF EXISTS my_db;
        '''

sql2 = '''
        CREATE DATABASE my_db;
       '''

sql3 = '''
        CREATE SCHEMA newsaggregator;
       '''

sql4 = '''
        CREATE TABLE newsaggregator.rssfeeds (
            URL varchar PRIMARY KEY, 
            Publisher varchar, 
            Topic varchar);

        CREATE TABLE newsaggregator.newsarticles (
            URL varchar PRIMARY KEY, 
            Title varchar, 
            Summary varchar,
            Published varchar,
            Image_URL varchar,
            RSS_URL varchar REFERENCES newsaggregator.rssfeeds(URL));
        
        CREATE TABLE newsaggregator.users (
            Username varchar PRIMARY KEY, 
            Password varchar, 
            Is_Admin boolean);

        CREATE TABLE newsaggregator.hasclicked (
            _User varchar REFERENCES newsaggregator.users(Username),
            Article varchar REFERENCES newsaggregator.newsarticles(URL),
            PRIMARY KEY(_User, Article));

        '''

#Executing SQL statements
cur.execute(sql0)
print("tables dropped........")
cur.execute(sql1)
print("db dropped........")
cur.execute(sql2)
print("db made........")
cur.execute(sql3)
print("schema added......")
cur.execute(sql4)
conn.commit()
print("tables added........")

#Closing the connection
conn.close()
