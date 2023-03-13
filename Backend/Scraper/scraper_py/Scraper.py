#!/usr/bin/env python
# coding: utf-8

import feedparser
import pandas as pd
import time

RSSFeeds = pd.read_csv('RSSFeeds.csv')

def scraper(RSSFeeds):
    
    # Get rss urls
    rss_urls = RSSFeeds['URL']
    
    # Load data (Temporary fix, will be removed in future version once there is a database)
    NewsArticles = pd.read_csv('NewsArticles.csv')
    for url in rss_urls:
        feed = feedparser.parse(url)

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

            article = pd.DataFrame({'URL'     :[link],
                                    'Title'    :[title], 
                                    'Summary'  :[summary], 
                                    'Published':[published],
                                    'Image'    :[image]}
                                  )

            ### Database connection should be made here in the future (duplicates need to be prevented)
            NewsArticles = pd.concat([NewsArticles, article], ignore_index=True)

    NewsArticles = NewsArticles.dropna()
    NewsArticles = NewsArticles.drop_duplicates()

    NewsArticles.to_csv('NewsArticles.csv', index=False)
    return NewsArticles


scraper(RSSFeeds)