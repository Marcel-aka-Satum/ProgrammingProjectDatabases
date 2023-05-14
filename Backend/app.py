import datetime
import json
import os
from functools import wraps
import threading
import time

import bcrypt
import jwt
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin

from Database.scraper import scraper
from Database.ui_db import DBConnection
from Database.article_clustering import NewsClusterer
from Helpers import helpers as h
from Helpers.ErrorDetectionRoutes import *

from log import logger

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'], resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
db = DBConnection()
db.connect()
drop_db = False
if drop_db:
    db.redefine()
    db.populate()
     
    # db.loadBackup("230417_19_36.txt")
    scraper()
    # clear logger file
    logger.warning("Database dropped and redefined")

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

    logger.info(f"Successful registration: email={email}")
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
        logger.info(f"Failed login attempt: email={email} | password={password}, reason=user does not exist")
        return jsonify({"message": "user does not exist."}), 401

    # check if password is correct compared to hashed password in db
    result = bcrypt.checkpw(password.encode('utf-8'), user_exists[1]["Password"].encode('utf-8'))

    if not result:
        logger.info(f"Failed login attempt: email={email} | password={password}, reason=incorrect password")
        return jsonify({"message": "password is incorrect"}), 401
    else:
        # jwt token
        encoded_jwt = jwt.encode({"user": user_exists[1]["Username"], "isAdmin": user_exists[1]['Is_Admin'],
                                  "email": user_exists[1]["Email"], 'exp':
                                      datetime.datetime.utcnow() + datetime.timedelta(minutes=600)},
                                 app.config["JWT_SECRET_KEY"])
        # access_token = create_access_token(identity=email)
        logger.info(f"Successful login: email={email}")
        return jsonify({
            "message": f"Authorized > Welcome Back",
            "UID": user_exists[1]['UID'],
            "Email": user_exists[1]['Email'],
            "token": encoded_jwt,
            "Username": user_exists[1]['Username'],
            "isAdmin": user_exists[1]['Is_Admin']
        }), 200


@app.route("/api/verify_password", methods=["POST"])
@cross_origin()
def change_password():
    email = request.json["Email"]
    old_password = request.json["OldPassword"]
    new_password = request.json["NewPassword"]
    confirm_password = request.json["ConfirmPassword"]
    user_exists = db.getUser(email)[1]

    if email == "" or old_password == "" or new_password == "" or confirm_password == "":
        return jsonify({"message": "please fill in all fields", "status": 401})

    if user_exists[0] in [None, False]:
        return jsonify({"message": "user does not exist.", "status": 401})

    # check if password is correct compared to hashed password in db
    result = bcrypt.checkpw(old_password.encode('utf-8'), user_exists[1]["Password"].encode('utf-8'))

    if not result:
        return jsonify({"message": "old password is incorrect", "status": 401})
    else:
        message_pwd_val, status_pwd_val = validate_pwd(new_password)

        if status_pwd_val == 401:
            return jsonify({"message": message_pwd_val, "status": 401})

        if new_password != confirm_password:
            return jsonify({"message": "passwords do not match", "status": 401})

        logger.info(f"Password changed: email={email}")
        return jsonify({
            "message": f"Password matched", "status": 200
        })


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
            logger.info(f"User added: username={username} | email={email}")
            return jsonify({"message": "User added successfully", "status": 200})
        else:
            return jsonify({"message": message_db, "status": 401})
    else:
        return jsonify({"message": "Something went wrong", "status": 500})


@app.route('/api/update_user/<id>', methods=['POST'])
@cross_origin()
def updateUser(id):
    data = request.get_json()
    username, email, password, is_admin = data['Username'], data['Email'], data.get('Password'), data['Is_Admin']

    print('update password:', password)

    new_password = None
    if password:
        new_password = h.create_hash(password)
    else:
        user_exists = db.getUser(email)[1]
        password = user_exists[1]["Password"]
        new_password = password

    status, message = db.updateUser(id, username, email, new_password, is_admin)[1]
    if status:
        logger.info(f"User updated: username={username} | email={email}")
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
        logger.info(f"User deleted: id={id}")
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
        logger.info(f"RSS Feed updated: url={url} | publisher={publisher} | topic={topic}")
        return jsonify({"message": "RSS Feed updated successfully", "status": 200})
    else:
        return jsonify({"message": message_db, "status": 401})


@app.route('/api/delete_rssfeed', methods=['POST'])
@cross_origin()
def deleteRSSFeed():
    data = request.get_json()
    status_db, message_db = db.deleteRSSFeed(data['URL'])[1]
    if status_db:
        logger.info(f"RSS Feed deleted: url={data['URL']}")
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
@app.route('/api/articles', methods=['GET'], strict_slashes=False)
@cross_origin()
def articles():
    articles_list = db.getNewsArticles()[1]
    return jsonify(articles_list)


