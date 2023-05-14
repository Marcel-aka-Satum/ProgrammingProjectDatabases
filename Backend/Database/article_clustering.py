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
    from . import ui_db
except ImportError:
    import ui_db

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
        DB = ui_db.DBConnection()
        DB.connect()
        df = pd.DataFrame(DB.getNewsArticles()[1])
        return df

    def preprocess_and_vectorize(self, df):
        """
        Preprocesses the input DataFrame by preprocessing the titles and summaries, 
        and applying TF-IDF vectorization.

        :param df: The input DataFrame containing news articles.
        :return: TF-IDF feature matrix.
        """
        df['preprocessed'] = df['Title'].apply(self.preprocess_text) + " " + df['Summary'].apply(self.preprocess_text)
        X_tfidf = self.vectorizer.fit_transform(df['preprocessed'])
        return X_tfidf

    def apply_svd(self, X_tfidf):
        """
        Applies dimensionality reduction using SVD on the input TF-IDF matrix.

        :param X_tfidf: The input TF-IDF feature matrix.
        :return: Reduced feature matrix after applying SVD.
        """
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
    

    def create_url_cluster_dataframe(self, df, clusters):
        """
        Creates a DataFrame containing article URLs and cluster labels.

        :param df: The input DataFrame containing news articles.
        :param clusters: Cluster labels for each data point.
        :return: DataFrame with URLs and cluster labels.
        """
        df_with_clusters = df.copy()
        df_with_clusters['cluster'] = clusters
        url_cluster_df = df_with_clusters[['URL', 'cluster']]
        return url_cluster_df
    

    def push_clusters_to_database(self, url_cluster_df):
        """
        Pushes the clustered data (URLs and cluster labels) to the database.

        :param url_cluster_df: DataFrame containing article URLs and cluster labels.
        :param db_connection: A connected instance of the database connection class.
        """
        db_connection = ui_db.DBConnection()
        db_connection.connect()
        for index, row in url_cluster_df.iterrows():
            url = row['URL']
            cluster_id = row['cluster']
            success, message = db_connection.addArticleCluster(url, cluster_id)

            if not success:
                print(f"Failed to insert cluster for URL '{url}': {message}")


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

    def run(self, visualize:bool):
        """
        Executes the full news clustering pipeline.

        :param db_connection: A connected instance of the database connection class.
        """
        df = self.load_data()
        X_tfidf = self.preprocess_and_vectorize(df)
        X_reduced = self.apply_svd(X_tfidf)
        clusters = self.cluster_data(X_reduced)
        df['cluster'] = clusters
        url_cluster_df = self.create_url_cluster_dataframe(df, clusters)
        self.push_clusters_to_database(url_cluster_df)
        if visualize:
            self.visualize_clusters(X_reduced, clusters, df)


if __name__ == "__main__":
    news_clusterer = NewsClusterer()
    news_clusterer.run(visualize=False)

