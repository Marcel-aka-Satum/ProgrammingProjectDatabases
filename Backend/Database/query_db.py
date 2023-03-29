import psycopg2
from typing import Tuple


#################### INSERTERS ####################

def insert_rssfeeds(URL: str, Publisher: str, Topic: str) -> tuple():
    """
        INSERT INTO newsaggregator.rssfeeds (URL, Publisher, Topic)
    """
    return f"""
            INSERT INTO newsaggregator.rssfeeds (URL, Publisher, Topic)
            VALUES('{URL}', '{Publisher}', '{Topic}')
            """


def insert_newsarticles(URL: str, Title: str, Summary: str, Published: str, Image_URL: str, rss_url: str,
                        Topic: str) -> str:
    """
        INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image_URL, RSS_URL, Topic)
    """
    return f"""
            INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image_URL, RSS_URL, Topic)
            VALUES ('{URL}', '{Title}', '{Summary}', '{Published}', '{Image_URL}', '{rss_url}', '{Topic}');
            """


def insert_visitors(UID: str) -> str:
    """
        INSERT INTO newsaggregator.visitors (UID)
    """
    return f"""
            INSERT INTO newsaggregator.visitors (UID)
            VALUES('{UID}')
            """


def insert_users(UID: str, Username: str, Email: str, Password: str, Is_Admin: bool) -> str:
    """
        INSERT INTO newsaggregator.users (Username, Email, Password, Is_Admin, UID)
    """
    return f"""
            INSERT INTO newsaggregator.users (Username, Email, Password, Is_Admin, UID)
            VALUES ('{Username}', '{Email}', '{Password}', {Is_Admin}, '{UID}');
            """


def insert_cookies(cookie: str, UID: str) -> str:
    """
        INSERT INTO newsaggregator.cookies (cookie, UID)
    """
    return f"""
            INSERT INTO newsaggregator.cookies (cookie, UID)
            VALUES ('{cookie}', '{UID}');
            """


def insert_hasclicked(UID: str, URL: str) -> str:
    """
        INSERT INTO newsaggregator.hasclicked (UID, URL)
    """
    return f"""
            INSERT INTO newsaggregator.hasclicked (UID, URL)
            VALUES ('{UID}', '{URL}');
            """


def insert_newsarticle(URL: str, Title: str, Summary: str, Published: str, Image_URL: str, rss_url: str, Topic: str) -> \
        Tuple[str, Tuple]:
    query = f"""
            INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image_URL, RSS_URL, Topic)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
            """
    return query, (URL, Title, Summary, Published, Image_URL, rss_url, Topic)


def insert_user(Username: str, Email: str, Password: str, Is_Admin: bool) -> str:
    return f"""
            INSERT INTO newsaggregator.users (Username, Email, Password, Is_Admin)
            VALUES ('{Username}', '{Email}', '{Password}', {Is_Admin});
            """


#################### DELETERS ####################
def delete_rssfeed(URL: str) -> str:
    return f"""
            DELETE FROM newsaggregator.rssfeeds
            WHERE URL = '{URL}';
            """


def delete_newsarticle(URL: str) -> str:
    return f"""
            DELETE FROM newsaggregator.newsarticles
            WHERE URL = '{URL}';
            """


def delete_user(Uid: str) -> str:
    return f"""
            DELETE FROM newsaggregator.users
            WHERE UID = '{Uid}';
            """


#################### UPDATERS ####################
def update_rssfeed(URL: str, Publisher: str, Topic: str) -> str:
    return f"""
            UPDATE newsaggregator.rssfeeds
            SET Publisher = '{Publisher}', Topic = '{Topic}'
            WHERE URL = '{URL}';
            """


def update_newsarticle(URL: str, Title: str, Summary: str, Published: str, Image_URL: str, RSS_URL: str,
                       Topic: str) -> str:
    return f"""
            UPDATE newsaggregator.newsarticles
            SET Title = '{Title}', Summary = '{Summary}', Published = '{Published}', Image_URL = '{Image_URL}', RSS_URL = '{RSS_URL}', Topic = '{Topic}'
            WHERE URL = '{URL}';
            """


def update_user(ID: int, Username: str, Email: str, Password: str, Is_Admin: bool) -> str:
    return f"""
            UPDATE newsaggregator.users
            SET Username = '{Username}', Email = '{Email}', Password = '{Password}', Is_Admin = '{Is_Admin}'
            WHERE UID = {ID};
            """


#################### GETTERS ####################

def get_rssfeeds() -> str:
    """
        SELECT * FROM newsaggregator.rssfeeds
    """
    return "SELECT * FROM newsaggregator.rssfeeds"


def get_newsarticles() -> str:
    """
        SELECT * FROM newsaggregator.newsarticles
    """
    return "SELECT * FROM newsaggregator.newsarticles"


def get_visitors() -> str:
    """
        SELECT * FROM newsaggregator.visitors
    """
    return "SELECT * FROM newsaggregator.visitors"


def get_users() -> str:
    """
        SELECT * FROM newsaggregator.users
    """
    return "SELECT * FROM newsaggregator.users"


def get_cookies() -> str:
    """
        SELECT * FROM newsaggregator.cookies
    """
    return "SELECT * FROM newsaggregator.cookies"


def get_hasclicked() -> str:
    """
        SELECT * FROM newsaggregator.hasclicked
    """
    return "SELECT * FROM newsaggregator.hasclicked"


def get_user(email: str) -> str:
    return f"""
            SELECT * FROM newsaggregator.users
            WHERE Email = '{email}';
            """
