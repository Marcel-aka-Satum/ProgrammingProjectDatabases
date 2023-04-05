#!/usr/bin/env python
# coding: utf-8

# In[2]:


import numpy as np
import pandas as pd
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import DBSCAN
from sklearn.decomposition import TruncatedSVD
from gensim.models import Word2Vec
from bs4 import BeautifulSoup
import re


# In[3]:


import psycopg2
import json


# In[4]:


from ui_db import DBConnection
DB = DBConnection()
DB.connect()
df = pd.DataFrame(json.loads(DB.getArticles()))


# In[5]:


import re


def remove_html_tags(text):
    soup = BeautifulSoup(text, 'html.parser')
    clean_text = soup.get_text()

    # Remove additional unwanted characters or spaces
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()

    return clean_text


# Preprocessing function
def preprocess_text(text):
    text = remove_html_tags(text)
    stop_words = set(stopwords.words('dutch'))
    lemmatizer = WordNetLemmatizer()
    tokens = word_tokenize(text)
    tokens = [lemmatizer.lemmatize(token.lower()) for token in tokens if token.isalpha() and token not in stop_words]
    return " ".join(tokens)


# In[6]:


import nltk
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')


# In[7]:


# Preprocess the news article titles and summaries
df['preprocessed'] = df['Title'].apply(preprocess_text) + " " + df['Summary'].apply(lambda x: preprocess_text(str(x)))


# In[8]:


# Convert the preprocessed text into numerical vectors using TF-IDF
vectorizer = TfidfVectorizer()
X_tfidf = vectorizer.fit_transform(df['preprocessed'])

# Optional: Apply dimensionality reduction using SVD
svd = TruncatedSVD(n_components=100)
X_reduced = svd.fit_transform(X_tfidf)


# In[9]:


# Apply DBSCAN algorithm
dbscan = DBSCAN(eps=0.5, min_samples=5, metric='cosine')
clusters = dbscan.fit_predict(X_reduced)


# In[10]:


# Assign the cluster labels to the original DataFrame
df['cluster'] = clusters


# In[16]:


pd.set_option('display.max_columns', None)  # Display all columns
pd.set_option('display.max_rows', None)     # Display all rows
pd.set_option('display.max_colwidth', None) # Display full column content without truncation

# Print the clustered news articles
for cluster_id in np.unique(clusters):
    if cluster_id == -1:
        continue
    print(f"Cluster {cluster_id}:")
    #print(df[df['cluster'] == cluster_id][['Title', 'Summary']])
    print(df[df['cluster'] == cluster_id]['preprocessed'])
    
    print("\n")


# In[12]:


df


# In[18]:


from sklearn.manifold import TSNE
import matplotlib.pyplot as plt


# In[19]:


tsne = TSNE(n_components=2, random_state=42)
X_tsne = tsne.fit_transform(X_reduced)


# In[20]:


plt.figure(figsize=(12, 8))
for cluster_id in np.unique(clusters):
    if cluster_id == -1:
        color = 'gray'
    else:
        color = plt.cm.rainbow(cluster_id / len(np.unique(clusters)))
    plt.scatter(X_tsne[clusters == cluster_id, 0], X_tsne[clusters == cluster_id, 1], c=[color], label=f"Cluster {cluster_id}")
plt.legend()
plt.xlabel('t-SNE 1')
plt.ylabel('t-SNE 2')
plt.title('t-SNE visualization of clusters')
plt.show()


# In[21]:


import plotly.graph_objs as go
import plotly.express as px


# In[25]:


def split_text(text, max_length=50):
    words = text.split()
    lines = []
    current_line = []

    for word in words:
        if len(' '.join(current_line + [word])) <= max_length:
            current_line.append(word)
        else:
            lines.append(' '.join(current_line))
            current_line = [word]

    if current_line:
        lines.append(' '.join(current_line))

    return '<br>'.join(lines)


# In[23]:


# Create a DataFrame with t-SNE data and cluster labels

tsne_df = pd.DataFrame(X_tsne, columns=['t-SNE 1', 't-SNE 2'])
tsne_df['Cluster'] = clusters
tsne_df['Preprocessed'] = df['preprocessed'].apply(split_text)


# Create an interactive scatter plot
fig = px.scatter(tsne_df,
                 x='t-SNE 1',
                 y='t-SNE 2',
                 color='Cluster',
                 hover_data=['Preprocessed'],
                 color_continuous_scale=px.colors.sequential.Rainbow,
                 title='t-SNE visualization of clusters')

# Show the plot
fig.show()


# In[ ]:




