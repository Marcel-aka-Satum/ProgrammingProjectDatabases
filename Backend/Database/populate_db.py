import psycopg2
import pandas as pd


def populate_db(conn, cur):
    RSSFeeds = pd.read_csv("Database/RSSFeeds.csv")

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

    # populate users
    users = [
        {'username': 'admin', 'email': 'admin@gmail.com', 'password': 'admin', 'is_admin': True},
        {'username': 'test', 'email': 'test@gmail.com', 'password': 'test', 'is_admin': False}
    ]
    # make an insert query into the users table
    insert_query = '''
                    INSERT INTO newsaggregator.users (username, email, password, is_admin)
                    VALUES (%s, %s, %s, %s);
                    '''

    print("Starting to insert values")

    for user in users:
        cur.execute(insert_query,
                    (user['username'],
                     user['email'],
                     user['password'],
                     user['is_admin']))
        conn.commit()

    print("Done inserting values")
