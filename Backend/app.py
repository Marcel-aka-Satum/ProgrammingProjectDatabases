import datetime
import json
import os
from functools import wraps

import bcrypt
import jwt
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin

from Database.ui_db import DBConnection
from Helpers import helpers as h
from Helpers.ErrorDetectionRoutes import *

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'], resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
db = DBConnection()

drop_db = False
if drop_db:
    db.redefine()
    db.populate()
    # db.loadBackup("230417_19_36.txt")
    # scraper()

# Set up the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'sample key')


# jwt = JWTManager(app)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256', ])
            if data:
                return ({'message': 'Valid token yay'}), 200
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token is expired!'}), 401
        except Exception as e:
            return jsonify({'message': str(e)}), 401

    return decorated


@app.route('/')
def index():
    return render_template('index.html')


################# AUTHENTICATION ROUTES #################
@app.route('/api/auth')
@token_required
def auth():
    return 'JWT IS GUT GUT!'


@app.route("/api/register", methods=["POST"])
@cross_origin()
def register_user():
    email = request.json["Email"]
    password = request.json["Password"]
    confirm_password = request.json["ConfirmPassword"]
    is_admin = request.json["Is_Admin"]
    username = request.json["Username"]
    user_exists = db.getUser(email)[1]

    if email == "" or password == "" or username == "":
        return jsonify({"message": "please fill in all fields"}), 401

    message_email_val, status_email_val = validate_email(email)
    message_pwd_val, status_pwd_val = validate_pwd(password)

    if status_email_val == 401:
        return jsonify({"message": message_email_val}), 401

    if user_exists[0]:
        return jsonify({"message": "user exists already."}), 401

    if password != confirm_password:
        return jsonify({"message": "passwords do not match"}), 401

    if status_pwd_val == 401:
        return jsonify({"message": message_pwd_val}), 401
    uid = db.generateUID()[1]
    status_db, message_db = db.addUser(uid, username, email, h.create_hash(password), is_admin)[1]
    if not status_db:
        return jsonify({"message": message_db}), 401
    user_exists = db.getUser(email)[1]
    # jwt token
    encoded_jwt = jwt.encode(
        {"user": user_exists[1]["Username"], "isAdmin": user_exists[1]["Is_Admin"], "email": user_exists[1]["Email"],
         'exp':
             datetime.datetime.utcnow() + datetime.timedelta(minutes=600)}, app.config["JWT_SECRET_KEY"])

    # access_token = create_access_token(identity=email)

    return jsonify({"message": f"Welcome {username}",
                    "token": encoded_jwt}), 200


@app.route("/api/login", methods=["POST"])
@cross_origin()
def login_user():
    email = request.json["Email"]
    password = request.json["Password"]
    user_exists = db.getUser(email)[1]

    if email == "" or password == "":
        return jsonify({"message": "please fill in all fields"}), 401

    if user_exists[0] in [None, False]:
        return jsonify({"message": "user does not exist."}), 401

    # check if password is correct compared to hashed password in db
    result = bcrypt.checkpw(password.encode('utf-8'), user_exists[1]["Password"].encode('utf-8'))

    if not result:
        return jsonify({"message": "password is incorrect"}), 401
    else:
        # jwt token
        encoded_jwt = jwt.encode({"user": user_exists[1]["Username"], "isAdmin": user_exists[1]['Is_Admin'],
                                  "email": user_exists[1]["Email"], 'exp':
                                      datetime.datetime.utcnow() + datetime.timedelta(minutes=600)},
                                 app.config["JWT_SECRET_KEY"])
        # access_token = create_access_token(identity=email)

        return jsonify({
            "message": f"Authorized > Welcome Back",
            "UID": user_exists[1]['UID'],
            "Email": user_exists[1]['Email'],
            "token": encoded_jwt,
            "Username": user_exists[1]['Username'],
            "isAdmin": user_exists[1]['Is_Admin']
        }), 200


################# FAVORITES #################

