import psycopg2
import pandas as pd

def populate_db(conn, cur):
    RSSFeeds = pd.read_csv("RSSFeeds.csv")


    rss_url = list(RSSFeeds['URL'])
    rss_publisher = list(RSSFeeds['Publisher'])
    rss_topic = list(RSSFeeds['Topic'])

    rss_insert_query = '''
                        INSERT INTO newsaggregator.rssfeeds (URL, Publisher, Topic)
                        VALUES (%s, %s, %s);
                        '''

    print("Starting to insert values")

    for i in range(len(rss_url)):
        cur.execute(rss_insert_query,
                    (rss_url[i],
                     rss_publisher[i],
                     rss_topic[i]))
        conn.commit()

    print("Done inserting values")
