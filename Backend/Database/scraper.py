import feedparser
from . import ui_db
import json


def scraper():
    # Initialize DB object
    DB = ui_db.DBConnection()
    # Establish connection
    DB.connect()
    if not DB.is_connected():
        print("Scraper cannot connect to database")

    rss_info = DB.ParseRSSFeeds()
    rss_info = json.loads(rss_info)

    for rss in rss_info:
        rss_url = rss['URL']
        topic = rss['Topic']
        feed = feedparser.parse(rss_url)

        for idx in range(len(feed)):
            link = feed.entries[idx]['link']
            title = feed.entries[idx]['title']
            summary = feed.entries[idx]['summary']
            published = feed.entries[idx]['published']

            links = feed.entries[idx]['links']
            image = ''
            for lnk in links:
                if lnk['type'] in ['image/jpeg']:
                    image = lnk['href']

            try:
                DB.addRSSFeed(rss_url, topic, link, title, summary, published, image)
            except:
                # print("Most likely a duplicate")
                continue

        # print('The news articles corresponding to rss feed '+str(rss_url)+ ' have been inserted.')

if __name__ == '__main__':
    scraper()