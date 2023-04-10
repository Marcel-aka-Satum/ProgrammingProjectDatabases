import psycopg2
import pandas as pd
import bcrypt

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

    passwordAdmin = "admin"
    passwordTest = "test"

    #create salt for hash
    salt = bcrypt.gensalt()

    #hashpsswd
    bytesAdmin = passwordAdmin.encode('utf-8')
    bytesTest = passwordTest.encode('utf-8')

    hashed_password_admin = bcrypt.hashpw(bytesAdmin, salt)
    hashed_password_test = bcrypt.hashpw(bytesTest, salt)

    # populate users
    users = [
        {'username': 'admin', 'email': 'admin@gmail.com', 'password': hashed_password_admin.decode(), 'is_admin': True},
        {'username': 'test', 'email': 'test@gmail.com', 'password': hashed_password_test.decode(), 'is_admin': False}
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
