import psycopg2


def insert_rssfeeds(URL: str, Publisher: str, Topic: str) -> str:
    return f"""
            INSERT INTO newsaggregator.rssfeeds (URL, Publisher, Topic)
            VALUES ({URL}, {Publisher}, {Topic});
            """


def insert_newsarticles(URL: str, Title: str, Summary: str, Published: str, Image_URL: str, RSS_URL: str) -> str:
    return f"""
            INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image_URL)
            VALUES ({URL}, {Title}, {Summary}, {Published}, {Image_URL});
            """


def insert_users(Username: str, Password: str, Is_Admin: bool) -> str:
    return f"""
            INSERT INTO newsaggregator.users (Username, Password, Is_Admin)
            VALUES ({Username}, {Password}, {Is_Admin});
            """


def get_rssfeeds() -> str:
    return "SELECT * FROM newsaggregator.rssfeeds"


def get_newsarticles() -> str:
    return "SELECT * FROM newsaggregator.newsarticles"


def get_users() -> str:
    return "SELECT * FROM newsaggregator.users"
