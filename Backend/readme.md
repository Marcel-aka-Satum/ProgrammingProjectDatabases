# UI Backend API Documentation

This code implements the backend for a User Interface (UI) that allows users to register and login, view, add, update,
and delete users, RSS feeds, and news articles. The API supports JSON requests and responses.

## Endpoints

**Response Body**

| Parameter | Type    | Description                       |
|:----------|:--------|:----------------------------------|
| `message` | string | Success message or error message. |
| `status`  | int   | HTTP status code.                 |

---

# Authentication API

This is a simple API for user authentication.

## Routes

### `POST /api/register`

**Description:** _Registers a new user and returns a JWT access token upon success._

### Request Body

| Field             | Type    | Required | Description                                     |
|-------------------|---------|----------|-------------------------------------------------|
| `Email`           | string  | Yes      | The email address for the user account.         |
| `Password`        | string  | Yes      | The password for the user account.              |
| `ConfirmPassword` | string  | Yes      | The confirmation password for the user account. |
| `Is_Admin`        | boolean | No       | Whether the user should have admin privileges.  |
| `Username`        | string  | Yes      | The username for the user account.              |

### Response


| Status Code | Field     | Type   | Description                              |
|-------------|-----------|--------|------------------------------------------|
| 200         | `message` | string | A welcome message for the user.          |
|             | `token`   | string | A JWT authentication token for the user. |
| 500         | `message` | string | Message that describes what went wrong   |

On success, returns a `200` status code and a JSON response with the following fields:

### `POST /api/login`

**Description:** _Logs in an existing user and returns a JWT access token upon success._

### Request Body

| Field      | Type   | Required | Description                             |
|------------|--------|----------|-----------------------------------------|
| `Email`    | string | Yes      | The email address for the user account. |
| `Password` | string | Yes      | The password for the user account.      |

### Response

On success, returns a `200` status code and a JSON response with the following fields:

| Field      | Type    | Description                                      |
|------------|---------|--------------------------------------------------|
| `message`  | string  | A welcome back message for the user.             |
| `UID`      | string  | The user ID for the logged-in user.              |
| `Email`    | string  | The email address for the logged-in user.        |
| `token`    | string  | A JWT authentication token for the user.         |
| `Username` | string  | The username for the logged-in user.             |
| `isAdmin`  | boolean | Whether the logged-in user has admin privileges. |

On failure, returns a `401` status code and a JSON response with a `message` field describing the error.

### `POST /api/verify_password`

**Description:** _Verifies the password for an existing user account._

### Request Body

| Field             | Type   | Required | Description                                     |
|-------------------|--------|----------|-------------------------------------------------|
| `Email`           | string | Yes      | The email address for the user account.         |
| `OldPassword`     | string | Yes      | The old password for the user account.          |
| `NewPassword`     | string | Yes      | The new password for the user account.          |
| `ConfirmPassword` | string | Yes      | The confirmation password for the user account. |

### Response

| Status Code | Field     | Type   | Description                                     |
|-------------|-----------|--------|-------------------------------------------------|
| 200         | `message` | string | message password has been changed successfully. |
| 401         | `message` | string | Message that describes what went wrong          |

## Security

This API uses JWT authentication to secure user accounts.

To access any of the routes, a valid JWT token must be provided in the `Authorization` header of the HTTP request.

To obtain a JWT token, use the `/api/register` or `/api/login` endpoints.

## Dependencies

This API was built using Python and the Flask web framework. It also relies on the following dependencies:

- `bcrypt` for password hashing
- `cross_origin` for handling CORS requests
- `jwt` for JWT

# User API Documentation

### `GET /api/users`

**Description:** _Get a list of all users in the database_

### Response

| Status Code | field           | type | Description                                          |
|-------------|-----------------|------|------------------------------------------------------|
| 200         | `User objects`  | list | A JSON array of user objects containing user details |
| 500         | `None`          | /    | An error occurred while processing the request       |

