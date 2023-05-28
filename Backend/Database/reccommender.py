try:
    from . import ui_db
except ImportError:
    import ui_db
try:
    from . import article_clustering
except ImportError:
    import article_clustering

from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict

import os
import pickle

class ArticleRecommender:
    def __init__(self, db_connection: ui_db.DBConnection, news_clusterer: article_clustering.NewsClusterer):
        self.db_connection = db_connection
        self.news_clusterer = news_clusterer

    def get_read_articles(self, cookie: str):
        return self.db_connection.getHasClicked(cookie)[1]

    def compute_recommendations(self, cookie: str):
        read_articles = self.get_read_articles(cookie)
        read_article_urls = [article["Article"] for article in read_articles]
        all_articles = self.news_clusterer.load_data()

        if os.path.exists("tfidf_matrix.pkl"):
            print("Loading tfidf matrix from file...")
            with open("tfidf_matrix.pkl", "rb") as f:
                X_tfidf = pickle.load(f)
        else:
            print("Calculating tfidf matrix for the reccommender...")
            # Get the tf_idf matrix for all articles
            X_tfidf = self.news_clusterer.preprocess_and_vectorize(all_articles, translate=False)

        # Calculate cosine similarities between all articles
        similarities = cosine_similarity(X_tfidf)

        # Create a dictionary to store the sum of similarities for each article
        similarity_sum = defaultdict(float)

        # Iterate over read articles and sum the similarities
        for url in read_article_urls:
            article_index = all_articles[all_articles["URL"] == url].index[0]
            for i, similarity in enumerate(similarities[article_index]):
                similarity_sum[all_articles.iloc[i]["URL"]] += similarity

        # Remove articles the user has already read
        for url in read_article_urls:
            del similarity_sum[url]

        # Sort articles by their total similarity and return 
        recommended_articles = sorted(similarity_sum.items(), key=lambda x: x[1], reverse=True)

        return recommended_articles

    def getRecommendedArticles(self, cookie: str):
        recommended_urls = self.compute_recommendations(cookie)
        print(recommended_urls)
        recommended_articles = []
        for url, score in recommended_urls:
            success, article = self.db_connection.getArticle(url)
            print(article)
            if success:
                recommended_articles.append(article[1])

        print("Inside the script:" + str(recommended_articles[0]))
        return recommended_articles


if __name__ == "__main__":
    db_connection = ui_db.DBConnection()
    db_connection.connect()

    news_clusterer = article_clustering.NewsClusterer()

    article_recommender = ArticleRecommender(db_connection, news_clusterer)
    cookie = "7d809cc5-0c7b-47a7-b5c0-ea179f606082"
    recommendations = article_recommender.compute_recommendations(cookie)
    recommended_articles = article_recommender.getRecommendedArticles(cookie)

    # Print the recommended articles

    print(f"Top 10 recommended articles for cookie '{cookie}':")
    idx = 1
    for i, (url, similarity) in enumerate(recommendations):
        print(f"{i + 1}. {url} (similarity: {similarity:.4f})")
        idx += 1
        if idx > 10:
            break

    idx = 1
    for article in recommended_articles:
        print(article)
        print("\n")
        idx += 1
        if idx > 10:
            break




            


