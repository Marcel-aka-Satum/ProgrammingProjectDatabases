# Database Description

<img src="database.png" alt="The Newsaggregator Database" width="400"/>


<div style="display: flex; justify-content: space-between;">

<div style="width: 45%;">

**`rssfeeds`**

This table stores information about the different RSS feeds that the system is aggregating. The `URL` is the primary key, meaning it's unique for each RSS feed. The `Publisher` and `Genre` provide more details about the source of the feed.

**`newsarticles`**

This table is the heart of the application. It contains all the news articles fetched from the various RSS feeds. Each article has a unique `URL`, `Title`, `Summary`, `Published` date, an `Image URL`, a `Topic`, a `Clicked` (how many times an article is clicked) and a `Language` (Lang) of the article. The `RSS_URL` is a foreign key linking back to the `rssfeeds` table, so we know which feed an article came from. The `ON DELETE CASCADE` clause ensures that if a feed is deleted, all related articles will also be deleted.

**`relatedcluster`**

This table is used to group similar articles together. It references the `newsarticles` table and assigns a `Cluster_ID` to similar articles. This helps in reducing redundancy and showing only one version of similar articles.

**`visitors`**

This table records all the unique visitors to the website. The `UID` is an automatically incrementing serial number that uniquely identifies each visitor.

</div>

<div style="width: 45%;">

**`users`**

The `users` table contains detailed information about registered users. It includes their `Username`, `Email`, `Password`, and an `Is_Admin` flag to denote admin users. The `UID` is a foreign key linking back to the `visitors` table, making sure every user is also a visitor.

**`cookies`**

The `cookies` table is used for session management. It stores a unique `cookie` for each `UID`, helping in maintaining state between different user sessions.

**`hasclicked`**

The `hasclicked` table is a relation table that tracks which user has clicked on which article. This data is crucial for the recommender system to determine article relevance for each user.

**`favored`**

The `favored` table also relates to users and articles. It keeps track of users' favorite articles. This data could be used to enhance the performance of the recommender system by giving more weight to favored articles.

**`settings`**

Finally, the `settings` table stores different configurable settings for the application. The `settingType` is the primary key and `value` is the value of that setting.

</div>

</div>

These tables help in storing, managing and processing the data needed for running the news aggregator app effectively. The relationships between the tables ensure data integrity and aid in implementing the necessary functionalities of the application.

---
---

# Database Solution

This suite of Python code is designed to provide a comprehensive news aggregator solution with a PostgreSQL database backend. The codebase consists of several modules that enable the initialization of the database, population with RSS feeds, insertion of news articles scraped from the feeds, and retrieval of data from the database. The codebase is modularized, well-documented, and designed to be easily extensible, making it an excellent starting point for a more complex news aggregator solution. With the ability to connect to and interface with the database, this codebase provides a simple but powerful interface to the database, enabling users to define, populate, and query the database with ease.

# Table of Contents