#### Response Body Details

Each user object in the response body contains the following fields:

| Field | Data Type | Description                            |
|-----------|-----------|----------------------------------------|
| `id`        | integer   | The unique identifier for the user     |
| `username`  | string    | The username of the user               |
| `email`     | string    | The email address of the user          |
| `password`  | string    | The password hash of the user          |
| `is_admin`  | boolean   | Indicates whether the user is an admin |

### `GET /api/users/totalusers`

**Description:** _Get the total number of users in the database_

### Response

| Status Code | field        | type | Description                                                        |
|-------------|--------------|------|--------------------------------------------------------------------|
| 200         | `totalUsers` | int  | A JSON object containing the total number of users in the database |
| 500         | `None`       | /    | An error occurred while processing the request                     |

### `GET /api/visitor`

**Description:** _Generate a unique cookie and add a new user_

### Response

| Status Code | field    | type   | Description                                                            |
|-------------|----------|--------|------------------------------------------------------------------------|
| 200         | `Cookie` | string | A JSON string containing a unique cookie value used for tracking users |
| 500         | `None`   | /      | An error occurred while processing the request                         |

#### Response Body Details

The response body contains a JSON string with a unique cookie value used for tracking users.

### `POST /api/user`

**Description:** _Add a new user to the database_

### Request Body

| Field | Data Type | Required | Description                                                 |
|-----------|-----------|----------|-------------------------------------------------------------|
| `Username`  | string    | Yes      | The username of the new user                                |
| `Email`     | string    | Yes      | The email address of the user                               |
| `Password`  | string    | Yes      | The password of the new user                                |
| `Is_Admin`  | boolean   | No       | Indicates whether the user is an admin (default is `false`) |

### Response

| Status Code | field     | type     | Description                                                           |
|-------------|-----------|----------|-----------------------------------------------------------------------|
| 200         | `message` | JSON obj | A JSON object indicating that the user was added successfully         |
| 401         | `message` | JSON obj | A JSON object indicating that the request was unauthorized or invalid |
| 500         | `message` | JSON obj | JSON object indicating that an error occurred while processing        |

### `POST /api/user/<id>`

**Description:** _Update a user of the database_

### Request Body

| Parameter | Type   | Description                                           |
|-----------|--------|-------------------------------------------------------|
| `id`        | string | The ID of the user to update                          |
| `Username`  | string | The new username for the user (optional)              |
| `Email`     | string | The new email for the user (optional)                 |
| `Password`  | string | The new password for the user (optional)              |
| `Is_Admin`  | bool   | Whether or not the user should be an admin (optional) |

### Response

| Status Code | field     | type   | Description                                    |
|-------------|-----------|--------|------------------------------------------------|
| 200         | `message` | string | The specified user is successfully updated     |
| 401         | `message` | string | There was an error updating the user           |
| 404         | `message` | string | The specified user was not found in the system |

### `POST /api/user/<id>`

**Description:** _Delete a user of the database_

### Request Body

| Parameter | Type   | Description                  |
|-----------|--------|------------------------------|
| `id`        | string | The ID of the user to delete |

### Response

| Status Code | field     | type   | Description                                    |
|-------------|-----------|--------|------------------------------------------------|
| 200         | `message` | string | The specified user is successfully deleted     |
| 404         | `message` | string | The specified user was not found in the system |

# RSS Feed API Documentation

### `GET /api/rssfeeds`

**Description:** _This endpoint returns a list of all the RSS feeds that have been added to the database in JSON
format._

### Response

| Status Code | Field     | Type             | Description                                                                    |
|-------------|-----------|------------------|--------------------------------------------------------------------------------|
| 200         | `RSS feeds` | Array of objects | An array of objects, where each object represents an RSS feed in the database. |

Each object has the following fields: 

