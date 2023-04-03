# UI Backend API Documentation

This code implements the backend for a User Interface (UI) that allows users to register and login, view, add, update,
and delete users, RSS feeds, and news articles. The API supports JSON requests and responses.

## Endpoints

**Response Body**

| Parameter | Type     | Description                       |
|:----------|:---------|:----------------------------------|
| `message` | `string` | Success message or error message. |
|`status`   | `int`    | HTTP status code.                 |
---

# Authentication API Documentation

### Register User

```http
POST /api/register
```

**Request Body**

| Parameter  | Type     | Description                                                |
|:-----------|:---------|:-----------------------------------------------------------|
| `Email`    | `string` | **Required**. User's email address.                        |
| `Password` | `string` | **Required**. User's password.                             |
| `Is_Admin` | `bool`   | Indicates if the user is an administrator. (default=False) |
| `Username` | `string` | **Required**. User's desired username.                     |

**Description:** _Registers a new user and returns a JWT access token upon success._

### Login User

```http
GET /api/login
```

**Request Body**

| Parameter  | Type     | Description                         |
|:-----------|:---------|:------------------------------------|
| `Email`    | `string` | **Required**. User's email address. |
| `Password` | `string` | **Required**. User's password.      |

**Description:** _Logs in an existing user and returns a JWT access token upon success._

---

# User API Documentation

### Get Users

```http
GET /api/users
```

**Description:** _Retrieves a list of all users._

### Get Total Users (quantity)

```http
GET /api/users/totalusers
```

**Response Body**

| Parameter | Type     | Description                       |
|:----------|:---------|:----------------------------------|
|`totalUsers`| `int`| Total number of users.            |

**Description:** _Retrieves the total number of users._

### Add User

```http
POST /api/add_user
```

**Request Body**

| Parameter  | Type     | Description                                                |
|:-----------|:---------|:-----------------------------------------------------------|
| `Email`    | `string` | **Required**. User's email address.                        |
| `Password` | `string` | **Required**. User's password.                             |
| `Is_Admin` | `bool`   | Indicates if the user is an administrator. (default=False) |
| `Username` | `string` | **Required**. User's desired username.                     |

**Description:** _Adds a new user._

### Update User

```http
POST /api/update_user/<id>
```

**Request Body**

| Parameter  | Type     | Description                                                |
|:-----------|:---------|:-----------------------------------------------------------|
| `Email`    | `string` | **Required**. User's email address.                        |
| `Password` | `string` | **Required**. User's password.                             |
| `Is_Admin` | `bool`   | Indicates if the user is an administrator. (default=False) |
| `Username` | `string` | **Required**. User's desired username.                     |

**Description:** _Updates an existing user._

### Delete User

```http
POST /api/delete_user/<id>
```

**Description:** _Deletes an existing user._

---

# RSS Feed API Documentation

### Get RSS Feeds

```http
GET /api/rssfeeds
```

**Description:** _Retrieves a list of all RSS feeds._

### Get Total RSS Feeds (quantity)

```http
GET /api/rssfeeds/totalrssfeeds
```

**Response Body**

| Parameter | Type     | Description                       |
|:----------|:---------|:----------------------------------|
|`totalRSSFeeds`| `int`| Total number of RSS feeds.        |

**Description:** _Retrieves the total number of RSS feeds._

### Add RSS Feed

```http
POST /api/add_rssfeed
```

**Request Body**

| Parameter  | Type     | Description                        |
|:-----------|:---------|:-----------------------------------|
| `URL`      | `string` | **Required**. RSS feed URL.        |
| `Publisher`| `string` | **Required**. Feed publisher name. |
| `Topic`    | `string` | **Required**. Feed topic.          |

**Description:** _Adds a new RSS feed._

### Update RSS Feed

```http
POST /api/update_rssfeed
```

**Request Body**

| Parameter  | Type     | Description                        |
|:-----------|:---------|:-----------------------------------|
| `URL`      | `string` | **Required**. RSS feed URL.        |
| `Publisher`| `string` | **Required**. Feed publisher name. |
| `Topic`    | `string` | **Required**. Feed topic.          |

**Description:** _Updates an existing RSS feed._

### Delete RSS Feed

```http
POST /api/delete_rssfeed
```

**Request Body**

| Parameter  | Type     | Description                        |
|:-----------|:---------|:-----------------------------------|
| `URL`      | `string` | **Required**. RSS feed URL.        |

**Description:** _Deletes an existing RSS feed._

### check RSS Feed

```http
POST /api/check_rssfeed
```

**Request Body**

| Parameter  | Type     | Description                        |
|:-----------|:---------|:-----------------------------------|
| `URL`      | `string` | **Required**. RSS feed URL.        |

**Description:** _Checks if an RSS feed is valid (still responsive, not deleted, xml format, etc.)._

---

# News Article API Documentation

### Get Articles

```http
GET /apiv2/articles
```

**Response Body**

| Parameter | Type     | Description                       |
|:----------|:---------|:----------------------------------|
|`articles` | `list`   | List of news articles.            |
|`status`   | `int`    | HTTP status code.                 |

**Description:** _Retrieves a list of all news articles._

### Get Total Articles (quantity)

```http
GET /api/articles/totalarticles
```

**Response Body**

| Parameter | Type     | Description                       |
|:----------|:---------|:----------------------------------|
|`totalArticles`| `int`| Total number of news articles.|

**Description:** _Retrieves the total number of news articles._