1. [Code Documentation for ui_db.py](#ui_dbpy)

2. [Code Documentation for init_db.py](#init_dbpy)

3. [Code Documentation for populate_db.py](#populate_dbpy)

4. [Code Documentation for Scraper.py](#Scraperpy)

5. [Code Documentation for query_db.py](#query_dbpy)

6. [Code Documentation for article_clustering.py](#newsclusterer-technical-documentation)

# ui_db.py

The DBConnection class is an interface for interacting with a PostgreSQL database that contains a newsaggregator schema. It provides methods for establishing a connection to the database, redefining the schema, populating the tables with hardcoded data, retrieving articles and RSS feeds, and performing CRUD operations on users, articles, and RSS feeds. The class also returns the data in JSON format. The class can be imported and instantiated, and its methods can be called to perform operations on the database.

## Class `DBConnection`
### Connection methods

 `__init__(self)`

- This is the constructor of the `DBConnection` class that initializes the `connection` and `cursor` attributes to `None`.

 `__del__(self)`

- This method is called when an object of the `DBConnection` class is deleted and it closes the connection to the database.

 `is_connected(self) -> bool`

- This method checks if the connection to the database exists and returns a boolean value accordingly.

 `connect(self) -> bool`

- This method tries to establish a connection with the database and returns a boolean value indicating whether the connection was successful.
 
 `createBackup(self, cwd)`

- This method creates a backup of the database and saves it in the current working directory.

 `loadBackup(self, cwd, file: str)`

- This method loads a backup of the database from the current working directory.

 `generateUID(self) -> int`

- This method generates a unique ID for a user.


### Database Operations

 `redefine(self)`

- This method recreates the database by dropping and re-creating the schema and tables.

 `populate(self)`

- This method populates the database with hardcoded data by inserting rows into the `rssfeeds` and `newsarticles` tables.

### Articles

 `getArticle(self, url: str) -> tuple`

- This method retrieves an article from the `newsarticles` table and returns it as a tuple.

 `getArticles(self, tag: str = "") -> json`

- This method retrieves all rows from the `newsarticles` table and returns them as a JSON object.

 `addNewsArticle(self, url: str, title: str, summary: str, published: str, image: str, rss_url: str, topic: str)`

- This method adds an article to the database.

 `deleteNewsArticle(self, url: str)`

- This method deletes an article from the database.

 `updateArticle(self, url: str, title: str, summary: str, published: str, image: str, rss_url: str, topic: str)`

- This method updates an article in the database.

 `getTopics(self) -> list`

- This method retrieves all the topics from the `newsarticles` table and returns them as a list.

 `getNewsArticlesTopic(self, topic: str) -> list`

- This method retrieves all the articles of a particular topic from the `newsarticles` table and returns them as a list.

 `getNewsArticles(self) -> list`

- This method retrieves all the articles from the `newsarticles` table and returns them as a list.

 `getArticlesDict(self) -> list`

- This method retrieves all the articles from the `newsarticles` table and returns them as a list of dictionaries.

### Users

 `getUsers(self) -> json`

- This method retrieves all rows from the `users` table and returns them as a JSON object.

 `getUser(self, email: str) -> bool`

- This method retrieves a user from the database with a specific email and returns a boolean value indicating whether the user exists. If the user exists, it also returns a dictionary with the user's data.

 `addUser(self, username: str, email: str, password: str, is_admin: bool)`

- This method adds a user to the database.

 `updateUser(self, id:int, username: str, email: str, password: str, is_admin: bool)`

- This method updates a user in the database.

 `deleteUser(self, username: str)`

- This method deletes a user from the database.

### RSS Feeds

 `ParseRSSFeeds(self) -> json`

- This method retrieves all rows from the `rssfeeds` table and returns them as a JSON object.

 `addRSSFeed(self, url: str, publisher: str, topic: str)`

- This method adds an RSS feed to the database.

 `deleteRSSFeed(self, url: str)`

- This method deletes an RSS feed from the database.

 `updateRSSFeed(self, url: str, publisher: str, topic: str)`

- This method updates an RSS feed in the database.

 `getRSSFeeds(self) -> list`

- This method retrieves all the RSS feeds from the `rssfeeds` table and returns them as a list.

### Settings
 `addSetting(self, settingType: str, value: str) -> tuple`

- This method adds a setting to the `settings` table.

 `updateSetting(self, settingType: str, value: str)`

- This method updates a setting in the `settings` table.

 `getSettings(self) -> dict`

- This method retrieves all the settings from the `settings` table and returns them as a dictionary.

### Clusters
 `addArticleCluster(self, url: str, cluster_id: int) -> tuple`

- This method adds an article cluster to the `relatedcluster` table and returns it as a tuple.

 `getCluster(self, cluster_id: int) -> tuple`

- This method retrieves a cluster from the `relatedcluster` table and returns it as a tuple.

 `getAllClusters(self) -> tuple`

- This method retrieves all the clusters from the `relatedcluster` table and returns them as a tuple.

 `getAllClustersGenre(self, genre: str) -> tuple`

- This method retrieves all the clusters of a particular genre from the `relatedcluster` table and returns them as a tuple.

### Favorites
 `addFavored(self, UID: str, url: str) -> tuple`

- This method adds a favored article to the `favored` table and returns it as a tuple.

`addFavorite(self, Cookie: str, url: str) -> tuple`

- This method adds a favored article to the `favored` table and returns it as a tuple.

 `getFavorites(self, URL: str) -> list`

- This method retrieves all the favored articles of a user from the `favored` table and returns them as a list.

 `getFavored(self) -> list`

- This method retrieves all the favored articles from the `favored` table and returns them as a list.

 `deleteFavored(self, UID: str, url: str) -> tuple`

- This method deletes a favored article from the `favored` table and returns it as a tuple.

 `deleteAllFavored(self, UID: str) -> tuple`

- This method deletes all favored articles of a user from the `favored` table and returns them as a tuple.

### Visitors
 `addVisitor(self, UID: str) -> tuple`

- This method adds a visitor to the `visitors` table and returns it as a tuple.

 `deleteVisitor(self, UID: str) -> tuple`

- This method deletes a visitor from the `visitors` table and returns it as a tuple.

 `getVisitors(self) -> list`

- This method retrieves all the visitors from the `visitors` table and returns them as a list.

 `getVisitor(self, UID: str) -> tuple`

- This method retrieves a visitor from the `visitors` table and returns it as a tuple.

### Clicked
 `addHasClicked(self, UID: str, url: str) -> tuple`

- This method adds a clicked article to the `hasclicked` table and returns it as a tuple.

 `addHasClickedCookie(self, url: str, cookie: str) -> tuple`

- This method adds a clicked article to the `hasclicked` table and returns it as a tuple.

 `getHasClicked(self, cookie: str) -> list`

- This method retrieves all the clicked articles of a user from the `hasclicked` table and returns them as a list.

 `getAllHasClicked(self) -> list`

- This method retrieves all the clicked articles from the `hasclicked` table and returns them as a list.

### Cookies
 `addCookie(self, cookie: str, UID: str) -> tuple`

- This method adds a cookie to the `cookies` table and returns it as a tuple.

 `deleteCookie(self, UID: str) -> tuple`

- This method deletes a cookie from the `cookies` table and returns it as a tuple.

 `getCookies(self) -> list`

- This method retrieves all the cookies from the `cookies` table and returns them as a list.

 `generateCookie(self) -> str`

- This method generates a unique cookie for a user.



## Example usage

To use the `DBConnection` class, first create an object of this class and call the `connect()` method to establish a connection to the database. Once a connection has been established, call the other methods of this class to perform operations on the database.

```
import Scraper
from ui_db import DBConnection
```

- Create a DBConnection object
```
DB = DBConnection()
```
- Connect to the database
```
DB.connect()
```
- Redefine the database
```
DB.redefine()
```
- Populate the database
```
DB.populate()
```
- Use the scraper to insert new articles into the database
```
Scraper.scraper()
```
- Retrieve articles from the database
```
articles = DB.getArticle()
```
- Retrieve users from the database
```
users = DB.getUsers()
```
- Retrieve RSS feeds from the database
```
rss_feeds = DB.ParseRSSFeeds()
```


# init_db.py

This code is written in Python and uses the psycopg2 library to connect to a PostgreSQL database. The purpose of this code is to initialize a new database and create tables for a news aggregator.

 `initialize_db(cur)`

- This function takes in a cursor object `cur` as a parameter, which is used to execute SQL statements. The function creates a new schema called `newsaggregator` and three tables within it: `rssfeeds`, `newsarticles`, and `users`. It also creates a fourth table called `hasclicked` that stores information about which users have clicked on which articles.

### SQL statements

- The SQL statements that are executed in this function are as follows:

#### `sql1`

- This SQL statement drops any existing schema and tables with the same names as the ones being created. It is necessary to do this to ensure that the database is properly initialized.

#### `sql2`

- This SQL statement creates a new schema called `newsaggregator`.

#### `sql3`

- This SQL statement creates three tables within the `newsaggregator` schema: `rssfeeds`, `newsarticles`, and `users`. It also creates a fourth table called `hasclicked` that stores information about which users have clicked on which articles. Each table has a set of columns with specific data types and constraints.

### Executing SQL statements

The SQL statements are executed using the `execute()` method of the cursor object. Once each SQL statement is executed, a message is printed to the console to indicate which action has been taken.

# populate_db.py

This code is written in Python and uses the psycopg2 and pandas libraries to connect to a PostgreSQL database and read data from a CSV file. The purpose of this code is to populate the `rssfeeds` table in the `newsaggregator` schema with data from a CSV file.

`populate_db(conn, cur)`

- This function takes in a connection object `conn` and a cursor object `cur` as parameters. The `conn` object is used to commit changes to the database, while the `cur` object is used to execute SQL statements. The function reads data from a CSV file called `RSSFeeds.csv` and inserts it into the `rssfeeds` table.

`create_has(password)`

- This function takes in a password as a parameter and returns a hashed version of it. The hashed password is stored in the database instead of the actual password.

### Reading data from CSV file

The function uses the pandas library to read data from a CSV file called `RSSFeeds.csv`. The CSV file must have three columns: `URL`, `Publisher`, and `Topic`. The function reads the data from each column into separate lists.

### SQL statements

The function uses an SQL statement called `rss_insert_query` to insert data into the `rssfeeds` table. The SQL statement has three parameters, which are filled in with data from the lists created in the previous step.

### Executing SQL statements

The SQL statement is executed using the `execute()` method of the cursor object. The function iterates through each row of the CSV file and inserts the data into the `rssfeeds` table one row at a time. After each row is inserted, the changes are committed to the database.

# Scraper.py

| Feed Format   | Version  | Description                                     |
|---------------|----------|-------------------------------------------------|
| RSS           | 0.90     | An early version of the RSS feed format        |
| Netscape RSS  | 0.91     | An early version of RSS by Netscape            |
| Userland RSS  | 0.91     | An early version of RSS by Userland            |
| RSS           | 0.92     | A version with improvements over 0.91          |
| RSS           | 0.93     | A version with improvements over 0.92          |
| RSS           | 0.94     | A version with improvements over 0.93          |
| RSS           | 1.0      | A major revision of the RSS feed format        |
| RSS           | 2.0      | The most widely-used version of the RSS format |
| Atom          | 0.3      | An early version of the Atom feed format       |
| Atom          | 1.0      | The latest and most stable version of Atom     |
| CDF           | -        | Channel Definition Format, an XML format       |
| JSON Feed     | -        | A feed format based on the JSON data format    |

`BaseFeedScraper` is a Python class developed for scraping and parsing syndicated feeds using the Universal Feed Parser Python module. The table above lists the feed formats and versions supported by the Universal Feed Parser.

## Class Methods

- `__init__(self)`: Constructor method for initializing a new instance of `BaseFeedScraper`. This method sets up a connection to the database.

- `connect_to_database(self)`: Method to establish a connection with the database. If connection fails, it prints "Scraper cannot connect to database".

- `parse_rss_feeds(self)`: Method to parse the RSS feeds from the database.

- `get_image(self, entry)`: Method to extract image from the `entry`. It supports various image formats such as jpeg, png, jpg, and gif.

- `get_summary(self, entry)`: Method to get the summary from the `entry`.

- `scrape_entry(self, entry, rss_url, topic, Image)`: Method to scrape individual entries from the feed. It takes in an entry, the URL of the RSS feed, the topic, and an image.

- `scrape_feed(self, rss_url, topic)`: Method to scrape an entire feed given its URL and topic. It parses the feed and scrapes each entry. If the feed includes an image or logo, it is also scraped.

- `get_scraper_for_url(self, url)`: Method to get the scraper instance for a given url.

- `scrape_all_feeds(self)`: Method to scrape all the RSS feeds. It parses the RSS feeds from the database and scrapes each feed.

## Usage

```python
def scraper():
    print("Starting scraper")
    _scraper = BaseFeedScraper()
    _scraper.connect_to_database()
    _scraper.scrape_all_feeds()
    print('scraping done')

    print("Calculating the new tf-idf matrix for new articles")
    clusterer = NewsClusterer()
    all_articles = clusterer.load_data()
    X_tfidf = clusterer.preprocess_and_vectorize(all_articles, translate=False)
    with open("tfidf_matrix.pkl", "wb") as f:
        pickle.dump(X_tfidf, f)
    print("Saved tf-idf matrix")

if __name__ == '__main__':
    scraper()
```
In this usage example, a new instance of BaseFeedScraper is created. It connects to the database and begins to scrape all feeds. After the scraping is done, it calculates the tf-idf matrix for new articles and saves it.


# query_db.py

This code is written in Python and uses the psycopg2 library to generate SQL statements that interact with the `newsaggregator` schema of a PostgreSQL database. The purpose of this code is to define functions that return SQL statements for inserting, updating, deleting or retrieving data from the `rssfeeds`, `newsarticles`, and `users` tables in the schema.

`insert_rssfeed(URL: str, Publisher: str, Topic: str) -> str`

- This function takes in three parameters representing the URL, publisher, and topic of an RSS feed and returns an SQL statement for inserting this information into the `rssfeeds` table.

`insert_newsarticle(URL: str, Title: str, Summary: str, Published: str, Image_URL: str, RSS_URL: str, Topic: str) -> str`

- This function takes in seven parameters representing the URL, title, summary, published date, image URL, RSS URL, and topic of a news article and returns an SQL statement for inserting this information into the `newsarticles` table.

`insert_user(Username: str, Email: str, Password: str, Is_Admin: bool) -> tuple()`

- This function takes in four parameters representing the username, email, password, and administrative status of a user and returns a tuple with the SQL statement for inserting this information into the `users` table and the parameters for the query.

`insert_visitor(UID: str) -> str`

- This function takes in the UID of a user and returns an SQL statement for inserting this information into the `visitors` table.

`insert_cookie(Cookie: str, UID: str) -> str`

- This function takes in two parameters representing the cookie and UID of a user and returns an SQL statement for inserting this information into the `cookies` table.

`insert_hasclicked(UID: str, URL: str) -> str`

- This function takes in two parameters representing the UID of a user and the URL of a news article and returns an SQL statement for inserting this information into the `hasclicked` table.

`insert_hasclickedcookie(URL: str, Cookie: str) -> str`

- This function takes in two parameters representing the URL of a news article and the cookie of a user and returns an SQL statement for inserting this information into the `hasclickedcookie` table.

`addCountArticle(URL: str) -> str`

- This function takes in the URL of a news article and returns an SQL statement for incrementing the `count` column of the corresponding row in the `newsarticles` table.

`insert_favored(UID: str, URL: str) -> str`

- This function takes in two parameters representing the UID of a user and the URL of a news article and returns an SQL statement for inserting this information into the `favored` table.

`insert_favorite(Cookie: str, URL: str) -> str`

- This function takes in two parameters representing the cookie of a user and the URL of a news article and returns an SQL statement for inserting this information into the `favorite` table.

`insert_cluster(URL: str, Cluster: int) -> str`

- This function takes in two parameters representing the URL of a news article and the cluster number and returns an SQL statement for inserting this information into the `cluster` table.

`insert_setting(SettingType: str, SettingValue: str) -> str`

- This function takes in two parameters representing the type and value of a setting and returns an SQL statement for inserting this information into the `settings` table.

`delete_rssfeed(URL: str) -> str`

- This function takes in the URL of an RSS feed and returns an SQL statement for deleting the corresponding row from the `rssfeeds` table.

`delete_newsarticle(URL: str) -> str`

- This function takes in the URL of a news article and returns an SQL statement for deleting the corresponding row from the `newsarticles` table.

`delete_user(Uid: str) -> str`

- This function takes in the UID of a user and returns an SQL statement for deleting the corresponding row from the `users` table.

`delete_visitor(UID: str) -> str`

- This function takes in the UID of a user and returns an SQL statement for deleting the corresponding row from the `visitors` table.

`delete_cookie(Cookie: str) -> str`

- This function takes in the cookie of a user and returns an SQL statement for deleting the corresponding row from the `cookies` table.

`delete_favored(UID: str, URL: str) -> str`

- This function takes in two parameters representing the UID of a user and the URL of a news article and returns an SQL statement for deleting the corresponding row from the `favored` table.

`delete_all_favored(UID: str) -> str`

- This function takes in the UID of a user and returns an SQL statement for deleting all rows from the `favored` table that correspond to that user.

`update_rssfeed(URL: str, Publisher: str, Topic: str) -> str`

- This function takes in three parameters representing the URL, publisher, and topic of an RSS feed and returns an SQL statement for updating this information in the corresponding row of the `rssfeeds` table.

`update_newsarticle(URL: str, Title: str, Summary: str, Published: str, Image_URL: str, RSS_URL: str, Topic: str) -> str`

- This function takes in seven parameters representing the URL, title, summary, published date, image URL, RSS URL, and topic of a news article and returns an SQL statement for updating this information in the corresponding row of the `newsarticles` table.

`update_user(ID: int, Username: str, Email: str, Password: str, Is_Admin: bool) -> str`

- This function takes in five parameters representing the UID, username, email, password, and administrative status of a user and returns an SQL statement for updating this information in the corresponding row of the `users` table.

`update_setting(SettingType: str, SettingValue: str) -> str`

- This function takes in two parameters representing the type and value of a setting and returns an SQL statement for updating this information in the corresponding row of the `settings` table.

`get_rssfeeds() -> str`

- This function returns an SQL statement for retrieving all rows from the `rssfeeds` table.

`get_newsarticles() -> str`

- This function returns an SQL statement for retrieving all rows from the `newsarticles` table.

`get_visitors() -> str`

- This function returns an SQL statement for retrieving all rows from the `visitors` table.

`get_users() -> str`

- This function returns an SQL statement for retrieving all rows from the `users` table.

`get_cookies() -> str`

- This function returns an SQL statement for retrieving all rows from the `cookies` table.

`get_hasclicked(cookie: str) -> str`

- This function takes in the cookie of a user and returns an SQL statement for retrieving all rows from the `hasclicked` table that correspond to that user.

`get_all_hasclicked() -> str`

- This function returns an SQL statement for retrieving all rows from the `hasclicked` table.

`get_favored() -> str`

- This function returns an SQL statement for retrieving all rows from the `favored` table.

`get_settings() -> str`

- This function returns an SQL statement for retrieving all rows from the `settings` table.

### Executing SQL statements

The SQL statements are not executed in this code. Instead, they are returned as strings and can be executed using the `execute()` method of a cursor object.

---

# NewsClusterer Technical Documentation

The `NewsClusterer` class clusters news articles based on their titles and summaries. The clustering process consists of:

1. Text preprocessing with `preprocess_text()`
2. Vectorizing text and applying dimensionality reduction using TF-IDF and SVD within `process_data()`
3. Clustering using DBSCAN in `cluster_data()`

## 1. Text Preprocessing

`preprocess_text()` 
The first step in the pipeline is to preprocess the text data. This process includes:

- HTML tag removal: HTML tags are removed using the BeautifulSoup library.
- Tokenization: The text is split into individual words (tokens) using the NLTK library.
- Stop word removal: Common words (e.g., "the", "and") are removed to reduce noise and improve computational efficiency.
- Lemmatization: Words are converted to their base form (e.g., "running" -> "run") to reduce dimensionality and improve similarity calculations.

This results in a cleaner and more compact representation of the text, making it easier for subsequent algorithms to process.


## 2. Vectorizing Text and Dimensionality Reduction

`process_data()` converts preprocessed text into numerical vectors using the Term Frequency-Inverse Document Frequency (TF-IDF) technique. TF-IDF is chosen as it captures the importance of each word in the document, while taking into account the overall frequency of the word in the dataset.

$$
\text{tfidf}(t, d, D) = \text{tf}(t, d) \times \text{idf}(t, D)
$$

where $\text{tf}(t, d)$ is the term frequency of term $t$ in document $d$, $\text{idf}(t, D)$ is the inverse document frequency of term $t$ in the set of documents $D$, and $D$ is the total number of documents. The inverse document frequency is calculated as:

$$
\text{idf}(t, D) = \log{\frac{N}{\text{df}(t)}}
$$

where $N$ is the total number of documents, and $\text{df}(t)$ is the number of documents containing term $t$.


Next, `process_data()` applies Singular Value Decomposition (SVD) to the TF-IDF matrix to reduce the feature space. SVD is used because it can efficiently compress information while maintaining the relationships among the documents.

$$
X_{reduced} = U \times \Sigma \times V^{T}
$$

where $X_{reduced}$ is the reduced feature matrix, $U$ contains the left singular vectors, $\Sigma$ is a diagonal matrix with singular values, and $V^{T}$ contains the right singular vectors.

## 3. Clustering Articles

`cluster_data()` uses the DBSCAN algorithm to cluster articles based on the reduced feature matrix. DBSCAN is chosen as it can automatically determine the number of clusters and is robust to noise, which helps reduce the impact of irrelevant articles or outliers.

```math
\text{DBSCAN}(P, \epsilon, \text{min\_samples})
```

DBSCAN has two main parameters that can be tweaked to improve performance:

- $\epsilon$: The maximum distance between two points for them to be considered as part of the same cluster. A smaller value will result in more clusters, while a larger value will result in fewer clusters.
- min\_samples: The minimum number of points required to form a dense region. A higher value will make the algorithm more conservative in forming clusters, while a lower value will create more clusters.

We use cosine similarity as a distance metric for clustering with DBSCAN, which is motivated by several factors:

1. High-dimensional data: News articles' text data, once vectorized (e.g., using TF-IDF), usually results in high-dimensional feature spaces. Cosine similarity is a better metric for high-dimensional spaces compared to Euclidean distance, as it mitigates the "curse of dimensionality." In high-dimensional spaces, Euclidean distances tend to become inflated and less meaningful.

2. Text data and sparsity: After vectorization, text data is often represented in sparse matrices where most values are zeros. Cosine similarity is particularly well-suited for sparse data, as it measures the angle between two vectors rather than their absolute distances. This characteristic makes it less sensitive to the magnitude of the vectors and more focused on their relative orientations, which is useful for text data.

3. Interpretability: Cosine similarity values range from -1 to 1, where 1 indicates that the vectors are identical, 0 means they are orthogonal (completely unrelated), and -1 implies they are diametrically opposed. This interpretable range is beneficial when analyzing the relationships between text documents, as it allows for an intuitive understanding of how similar or dissimilar the documents are.

4. Robustness to document length: Cosine similarity measures the angle between two vectors, not their magnitude. Therefore, it is less affected by the difference in document lengths. This is important when clustering news articles, as the length of articles can vary greatly.

## Visualizing Clusters

`visualize_clusters()` uses the t-SNE algorithm for 3D visualization of the clusters. t-SNE is suitable for visualizing high-dimensional data in lower-dimensional spaces, providing an intuitive understanding of the clustering results.

$$
\text{t-SNE}(X_{reduced}, d)
$$

In summary, the `NewsClusterer` class provides a concise pipeline for clustering news articles based on their titles and summaries, with dimensionality reduction and 3D visualization of the resulting clusters. The DBSCAN parameters can be adjusted to optimize the clustering performance.