| Field       | Type   | Description                               |
|-------------|--------|-------------------------------------------|
| `URL`       | String | The URL of the RSS feed                   |
| `Publisher` | String | The name of the publisher of the RSS feed |
| `Topic`     | String | The topic of the RSS feed                 |

### `GET /api/rssfeeds/totalrssfeeds`

**Description:** _This endpoint returns the total number of RSS feeds that have been added to the database._

### Response

| Status Code | Field           | Type    | Description                                   |
|-------------|-----------------|---------|-----------------------------------------------|
| 200         | `totalRSSFeeds` | Integer | The total number of RSS feeds in the database |

### `POST /api/rssfeeds`

**Description:** _This endpoint allows adding a new RSS feed to the database. It expects a JSON object containing the
`URL`, `Publisher`, and `Topic` of the RSS feed. The endpoint first validates the RSS feed URL by checking that it can
be accessed and contains valid RSS XML. If the validation is successful, the endpoint attempts to add the new RSS feed
to the database._

### Request Body

| Field       | Type   | Description                               |
|-------------|--------|-------------------------------------------|
| `URL`       | String | The URL of the RSS feed                   |
| `Publisher` | String | The name of the publisher of the RSS feed |
| `Topic`     | String | The topic of the RSS feed                 |

### Response

| Status Code | Field     | Type   | Description                                               |
|-------------|-----------|--------|-----------------------------------------------------------|
| 200         | `message` | String | A message that adding rss was successful                  |
| 401         | `message` | String | A message that given was by the db when trying to add rss |
| 500         | `message` | String | A message that said that something went wrong             |

### `PATCH /api/rssfeeds`

**Description:** _This endpoint allows updating an existing RSS feed in the database. It expects a JSON object
containing
the `URL`, `Publisher`, and `Topic` of the RSS feed to be updated. The endpoint attempts to update the corresponding
RSS feed in the database._

### Request Body

| Field       | Type   | Description                               |
|-------------|--------|-------------------------------------------|
| `URL`       | String | The URL of the RSS feed                   |
| `Publisher` | String | The name of the publisher of the RSS feed |
| `Topic`     | String | The topic of the RSS feed                 |

### Response

| Status Code | Field     | Type   | Description                                                  |
|-------------|-----------|--------|--------------------------------------------------------------|
| 200         | `message` | String | A message that updating rss was successful                   |
| 401         | `message` | String | A message that was given by the db when trying to update rss |

### `DELETE /api/rssfeeds`

**Description:** _This endpoint allows deleting an existing RSS feed from the database. It expects a JSON object
containing the `URL` of the RSS feed to be deleted. The endpoint attempts to delete the corresponding RSS feed from
the database._

### Request Body

| Field | Type   | Description             |
|-------|--------|-------------------------|
| `URL` | String | The URL of the RSS feed |

### Response

| Status Code | Field     | Type   | Description                                                  |
|-------------|-----------|--------|--------------------------------------------------------------|
| 200         | `message` | String | A message that deleting rss was successful                   |
| 401         | `message` | String | A message that was given by the db when trying to delete rss |

### `POST /api/check_rssfeed`

**Description:** _This API endpoint checks the validity of an RSS feed._

### Request Body

| Parameter | Type   | Required | Description                             |
|-----------|--------|----------|-----------------------------------------|
| `URL`       | string | Yes      | The URL of the RSS feed to be validated |

### Response

The API returns a JSON object with a message and a status code.

| Status Code | Field     | Type   | Description                                                         |
|-------------|-----------|--------|---------------------------------------------------------------------|
| 200         | `message` | string | The RSS feed is valid                                               |
| 401         | `message` | string | The URL provided does not correspond to a valid RSS feed            |
| 500         | `message` | string | There was an error validating the RSS feed. Please try again later. |

# News Article API Documentation

### `GET /api/articles`

**Description:** _This endpoint retrieves a list of all news articles currently stored in the database._

### Response

