import pandas as pd

try:
    from . import query_db as query
except:
    import query_db as query
import bcrypt


def create_hash(password):
    bytesPassword = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(bytesPassword, salt)
    return hashed_password.decode()


def populate_db(conn, cur, cwd):
    RSSFeeds = pd.read_csv(f"{cwd}/Backend/Database/RSSFeeds.csv")

    rss_url = list(RSSFeeds['URL'])
    rss_publisher = list(RSSFeeds['Publisher'])
    rss_topic = list(RSSFeeds['Topic'])

    print("Starting to insert values")

    for i in range(len(rss_url)):
        cur.execute(query.insert_rssfeed
                    ([rss_url[i],
                      rss_publisher[i],
                      rss_topic[i]]))
        conn.commit()

    # populate users
    users = [['1', 'admin', 'admin@gmail.com', create_hash('admin'), True],
             ['2', 'test', 'test@gmail.com', create_hash('test'), False]]
    # make an insert query into the users table

    for user in users:
        cur.execute(query.insert_visitor([user[0]]))
        cur.execute(query.insert_user(user))
        conn.commit()

    cur.execute(query.insert_cookie(["abc", 1]))
    cur.execute(query.insert_setting(["scraperTimer", "600"]))

    print("Done inserting values")
