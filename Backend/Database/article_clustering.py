import numpy as np
import pandas as pd

import nltk
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import DBSCAN
from sklearn.decomposition import TruncatedSVD
from sklearn.manifold import TSNE

from gensim.models import Word2Vec
from bs4 import BeautifulSoup

import re
import psycopg2
import json

import matplotlib.pyplot as plt
import plotly.graph_objs as go
import plotly.express as px

try:
    from . import DBConnection
except:
    from ui_db import DBConnection

class NewsClusterer:
    """
    A class to cluster news articles based on their titles and summaries.
    """

    def __init__(self):
        """
        Initializes the NewsClusterer with required models and transformers.
        """
        self.vectorizer = TfidfVectorizer()
        self.dbscan = DBSCAN(eps=0.2, min_samples=2, metric='cosine')
        self.tsne_3d = TSNE(n_components=3, random_state=42)
        self.svd = TruncatedSVD(n_components=100)

    @staticmethod
    def remove_html_tags(text):
        """
        Removes HTML tags from the input text.

        :param text: The input text containing HTML tags.
        :return: Cleaned text without HTML tags.
        """
        soup = BeautifulSoup(text, 'html.parser')
        clean_text = soup.get_text()
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()
        return clean_text

    @staticmethod
    def preprocess_text(text):
        """
        Preprocesses the input text by removing HTML tags, tokenizing, removing stop words, 
        and lemmatizing the tokens.

        :param text: The input text to preprocess.
        :return: Preprocessed text.
        """
        text = NewsClusterer.remove_html_tags(text)
        stop_words = set(stopwords.words('dutch'))
        lemmatizer = WordNetLemmatizer()
        tokens = word_tokenize(text)
        tokens = [lemmatizer.lemmatize(token.lower()) for token in tokens if token.isalpha() and token not in stop_words]
        return " ".join(tokens)

    @staticmethod
    def split_text(text, max_length=50):
        """
        Splits the input text into lines of at most max_length characters.

        :param text: The input text to split.
        :param max_length: The maximum length of a line.
        :return: Text with lines split by '<br>'.
        """
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

    def load_data(self):
        """
        Loads news articles from the database and returns a DataFrame.

        :return: DataFrame containing news articles.
        """
        DB = DBConnection()
        DB.connect()
        df = pd.DataFrame(DB.getNewsArticles()[1])
        return df

    def process_data(self, df):
        """
        Processes the input DataFrame by preprocessing the titles and summaries, 
        and applying TF-IDF vectorization and dimensionality reduction using SVD.

        :param df: The input DataFrame containing news articles.
        :return: Reduced feature matrix after applying SVD.
        """
        df['preprocessed'] = df['Title'].apply(self.preprocess_text) + " " + df['Summary'].apply(self.preprocess_text)
        X_tfidf = self.vectorizer.fit_transform(df['preprocessed'])
        X_reduced = self.svd.fit_transform(X_tfidf)
        return X_reduced

    def cluster_data(self, X_reduced):
        """
        Clusters the reduced feature matrix using the DBSCAN algorithm.

        :param X_reduced: The reduced feature matrix.
        :return: Cluster labels for each data point.
        """
        clusters = self.dbscan.fit_predict(X_reduced)
        return clusters
    
    def visualize_clusters(self, X_reduced, clusters, df):
        """
        Visualizes the clusters using 3D t-SNE.

        :param X_reduced: The reduced feature matrix.
        :param clusters: Cluster labels for each data point.
        :param df: The input DataFrame containing news articles.
        """
        X_tsne_3d = self.tsne_3d.fit_transform(X_reduced)
        tsne_df_3d = pd.DataFrame(X_tsne_3d, columns=['t-SNE 1', 't-SNE 2', 't-SNE 3'])
        tsne_df_3d['Cluster'] = clusters
        tsne_df_3d['Preprocessed'] = df['Title'].apply(self.split_text) + ' ' + df['Summary'].apply(self.split_text)

        fig_3d = px.scatter_3d(tsne_df_3d,
                                x='t-SNE 1',
                                y='t-SNE 2',
                                z='t-SNE 3',
                                color='Cluster',
                                hover_data=['Preprocessed'],
                                color_continuous_scale=px.colors.sequential.Rainbow,
                                title='3D t-SNE visualization of clusters')

        fig_3d.show()

    def run(self):
        """
        Executes the full news clustering pipeline.
        """
        df = self.load_data()
        X_reduced = self.process_data(df)
        clusters = self.cluster_data(X_reduced)
        df['cluster'] = clusters
        self.visualize_clusters(X_reduced, clusters, df)

if __name__ == "__main__":
    news_clusterer = NewsClusterer()
    news_clusterer.run()