| Status Code | Field         | Type  | Description                                            |
|-------------|---------------|-------|--------------------------------------------------------|
| 200         | `articles_list` | Array | A list of dictionaries representing each news article. |

### `GET /api/articlesDict`

**Description:** _This endpoint retrieves a dictionary containing all news articles currently stored in the database._

### Response

| Status Code | Field         | Type       | Description                                                                                                         |
|-------------|---------------|------------|---------------------------------------------------------------------------------------------------------------------|
| 200         | `articles_dict` | Dictionary | A dictionary with the keys being the article URLs and the values being dictionaries representing each news article. |

### `POST /api/article`

**Description:** _This endpoint retrieves a specific news article by its URL._

### Request Body

| Parameter   | Type   | Description                                  |
|-------------|--------|----------------------------------------------|
| `article_url` | String | The URL of the news article to be retrieved. |

### Response

| Status Code | Field   | Type       | Description                                 |
|-------------|---------|------------|---------------------------------------------|
| 200         | `article` | Dictionary | A dictionary representing the news article. |

### `GET /api/articles/totalarticles`

**Description:** _This endpoint retrieves the total number of news articles currently stored in the database._

### Response

| Status Code | Field         | Type    | Description                                        |
|-------------|---------------|---------|----------------------------------------------------|
| 200         | `totalArticles` | Integer | The total number of news articles in the database. |

### `GET /api/articles/genres`

**Description:** _This endpoint retrieves a list of all topics (genres) of news articles currently stored in the
database._

### Response

| Status Code | Field  | Type  | Description                                                                              |
|-------------|--------|-------|------------------------------------------------------------------------------------------|
| 200         | `topics` | Array | A list of strings representing all the topics (genres) of news articles in the database. |

### `POST /api/articles/genre`

**Description:** _This endpoint retrieves all news articles for a specific topic (genre)._

### Request Body

| Parameter | Type   | Description                                         |
|-----------|--------|-----------------------------------------------------|
| `genre`     | String | The topic (genre) of news articles to be retrieved. |

### Response

| Status Code | Field    | Type  | Description                                                                            |
|-------------|----------|-------|----------------------------------------------------------------------------------------|
| 200         | `articles` | Array | A list of dictionaries representing each news article for the specified topic (genre). |

### `POST /api/articles/recommended`

**Description:** _This endpoint retrieves the recommended articles for a specific cookie._

### Request Body

| Parameter | Type   | Description                                                   |
|-----------|--------|---------------------------------------------------------------|
| `cookie`    | String | The cookie for which the news articles needs to be retrieved. |

### Response

| Status Code | Field    | Type  | Description                        |
|-------------|----------|-------|------------------------------------|
| 200         | `articles` | Array | A list of articles for recommended |


---

## Favorite Articles API Documentation

This API provides endpoints for adding, deleting, and retrieving favorite articles for a given user.

### `GET /api/favorites`

**Description:** _This endpoint retrieves a list of favorite articles for a given user._

### Response

The response will be in JSON format with the following fields:

| Status Code | Field     | Type | Description                 |
|-------------|-----------|------|-----------------------------|
| 200         | `favorites` | list | A list of favorite articles |

### `POST /api/favorites`

**Description:** _This endpoint adds a new favorite article for a given user._

### Request Body

| Field  | Data Type | Description            |
|------------|-----------|------------------------|
| `UID`        | integer   | The ID of the user     |
| `article_url` | string    | The URL of the article |

#### Response

The response will be in JSON format with the following fields:

| Status Code | Field     | Type   | Description                                          |
|-------------|-----------|--------|------------------------------------------------------|
| 200         | `message` | string | A message indicating adding was successful           |
| 401         | `message` | string | Message from db what went wrong when adding favorite |


### `DELETE /api/favorites`

**Description:** _This endpoint deletes a favorite articles for a given user._

### Request Body

