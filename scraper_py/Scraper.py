#!/usr/bin/env python
# coding: utf-8

# In[1]:


import feedparser
import pandas as pd


# In[2]:


RSSFeeds = pd.read_csv('RSSFeeds.csv')


# In[3]:


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
            
            
            article = pd.DataFrame({'URL'     :[link], 
                                    'Title'    :[title], 
                                    'Summary'  :[summary], 
                                    'Published':[published]}
                                  )
            
            
            ### Database connection should be made here in the future (duplicates need to be prevented)
            NewsArticles = NewsArticles.append(article)
            
            
    NewsArticles = NewsArticles.dropna()
    NewsArticles = NewsArticles.drop_duplicates()
    
    NewsArticles.to_csv('NewsArticles.csv', index=False)
            
    return NewsArticles


# In[4]:


import time


# In[ ]:


while True:
    scraper(RSSFeeds)
    time.sleep(600)


# In[ ]:




