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


def get_topics() -> str:
    """
        SELECT DISTINCT Topic FROM newsaggregator.newsarticles
    """

    return f"""
            SELECT DISTINCT Topic FROM newsaggregator.newsarticles
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


def get_newsarticle(URL: str) -> str:
    """
        SELECT * FROM newsaggregator.newsarticles
        WHERE URL = '{URL}';
    """
    return f"""
            SELECT * FROM newsaggregator.newsarticles
            WHERE URL = '{URL}';
            """


def get_ArticlesDict() -> str:
    """
                SELECT Topic, JSON_AGG(json_build_object(
                'URL', URL,
                'Title', Title,
                'Summary', Summary,
                'Published', Published,
                'Image', Image,
                'Topic', Topic
                )) AS Articles
                FROM newsaggregator.newsarticles
                GROUP BY Topic;
    """
    return f"""
                SELECT Topic, JSON_AGG(json_build_object(
                'URL', URL,
                'Title', Title,
                'Summary', Summary,
                'Published', Published,
                'Image', Image,
                'Topic', Topic
                )) AS Articles
                FROM newsaggregator.newsarticles
                GROUP BY Topic;
            """


def get_newsarticlesTopic(Topic: str) -> str:
    """
        SELECT * FROM newsaggregator.newsarticles
        WHERE Topic = '{Topic}';
    """
    return f"""
            SELECT * FROM newsaggregator.newsarticles
            WHERE Topic = '{Topic}';
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


def get_cluster(Cluster_ID: int) -> str:
    """
        SELECT * FROM newsaggregator.relatedcluster
        WHERE Cluster_ID = '{Cluster_ID}';
    """
    return f"""
            SELECT * FROM newsaggregator.relatedcluster
            WHERE Cluster_ID = {Cluster_ID};
            """


def get_all_clusters():
    """
        SELECT Topic, json_agg(json_build_object(
            'Cluster', Cluster
        )) AS Topic_Clusters
        FROM (
            SELECT Cluster_ID, Topic, json_agg(json_build_object(
                'URL', URL,
                'Title', Title,
                'Summary', Summary,
                'Published', Published,
                'Image', Image
            )) AS Cluster
            FROM (
                SELECT r.Cluster_ID, n.URL, n.Title, n.Summary, n.Published, n.Image, n.Topic,
                CASE WHEN r.Cluster_ID = -1 THEN
                    ROW_NUMBER() OVER (PARTITION BY r.Cluster_ID ORDER BY n.Published DESC)
                END AS rn
                FROM newsaggregator.relatedcluster r
                JOIN newsaggregator.newsarticles n ON r.URL = n.URL
                ORDER BY n.Topic ASC, r.Cluster_ID ASC, n.Published DESC
            ) AS subquery
            GROUP BY subquery.Cluster_ID, subquery.Topic, subquery.rn
        ) AS topic_clusters
        GROUP BY Topic
        ORDER BY Topic ASC;
    """

    return f"""
        SELECT Topic, json_agg(json_build_object(
            'Cluster', Cluster
        )) AS Topic_Clusters
        FROM (
            SELECT Cluster_ID, Topic, json_agg(json_build_object(
                'URL', URL,
                'Title', Title,
                'Summary', Summary,
                'Published', Published,
                'Image', Image,
                'Clicked', Clicked,
                'Lang', Lang
            )) AS Cluster
            FROM (
                SELECT r.Cluster_ID, n.URL, n.Title, n.Summary, n.Published, n.Image, n.Topic, n.Clicked, n.Lang,
                CASE WHEN r.Cluster_ID = -1 THEN
                    ROW_NUMBER() OVER (PARTITION BY r.Cluster_ID ORDER BY n.Published DESC)
                END AS rn
                FROM newsaggregator.relatedcluster r
                JOIN newsaggregator.newsarticles n ON r.URL = n.URL
                ORDER BY n.Topic ASC, r.Cluster_ID ASC, n.Published DESC
            ) AS subquery
            GROUP BY subquery.Cluster_ID, subquery.Topic, subquery.rn
        ) AS topic_clusters
        GROUP BY Topic
        ORDER BY Topic ASC;

    """