| Field  | Data Type | Description            |
|------------|-----------|------------------------|
| `UID`       | integer   | The ID of the user     |
| `article_url` | string    | The URL of the article |

### Response

The response will be in JSON format with the following fields:

| Status Code | Field     | Type   | Description                                            |
|-------------|-----------|--------|--------------------------------------------------------|
| 200         | `message` | string | A message indicating deleting favorite was successful  |
| 401         | `message` | string | Message from db what went wrong when deleting favorite |

### `DELETE /api/all_favorites`

**Description:** _This endpoint deletes all favorite articles for a given user._

### Request Body

| Field | Data Type | Description        |
|-----------|-----------|--------------------|
| `UID`       | integer   | The ID of the user |

### Response

The response will be in JSON format with the following fields:

| Status Code | Field     | Type   | Description                                                 |
|-------------|-----------|--------|-------------------------------------------------------------|
| 200         | `message` | string | A message indicating deleting all favorites was successful  |
| 401         | `message` | string | Message from db what went wrong when deleting all favorites |

## API Visitor/Topics/Clicked Documentation

### `GET /api/visitors`

**Description:** _This endpoint retrieves a list of visitors from the database. The response includes a JSON object
containing a list of visitors._

### Response

The response includes a JSON object containing a list of visitors.

| Status Code | Field    | Type  | Description                 |
|-------------|----------|-------|-----------------------------|
| 200         | `visitors` | Array | An array of visitor objects |

Each visitor object has the following fields:

| Field      | Type    | Description                                    |
|------------|---------|------------------------------------------------|
| `id`         | Integer | The unique ID of the visitor                   |
| `name`       | String  | The name of the visitor                        |
| `email`      | String  | The email address of the visitor               |
| `created_at` | String  | The date and time when the visitor was created |

### `GET /api/topics`

**Description:** _This endpoint retrieves a list of topics from the database. The response includes a JSON object
containing a list of topics._

### Response

The response includes a JSON object containing a list of topics.

| Status Code | Field  | Type  | Description               |
|-------------|--------|-------|---------------------------|
| 200         | `topics` | Array | An array of topic objects |

Each topic object has the following fields:

| Field      | Type    | Description                                  |
|------------|---------|----------------------------------------------|
| `id`         | Integer | The unique ID of the topic                   |
| `name`       | String  | The name of the topic                        |
| `created_at` | String  | The date and time when the topic was created |

### `POST /api/clicked`

**Description:** _This endpoint adds a new clicked topic for a given visitor. The response includes a JSON object
containing a message and a status code._

### Request Body

| Field  | Data Type | Description             |
|------------|-----------|-------------------------|
| `Article_URL` | String    | The URL of the article  |
| `Cookie`     | String    | The Cookie of the guest |

### Response

The response includes a JSON object containing a message and a status code.

| Status Code | Field     | Type   | Description                                                             |
|-------------|-----------|--------|-------------------------------------------------------------------------|
| 200         | `message` | string | A message that click on article for given cookie was added successfully |
| 401         | `message` | string | Message from db what went wrong when adding click                       |


# Clusters API Documentation

### `GET /api/clusters`

**Description:** _This endpoint retrieves a list of all the clusters sorted per genre of news articles currently stored in the database._

### Response

| Status Code | Field         | Type  | Description                                                 |
|-------------|---------------|-------|-------------------------------------------------------------|
| 200         | `all_clusters` | Array | A list of dictionaries where clusters are sorted per topic. |


### `POST /api/clustersGenre`

**Description:** _This endpoint retrieves all clusters of articles for a specific topic (genre)._

### Request Body

| Parameter | Type   | Description                                                     |
|-----------|--------|-----------------------------------------------------------------|
| `topic`     | String | The topic (genre) of clusters of news articles to be retrieved. |

### Response

| Status Code | Field        | Type  | Description                                                     |
|-------------|--------------|-------|-----------------------------------------------------------------|
| 200         | `all_clusters` | Array | A list of clusters of articles for the specified topic (genre). |


