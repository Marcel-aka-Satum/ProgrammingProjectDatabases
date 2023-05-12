import feedparser

from . import ui_db
import json
import requests
import spacy
from bs4 import BeautifulSoup

# Load English model
en_nlp = spacy.load('en_core_web_sm')

# Load Dutch model
nl_nlp = spacy.load('nl_core_news_sm')


# def scraper():
#     # Initialize DB object
#     DB = ui_db.DBConnection()
#     # Establish connection
#     DB.connect()
#     if not DB.is_connected():
#         print("Scraper cannot connect to database")
#
#     rss_info = DB.ParseRSSFeeds()
#     rss_info = json.loads(rss_info)
#
#     for rss in rss_info:
#         rss_url = rss['URL']
#         print(rss_url)
#         topic = rss['Topic']
#         feed = feedparser.parse(rss_url)
#
#         print("Scraping: ", rss_url)
#         for entry in feed.entries:
#             link = entry['link']
#             title = entry['title']
#             summary = entry['summary']
#             publisher = entry['published']
#
#             image = ''
#             for lnk in entry['links']:
#                 if lnk['type'] in ['image/jpeg']:
#                     image = lnk['href']
#
#             try:
#                 status, message = DB.addNewsArticle(link, title, summary, publisher, image, rss_url, topic)
#                 # print("Added article: ", link, 'from: ', rss_url)
#             except Exception as e:
#                 print('error:', e)
#                 continue

class BaseFeedScraper:
    def __init__(self):
        self.DB = ui_db.DBConnection()

    def connect_to_database(self):
        if not self.DB.connect():
            print("Scraper cannot connect to database")

    def parse_rss_feeds(self):
        state, rss_info = self.DB.getRSSFeeds()
        if not state:
            return
        return json.loads(json.dumps(rss_info))

    def get_image(self, entry):
        try:
            if 'media_content' in entry:
                for lnk in entry['media_content']:
                    if 'type' in lnk:
                        if lnk['type'] in ['image/jpeg']:
                            return lnk['url']
                    elif 'medium' in lnk:
                        if lnk['medium'] in ['image']:
                            return lnk['url']
                    elif 'url' in lnk:
                        return lnk['url']

            elif 'links' in entry:
                for lnk in entry['links']:
                    if lnk['type'] in ['image/jpeg']:
                        return lnk['href']
        except:
            return 'None'

    #       if 'media_content' in entry :
    #            return entry['media_content']['url']
    #
    #      elif 'links' in entry:
    #         for lnk in entry['links']:
    #            if lnk['type'] in ['image/jpeg']:
    #               return lnk['href']
    #
    #      else:
    #         print("hello")
    #         return 'None'

    def get_summary(self, entry):
        return entry['summary']

    def get_image_none(self, url):
        r = requests.get(url)
        data = r.text
        soup = BeautifulSoup(data, features="lxml")
        for link in soup.find_all('img'):
            img_src = link.get('src')
            return img_src

        return None  # return None if no images found

    def scrape_entry(self, entry, rss_url, topic):
        link = entry['link']
        title = entry['title']
        summary = self.get_summary(entry)
        publisher = entry['published']
        image = self.get_image(entry)
        if image == None and "www.tijd" in link:
            image = None
        elif image == None:
            image = self.get_image_none(link)

        if image == None:
            print("hey")

        status, message = self.DB.addNewsArticle(link, title, summary, publisher, image, rss_url, topic)
        if not message[0]:
            if "duplicate key value" not in message[1]:
                print('error:', message[1], 'link:', rss_url)

    def scrape_feed(self, rss_url, topic):
        try:
            response = requests.get(rss_url, timeout=1)
            feed = feedparser.parse(response.content)
            scraper = self.get_scraper_for_url(rss_url)
            for entry in feed.entries:
                scraper.scrape_entry(entry, rss_url, topic)
        except requests.exceptions.Timeout:
            print("Timed out while downloading RSS feed: ", rss_url)
            return
        except Exception as e:
            print("Error while downloading RSS feed: ", rss_url)
            print(e)
            return

    def get_scraper_for_url(self, url):
        return self

    def scrape_all_feeds(self):
        rss_info = self.parse_rss_feeds()
        for rss in rss_info:
            self.scrape_feed(rss['URL'], rss['Topic'])


def scraper():
    print("Starting scraper")
    _scraper = BaseFeedScraper()
    _scraper.connect_to_database()
    _scraper.scrape_all_feeds()
    print("scraping done")


if __name__ == '__main__':
    scraper()
