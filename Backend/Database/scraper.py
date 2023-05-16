import feedparser

from . import ui_db
import json
import requests

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
                        if lnk['type'] in ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']:
                            return lnk['url']
                    elif 'medium' in lnk:
                        if lnk['medium'] in ['image']:
                            return lnk['url']
                    elif 'url' in lnk:
                        return lnk['url']

            elif 'links' in entry:
                for lnk in entry['links']:
                    if lnk['type'] in ['image/jpeg', 'image/png', 'image/jpg']:
                        return lnk['href']
        except:
            return 'None'

    def get_summary(self, entry):
        return entry['summary']


    def scrape_entry(self, entry, rss_url, topic, Image):
        link = entry['link']
        title = entry['title']
        summary = self.get_summary(entry)
        publisher = entry['published']
        image = self.get_image(entry)

        #if image is None and "www.tijd" in link:
        #    image = self.get_image_none_2(link)
        #    image = None
        if image is None:
            # image = self.get_image_none(link)
            image = Image

        status, message = self.DB.addNewsArticle(link, title, summary, publisher, image, rss_url, topic)
        if not message[0]:
            if "duplicate key value" not in message[1]:
                print('error:', message[1], 'link:', rss_url)

    def scrape_feed(self, rss_url, topic):
        Image = None
        try:
            response = requests.get(rss_url, timeout=1)
            feed = feedparser.parse(response.content)
            scraper = self.get_scraper_for_url(rss_url)
            if 'image' in feed.feed and 'url' in feed.feed.image:
                Image = feed.feed.image.url
            elif 'logo' in feed.feed:
                Image = feed.feed.logo
            for entry in feed.entries:
                scraper.scrape_entry(entry, rss_url, topic, Image)
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
