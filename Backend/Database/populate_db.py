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
                    (rss_url[i],
                     rss_publisher[i],
                     rss_topic[i]))
        conn.commit()

    print("Done inserting values")

    # populate users
    users = [
        {'UID':'1', 'username': 'admin', 'email': 'admin@gmail.com', 'password': 'admin', 'is_admin': True},
        {'UID':'2', 'username': 'test', 'email': 'test@gmail.com', 'password': 'test', 'is_admin': False}
    ]
    # make an insert query into the users table


    print("Starting to insert values")

    for user in users:
        cur.execute(query.insert_visitors(
            user["UID"]))

        cur.execute(query.insert_users(
                     user["UID"],
                     user['username'],
                     user['email'],
                     user['password'],
                     user['is_admin']))
        conn.commit()

    print("Done inserting values")
