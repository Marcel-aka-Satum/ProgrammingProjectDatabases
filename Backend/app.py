from flask import Flask, render_template, request, redirect, url_for, jsonify
import os, sys, json
# from flask_bcrypt import Bcrypt
import bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin
from Database import ui_db, Scraper

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
app.config['CORS_HEADERS'] = 'Content-Type'
# bcrypt = Bcrypt(app)
db = ui_db.DBConnection()
db.connect()
# db.redefine()
# db.populate()
Scraper.scraper()
import pandas as pd
articles = pd.read_csv("Database/NewsArticles.csv")

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'sample key')
jwt = JWTManager(app)

@app.route('/')
def index():
    return render_template('index.html')

################# AUTHENTICATION ROUTES #################

@app.route("/api/register", methods=["POST"])
@cross_origin()
def register_user():
    email = request.json["Email"]
    password = request.json["Password"]
    is_admin = request.json["Is_Admin"]
    username = request.json["Username"]
    user_exists = db.getUser(email)

    if user_exists[0]:
        return jsonify({"error": "Unauthorized > user exists already."}), 401

    # salt = bcrypt.gensalt()
    # hashed_password = bcrypt.hashpw(password, salt)
    new_user = db.addUser(username, email, password, is_admin)

    access_token = create_access_token(identity=email)
    return jsonify({
        "UID": new_user[1]['UID'],
        "Email": new_user[1]['Email'],
        "token": access_token
    })


@app.route("/api/login", methods=["POST"])
@cross_origin()
def login_user():
    email = request.json["Email"]
    password = request.json["Password"]
    user_exists = db.getUser(email)

    if user_exists[0] in [None, False]:
        return jsonify({"error": "Unauthorized > user does not exist."}), 401

    print('comparing passwords: ', password, user_exists[1]['Password'])

    if password != user_exists[1]['Password']:
        return jsonify({"error": "Unauthorized > password is incorrect"}), 401
    else:
        return jsonify({"message": f"Authorized > Welcome Back"}), 200
    access_token = create_access_token(identity=email)

    return jsonify({
        "UID": user_exists[1]['UID'],
        "Email": user_exists[1]['Email'],
        "token": access_token
    })


################# USER ROUTES #################
@app.route('/api/users', methods=['GET'])
@cross_origin()
def getUsers():
    users = db.getUsers()
    return json.loads(users)

@app.route('/api/add_user', methods=['POST'])
@cross_origin()
def addUser():
    data = request.get_json()
    db.addUser(data['Username'], data['Email'], data['Password'], data['Is_Admin'])
    return json.loads('{"message": "user added successfully"}')

@app.route('/api/update_user/<id>', methods=['POST'])
@cross_origin()
def updateUser(id):
    data = request.get_json()
    db.updateUser(id, data['Username'], data['Email'], data['Password'], data['Is_Admin'])
    return json.loads('{"message": "user updated successfully"}')

@app.route('/api/delete_user/<username>', methods=['POST'])
@cross_origin()
def deleteUser(username):
    db.deleteUser(username)
    return json.loads('{"message": "user deleted successfully"}')


################# RSS FEED ROUTES #################
@app.route('/api/rssfeeds', methods=['GET'])
@cross_origin()
def getRSSFeeds():
    rssfeeds = db.ParseRSSFeeds()
    print('rssfeeds:', rssfeeds)
    return json.loads(rssfeeds)

@app.route('/api/add_rssfeed', methods=['POST'])
@cross_origin()
def addRSSFeed():
    data = request.get_json()
    print('data:', data)
    # db.addRSSFeed(data['URL'], data['Publisher'], data['Topic'])
    return json.loads('{"message": "rssfeed added successfully"}')

@app.route('/api/update_rssfeed/<url>', methods=['POST'])
@cross_origin()
def updateRSSFeed(url):
    data = request.get_json()
    print('data:', data)
    # db.updateRSSFeed(url, data['Publisher'], data['Topic'])
    return json.loads('{"message": "rssfeed updated successfully"}')