# Google Log in API Documentation

### `POST /api/google/login`

### Request Body

| Parameter | Type   | Description                                                        |
|-----------|--------|--------------------------------------------------------------------|
| `email`     | String | The email of the user to check if the user exists in the database. |

### Response

| Status Code | Field     | Type     | Description                                                   |
|-------------|-----------|----------|---------------------------------------------------------------|
| 200         | `message` | string   | A message that user is authorised/welcome back                |
|             | `info_user` | JSON obj | A JSON object that consists of all the data of the given user |
| 401         | `message` | string   | Message that the user does not exist                          |


Each info_user object has the following fields:

| Field    | Type    | Description                                     |
|----------|---------|-------------------------------------------------|
| `UID`      | Integer | The user ID                                     |
| `Email`    | String  | The email of the user (same as the given email) |
| `token`    | String  | The JWT                                         |
| `Username` | String  | The Username of the user                        |
| `isAdmin`  | Bool    | If the user is an admin or not                  |


# Other API Documentation

### Error Handler Endpoints

### `/errorhandler/404`

**Description:** _This endpoint is triggered when the user attempts to access a resource that does not exist on the
server. It returns an error page with a status code of 404._

| Method | Path              | Description                                                       |
|--------|-------------------|-------------------------------------------------------------------|
| GET    | /errorhandler/404 | Returns an error page indicating that the resource was not found. |

### `/errorhandler/500`

**Description:** _This endpoint is triggered when the server encounters an internal error. It returns an error page with
a status code of 500._

| Method | Path              | Description                                                                         |
|--------|-------------------|-------------------------------------------------------------------------------------|
| GET    | /errorhandler/500 | Returns an error page indicating that the server has encountered an internal error. |

### `/errorhandler/429`

**Description:** _This endpoint is triggered when the user attempts to access a resource too many times. It returns an
error page with a status code of 429._

| Method | Path              | Description                                                                                       |
|--------|-------------------|---------------------------------------------------------------------------------------------------|
| GET    | /errorhandler/429 | Returns an error page indicating that the user has attempted to access a resource too many times. |

### Settings Endpoints

### `PATCH /api/settings`

**Description:** _This endpoint allows the user to update a setting value in the database._

#### Request Body

| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| `setting`   | string | Yes      | The name of the setting to be updated.   |
| `value`     | string | Yes      | The new value for the setting to be set. |

#### Response Body

| Status Code | Field     | Type   | Description                                                     |
|-------------|-----------|--------|-----------------------------------------------------------------|
| 200         | `message`   | string | A message indicating the update of the settings was successful. |
| 401         | `message` | string | There is something wrong, an error occurred                     |

### `GET /api/settings`

**Description:** _This endpoint allows the user to retrieve all settings from the database._

### Response

| Status Code | Field    | Type   | Description                                                 |
|-------------|----------|--------|-------------------------------------------------------------|
| 200         | `settings` | object | An object containing all settings and their current values. |

# DB API Documentation

### `/db/rssfeeds`

**Description:** _Returns a list of RSS feeds that have been added to the database._

| Field  | Data Type | Description                                  |
|------------|-----------|----------------------------------------------|
| `id`         | Integer   | Unique identifier for the RSS feed.          |
| `url`        | String    | URL of the RSS feed.                         |
| `title`      | String    | Title of the RSS feed.                       |
| `description` | String    | Description of the RSS feed.                 |
| `date_added` | Date      | Date the RSS feed was added to the database. |

### `/db/newsarticles`

**Description:** _Returns a list of news articles that have been added to the database._