@app.route('/api/articlesDict/', methods=['GET'])
@cross_origin()
def articlesDict():
    return jsonify(db.getArticlesDict()[1])


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


@app.route('/api/articles/genres', methods=['GET'])
@cross_origin()
def getTopics():
    return jsonify(db.getTopics()[1])


@app.route('/api/articles/genre', methods=['POST'])
@cross_origin()
def getArticlesTopic():
    data = request.get_json()
    topic = data['genre']
    articles = db.getNewsArticlesTopic(topic)
    return jsonify(articles[1])


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
    status_db, message_db = db.deleteFavored(user_id, article_url)[1]
    if status_db:
        return jsonify({"message": "Article deleted from favorites", "status": 200})
    else:
        return jsonify({"message": message_db, "status": 401})


@app.route('/api/delete_all_favored', methods=['POST'])
@cross_origin()
def deleteAllFavored():
    data = request.get_json()
    user_id = data['UID']
    status_db, message_db = db.deleteAllFavored(user_id)[1]
    if status_db:
        return jsonify({"message": "All Articles deleted from favorites", "status": 200})
    else:
        return jsonify({"message": message_db, "status": 401})


################# VISITORS/TOPICS #################
@app.route('/api/visitors', methods=['GET'])
@cross_origin()
def visitors():
    visitors_list = db.getVisitors()[1]
    return jsonify({'visitors': visitors_list})


@app.route('/api/topics', methods=['GET'])
@cross_origin()
def topics():
    topics_list = db.getTopics()[1]
    return jsonify({'topics': topics_list})


################# OTHERS #################
@app.errorhandler(404)
@app.errorhandler(500)
@app.errorhandler(429)
def error_handler():
    return render_template('errors/404.html'), 404


@app.route('/api/update_settings', methods=['POST'])
@cross_origin()
def ChangeSetting():
    data = request.get_json()
    setting, value = data['setting'], data['value']
    if setting == "" or value == "":
        return jsonify({"message": "Setting or value cannot be empty", "status": 401})
    val = db.updateSetting(setting, value)
    if val[1][0]:
        return jsonify({"message": "Setting updated successfully", "status": 200})
    else:
        return jsonify({"message": val[1][1], "status": 401})


@app.route('/api/settings', methods=['GET'])
@cross_origin()
def GetSettings():
    return jsonify(db.getSettings()[1])


################# GOOGLE API CALLS #################

@app.route('/api/google/login', methods=['POST'])
@cross_origin()
def GoogleLogin():
    data = request.get_json()
    email = data['Email']
    user_exists = db.getUser(email)[1]

    if user_exists[0] in [None, False]:
        logger.info(f"Failed login attempt via google: email={email}, reason=user does not exist")
        return jsonify({"message": "user does not exist."}), 401

    uid = user_exists[1]["UID"]
    username = user_exists[1]["Username"]
    password = user_exists[1]["Password"]
    is_admin = user_exists[1]["Is_Admin"]

    print(f"Successful login via google: email={email}, uid={uid}, username={username}, password={password}, "
          f"is_admin={is_admin}")

    encoded_jwt = jwt.encode({"user": username, "isAdmin": is_admin,
                              "email": email, 'exp':
                                  datetime.datetime.utcnow() + datetime.timedelta(minutes=600)},
                             app.config["JWT_SECRET_KEY"])

    logger.info(f"Successful login: email={email}")

    return jsonify({
        "message": f"Authorized > Welcome Back",
        "UID": uid,
        "Email": email,
        "token": encoded_jwt,
        "Username": username,
        "isAdmin": is_admin
    }), 200


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
    return jsonify(db.getFavored()[1])


@app.route('/db/settings')
def DBSettings():
    print('settings2:', db.getSettings()[1])
    return jsonify(db.getSettings()[1])


@app.route('/db/backup')
def Backup():
    return db.createBackup()[1]


@app.route('/db/topics')
def Topics():
    return db.getTopics()[1]


@app.route('/db/articlesgenres')
def articlesPerGenre():
    return db.getArticlesDict()[1]


def start_scraper():
    while True:
        data = db.getSettings()[1]
        scraped_time = int(600)
        scraper()
        time.sleep(scraped_time)


scraper_thread = threading.Thread(target=start_scraper)
scraper_thread.start()

def start_clustering():
    news_clusterer = NewsClusterer()
    while True:
        news_clusterer.run(visualize=False)
        time.sleep(600)

#clustering_thread = threading.Thread(target=start_clustering)
#clustering_thread.start()

if __name__ == '__main__':
    app.run(port=4444)
