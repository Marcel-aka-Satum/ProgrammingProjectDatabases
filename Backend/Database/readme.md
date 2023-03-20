# Database Solution

This suite of Python code is designed to provide a comprehensive news aggregator solution with a PostgreSQL database backend. The codebase consists of several modules that enable the initialization of the database, population with RSS feeds, insertion of news articles scraped from the feeds, and retrieval of data from the database. The codebase is modularized, well-documented, and designed to be easily extensible, making it an excellent starting point for a more complex news aggregator solution. With the ability to connect to and interface with the database, this codebase provides a simple but powerful interface to the database, enabling users to define, populate, and query the database with ease.

# Table of Contents

1. [Code Documentation for ui_db.py](#ui_db.py)
    - ### Class `DBConnection`
        - `__init__(self)`
        - `__del__(self)`
        - `is_connected(self) -> bool`
        - `redefine(self)`
        - `populate(self)`
        - `connect(self) -> bool`
        - `getArticle(self, tag: str = "") -> json`
        - `getUsers(self) -> json`
        - `ParseRSSFeeds(self) -> json`

2.  [Code Documentation for init_db.py](#init_db.py)

    - `initialize_db(cur)`

3.  [Code Documentation for populate_db.py](#populate_db.py)

    - `populate_db(conn, cur)`

4.  [Code Documentation for Scraper.py](#Scraper.py)

    - `scraper()`

5.  [Code Documentation for querry_db.py](#querry_db.py)

    - `insert_rssfeeds(URL: str, Publisher: str, Topic: str) -> str`
    - `insert_newsarticles(URL: str, Title: str, Summary: str, Published: str, Image_URL: str, RSS_URL: str, Topic: str) -> str`
    - `insert_users(Username: str, Email: str, Password: str, Is_Admin: bool) -> str`
    - `get_rssfeeds() -> str`
    - `get_newsarticles() -> str`
    - `get_users() -> str`

# ui_db.py

This code is written in Python and uses the psycopg2 library to interact with the `newsaggregator` schema of a PostgreSQL database. The purpose of this code is to provide an interface to the database, allowing users to connect to the database, define it, populate it, and retrieve data from it.

## Class `DBConnection`

 `__init__(self)`

- This is the constructor of the `DBConnection` class that initializes the `connection` and `cursor` attributes to `None`.

 `__del__(self)`

- This method is called when an object of the `DBConnection` class is deleted and it closes the connection to the database.

 `is_connected(self) -> bool`

- This method checks if the connection to the database exists and returns a boolean value accordingly.

 `redefine(self)`

- This method recreates the database by dropping and re-creating the schema and tables.

 `populate(self)`

- This method populates the database with hardcoded data by inserting rows into the `rssfeeds` and `newsarticles` tables.

 `connect(self) -> bool`

- This method tries to establish a connection with the database and returns a boolean value indicating whether the connection was successful.

 `getArticle(self, tag: str = "") -> json`

- This method retrieves all rows from the `newsarticles` table and returns them as a JSON object.

`getUsers(self) -> json`

- This method retrieves all rows from the `users` table and returns them as a JSON object.

 `ParseRSSFeeds(self) -> json`

- This method retrieves all rows from the `rssfeeds` table and returns them as a JSON object.

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

### Reading data from CSV file

The function uses the pandas library to read data from a CSV file called `RSSFeeds.csv`. The CSV file must have three columns: `URL`, `Publisher`, and `Topic`. The function reads the data from each column into separate lists.

### SQL statements

The function uses an SQL statement called `rss_insert_query` to insert data into the `rssfeeds` table. The SQL statement has three parameters, which are filled in with data from the lists created in the previous step.

### Executing SQL statements

The SQL statement is executed using the `execute()` method of the cursor object. The function iterates through each row of the CSV file and inserts the data into the `rssfeeds` table one row at a time. After each row is inserted, the changes are committed to the database.

# Scraper.py

This code is written in Python and uses the feedparser library to scrape RSS feeds and the psycopg2 library to connect to a PostgreSQL database. The purpose of this code is to scrape news articles from RSS feeds and insert them into the `newsarticles` table in the `newsaggregator` schema of the database.

`scraper()`

- This function scrapes news articles from RSS feeds and inserts them into the `newsarticles` table in the database. It does this by iterating through each RSS feed in the `rssfeeds` table of the database and using the feedparser library to scrape news articles from each feed. The function then inserts the scraped data into the `newsarticles` table.

### Initializing DB object

The function creates a DBConnection object called `DB` to connect to the database. The `DBConnection()` function is defined in another file called `ui_db.py`. 

### Parsing RSS feed info

The function calls the `ParseRSSFeeds()` method of the `DB` object to retrieve the RSS feed information from the `rssfeeds` table. The method returns a JSON object, which is converted to a Python dictionary using the `json.loads()` method. 

### Scraping news articles

The function iterates through each RSS feed in the dictionary and uses the `feedparser.parse()` method to scrape news articles from the feed. The function extracts information about each article, including its URL, title, summary, published date, and image URL. It then uses an SQL statement called `rss_insert_query` to insert the data into the `newsarticles` table.

### Executing SQL statements

The SQL statement is executed using the `execute()` method of the cursor object. If an exception is raised during the execution, it means that the article is most likely a duplicate and is not inserted. After each row is inserted, the changes are committed to the database.

### Example usage

To use this function, you must first ensure that the database has been initialized and the `rssfeeds` table has been populated with data using the `initialize_db()` and `populate_db()` functions respectively. Then, call the `scraper()` function to start scraping news articles from the RSS feeds and inserting them into the `newsarticles` table.

```python
scraper()
```

# querry_db.py

This code is written in Python and uses the psycopg2 library to generate SQL statements that interact with the `newsaggregator` schema of a PostgreSQL database. The purpose of this code is to define functions that return SQL statements for inserting or retrieving data from the `rssfeeds`, `newsarticles`, and `users` tables in the schema.

`insert_rssfeeds(URL: str, Publisher: str, Topic: str) -> str`

- This function takes in three parameters representing the URL, publisher, and topic of an RSS feed and returns an SQL statement for i nserting this information into the `rssfeeds` table.

`insert_newsarticles(URL: str, Title: str, Summary: str, Published: str, Image_URL: str, RSS_URL: str, Topic: str) -> str`

- This function takes in seven parameters representing the URL, title, summary, published date, image URL, RSS URL, and topic of a news article and returns an SQL statement for inserting this information into the `newsarticles` table.

`insert_users(Username: str, Email: str, Password: str, Is_Admin: bool) -> str`

- This function takes in four parameters representing the username, email, password, and administrative status of a user and returns an SQL statement for inserting this information into the `users` table.

`get_rssfeeds() -> str`

- This function returns an SQL statement for retrieving all rows from the `rssfeeds` table.

`get_newsarticles() -> str`

- This function returns an SQL statement for retrieving all rows from the `newsarticles` table.

`get_users() -> str`

- This function returns an SQL statement for retrieving all rows from the `users` table.

### Executing SQL statements

The SQL statements are not executed in this code. Instead, they are returned as strings and can be executed using the `execute()` method of a cursor object.



