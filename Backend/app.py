from flask import Flask, render_template, request, redirect, url_for, jsonify
from models import db, User
import os
from config import ApplicationConfig
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
db.init_app(app)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
bcrypt = Bcrypt(app)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'sample key')
jwt = JWTManager(app)

with app.app_context():
    db.create_all()


@app.route("/api/register", methods=["POST"])
@cross_origin()
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    user_exists = User.query.filter_by(email=email).first() is not None

    if (user_exists):
        return jsonify({"error": "User already exists"}), 409
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    acces_token = create_access_token(identity=email)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "id":  new_user.id,
        "email": new_user.email
    })


@app.route("/api/login", methods=["POST"])
@cross_origin()
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    user_exists = User.query.filter_by(email=email).first()
    
    if user_exists is None:
        return jsonify({"error": "Unauthorized"}), 401
    
    if not bcrypt.check_password_hash(user_exists.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    acces_token = create_access_token(identity=email)
    return jsonify({
        "id":  user_exists.id,
        "email": user_exists.email,
        "token": acces_token
    })


@app.route("/api/getUsers", methods=["GET"])
@cross_origin()
def get_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "email": user.email} for user in users])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/articles', strict_slashes=False)
@app.route('/articles/<tag>', strict_slashes=False)
def articles(tag="Economie"):
    article_1 = {
        'title': '10 Tips for Better Time Management',
        'content': 'In today’s fast-paced world, effective time management is essential. Here are some practical tips to help you make the most of your time.',
        'author': 'John Smith',
        'date_posted': 'September 12, 2022',
        'image': 'https://picsum.photos/400/400/?random',
        'category': 'Productivity',
        'tags': ['time management', 'productivity'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': ['ref_1', 'ref_2'],
        'article_id': 1
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
        'references': ['ref_3', 'ref_4'],
        'article_id': 2
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
        'article_id': 3
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
        'article_id': 4
    }


    if tag == 'latest':
        ## get the latest articles
        # articles = get_latest_articles()
        articles = [article_1, article_2]
    elif tag == 'popular':
        ## get the most popular articles
        # articles = get_popular_articles()
        articles = [article_3, article_4]
    elif tag == 'all':
        # get all articles
        # articles = get_all_articles(limit=25)
        articles = [article_1, article_2, article_3, article_4]
    elif tag == 'Economie':
        # get all articles
        # articles = get_all_articles()
        articles = rssScraper("Hardcoded rssFeed from HLN")
    else:
        return redirect(url_for('articles', tag='all'))

    return render_template('articles.html', articles=articles, tag=tag)


@app.route('/article/<int:article_id>')
def article(article_id):
    # Retrieve article from database/api
    # Do this by checking the exact article_id
    # so if /article/1 is requested, retrieve the article with id 1 from Database/api

    ## Dummy article, this will be extracted by referring to the article_id
    article = {
        'title': 'Dummy Article',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae nisl nec nisl luctus ultricies.',
        'author': 'Someone',
        'date_posted': 'April 20, 2018',
        'image': 'https://picsum.photos/200/300/?random',
        'category': None,
        'tags': ['dummy', 'article'],
        'comments': ['comment_id_1', 'comment_id_2'],
        'references': None
    }

    return render_template('article.html', article=article)


@app.errorhandler(404)
@app.errorhandler(500)
def error_handler(error):
    return render_template('errors/404.html'), 404


if __name__ == '__main__':
    app.run(port=4444)
