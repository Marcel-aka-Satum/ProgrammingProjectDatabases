import psycopg2
import pandas as pd

def populate_db(conn, cur):
    RSSFeeds = pd.read_csv("RSSFeeds.csv")
    NewsArticles = pd.read_csv("NewsArticles.csv")

    article_url = list(NewsArticles['URL'])
    article_title = list(NewsArticles['Title'])
    article_summary = list(NewsArticles['Summary'])
    article_published = list(NewsArticles['Published'])
    article_image = list(NewsArticles['Image'])


    rss_url = list(RSSFeeds['URL'])
    rss_publisher = list(RSSFeeds['Publisher'])
    rss_topic = list(RSSFeeds['Topic'])

    rss_insert_query = '''
                        INSERT INTO newsaggregator.rssfeeds (URL, Publisher, Topic)
                        VALUES (%s, %s, %s);
                        '''

    article_insert_query = '''
                        INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image_URL)
                        VALUES (%s, %s, %s, %s, %s);
                        '''


    print("Starting to insert values")

    for i in range(len(rss_url)):
        cur.execute(rss_insert_query,
                    (rss_url[i],
                     rss_publisher[i],
                     rss_topic[i]))
        conn.commit()

    for i in range(len(article_url)):
        cur.execute(article_insert_query,
                    (article_url[i],
                     article_title[i],
                     article_summary[i],
                     article_published[i],
                     article_image[i]))

        conn.commit()

    print("Done inserting values")
