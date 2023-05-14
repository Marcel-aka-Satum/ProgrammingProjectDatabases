import feedparser

from . import ui_db
import json
import requests
from bs4 import BeautifulSoup
import random
import time
from fake_useragent import UserAgent
from newspaper import Article


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
        self.user_agent = None
        self.headers = None
        try:
            self.user_agent = UserAgent()
            self.headers = {'User-Agent': self.user_agent.random}
        except:
            pass

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

    def get_summary(self, entry):
        return entry['summary']

    def get_image_none(self, url):
        # Use a legitimate user agent
        user_agent_list = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36 Edge/16.16299",
            "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; AS; rv:11.0) like Gecko",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/15.15063"
        ]
        headers = {'User-Agent': random.choice(user_agent_list)}

        # Use a random delay between requests, but add a small random variation
        # in the delay to make the requests less predictable
        delay = random.uniform(2, 4)
        time.sleep(delay + random.uniform(-1, 1))

        # Use a session object to reuse the same TCP connection for multiple requests
        session = requests.Session()

        # Set the maximum number of retries and retry on 5xx HTTP errors and timeouts
        adapter = requests.adapters.HTTPAdapter(max_retries=3, pool_connections=1, pool_maxsize=1,
                                                pool_block=True)
        session.mount('http://', adapter)
        session.mount('https://', adapter)

        # Make the request with a timeout
        try:
            response = session.get(url, headers=headers, timeout=10)
            response.raise_for_status()  # raise an exception for 4xx or 5xx status codes
        except requests.exceptions.RequestException as e:
            print(f"Error: {e}")
            return None

        # Parse the HTML with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        image = soup.find('img')
        if image is not None:
            return image['src']
        else:
            return None

    def get_image_none_2(self, url):
        try:
            article = Article(url)
            response = requests.get(url, timeout=5)
            article.set_html(response.content)
            article.parse()
            return article.top_image
        except:
            return None

    def scrape_entry(self, entry, rss_url, topic):
        link = entry['link']
        title = entry['title']
        summary = self.get_summary(entry)
        publisher = entry['published']
        image = self.get_image(entry)
        if image is None and "www.tijd" in link:
            #image = self.get_image_none_2(link)
            image = None
        elif image is None:
            #image = self.get_image_none(link)
            image = None

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
