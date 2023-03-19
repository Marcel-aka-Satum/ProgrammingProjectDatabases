from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    username = db.Column(db.String(32), unique=True)

class RssFeed(db.Model):
    __tablename__ = "rss_feeds"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    url = db.Column(db.String(345), unique=True)
    publisher = db.Column(db.String(32), unique=True)
    topic = db.Column(db.String(32), unique=True)

class Article(db.Model):
    __tablename__ = "articles"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    title = db.Column(db.String(345), unique=True)
    url = db.Column(db.String(345), unique=True)
    publisher = db.Column(db.String(32), unique=True)
    topic = db.Column(db.String(32), unique=True)