# @app.route("/api/favorites", methods=["POST"])
# def setFavorites():
#    Url = request.json["Url"]
#    Cookie = request.json["Cookie"]
#    status, message = db.addFavorite(Cookie, Url)
#    return jsonify(message[1])


# @app.route('/api/getfavorites', methods=['POST'])
# def getFavorites():
#    Cookie = request.json["Cookie"]
#    return jsonify(db.getFavorites(Cookie)[1])

################# USER ROUTES #################
@app.route('/api/users', methods=['GET'])
@cross_origin()
def getUsers():
    users = json.dumps(db.getUsers()[1])
    return json.loads(users)


@app.route('/api/users/totalusers', methods=['GET'])
@cross_origin()
def getTotalUsers():
    users = json.dumps(db.getUsers()[1])
    return jsonify({"totalUsers": len(json.loads(users))})


@app.route('/api/add_Visitor', methods=['GET'])
def addVisitor():
    uid = db.generateUID()[1]
    cookie = db.generateCookie()[1]
    db.addVisitor(uid)
    db.addCookie(cookie, uid)
    return jsonify(cookie)


@app.route('/api/add_user', methods=['POST'])
@cross_origin()
def addUser():
    data = request.get_json()
    username, email, password, is_admin = data['Username'], data['Email'], data['Password'], data['Is_Admin']

    message_pwd_val, status_pwd_val = validate_pwd(password)

    if status_pwd_val == 401:
        return jsonify({"message": message_pwd_val, "status": status_pwd_val})
    elif status_pwd_val == 200:
        status_db, message_db = db.addUser(db.generateUID()[1], username, email, h.create_hash(password), is_admin)[1]
        if status_db:
            return jsonify({"message": "User added successfully", "status": 200})
        else:
            return jsonify({"message": message_db, "status": 401})
    else:
        return jsonify({"message": "Something went wrong", "status": 500})


@app.route('/api/update_user/<id>', methods=['POST'])
@cross_origin()
def updateUser(id):
    data = request.get_json()
    username, email, password, is_admin = data['Username'], data['Email'], data['Password'], data['Is_Admin']

    status, message = db.updateUser(id, username, email, password, is_admin)[1]
    if status:
        return jsonify({"message": f"USER ({id}) Updated Successfully", "status": 200})
    else:
        return jsonify({"message": message, "status": 401})


@app.route('/api/delete_user/<id>', methods=['POST'])
@cross_origin()
def deleteUser(id):
    user = db.getUser(id)[1]
    if user[0]:
        return jsonify({"message": f"USER ({id}) Not Found", "status": 404})
    else:
        db.deleteUser(id)
        return jsonify({"message": f"USER ({id}) Deleted Successfully", "status": 200})


################# RSS FEED ROUTES #################
@app.route('/api/rssfeeds', methods=['GET'])
@cross_origin()
def getRSSFeeds():
    rssfeeds = json.dumps(db.getRSSFeeds()[1])
    return json.loads(rssfeeds)


@app.route('/api/rssfeeds/totalrssfeeds', methods=['GET'])
@cross_origin()
def getTotalRSSFeeds():
    rssfeeds = json.dumps(db.getRSSFeeds()[1])
    return jsonify({"totalRSSFeeds": len(json.loads(rssfeeds))})


@app.route('/api/add_rssfeed', methods=['POST'])
@cross_origin()
def addRSSFeed():
    data = request.get_json()
    url, publisher, topic = data['URL'], data['Publisher'], data['Topic']

    message_rss_val, status_rss_val = validate_rssFeed(url)

    if status_rss_val == 401:
        return jsonify({"message": message_rss_val, "status": status_rss_val})
    elif status_rss_val == 200:
        status_db, message_db = db.addRSSFeed(url, publisher, topic)[1]
        if status_db:
            return jsonify({"message": "RSS Feed added successfully", "status": 200})
        else:
            return jsonify({"message": message_db, "status": 401})
    else:
        return jsonify({"message": "Something went wrong", "status": 500})


