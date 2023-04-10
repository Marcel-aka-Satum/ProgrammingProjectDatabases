from flask import Flask, render_template, request, jsonify, make_response
import os,json
import bcrypt
from flask_jwt_extended import create_access_token, JWTManager, get_jwt, jwt_required
from flask_cors import CORS, cross_origin
from Database.ui_db import DBConnection
from Helpers.ErrorDetectionRoutes import *
from functools import wraps
import jwt
import datetime
from Database.scraper import scraper



app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'], resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
db = DBConnection()
db.connect()


drop_db = True
if drop_db == True:
    db.redefine()
    db.populate()
    scraper()

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'sample key')
# jwt = JWTManager(app)


@app.route('/')
def index():
    return render_template('index.html')


################# AUTHENTICATION ROUTES #################


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256', ])
            if(data):
                return({'message': 'Valid token yay'}), 200
        except:
            return jsonify({'message':'Token is invalid!'}), 401

    return decorated

@app.route("/api/register", methods=["POST"])
@cross_origin()
def register_user():
    email = request.json["Email"]
    password = request.json["Password"]
    confirm_password = request.json["ConfirmPassword"]
    is_admin = request.json["Is_Admin"]
    username = request.json["Username"]
    user_exists = db.getUser(email)

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

    #create salt for hash
    salt = bcrypt.gensalt()
    #hashpsswd
    bytes = password.encode('utf-8')
    hashed_password = bcrypt.hashpw(bytes, salt)
    status_db, message_db = db.addUser(username, email, hashed_password.decode(), is_admin)
    if not status_db:
        return jsonify({"message": message_db}), 401
    user_exists = db.getUser(email)
    #jwt token
    encoded_jwt = jwt.encode({"user": user_exists[1]["Username"], "isAdmin":user_exists[1]["Is_Admin"], "email":user_exists[1]["Email"], 'exp':
                              datetime.datetime.utcnow() + datetime.timedelta(minutes=600)}, app.config["JWT_SECRET_KEY"])

    # access_token = create_access_token(identity=email)

    return jsonify({"message": f"Welcome {username}", 
                    "token": encoded_jwt}), 200


@app.route("/api/login", methods=["POST"])
@cross_origin()
def login_user():
    email = request.json["Email"]
    password = request.json["Password"]
    user_exists = db.getUser(email)
    #check is psswd is == hash in our database
    result = bcrypt.checkpw(password.encode('utf-8'), user_exists[1]["Password"].encode('utf-8'))
    

    if email == "" or password == "":
        return jsonify({"message": "please fill in all fields"}), 401

    if user_exists[0] in [None, False]:
        return jsonify({"message": "user does not exist."}), 401

    if not result:
        return jsonify({"message": "password is incorrect"}), 401
    else:
        #jwt token
        encoded_jwt = jwt.encode({"user": user_exists[1]["Username"], "isAdmin":user_exists[1]['Is_Admin'], "email":user_exists[1]["Email"], 'exp':
                              datetime.datetime.utcnow() + datetime.timedelta(minutes=600)}, app.config["JWT_SECRET_KEY"])
        # access_token = create_access_token(identity=email)

        return jsonify({
            "message": f"Authorized > Welcome Back",
            "UID": user_exists[1]['UID'],
            "Email": user_exists[1]['Email'],
            "token": encoded_jwt,
            "Username":user_exists[1]['Username'],
            "isAdmin": user_exists[1]['Is_Admin']
        }), 200


################# USER ROUTES #################
@app.route('/api/users', methods=['GET'])
@cross_origin()
def getUsers():
    users = db.getUsers()
    return json.loads(users)

@app.route('/api/auth')
@token_required
def auth():
    return 'JWT IS GUT GUT!'

@app.route('/api/users/totalusers', methods=['GET'])
@token_required
@cross_origin()
def getTotalUsers():
    users = db.getUsers()
    return jsonify({"totalUsers": len(json.loads(users))})


@app.route('/api/add_user', methods=['POST'])
@cross_origin()
def addUser():
    data = request.get_json()
    username, email, password, is_admin = data['Username'], data['Email'], data['Password'], data['Is_Admin']
    forbidden = [' ', '`', '~', '[', ']', '{', '}', '(', ')', '|', ';', ':', '"', "'", ',', '<', '>', '.', '?', '/']

    message_pwd_val, status_pwd_val = validate_pwd(password)

    if status_pwd_val == 401:
        return jsonify({"message": message_pwd_val, "status": status_pwd_val})
    elif status_pwd_val == 200:
        status_db, message_db = db.addUser(username, email, password, is_admin)
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

    status, message = db.updateUser(id, username, email, password, is_admin)
    if status:
        return jsonify({"message": f"USER ({id}) Updated Successfully", "status": 200})
    else:
        return jsonify({"message": message, "status": 401})

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

@app.route('/api/rssfeeds/totalrssfeeds', methods=['GET'])
@cross_origin()
def getTotalRSSFeeds():
    rssfeeds = db.ParseRSSFeeds()
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
        status_db, message_db = db.addRSSFeed(url, publisher, topic)
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

    status_db, message_db = db.updateRSSFeed(url, publisher, topic)
    if status_db:
        return jsonify({"message": "RSS Feed updated successfully", "status": 200})
    else:
        return jsonify({"message": message_db, "status": 401})

@app.route('/api/delete_rssfeed', methods=['POST'])
@cross_origin()
def deleteRSSFeed():
    data = request.get_json()
    status_db, message_db = db.deleteRSSFeed(data['URL'])
    if status_db:
        return jsonify({"message": "RSS Feed deleted successfully", "status": 200})
    else:
        return jsonify({"message": message_db, "status": 401})

@app.route('/api/check_rssfeed', methods=['POST'])
@cross_origin()
def checkRSSFeed(url=None):
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
@app.route('/apiv2/articles', methods=['GET'])
@cross_origin()
def getArticles():
    articles_list = json.loads(db.getArticles())
    return jsonify({"articles": articles_list, "status": 200})


@app.route('/api/articles', methods=['GET'])
@cross_origin()
def articles():
    articles_list = json.loads(db.getArticles())
    return articles_list

@app.route('/api/articles/totalarticles', methods=['GET'])
@cross_origin()
def getTotalArticles():
    totalarticles = json.loads(db.getArticles())
    return jsonify({'totalArticles': len(totalarticles)})

@app.errorhandler(404)
@app.errorhandler(500)
def error_handler(error):
    return render_template('errors/404.html'), 404


if __name__ == '__main__':
    app.run(port=4444)