@app.route('/api/delete_rssfeed/<url>', methods=['POST'])
@cross_origin()
def deleteRSSFeed(url):
    print('url:', url)
    # db.deleteRSSFeed(url)
    return json.loads('{"message": "rssfeed deleted successfully"}')


################# NEWS ARTICLE ROUTES #################
# @app.route('/api/articles', methods=['GET'])
# @app.route('/articles/<tag>')
# @cross_origin()
# def getArticles(tag=""):
#     articles = db.getArticles(tag)
#     print('articles:', articles)
#     return json.loads(articles)
#

@app.route('/api/articles', strict_slashes=False, methods=['GET'])
def articles():

    article_1 = {
        'title': '10 Tips for Better Time Management',
        'content': 'In today’s fast-paced world, effective time management is essential. Here are some practical tips to help you make the most of your time.',
        'author': 'John Smith',
        'date_posted': 'September 12, 2022',
        'image': 'https://picsum.photos/400/400/?random',
        'category': 'Productivity',
        'tags': ['time management', 'productivity'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': "https://extension.uga.edu/publications/detail.html?number=C1042&title=time-management-10-strategies-for-better-time-management",
        'article_id': 1,
    }
    article_2 = {
        'title': 'The Benefits of Meditation: How it Can Improve Your Life',
        'content': 'Meditation has been shown to have numerous benefits for both physical and mental health. Find out how it can help you reduce stress, improve focus, and more.',
        'author': 'Jane Doe',
        'date_posted': 'August 30, 2022',
        'image': 'https://picsum.photos/400/400/?random',
        'category': 'Wellness',
        'tags': ['meditation', 'wellness', 'mindfulness'],
        'comments': ['comment_id_3', 'comment_id_4'],
        'references': "https://www.healthline.com/nutrition/12-benefits-of-meditation",
        'article_id': 2,
    }
    article_3 = {
        'title': 'The Importance of Sleep for Optimal Health',
        'content': 'Sleep is crucial for maintaining overall health and wellbeing. It allows our bodies to repair and regenerate, and is important for cognitive function, emotional regulation, and immune system function. Inadequate sleep has been linked to a number of health problems, including obesity, diabetes, heart disease, and depression. To optimize your sleep, experts recommend establishing a regular sleep routine, creating a comfortable sleep environment, and avoiding stimulants like caffeine and electronic devices before bedtime.',
        'author': 'Jane Smith',
        'date_posted': 'March 1, 2023',
        'image': 'https://picsum.photos/400/400/?random',
        'category': 'Health',
        'tags': ['sleep', 'health', 'wellness'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': 'https://www.sleepfoundation.org/articles/why-do-we-need-sleep',
        'article_id': 3,
    }
    article_4 = {
        'title': 'The Benefits of Meditation for Stress Relief',
        'content': 'Meditation has been shown to be an effective tool for reducing stress and improving overall wellbeing. It can help to calm the mind and body, reduce feelings of anxiety and depression, and improve sleep quality. Regular meditation practice has also been linked to increased focus and concentration, better emotional regulation, and improved immune system function. To get started with meditation, experts recommend finding a quiet, comfortable place to sit, focusing on your breath, and gradually increasing the length of your practice over time.',
        'author': 'John Doe',
        'date_posted': 'February 15, 2023',
        'image': 'https://picsum.photos/400/400/?random',
        'category': 'Mindfulness',
        'tags': ['meditation', 'stress relief', 'mindfulness'],
        'comments': ['comment_id_3', 'comment_id_4', 'comment_id_5'],
        'references': 'https://www.mayoclinic.org/tests-procedures/meditation/in-depth/meditation/art-20045858',
        'article_id': 4,
    }
    article_5 = {
        'title': 'The Importance of Sleep for Optimal Health',
        'content': 'Sleep is crucial for maintaining overall health and wellbeing. It allows our bodies to repair and regenerate, and is important for cognitive function, emotional regulation, and immune system function. Inadequate sleep has been linked to a number of health problems, including obesity, diabetes, heart disease, and depression. To optimize your sleep, experts recommend establishing a regular sleep routine, creating a comfortable sleep environment, and avoiding stimulants like caffeine and electronic devices before bedtime.',
        'author': 'Jane Smith',
        'date_posted': 'March 1, 2023',
        'image': 'https://picsum.photos/400/400/?random',
        'category': 'Health',
        'tags': ['sleep', 'health', 'wellness'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': 'https://www.sleepfoundation.org/articles/why-do-we-need-sleep',
        'article_id': 5,
    }
    article_6 = {
        'title': 'The Importance of Sleep for Optimal Health',
        'content': 'Sleep is crucial for maintaining overall health and wellbeing. It allows our bodies to repair and regenerate, and is important for cognitive function, emotional regulation, and immune system function. Inadequate sleep has been linked to a number of health problems, including obesity, diabetes, heart disease, and depression. To optimize your sleep, experts recommend establishing a regular sleep routine, creating a comfortable sleep environment, and avoiding stimulants like caffeine and electronic devices before bedtime.',
        'author': 'Jane Smith',
        'date_posted': 'March 1, 2023',
        'image': 'https://picsum.photos/400/400/?random',
        'category': 'Health',
        'tags': ['sleep', 'health', 'wellness'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': 'https://www.sleepfoundation.org/articles/why-do-we-need-sleep',
        'article_id': 6,
    }
    article_7 = {
        'title': 'The Importance of Sleep for Optimal Health',
        'content': 'Sleep is crucial for maintaining overall health and wellbeing. It allows our bodies to repair and regenerate, and is important for cognitive function, emotional regulation, and immune system function. Inadequate sleep has been linked to a number of health problems, including obesity, diabetes, heart disease, and depression. To optimize your sleep, experts recommend establishing a regular sleep routine, creating a comfortable sleep environment, and avoiding stimulants like caffeine and electronic devices before bedtime.',
        'author': 'Jane Smith',
        'date_posted': 'March 1, 2023',
        'image': 'https://picsum.photos/400/400/?random',
        'category': 'Joy',
        'tags': ['sleep', 'health', 'wellness'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': 'https://www.sleepfoundation.org/articles/why-do-we-need-sleep',
        'article_id': 7,
    }
    article_8 = {
        'title': 'The Importance of Sleep for Optimal Health',
        'content': 'Sleep is crucial for maintaining overall health and wellbeing. It allows our bodies to repair and regenerate, and is important for cognitive function, emotional regulation, and immune system function. Inadequate sleep has been linked to a number of health problems, including obesity, diabetes, heart disease, and depression. To optimize your sleep, experts recommend establishing a regular sleep routine, creating a comfortable sleep environment, and avoiding stimulants like caffeine and electronic devices before bedtime.',
        'author': 'Jane Smith',
        'date_posted': 'March 1, 2023',
        'image': 'https://picsum.photos/400/400/?random',
        'category': 'Joy',
        'tags': ['sleep', 'health', 'wellness'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': 'https://www.sleepfoundation.org/articles/why-do-we-need-sleep',
        'article_id': 8,
    }

    all_articles = [article_1, article_2, article_3, article_4, article_5, article_6, article_7]
    return all_articles

@app.route('/api/add_article', methods=['POST'])
@cross_origin()
def addArticle():
    data = request.get_json()
    print('data:', data)
    # db.addArticle(data['title'], data['content'], data['author'], data['date_posted'], data['image'], data['category'], data['tags'], data['comments'], data['references'])
    return json.loads('{"message": "article added successfully"}')

@app.route('/api/update_article/<article_url>', methods=['POST'])
@cross_origin()
def updateArticle(article_url):
    data = request.get_json()
    print('data:', data)
    # db.updateArticle(article_url, data['title'], data['content'], data['author'], data['date_posted'], data['image'], data['category'], data['tags'], data['comments'], data['references'])
    return json.loads('{"message": "article updated successfully"}')

@app.route('/api/delete_article/<article_url>', methods=['POST'])
@cross_origin()
def deleteArticle(article_url):
    print('article_url:', article_url)
    # db.deleteArticle(article_url)
    return json.loads('{"message": "article deleted successfully"}')


@app.errorhandler(404)
@app.errorhandler(500)
def error_handler(error):
    return render_template('errors/404.html'), 404


if __name__ == '__main__':
    app.run(port=4444)
