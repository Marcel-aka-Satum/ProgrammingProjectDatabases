def initialize_db(cur):
    # SQL to initialize db
    cur.execute('''
            DROP SCHEMA IF EXISTS newsaggregator CASCADE;
            DROP TABLE IF EXISTS rssfeeds CASCADE;
            DROP TABLE IF EXISTS newsarticles CASCADE;
            DROP TABLE IF EXISTS relatedcluster CASCADE;
            DROP TABLE IF EXISTS visitors CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
            DROP TABLE IF EXISTS cookies CASCADE;
            DROP TABLE IF EXISTS hasclicked CASCADE;
            DROP TABLE IF EXISTS favored CASCADE;
            DROP TABLE IF EXISTS settings CASCADE;
            ''')

    print("schema and tables dropped........")

    cur.execute('''
            CREATE SCHEMA newsaggregator;
           ''')

    print("schema made........")

    cur.execute('''
            CREATE TABLE newsaggregator.rssfeeds (
                URL varchar PRIMARY KEY, 
                Publisher varchar, 
                Genre varchar);


            CREATE TABLE newsaggregator.newsarticles (
                URL varchar PRIMARY KEY, 
                Title varchar, 
                Summary varchar,
                Published varchar,
                Image varchar,
                Topic varchar,
                RSS_URL varchar REFERENCES newsaggregator.rssfeeds(URL) ON DELETE CASCADE);
                

            CREATE TABLE newsaggregator.relatedcluster (
                URL varchar PRIMARY KEY REFERENCES newsaggregator.newsarticles(URL) ON DELETE CASCADE,
                Cluster_ID int);


            CREATE TABLE newsaggregator.visitors (
                UID serial PRIMARY KEY);


            CREATE TABLE newsaggregator.users (
                UID serial REFERENCES newsaggregator.visitors(UID) ON DELETE CASCADE ,
                Username varchar UNIQUE, 
                Email varchar UNIQUE PRIMARY KEY,
                Password varchar, 
                Is_Admin boolean);


            CREATE TABLE newsaggregator.cookies (
                cookie varchar PRIMARY KEY,
                UID serial REFERENCES newsaggregator.visitors(UID) ON DELETE CASCADE );


            CREATE TABLE newsaggregator.hasclicked (
                _User int REFERENCES newsaggregator.visitors(UID) ON DELETE CASCADE,
                Article varchar REFERENCES newsaggregator.newsarticles(URL) ON DELETE CASCADE,
                PRIMARY KEY(_User, Article));
                

            CREATE TABLE newsaggregator.favored (
                _User int REFERENCES newsaggregator.visitors(UID) ON DELETE CASCADE,
                Article varchar REFERENCES newsaggregator.newsarticles(URL) ON DELETE CASCADE,
                PRIMARY KEY(_User, Article));
                
            CREATE TABLE newsaggregator.settings (
                settingType varchar PRIMARY KEY,
                value varchar);
                
            ''')

    print("tables added......")
