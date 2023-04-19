import psycopg2
from typing import Tuple


def get_maxUID() -> str:
    """
        SELECT MAX(UID) FROM newsaggregator.visitors
    """
    return f"""
            SELECT MAX(UID) FROM newsaggregator.visitors;
            """


#################### GETTERS ####################

def get_visitor(UID: str) -> str:
    """
        SELECT * FROM newsaggregator.visitors
        WHERE UID = '{UID}';
    """
    return f"""
            SELECT * FROM newsaggregator.visitors
            WHERE UID = {UID};
            """


def get_user(email: str) -> str:
    """
        SELECT * FROM newsaggregator.users
        WHERE Email = '{email}';
    """
    return f"""
            SELECT * FROM newsaggregator.users
            WHERE Email = '{email}';
            """


def get_rssfeed(URL: str) -> str:
    """
        SELECT * FROM newsaggregator.rssfeeds
        WHERE URL = '{URL}';
    """
    return f"""
            SELECT * FROM newsaggregator.rssfeeds
            WHERE URL = '{URL}';
            """


def get_newsarticles(URL: str) -> str:
    """
        SELECT * FROM newsaggregator.newsarticles
        WHERE URL = '{URL}';
    """
    return f"""
            SELECT * FROM newsaggregator.newsarticles
            WHERE URL = '{URL}';
            """

def get_favorites(URL: str) -> str:
    """SELECT * 
        FROM newsaggregator.newsarticles 
        WHERE URL IN (
            SELECT Article 
            FROM newsaggregator.favored 
            WHERE _User = (
                SELECT UID 
                FROM newsaggregator.cookies 
                WHERE cookie = 'YOUR_COOKIE_VALUE'
            )
        );
    """

    return f"""SELECT * 
        FROM newsaggregator.newsarticles 
        WHERE URL IN (
            SELECT Article 
            FROM newsaggregator.favored 
            WHERE _User = (
                SELECT UID 
                FROM newsaggregator.cookies 
                WHERE cookie = ' {URL}'
            )
        );
    """


#################### TABLE GETTERS ####################

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


def get_favored() -> str:
    """
        SELECT * FROM newsaggregator.favored
    """
    return "SELECT * FROM newsaggregator.favored"


#################### SETTERS ####################

def insert_rssfeed(values: list) -> str:
    """
        INSERT INTO newsaggregator.rssfeeds (URL, Publisher, Topic)
    """
    return f"""
            INSERT INTO newsaggregator.rssfeeds (URL, Publisher, Topic)
            VALUES ('{values[0]}', '{values[1]}', '{values[2]}')
            """


def insert_newsarticle(values: list) -> str:
    """
        INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image_URL, RSS_URL, Topic)
    """
    query = f"""
            INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image_URL, RSS_URL, Topic)
            VALUES (%s,%s,%s,%s,%s,%s,%s);
            """
    return query, (values[0],values[1],values[2],values[3],values[4],values[5],values[6])


def insert_visitor(values: list) -> str:
    """
        INSERT INTO newsaggregator.visitors (UID)
    """
    return f"""
            INSERT INTO newsaggregator.visitors (UID)
            VALUES({values[0]})
            """


def insert_user(values: list) -> str:
    """
        INSERT INTO newsaggregator.users (UID, Username, Email, Password, Is_Admin)
    """
    return f"""
            INSERT INTO newsaggregator.users (UID, Username, Email, Password, Is_Admin)
            VALUES ('{values[0]}', '{values[1]}', '{values[2]}', '{values[3]}', '{values[4]}');
            """


def insert_cookie(values: list) -> str:
    """
        INSERT INTO newsaggregator.cookies (cookie, UID)
    """
    return f"""
            INSERT INTO newsaggregator.cookies (cookie, UID)
            VALUES ('{values[0]}', '{values[1]}');
            """


