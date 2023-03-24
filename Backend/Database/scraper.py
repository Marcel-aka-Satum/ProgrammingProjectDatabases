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

        for entry in feed.entries:
            link = entry['link']
            title = entry['title']
            summary = entry['summary']
            publisher = entry['published']

            image = ''
            for lnk in entry['links']:
                if lnk['type'] in ['image/jpeg']:
                    image = lnk['href']

            try:
                status, message = DB.addArticle(link, title, summary, publisher, image, rss_url, topic)
                # print("Added article: ", link, 'from: ', rss_url)
            except Exception as e:
                print('error:', e)
                continue

if __name__ == '__main__':
    scraper()
