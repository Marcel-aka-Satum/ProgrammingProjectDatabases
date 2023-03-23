import flask
from flask import Flask, render_template, request, redirect, url_for, jsonify
import os, sys, json
import bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin
from Database.ui_db import DBConnection
from Helpers.ErrorDetectionRoutes import *
import requests

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
app.config['CORS_HEADERS'] = 'Content-Type'
db = DBConnection()
db.connect()
db.redefine()
db.populate()

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
    username, email, password, is_admin = data['Username'], data['Email'], data['Password'], data['Is_Admin']
    forbidden = [' ', '`', '~', '[', ']', '{', '}', '(', ')', '|', ';', ':', '"', "'", ',', '<', '>', '.', '?', '/']

    users = json.loads(db.getUsers())
    message, status = validate_user(username, email, password, users)

    if status == 401:
        return jsonify({"message": message, "status": status})
    elif status == 200:
        db.addUser(username, email, password, is_admin)
        return jsonify({"message": "User added successfully", "status": 200})
    else:
        return jsonify({"message": "Something went wrong", "status": 500})

@app.route('/api/update_user/<id>', methods=['POST'])
@cross_origin()
def updateUser(id):
    data = request.get_json()
    username, email, password, is_admin = data['Username'], data['Email'], data['Password'], data['Is_Admin']
    db.updateUser(id, username, email, password, is_admin)
    return jsonify({"message": f"USER ({id}) Updated Successfully", "status": 200})

@app.route('/api/delete_user/<id>', methods=['POST'])
@cross_origin()
def deleteUser(id):
    user = db.getUser(id)
    if user[0]:
        return jsonify({"message": f"USER ({id}) Not Found", "status": 404})
    else:
        db.deleteUser(id)
        return jsonify({"message": f"USER ({id}) Deleted Successfully", "status": 200})


################# RSS FEED ROUTES #################
@app.route('/api/rssfeeds', methods=['GET'])
@cross_origin()
def getRSSFeeds():
    rssfeeds = db.ParseRSSFeeds()
    return json.loads(rssfeeds)


@app.route('/api/add_rssfeed/', methods=['POST'])
@cross_origin()
def addRSSFeed():
    data = request.get_json()
    url, publisher, topic = data['URL'], data['Publisher'], data['Topic']
    print('url:', url, 'publisher:', publisher, 'topic:', topic)

    db.addRSSFeed(url, publisher, topic)
    return jsonify({"message": f"FEED ({url}). Added Successfully", "status": 200})


@app.route('/api/update_rssfeed/', methods=['POST'])
@cross_origin()
def updateRSSFeed():
    data = request.get_json()
    url, publisher, topic = data['URL'], data['Publisher'], data['Topic']
    db.updateRSSFeed(url, publisher, topic)
    return jsonify({"message": f"FEED ({url}). Updated Successfully", "status": 200})


@app.route('/api/delete_rssfeed/', methods=['POST'])
@cross_origin()
def deleteRSSFeed():
    data = request.get_json()
    db.deleteRSSFeed(data['URL'])
    return jsonify({"message": "rssfeed deleted successfully"})


