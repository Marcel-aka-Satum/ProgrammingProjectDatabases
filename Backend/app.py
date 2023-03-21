from flask import Flask, render_template, request, redirect, url_for, jsonify
import os, sys, json
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin
from Database import ui_db, Scraper

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
app.config['CORS_HEADERS'] = 'Content-Type'
bcrypt = Bcrypt(app)
db = ui_db.DBConnection()
db.connect()
db.redefine()
db.populate()
Scraper.scraper()
# db.updateUser(1, "admin-username", "admin@gmail.com", "admin-password", 1)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'sample key')
jwt = JWTManager(app)

@app.route('/')
def index():
    return render_template('index.html')


################# USER ROUTES #################
@app.route('/api/users', methods=['GET'])
@cross_origin()
def getUsers():
    users = db.getUsers()
    print('users:', users)
    return json.loads(users)

@app.route('/api/add_user', methods=['POST'])
@cross_origin()
def addUser():
    data = request.get_json()
    print('data:', data)
    # db.addUser(data['username'], data['email'], data['password'], data['is_admin'])
    return json.loads('{"message": "user added successfully"}')

@app.route('/api/update_user/<id>', methods=['POST'])
@cross_origin()
def updateUser(id):
    data = request.get_json()
    print('data:', data)
    db.updateUser(id, data['Username'], data['Email'], data['Password'], data['Is_Admin'])
    return json.loads('{"message": "user updated successfully"}')

@app.route('/api/delete_user/<username>', methods=['POST'])
@cross_origin()
def deleteUser(username):
    print('username:', username)
    # db.deleteUser(username)
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
@app.route('/api/articles', methods=['GET'])
@app.route('/articles/<tag>')
@cross_origin()
def getArticles(tag=""):
    articles = db.getArticles(tag)
    print('articles:', articles)
    return json.loads(articles)

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