def insert_hasclicked(values: list) -> str:
    """
        INSERT INTO newsaggregator.hasclicked (_User, Article)
    """
    return f"""
            INSERT INTO newsaggregator.hasclicked (_User, Article)
            VALUES ('{values[0]}', '{values[1]}');
            """


def insert_favored(values: list) -> str:
    """
        INSERT INTO newsaggregator.favored (_User, Article)
    """
    return f"""
            INSERT INTO newsaggregator.favored (_User, Article)
            VALUES ('{values[0]}', '{values[1]}');
            """

def insert_favorite(values: list) -> str:
    """
        INSERT INTO newsaggregator.favorite (_User, Article)
    """
    return f"""
            INSERT INTO newsaggregator.favored (_User, Article)
            VALUES (
                (SELECT UID FROM newsaggregator.cookies WHERE cookie = '{values[0]}'),
                '{values[1]}'
            );
            """

def insert_cluster(URL: str, cluster: int) -> str:
    """
        INSERT INTO newsaggregator.relatedcluster (URL, Cluster)
    """
    return f"""
            INSERT INTO newsaggregator.relatedcluster (URL, Cluster)
            VALUES ('{URL}', '{cluster}');
            """

#################### DELETERS ####################
def delete_rssfeed(URL: str) -> str:
    """
    DELETE FROM newsaggregator.rssfeeds
    WHERE URL = '{URL}'
    """
    return f"""
            DELETE FROM newsaggregator.rssfeeds
            WHERE URL = '{URL}';
            """


def delete_newsarticle(URL: str) -> str:
    """
    DELETE FROM newsaggregator.newsarticles
    WHERE URL = '{URL}'
    """
    return f"""
            DELETE FROM newsaggregator.newsarticles
            WHERE URL = '{URL}';
            """


def delete_visitor(UID: str) -> str:
    """
    DELETE FROM newsaggregator.visitor
    WHERE UID = '{UID}'
    """
    return f"""
            DELETE FROM newsaggregator.visitors
            WHERE UID = '{UID}';
            """


def delete_user(UID: str) -> str:
    """
    DELETE FROM newsaggregator.users
    WHERE UID = '{UID}
    """
    return f"""
            DELETE FROM newsaggregator.users
            WHERE UID = '{UID}';
            """


def delete_cookie(cookie: str) -> str:
    """
    DELETE FROM newsaggregator.cookies
    WHERE cookie = '{cookie}'

    """
    return f"""
            DELETE FROM newsaggregator.cookies
            WHERE cookie = '{cookie}';
            """

def delete_favored(User, URL: str) -> str:
    """
    DELETE FROM newsaggregator.favored
    WHERE _User = {User} AND Article = '{URL}'
    """
    return f"""
            DELETE FROM newsaggregator.favored
            WHERE _User = {User} AND Article = '{URL}';
            """


#################### UPDATERS ####################
def update_rssfeed(URL: str, Publisher: str, Topic: str) -> str:
    """
        UPDATE newsaggregator.rssfeeds
    """
    return f"""
            UPDATE newsaggregator.rssfeeds
            SET Publisher = '{Publisher}', Topic = '{Topic}'
            WHERE URL = '{URL}';
            """


def update_newsarticle(URL: str, Title: str, Summary: str, Published: str, Image_URL: str, RSS_URL: str,
                       Topic: str) -> str:
    """
        UPDATE newsaggregator.newsarticles
    """
    return f"""
            UPDATE newsaggregator.newsarticles
            SET Title = '{Title}', Summary = '{Summary}', Published = '{Published}', Image_URL = '{Image_URL}',
             Topic = '{Topic}', RSS_URL = '{RSS_URL}'
            WHERE URL = '{URL}';
            """


def update_user(ID: int, Username: str, Email: str, Password: str, Is_Admin: bool) -> str:
    """
        UPDATE newsaggregator.users
    """
    return f"""
            UPDATE newsaggregator.users
            SET Username = '{Username}', Email = '{Email}', Password = '{Password}', Is_Admin = '{Is_Admin}'
            WHERE UID = {ID};
            """
