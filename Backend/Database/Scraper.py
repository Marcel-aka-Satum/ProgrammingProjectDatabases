#!/usr/bin/env python
# coding: utf-8

import feedparser
from ui_db import DBConnection 
import json


def scraper():
    
    # Initialize DB object
    DB = DBConnection()
    # Establish connection
    DB.connect()

    rss_info = DB.ParseRSSFeeds()
    rss_info = json.loads(rss_info)
    
    for rss in rss_info:
        rss_url = rss['URL']
        topic = rss['Topic']
        print(topic)
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

            rss_insert_query = '''
                        INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image_URL, RSS_URL, Topic)
                        VALUES (%s, %s, %s, %s, %s, %s, %s);
                        '''
            try:
                DB.cursor.execute(rss_insert_query,
                                        (link, title, summary, published, image, rss_url, topic)
                                    )
                DB.connection.commit()
            except:
                print("Most likely a duplicate")
        print('The news articles corresponding to rss feed '+str(rss_url)+ ' have been inserted.')

scraper()