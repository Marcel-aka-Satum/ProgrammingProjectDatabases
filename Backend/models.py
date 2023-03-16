from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(128), unique=True)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

class Article(db.Model):
    __tablename__ = "articles"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    title = db.Column(db.String(128), unique=True)
    summary = db.Column(db.Text, nullable=False)
    published = db.Column(db.String(128), nullable=False)
    image_url = db.Column(db.String(128), nullable=False)


class RssFeed(db.Model):
    __tablename__ = "rss_feeds"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    topic = db.Column(db.String(128), unique=True)
    publisher = db.Column(db.String(128), nullable=False)
    url = db.Column(db.String(128), nullable=False)