@app.route('/api/update_rssfeed', methods=['POST'])
@cross_origin()
def updateRSSFeed():
    data = request.get_json()
    url, publisher, topic = data['URL'], data['Publisher'], data['Topic']

    status_db, message_db = db.updateRSSFeed(url, publisher, topic)[1]
    if status_db:
        return jsonify({"message": "RSS Feed updated successfully", "status": 200})
    else:
        return jsonify({"message": message_db, "status": 401})


@app.route('/api/delete_rssfeed', methods=['POST'])
@cross_origin()
def deleteRSSFeed():
    data = request.get_json()
    status_db, message_db = db.deleteRSSFeed(data['URL'])[1]
    if status_db:
        return jsonify({"message": "RSS Feed deleted successfully", "status": 200})
    else:
        return jsonify({"message": message_db, "status": 401})


@app.route('/api/check_rssfeed', methods=['POST'])
@cross_origin()
def checkRSSFeed():
    data = request.get_json()
    feed_url = data['URL']
    message_rss_val, status_rss_val = validate_rssFeed(feed_url)
    if status_rss_val == 401:
        return jsonify({"message": message_rss_val, "status": status_rss_val})
    elif status_rss_val == 200:
        return jsonify({"message": "RSS Feed is valid", "status": 200})
    else:
        return jsonify({"message": "Something went wrong", "status": 500})


################# NEWS ARTICLE ROUTES #################
@app.route('/api/articles', methods=['GET'])
@cross_origin()
def articles():
    articles_list = db.getNewsArticles()[1]
    return jsonify(articles_list)


@app.route('/api/get_article', methods=['POST'])
@cross_origin()
def getArticle():
    data = request.get_json()
    article_url = data['article_url']
    article = db.getArticle(article_url)[1]
    return jsonify({'article': article})


@app.route('/api/articles/totalarticles', methods=['GET'])
@cross_origin()
def getTotalArticles():
    totalarticles = db.getNewsArticles()[1]
    return jsonify({'totalArticles': len(totalarticles)})


################# Favorite ROUTES #################
@app.route('/api/favorites', methods=['GET'])
@cross_origin()
def favorites():
    favorites_list = db.getFavored()[1]
    return jsonify({'favorites': favorites_list})


@app.route('/api/addFavored', methods=['POST'])
@cross_origin()
def addFavored():
    data = request.get_json()
    user_id, article_url = data['UID'], data['article_url']
    print('addFavored: ', user_id, article_url)
    status_db, message_db = db.addFavored(user_id, article_url)[1]
    if status_db:
        return jsonify({"message": "Article added to favorites", "status": 200})
    else:
        return jsonify({"message": message_db, "status": 401})


@app.route('/api/delete_favored', methods=['POST'])
@cross_origin()
def deleteFavored():
    data = request.get_json()
    user_id, article_url = data['UID'], data['article_url']
    print('deleteFavored: ', user_id, article_url)
    status_db, message_db = db.deleteFavored(user_id, article_url)[1]
    if status_db:
        return jsonify({"message": "Article deleted from favorites", "status": 200})
    else:
        return jsonify({"message": message_db, "status": 401})



@app.errorhandler(404)
@app.errorhandler(500)
def error_handler():
    return render_template('errors/404.html'), 404


#################### DATABASE TABLES ####################

@app.route('/db')
def database():
    return render_template('database.html')


@app.route('/db/rssfeeds')
def DBRssfeeds():
    return jsonify(db.getRSSFeeds()[1])


@app.route('/db/newsarticles')
def DBNewsarticles():
    return jsonify(db.getNewsArticles()[1])


@app.route('/db/visitors')
def DBVisitors():
    return jsonify(db.getVisitors()[1])


@app.route('/db/users')
def DBUsers():
    return jsonify(db.getUsers()[1])


@app.route('/db/cookies')
def DBCookies():
    return jsonify(db.getCookies()[1])


@app.route('/db/hasclicked')
def DBHasClicked():
    return jsonify(db.getHasClicked()[1])


@app.route('/db/favored')
def DBFavored():
    return jsonify(db.getFavored())


@app.route('/db/backup')
def Backup():
    return db.createBackup()[1]


if __name__ == '__main__':
    app.run(port=4444)
