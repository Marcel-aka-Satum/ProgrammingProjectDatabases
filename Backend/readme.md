# UI Backend Documentation

This code implements the backend for a User Interface (UI) that allows users to register and login, view, add, update and delete users, RSS feeds, and news articles. The API supports JSON requests and responses.

## Functions

### `index()`

Routing: `@app.route('/')`

Renders the `index.html` template for the homepage.

### `register_user()`

Routing: `@app.route("/api/register", methods=["POST"])`

Endpoint to register a new user. Accepts a POST request with JSON data containing `Email`, `Password`, `Is_Admin`, and `Username`. The `Email` and `Username` must not be in use by another user. If successful, a new user is created, and a JWT access token is returned.

### `login_user()`

Routing: `@app.route("/api/login", methods=["POST"])`

Endpoint to login an existing user. Accepts a POST request with JSON data containing `Email` and `Password`. If successful, a JWT access token is returned.

### `getUsers()`

Routing: `@app.route('/api/users', methods=['GET'])`

Endpoint to retrieve a list of all users.

### `addUser()`

Routing: `@app.route('/api/add_user', methods=['POST'])`

Endpoint to add a new user. Accepts a POST request with JSON data containing `Email`, `Password`, `Is_Admin`, and `Username`.

### `updateUser(id)`

Routing: `@app.route('/api/update_user/<id>', methods=['POST'])`

Endpoint to update an existing user. Accepts a POST request with JSON data containing `Email`, `Password`, `Is_Admin`, and `Username`.

### `deleteUser(username)`

Routing: `@app.route('/api/delete_user/<username>', methods=['POST'])`

Endpoint to delete an existing user.

### `getRSSFeeds()`

Routing: `@app.route('/api/rssfeeds', methods=['GET'])`

Endpoint to retrieve a list of all RSS feeds.

### `addRSSFeed()`

Routing: `@app.route('/api/add_rssfeed', methods=['POST'])`

Endpoint to add a new RSS feed. Accepts a POST request with JSON data containing `URL`, `Publisher`, and `Topic`.

### `updateRSSFeed(url)`

Routing: `@app.route('/api/update_rssfeed/<url>', methods=['POST'])`

Endpoint to update an existing RSS feed. Accepts a POST request with JSON data containing `Publisher` and `Topic`.

### `deleteRSSFeed(url)`

Routing: `@app.route('/api/delete_rssfeed/<url>', methods=['POST'])`

Endpoint to delete an existing RSS feed.

### `articles()`

Routing: `@app.route('/api/articles', strict_slashes=False, methods=['GET'])`

Endpoint to retrieve a list of all news articles.

### `addArticle()`

Routing: `@app.route('/api/add_article', methods=['POST'])`

Endpoint to add a new news article.


