import psycopg2


def initialize_db(cur):
    # SQL to initialize db
    sql1 = '''
            DROP SCHEMA IF EXISTS newsaggregator CASCADE;
            DROP TABLE IF EXISTS rssfeeds CASCADE;
            DROP TABLE IF EXISTS newsarticles CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
            DROP TABLE IF EXISTS hasclicked CASCADE;
            '''

    sql2 = '''
            CREATE SCHEMA newsaggregator;
           '''

    sql3 = '''
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
                RSS_URL varchar REFERENCES newsaggregator.rssfeeds(URL) ON DELETE CASCADE,
                Topic varchar);

            CREATE TABLE newsaggregator.users (
                UID serial PRIMARY KEY,
                Username varchar UNIQUE, 
                Email varchar UNIQUE,
                Password varchar, 
                Is_Admin boolean);

            CREATE TABLE newsaggregator.hasclicked (
                _User int REFERENCES newsaggregator.users(UID),
                Article varchar REFERENCES newsaggregator.newsarticles(URL),
                PRIMARY KEY(_User, Article));

            '''

    # Executing SQL statements

    cur.execute(sql1)
    print("schema and tables dropped........")
    cur.execute(sql2)
    print("schema made........")
    cur.execute(sql3)
    print("tables added......")