@app.route('/api/check_rssfeed', methods=['POST'])
@cross_origin()
def checkRSSFeed(url=None):
    data = request.get_json()

    feed_url = data['URL']

    try:
        response = requests.get(feed_url, timeout=5)
        if response.status_code == 200:
            return jsonify({"message": f"RSS Feed is responsive", "status": 200})
        else:
            return jsonify({"message": f"RSS Feed is not responsive", "status": 401})
    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"RSS Feed is not responsive", "status": 401})


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
        'title': 'Voor spaarders goed nieuws, maar sommigen zijn maandsalaris extra kwijt: de voor- en nadelen van stijgende rente',
        'content': 'In today’s fast-paced world, effective time management is essential. Here are some practical tips to help you make the most of your time.',
        'author': 'John Smith',
        'date_posted': 'September 12, 2022',
        'image': 'https://static.nieuwsblad.be/Assets/Images_Upload/2023/03/09/96638ad4-551f-4269-91c4-ea21b49ff8b8.jpg',
        'category': 'Productivity',
        'tags': ['time management', 'productivity'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': "https://www.nieuwsblad.be/cnt/dmf20230309_96130408",
        'article_id': 1,
    }
    article_2 = {
        'title': 'Colruyt verhoogt lonen bij OKay Compact',
        'content': 'Meditation has been shown to have numerous benefits for both physical and mental health. Find out how it can help you reduce stress, improve focus, and more.',
        'author': 'Jane Doe',
        'date_posted': 'August 30, 2022',
        'image': 'https://static.nieuwsblad.be/Assets/Images_Upload/2023/03/09/cc1944f3-baac-4bdf-8131-9d169d2c5421.jpg',
        'category': 'Wellness',
        'tags': ['meditation', 'wellness', 'mindfulness'],
        'comments': ['comment_id_3', 'comment_id_4'],
        'references': "https://www.healthline.com/nutrition/12-benefits-of-meditation",
        'article_id': 2,
    }
    article_3 = {
        'title': 'Melkveehouder wordt directeur bij Rabobank',
        'content': 'Sleep is crucial for maintaining overall health and wellbeing. It allows our bodies to repair and regenerate, and is important for cognitive function, emotional regulation, and immune system function. Inadequate sleep has been linked to a number of health problems, including obesity, diabetes, heart disease, and depression. To optimize your sleep, experts recommend establishing a regular sleep routine, creating a comfortable sleep environment, and avoiding stimulants like caffeine and electronic devices before bedtime.',
        'author': 'Jane Smith',
        'date_posted': 'March 1, 2023',
        'image': 'https://static.nieuwsblad.be/Assets/Images_Upload/2023/03/09/577fa4db-2785-4098-be80-b6ca9c20b122.jpg',
        'category': 'Health',
        'tags': ['sleep', 'health', 'wellness'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': 'https://www.nieuwsblad.be/cnt/dmf20230309_95852719',
        'article_id': 3,
    }
    article_4 = {
        'title': 'Minister van Werk Dermagne vraagt Delhaize-directie om andere pistes te onderzoeken',
        'content': 'Meditation has been shown to be an effective tool for reducing stress and improving overall wellbeing. It can help to calm the mind and body, reduce feelings of anxiety and depression, and improve sleep quality. Regular meditation practice has also been linked to increased focus and concentration, better emotional regulation, and improved immune system function. To get started with meditation, experts recommend finding a quiet, comfortable place to sit, focusing on your breath, and gradually increasing the length of your practice over time.',
        'author': 'John Doe',
        'date_posted': 'February 15, 2023',
        'image': 'https://static.nieuwsblad.be/Assets/Images_Upload/2023/03/09/c73245f1-fc0a-46cf-9e3b-d717513cb87b.jpg',
        'category': 'Mindfulness',
        'tags': ['meditation', 'stress relief', 'mindfulness'],
        'comments': ['comment_id_3', 'comment_id_4', 'comment_id_5'],
        'references': 'https://www.nieuwsblad.be/cnt/dmf20230309_95747980',
        'article_id': 4,
    }
    article_5 = {
        'title': 'Meer mensen vroeger met pensioen, maar Belg wel langer aan het werk',
        'content': 'Sleep is crucial for maintaining overall health and wellbeing. It allows our bodies to repair and regenerate, and is important for cognitive function, emotional regulation, and immune system function. Inadequate sleep has been linked to a number of health problems, including obesity, diabetes, heart disease, and depression. To optimize your sleep, experts recommend establishing a regular sleep routine, creating a comfortable sleep environment, and avoiding stimulants like caffeine and electronic devices before bedtime.',
        'author': 'Jane Smith',
        'date_posted': 'March 1, 2023',
        'image': 'https://static.nieuwsblad.be/Assets/Images_Upload/2023/03/09/39081e01-6433-414e-8d35-473773c926a3.jpg',
        'category': 'Health',
        'tags': ['sleep', 'health', 'wellness'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': 'https://www.nieuwsblad.be/cnt/dmf20230309_95384536',
        'article_id': 5,
    }
    article_6 = {
        'title': 'KBC breidt dienstverlening aan huis uit naar heel Vlaanderen',
        'content': 'Sleep is crucial for maintaining overall health and wellbeing. It allows our bodies to repair and regenerate, and is important for cognitive function, emotional regulation, and immune system function. Inadequate sleep has been linked to a number of health problems, including obesity, diabetes, heart disease, and depression. To optimize your sleep, experts recommend establishing a regular sleep routine, creating a comfortable sleep environment, and avoiding stimulants like caffeine and electronic devices before bedtime.',
        'author': 'Jane Smith',
        'date_posted': 'March 1, 2023',
        'image': 'https://static.nieuwsblad.be/Assets/Images_Upload/2023/03/06/ee301f5a-1c1e-44dc-bbf0-affa99f70f15.jpg',
        'category': 'Health',
        'tags': ['sleep', 'health', 'wellness'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': 'https://www.nieuwsblad.be/cnt/dmf20230309_94744798',
        'article_id': 6,
    }
    article_7 = {
        'title': 'Bank JPMorgan sleept vroeger directielid voor rechter wegens banden met Epstein',
        'content': 'Sleep is crucial for maintaining overall health and wellbeing. It allows our bodies to repair and regenerate, and is important for cognitive function, emotional regulation, and immune system function. Inadequate sleep has been linked to a number of health problems, including obesity, diabetes, heart disease, and depression. To optimize your sleep, experts recommend establishing a regular sleep routine, creating a comfortable sleep environment, and avoiding stimulants like caffeine and electronic devices before bedtime.',
        'author': 'Jane Smith',
        'date_posted': 'March 1, 2023',
        'image': 'https://static.nieuwsblad.be/Assets/Images_Upload/2023/03/09/c98f5351-0682-439c-89ca-9a1a10454de8.jpg',
        'category': 'Science',
        'tags': ['sleep', 'health', 'wellness'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': 'https://www.nieuwsblad.be/cnt/dmf20230309_94737736',
        'article_id': 7,
    }

    article_8 = {
        'title': 'Schuldeisers Inno-moeder Galeria moeten miljardenbedrag kwijtschelden',
        'content': 'Sleep is crucial for maintaining overall health and wellbeing. It allows our bodies to repair and regenerate, and is important for cognitive function, emotional regulation, and immune system function. Inadequate sleep has been linked to a number of health problems, including obesity, diabetes, heart disease, and depression. To optimize your sleep, experts recommend establishing a regular sleep routine, creating a comfortable sleep environment, and avoiding stimulants like caffeine and electronic devices before bedtime.',
        'author': 'Jane Smith',
        'date_posted': 'March 1, 2023',
        'image': 'https://static.nieuwsblad.be/Assets/Images_Upload/2023/02/27/b56e828d-242e-4220-9263-69461936af66.jpg',
        'category': 'Joy',
        'tags': ['sleep', 'health', 'wellness'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': 'https://www.nieuwsblad.be/cnt/dmf20230309_94381387',
        'article_id': 8,
    }

    all_articles = [article_1, article_2, article_3, article_4, article_5, article_6, article_7]
    return all_articles


@app.route('/api/add_article', methods=['POST'])
@cross_origin()
def addArticle():
    data = request.get_json()
    # db.addArticle(data['title'], data['content'], data['author'], data['date_posted'], data['image'], data['category'], data['tags'], data['comments'], data['references'])
    return json.loads('{"message": "article added successfully"}')


@app.route('/api/update_article/<article_url>', methods=['POST'])
@cross_origin()
def updateArticle(article_url):
    data = request.get_json()
    # db.updateArticle(article_url, data['title'], data['content'], data['author'], data['date_posted'], data['image'], data['category'], data['tags'], data['comments'], data['references'])
    return json.loads('{"message": "article updated successfully"}')


@app.route('/api/delete_article/<article_url>', methods=['POST'])
@cross_origin()
def deleteArticle(article_url):
    # db.deleteArticle(article_url)
    return json.loads('{"message": "article deleted successfully"}')


@app.errorhandler(404)
@app.errorhandler(500)
def error_handler(error):
    return render_template('errors/404.html'), 404


if __name__ == '__main__':
    app.run(port=4444)
