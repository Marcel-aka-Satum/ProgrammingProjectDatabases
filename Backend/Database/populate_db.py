"""

I need to extend this such that the csv files can be read and inserted into the database;
this ensures that you're never stuck with an empty database if something goes wrong.

You could merge this code with init_db.py at a later point so that you don't have to run these seperately

It's 1:45 am so I'm gonna sleep

sweet dreams

"""







import psycopg2
import pandas as pd

from ProgrammingProjectDatabases.Backend.Scraper.scraper_py.Scraper import RSSFeeds

# Connect to your postgres DB
conn = psycopg2.connect(user="postgres",
                        dbname="my_db")
conn.autocommit = True

# Open a cursor to perform database operations
cur = conn.cursor()

RSSFeeds = pd.read_csv("RSSFeeds.csv")
NewsArticles = pd.read_csv("NewsArticles.csv")



"""

cur.execute(""
    INSERT INTO some_table (an_int, a_date, a_string)
     VALUES (%s, %s, %s);
     "",
(10, datetime.date(2005, 11, 18), "O'Reilly"))

"""



#Closing the connection
conn.close()