| Field     | Data Type | Description                                        |
|---------------|-----------|----------------------------------------------------|
| `id`           | Integer   | Unique identifier for the news article.            |
| `url`          | String    | URL of the news article.                           |
| `title`        | String    | Title of the news article.                         |
| `description`  | String    | Description of the news article.                   |
| `image_url`    | String    | URL of the image associated with the news article. |
| `source_name`  | String    | Name of the news source.                           |
| `source_url`    | String    | URL of the news source.                            |
| `published_date` | Date      | Date the news article was published.               |
| `date_added`    | Date      | Date the news article was added to the database.   |
| `genre`         | String    | Genre of the news article.                         |

### `/db/visitors`

**Description:** _Returns a list of visitors that have visited the website._

| Field   | Data Type | Description                           |
|-------------|-----------|---------------------------------------|
| `id`          | Integer   | Unique identifier for the visitor.    |
| `ip_address`  | String    | IP address of the visitor.            |
| `user_agent`  | String    | User agent of the visitor.            |
| `date_visited` | Date      | Date the visitor visited the website. |

### `/db/users`

**Description:** _Returns a list of users that have registered on the website._

| Field      | Data Type | Description                              |
|----------------|-----------|------------------------------------------|
| `id`             | Integer   | Unique identifier for the user.          |
| `username`       | String    | Username of the user.                    |
| `email`          | String    | Email of the user.                       |
| `password`       | String    | Password of the user.                    |
| `date_registered` | Date      | Date the user registered on the website. |

### `/db/cookies`

**Description:** _Returns a list of cookies that have been stored on the website._

| Field   | Data Type | Description                           |
|-------------|-----------|---------------------------------------|
| `id`          | Integer   | Unique identifier for the cookie.     |
| `name`        | String    | Name of the cookie.                   |
| `value`       | String    | Value of the cookie.                  |
| `date_created` | Date      | Date the cookie was created.          |
| `date_expired` | Date      | Date the cookie will expire.          |
| `user_id`     | Integer   | ID of the user the cookie belongs to. |

### `/db/hasclicked`

**Description:** _Returns a list of articles that have been clicked by users._

| Field   | Data Type | Description                                |
|-------------|-----------|--------------------------------------------|
| `id`          | Integer   | Unique identifier for the clicked article. |
| `article_id`  | Integer   | ID of the article that was clicked.        |
| `user_id`     | Integer   | ID of the user who clicked the article.    |
| `date_clicked` | Date      | Date the article was clicked.              |

### `/db/favored`

**Description:** _Returns a list of articles that have been favored by users._

| Field   | Data Type | Description                                |
|-------------|-----------|--------------------------------------------|
| `id`          | Integer   | Unique identifier for the favored article. |
| `article_id`  | Integer   | ID of the article that was favored.        |
| `user_id`     | Integer   | ID of the user who favored the article.    |
| `date_favored` | Date      | Date the article was favored.              |

### `/db/settings`

**Description:** _Returns the current website settings._

| Field | Data Type | Description                        |
|-------|-----------|------------------------------------|
| `id`    | Integer   | Unique identifier for the setting. |
| `name`  | String    | Name of the setting.               |
| `value` | String    | Current value of the setting.      |

### `/db/backup`

**Description:** _Returns a backup of the entire database._

| Field  | Data Type | Description                                          |
|------------|-----------|------------------------------------------------------|
| `backup_file` | Binary    | A binary file containing the entire database backup. |

### `/db/topics`

**Description:** _Returns a list of topics that have been added to the database._

| Field | Data Type | Description                               |
|-----------|-----------|-------------------------------------------|
| `id`        | Integer   | Unique identifier for the topic.          |
| `name`      | String    | Name of the topic.                        |
| `date_added` | Date      | Date the topic was added to the database. |

### `/db/articlesgenres`

Returns a dictionary of articles grouped by genre.

| Field | Data Type | Description                                                                                                                                          |
|-----------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `genre`     | String    | The name of the genre.                                                                                                                               |
| `articles`  | List      | A list of news articles belonging to the genre. Each news article is represented as a dictionary with the same field names as in `/db/newsarticles`. |
