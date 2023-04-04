import pandas as pd
from . import query_db as query


def populate_db(conn, cur):
    RSSFeeds = pd.read_csv("Backend/Database/RSSFeeds.csv")

    rss_url = list(RSSFeeds['URL'])
    rss_publisher = list(RSSFeeds['Publisher'])
    rss_topic = list(RSSFeeds['Topic'])

    print("Starting to insert values")

    for i in range(len(rss_url)):
        cur.execute(query.insert_rssfeeds
                    ([rss_url[i],
                     rss_publisher[i],
                     rss_topic[i]]))
        conn.commit()
    cur.execute(query.insert_rssfeeds(["6","2","3"]))
    cur.execute(
        f"""
                INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image_URL, RSS_URL, Topic)
                VALUES ('url','title','sum',4,5,6,7);
                """
    )
    cur.execute(
        f"""
                INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image_URL, RSS_URL, Topic)
                VALUES (2,2,3,4,5,6,7);
                """
    )
    print("Done inserting values")

    # populate users
    users = [['1','admin','admin@gmail.com','admin',True],['2','test','test@gmail.com','test', False]]
    # make an insert query into the users table


    print("Starting to insert values")

    for user in users:
        cur.execute(query.insert_visitors([user[0]]))
        cur.execute(query.insert_users(user))
        conn.commit()

    print("Done inserting values")
