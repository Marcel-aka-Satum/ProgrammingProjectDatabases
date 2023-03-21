import psycopg2


#################### INSERTERS ####################
def insert_rssfeed(URL: str, Publisher: str, Topic: str) -> str:
    return f"""
            INSERT INTO newsaggregator.rssfeeds (URL, Publisher, Topic)
            VALUES (%s, %s, %s);
            """

def insert_newsarticle(URL: str, Title: str, Summary: str, Published: str, Image_URL: str, RSS_URL: str, Topic: str) -> str:
    return f"""
            INSERT INTO newsaggregator.newsarticles (URL, Title, Summary, Published, Image_URL, Topic)
            VALUES (%s, %s, %s, %s, %s, %s);
            """

def insert_user(Username: str, Email: str, Password: str, Is_Admin: bool) -> tuple[str, tuple]:
    query = f"""
            INSERT INTO newsaggregator.users (Username, Email, Password, Is_Admin)
            VALUES (%s, %s, %s, %s);
            """
    params = (Username, Email, Password, Is_Admin)
    return query, params


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

def update_newsarticle(URL: str, Title: str, Summary: str, Published: str, Image_URL: str, RSS_URL: str, Topic: str) -> str:
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
    return "SELECT * FROM newsaggregator.rssfeeds"

def get_newsarticles() -> str:
    return "SELECT * FROM newsaggregator.newsarticles"

def get_users() -> str:
    return "SELECT * FROM newsaggregator.users"

def get_user(email: str) -> str:
    return f"""
            SELECT * FROM newsaggregator.users
            WHERE Email = '{email}';
            """