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