# UI Backend API Documentation

This code implements the backend for a User Interface (UI) that allows users to register and login, view, add, update,
and delete users, RSS feeds, and news articles. The API supports JSON requests and responses.

## Endpoints

---

# Authentication API Documentation

### Register User

**Endpoint:** `/api/register`

**Method:** `POST`

**Parameters:**

- `Email`: User's email address.
- `Password`: User's password.
- `Is_Admin`: Indicates if the user is an administrator. (default=False)
- `Username`: User's desired username.

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

**Response Body**

| Parameter | Type     | Description       |
|:----------|:---------|:------------------|
| `UID`     | `int`    | User ID.          |
| `Email`   | `string` | User's email.     |
| `token`   | `string` | JWT access token. |


**Description:** _Logs in an existing user and returns a JWT access token upon success._

---

# User API Documentation

### Get Users

**Endpoint:** `/api/users`

**Method:** `GET`

**Description:** _Retrieves a list of all users._

### Get Total Users (quantity)

**Endpoint:** `/api/users/totalusers`

**Method:** `GET`

**Description:** _Retrieves the total number of users._

### Add User

**Endpoint:** `/api/add_user`

**Method:** `POST`

**Parameters:**

- `Email`: User's email address.
- `Password`: User's password.
- `Is_Admin`: Indicates if the user is an administrator.
- `Username`: User's desired username.

**Description:** _Adds a new user._

### Update User

**Endpoint:** `/api/update_user/<id>`

**Method:** `POST`

**Parameters:**

- `Email`: User's email address.
- `Password`: User's password.
- `Is_Admin`: Indicates if the user is an administrator.
- `Username`: User's desired username.

**Description:** _Updates an existing user._

### Delete User

**Endpoint:** `/api/delete_user/<id>`

**Method:** `POST`

**Description:** _Deletes an existing user._

---

# RSS Feed API Documentation

### Get RSS Feeds

**Endpoint:** `/api/rssfeeds`

**Method:** `GET`

**Description:** _Retrieves a list of all RSS feeds._

### Get Total RSS Feeds (quantity)

**Endpoint:** `/api/rssfeeds/totalrssfeeds`

**Method:** `GET`

**Description:** _Retrieves the total number of RSS feeds._

### Add RSS Feed

**Endpoint:** `/api/add_rssfeed`

**Method:** `POST`

**Parameters:**

- `URL`: RSS feed URL.
- `Publisher`: Feed publisher name.
- `Topic`: Feed topic.

**Description:** _Adds a new RSS feed._

### Update RSS Feed

**Endpoint:** `/api/update_rssfeed`

**Method:** `POST`

**Parameters:**

- `URL`: RSS feed URL.
- `Publisher`: Feed publisher name.
- `Topic`: Feed topic.

**Description:** _Updates an existing RSS feed._

### Delete RSS Feed

**Endpoint:** `/api/delete_rssfeed`

**Method:** `POST`

**Description:** _Deletes an existing RSS feed._

### check RSS Feed

**Endpoint:** `/api/check_rssfeed`

**Method:** `POST`

**Parameters:**

- `URL`: RSS feed URL.

**Description:** _Checks if an RSS feed is valid (still responsive, not deleted, xml format, etc.)._

---

# News Article API Documentation

### Get Articles

**Endpoint:** `/api/articles`

**Method:** `GET`

**Description:** _Retrieves a list of all news articles._

### Get Total Articles (quantity)

**Endpoint:** `/api/articles/totalarticles`

**Method:** `GET`

**Description:** _Retrieves the total number of news articles._