def get_all_clusters_genre(Topic: str):
    """

            SELECT json_agg(json_build_object(
                'URL', URL,
                'Title', Title,
                'Summary', Summary,
                'Published', Published,
                'Image', Image
            )) AS Cluster
            FROM (
                SELECT r.Cluster_ID, n.URL, n.Title, n.Summary, n.Published, n.Image, n.Topic,
                CASE WHEN r.Cluster_ID = -1 THEN
                    ROW_NUMBER() OVER (PARTITION BY r.Cluster_ID ORDER BY n.Published DESC)
                END AS rn
                FROM newsaggregator.relatedcluster r
                JOIN newsaggregator.newsarticles n ON r.URL = n.URL
                WHERE n.Topic = '{Topic}'
            ) AS subquery
            GROUP BY subquery.Cluster_ID, subquery.Topic, subquery.rn

            """

    return f"""
            SELECT json_agg(json_build_object(
                'URL', URL,
                'Title', Title,
                'Summary', Summary,
                'Published', Published,
                'Image', Image,
                'Clicked', Clicked,
                'Lang', Lang
            )) AS Cluster
            FROM (
                SELECT r.Cluster_ID, n.URL, n.Title, n.Summary, n.Published, n.Image, n.Topic, n.Clicked, n.Lang,
                CASE WHEN r.Cluster_ID = -1 THEN
                    ROW_NUMBER() OVER (PARTITION BY r.Cluster_ID ORDER BY n.Published DESC)
                END AS rn
                FROM newsaggregator.relatedcluster r
                JOIN newsaggregator.newsarticles n ON r.URL = n.URL
                WHERE n.Topic = '{Topic}'
            ) AS subquery
            GROUP BY subquery.Cluster_ID, subquery.Topic, subquery.rn

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


def get_hasclicked(cookie: str) -> str:
    """
        SELECT * FROM newsaggregator.hasclicked
        WHERE _User IN (SELECT UID FROM newsaggregator.cookies WHERE cookie = '{cookie}')
    """
    return f"""
            SELECT hc._User, hc.Article
            FROM newsaggregator.hasclicked hc
            JOIN newsaggregator.cookies c ON hc._User = c.UID
            WHERE c.cookie = '{cookie}';
            """


def get_all_hasclicked() -> str:
    """
        SELECT * FROM newsaggregator.hasclicked
    """
    return "SELECT * FROM newsaggregator.hasclicked"


def get_favored() -> str:
    """
        SELECT * FROM newsaggregator.favored
    """
    return "SELECT * FROM newsaggregator.favored"


def get_settings() -> str:
    """
        SELECT * FROM newsaggregator.settings
    """
    return "SELECT * FROM newsaggregator.settings"


#################### SETTERS ####################

def insert_rssfeed(values: list) -> str:
    """
        INSERT INTO newsaggregator.rssfeeds (URL, Publisher, Genre)
    """
    return f"""
            INSERT INTO newsaggregator.rssfeeds (URL, Publisher, Genre)
            VALUES ('{values[0]}', '{values[1]}', '{values[2]}')
            """


def insert_newsarticle(values: list) -> str:
    """
        INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image, RSS_URL, Topic, Lang)
    """
    query = f"""
            INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image, RSS_URL, Topic, Lang)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s);
            """
    return query, (values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7])


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


def insert_hasclickedcookie(values: list) -> str:
    """
        INSERT INTO newsaggregator.hasclicked (_User, Article)
    """
    return f"""
            INSERT INTO newsaggregator.hasclicked (_User, Article)
            SELECT v.UID, n.URL
            FROM newsaggregator.cookies c
            JOIN newsaggregator.visitors v ON c.UID = v.UID
            JOIN newsaggregator.newsarticles n ON n.URL = '{values[0]}'
            WHERE c.cookie = '{values[1]}';
            """


def addCountArticle(values: list) -> str:
    """
        INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image, RSS_URL, Topic, Count)
    """
    print('clicked lol: ', values[0])
    return f"""
            UPDATE newsaggregator.newsarticles
            SET Clicked = Clicked + 1
            WHERE URL = '{values[0]}';
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
        INSERT INTO newsaggregator.relatedcluster (URL, Cluster_ID)
    """
    return f"""
            INSERT INTO newsaggregator.relatedcluster (URL, Cluster_ID)
            VALUES ('{URL}', '{cluster}');
            """


def insert_setting(values: list) -> str:
    """
        INSERT INTO newsaggregator.settings (settingType, value)
    """
    return f"""
            INSERT INTO newsaggregator.settings (settingType, value)
            VALUES ('{values[0]}', '{values[1]}')
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


def delete_favored(UID, URL: str) -> str:
    """
    DELETE FROM newsaggregator.favored
    WHERE _User = {User} AND Article = '{URL}'
    """
    return f"""
            DELETE FROM newsaggregator.favored
            WHERE _User = {UID} AND Article = '{URL}';
            """


def delete_all_favored(UID: str) -> str:
    """
    DELETE FROM newsaggregator.favored
    WHERE _User = {User}
    """
    return f"""
            DELETE FROM newsaggregator.favored
            WHERE _User = {UID};
            """


#################### UPDATERS ####################
def update_rssfeed(URL: str, Publisher: str, Topic: str) -> str:
    """
        UPDATE newsaggregator.rssfeeds
    """
    return f"""
            UPDATE newsaggregator.rssfeeds
            SET Publisher = '{Publisher}', Genre = '{Topic}'
            WHERE URL = '{URL}';
            """


def update_newsarticle(URL: str, Title: str, Summary: str, Published: str, Image: str, RSS_URL: str,
                       Topic: str) -> str:
    """
        UPDATE newsaggregator.newsarticles
    """
    return f"""
            UPDATE newsaggregator.newsarticles
            SET Title = '{Title}', Summary = '{Summary}', Published = '{Published}', Image = '{Image}',
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


def update_setting(Setting: str, Value: str) -> str:
    """
        UPDATE newsaggregator.settings
    """
    return f"""
            UPDATE newsaggregator.settings
            SET settingType = '{Setting}', value = '{Value}'
            WHERE settingType = '{Setting}';
            """
