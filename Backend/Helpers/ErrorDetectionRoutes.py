import requests
from requests.exceptions import RequestException
import feedparser
import re

def validate_pwd(password):
    forbidden = ['"', "'", ';', ':', ',', '\\', '/', '[', ']', '{', '}', '|', '<', '>', '?', '`', '~']

    # check for password strength
    if len(password) < 8:
        return "Password must be at least 8 characters", 401
    elif not any(char.isdigit() for char in password):
        return "Password must contain at least one number", 401
    elif not any(char.isupper() for char in password):
        return "Password must contain at least one uppercase letter", 401
    elif not any(char.islower() for char in password):
        return "Password must contain at least one lowercase letter", 401
    elif not any(char in ['!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '='] for char in password):
        return "Password must contain at least one special character", 401

    for char in password:
        if char in forbidden:
            return f"Password must not contain any of the following characters: {forbidden}", 401
    return "User Added Successfully", 200

def validate_rssFeed(url):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except RequestException as e:
        return str(e), 401

    feed = feedparser.parse(response.text)

    if feed.version:  # feed.version will be empty if it's not a valid RSS feed
        return "RSS Feed Added Successfully", 200
    else:
        return "Valid URL, but not a valid RSS Feed", 401

def validate_email(email):
    """
        Check if the given email address is valid.

        Args:
            email (str): The email address to validate.

        Returns:
            bool: True if the email is valid, False otherwise.
        """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    correct = bool(re.match(pattern, email))
    if not correct:
        return "Invalid email address", 401
    return "Email Added Successfully", 200


if __name__ == "__main__":
    print(validate_rssFeed("https://www.tijd.be/rss/politiek_economie.xml"))