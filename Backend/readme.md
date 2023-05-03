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

# Authentication API

This is a simple API for user authentication.

## Routes

### `POST /api/register`

**Description:** _Registers a new user and returns a JWT access token upon success._


### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `Email` | string | Yes | The email address for the user account. |
| `Password` | string | Yes | The password for the user account. |
| `ConfirmPassword` | string | Yes | The confirmation password for the user account. |
| `Is_Admin` | boolean | No | Whether the user should have admin privileges. |
| `Username` | string | Yes | The username for the user account. |

#### Response

On success, returns a `200` status code and a JSON response with the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `message` | string | A welcome message for the user. |
| `token` | string | A JWT authentication token for the user. |

On failure, returns a `401` status code and a JSON response with a `message` field describing the error.

### `POST /api/login`

**Description:** _Logs in an existing user and returns a JWT access token upon success._

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `Email` | string | Yes | The email address for the user account. |
| `Password` | string | Yes | The password for the user account. |

#### Response

On success, returns a `200` status code and a JSON response with the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `message` | string | A welcome back message for the user. |
| `UID` | string | The user ID for the logged-in user. |
| `Email` | string | The email address for the logged-in user. |
| `token` | string | A JWT authentication token for the user. |
| `Username` | string | The username for the logged-in user. |
| `isAdmin` | boolean | Whether the logged-in user has admin privileges. |

On failure, returns a `401` status code and a JSON response with a `message` field describing the error.

### `POST /api/change_password`

**Description:** _Changes the password for an existing user account._

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `Email` | string | Yes | The email address for the user account. |
| `OldPassword` | string | Yes | The old password for the user account. |
| `NewPassword` | string | Yes | The new password for the user account. |
| `ConfirmPassword` | string | Yes | The confirmation password for the user account. |

#### Response

On success, returns a `200` status code and a JSON response with a `message` field indicating that the password has been changed.

On failure, returns a `401` status code and a JSON response with a `message` field describing the error.

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

| Status Code | Response Body          | Description                                                        |
| ----------- | ----------------------| ------------------------------------------------------------------ |
| 200         | List of user objects   | A JSON array of user objects containing user details                |
| 500         | None                   | An error occurred while processing the request                      |

#### Response Body Details

Each user object in the response body contains the following fields:

| Field Name | Data Type | Description                               |
| ---------- | --------- | ----------------------------------------- |
| id         | integer   | The unique identifier for the user        |
| username   | string    | The username of the user                  |
| email      | string    | The email address of the user             |
| password   | string    | The password hash of the user             |
| is_admin   | boolean   | Indicates whether the user is an admin     |

### `GET /api/users/totalusers`

**Description:** _Get the total number of users in the database_

### Response

| Status Code | Response Body          | Description                                                     |
| ----------- | ----------------------| --------------------------------------------------------------- |
| 200         | `{"totalUsers": <int>}`| A JSON object containing the total number of users in the database |
| 500         | None                   | An error occurred while processing the request                   |

### `GET /api/add_Visitor` 

**Description:** _Generate a unique cookie and add a new user_

### Response

| Status Code | Response Body  | Description                                                             |
| ----------- | --------------| ----------------------------------------------------------------------- |
| 200         | Cookie string  | A JSON string containing a unique cookie value used for tracking users |
| 500         | None           | An error occurred while processing the request                           |

#### Response Body Details

The response body contains a JSON string with a unique cookie value used for tracking users.

### `POST /api/add_user`

**Description:** _Add a new user to the database_


### Request Body

| Field Name | Data Type | Required | Description                    |
| ---------- | --------- | -------- | ------------------------------ |
| Username   | string    | Yes      | The username of the new user   |
| Email      | string    | Yes      | The email address of the user  |
| Password   | string    | Yes      | The password of the new user   |
| Is_Admin   | boolean   | No       | Indicates whether the user is an admin (default is `false`) |

### Response

| Status Code | Response Body                                        | Description                                                           |
|-------------|------------------------------------------------------|-----------------------------------------------------------------------|
| 200         | `{"message": <string>, "status": 200}`               | A JSON object indicating that the user was added successfully         |
| 401         | `{"message": <string>, "status": 401}`               | A JSON object indicating that the request was unauthorized or invalid |
| 500         | `{"message": "Something went wrong", "status": 500}` | An error occurred while processing                                    |



### `POST /api/update_user/<id>`

**Description:** _Update a user of the database_

### Request Body

| Parameter   | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| id          | string | The ID of the user to update                     |
| Username    | string | The new username for the user (optional)          |
| Email       | string | The new email for the user (optional)             |
| Password    | string | The new password for the user (optional)          |
| Is_Admin    | bool   | Whether or not the user should be an admin (optional) |

### Response

| HTTP Code | Response body                                  | Description                                    |
|-----------|------------------------------------------------|------------------------------------------------|
| 200       | {"message": "USER (id) Updated Successfully"} | The user was successfully updated              |
| 401       | {"message": message}                           | There was an error updating the user           |
| 404       | {"message": "USER (id) Not Found"}             | The specified user was not found in the system |

### `POST /api/delete_user/<id>`

**Description:** _Delete a user of the database_

### Request Body

| Parameter | Type   | Description                           |
|-----------|--------|---------------------------------------|
| id        | string | The ID of the user to delete           |

### Response

| HTTP Code | Response body                                   | Description                            |
|-----------|-------------------------------------------------|----------------------------------------|
| 200       | {"message": "USER (id) Deleted Successfully"}   | The user was successfully deleted      |
| 404       | {"message": "USER (id) Not Found"}              | The specified user was not found       |


# RSS Feed API Documentation

### `GET /api/rssfeeds`
**Description:** _This endpoint returns a list of all the RSS feeds that have been added to the database in JSON format._

### Response

| Field | Type | Description |
| --- | --- | --- |
| RSS feeds | Array of objects | An array of objects, where each object represents an RSS feed in the database.|

Each object has the following fields: |

| Field | Type | Description |
| --- | --- | --- |
| `URL` | String | The URL of the RSS feed |
| `Publisher` | String | The name of the publisher of the RSS feed |
| `Topic` | String | The topic of the RSS feed |

### `GET /api/rssfeeds/totalrssfeeds`
**Description:** _This endpoint returns the total number of RSS feeds that have been added to the database._

### Response

| Field | Type | Description |
| --- | --- | --- |
| `totalRSSFeeds` | Integer | The total number of RSS feeds in the database |

### `POST /api/add_rssfeed`
**Description:** _This endpoint allows adding a new RSS feed to the database. It expects a JSON object containing the
`URL`, `Publisher`, and `Topic` of the RSS feed. The endpoint first validates the RSS feed URL by checking that it can 
be accessed and contains valid RSS XML. If the validation is successful, the endpoint attempts to add the new RSS feed 
to the database._

### Request Body

| Field | Type | Description |
| --- | --- | --- |
| `URL` | String | The URL of the RSS feed |
| `Publisher` | String | The name of the publisher of the RSS feed |
| `Topic` | String | The topic of the RSS feed |

### Response

| Field | Type | Description |
| --- | --- | --- |
| `message` | String | A message describing the result of the operation |
| `status` | Integer | The HTTP status code indicating the result of the operation |

### `POST /api/update_rssfeed`

**Description:** _This endpoint allows updating an existing RSS feed in the database. It expects a JSON object containing 
the `URL`, `Publisher`, and `Topic` of the RSS feed to be updated. The endpoint attempts to update the corresponding 
RSS feed in the database._

### Request Body

| Field | Type | Description |
| --- | --- | --- |
| `URL` | String | The URL of the RSS feed |
| `Publisher` | String | The name of the publisher of the RSS feed |
| `Topic` | String | The topic of the RSS feed |

### Response

| Field | Type | Description |
| --- | --- | --- |
| `message` | String | A message describing the result of the operation |
| `status` | Integer | The HTTP status code indicating the result of the operation |

### `POST /api/delete_rssfeed`

**Description:** _This endpoint allows deleting an existing RSS feed from the database. It expects a JSON object 
containing the `URL` of the RSS feed to be deleted. The endpoint attempts to delete the corresponding RSS feed from 
the database._

### Request Body

| Field | Type | Description |
| --- | --- | --- |
| `URL` | String | The URL of the RSS feed |

### Response

| Field | Type | Description |
| --- | --- | --- |
| `message` | String | A message describing the result of the operation |
| `status` | Integer | The HTTP status code indicating the result of the operation |


### `POST /api/check_rssfeed`


**Description:** _This API endpoint checks the validity of an RSS feed._

### Request Body

| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| URL       | string | Yes      | The URL of the RSS feed to be validated |

## Response

The API returns a JSON object with a message and a status code.

| Status Code | Message              | Description                                                         |
|-------------|----------------------|---------------------------------------------------------------------|
| 200         | "RSS Feed is valid" | The RSS feed is valid                                               |
| 401         | "Invalid RSS feed URL" | The URL provided does not correspond to a valid RSS feed      |
| 500         | "Something went wrong" | There was an error validating the RSS feed. Please try again later. |

# News Article API Documentation

### `GET /api/articles`

**Description:** _This endpoint retrieves a list of all news articles currently stored in the database._


## Response

| Response | Type | Description |
| --- | --- | --- |
| articles_list | Array | A list of dictionaries representing each news article. |

### `GET /api/articlesDict`

**Description:** _This endpoint retrieves a dictionary containing all news articles currently stored in the database._


## Response

| Response | Type | Description |
| --- | --- | --- |
| articles_dict | Dictionary | A dictionary with the keys being the article URLs and the values being dictionaries representing each news article. |

### `POST /api/get_article`

**Description:** _This endpoint retrieves a specific news article by its URL._


### Request Body
| Parameter | Type | Description |
| --- | --- | --- |
| article_url | String | The URL of the news article to be retrieved. |

## Response

| Response | Type | Description |
| --- | --- | --- |
| article | Dictionary | A dictionary representing the news article. |

### `GET /api/articles/totalarticles`

**Description:** _This endpoint retrieves the total number of news articles currently stored in the database._

## Response

| Response | Type | Description |
| --- | --- | --- |
| totalArticles | Integer | The total number of news articles in the database. |

### `GET /api/articles/genres`

**Description:** _This endpoint retrieves a list of all topics (genres) of news articles currently stored in the database._


## Response

| Response | Type | Description |
| --- | --- | --- |
| topics | Array | A list of strings representing all the topics (genres) of news articles in the database. |

### `POST /api/articles/genre`

**Description:** _This endpoint retrieves all news articles for a specific topic (genre)._

### Request Body

| Parameter | Type | Description |
| --- | --- | --- |
| genre | String | The topic (genre) of news articles to be retrieved. |

## Response

| Response | Type | Description |
| --- | --- | --- |
| articles | Array | A list of dictionaries representing each news article for the specified topic (genre). |

---

## Favorite Articles API Documentation

This API provides endpoints for adding, deleting, and retrieving favorite articles for a given user.

### `GET /api/favorites`

**Description:** _This endpoint retrieves a list of favorite articles for a given user._

### Response

The response will be in JSON format with the following fields:

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| favorites  | list      | A list of favorite articles |

### `POST /api/addFavored`

**Description:** _This endpoint adds a new favorite article for a given user._

### Request Body

| Field Name   | Data Type | Description             |
|--------------|-----------|-------------------------|
| UID          | integer   | The ID of the user      |
| article_url  | string    | The URL of the article  |

#### Response

The response will be in JSON format with the following fields:

| Field Name | Data Type | Description                                      |
|------------|-----------|--------------------------------------------------|
| message    | string    | A message indicating the status of the operation |
| status     | integer   | An HTTP status code                               |

### `POST /api/delete_favored`

**Description:** _This endpoint deletes a favorite article for a given user._

### Request Body

| Field Name   | Data Type | Description             |
|--------------|-----------|-------------------------|
| UID          | integer   | The ID of the user      |
| article_url  | string    | The URL of the article  |


#### Response

The response will be in JSON format with the following fields:

| Field Name | Data Type | Description                                      |
|------------|-----------|--------------------------------------------------|
| message    | string    | A message indicating the status of the operation |
| status     | integer   | An HTTP status code                               |


### `POST /api/delete_all_favored`

**Description:** _This endpoint deletes all favorite articles for a given user._

### Request Body

| Field Name | Data Type | Description    |
|------------|-----------|----------------|
| UID        | integer   | The ID of the user |

### Response

The response will be in JSON format with the following fields:

| Field Name | Data Type | Description                                      |
|------------|-----------|--------------------------------------------------|
| message    | string    | A message indicating the status of the operation |
| status     | integer   | An HTTP status code                               |


## API Visitor/Topics Documentation

### `GET /api/visitors`

**Description:** _This endpoint retrieves a list of visitors from the database. The response includes a JSON object containing a list of visitors._

### Response

The response includes a JSON object containing a list of visitors.

| Field | Type   | Description            |
|-------|--------|------------------------|
| visitors | Array | An array of visitor objects |

Each visitor object has the following fields:

| Field      | Type   | Description                  |
|------------|--------|------------------------------|
| id         | Integer  | The unique ID of the visitor |
| name       | String  | The name of the visitor       |
| email      | String  | The email address of the visitor |
| created_at | String  | The date and time when the visitor was created |


### `GET /api/topics`

**Description:** _This endpoint retrieves a list of topics from the database. The response includes a JSON object containing a list of topics._

### Response

The response includes a JSON object containing a list of topics.

| Field | Type   | Description            |
|-------|--------|------------------------|
| topics | Array | An array of topic objects |

Each topic object has the following fields:

| Field      | Type   | Description                  |
|------------|--------|------------------------------|
| id         | Integer  | The unique ID of the topic |
| name       | String  | The name of the topic       |
| created_at | String  | The date and time when the topic was created |

# Other API Documentation

### Error Handler Endpoints

### `/errorhandler/404`

**Description:** _This endpoint is triggered when the user attempts to access a resource that does not exist on the server. It returns an error page with a status code of 404._

| Method | Path           | Description                                              |
|--------|----------------|----------------------------------------------------------|
| GET    | /errorhandler/404 | Returns an error page indicating that the resource was not found. |

### `/errorhandler/500`

**Description:** _This endpoint is triggered when the server encounters an internal error. It returns an error page with a status code of 500._

| Method | Path           | Description                                              |
|--------|----------------|----------------------------------------------------------|
| GET    | /errorhandler/500 | Returns an error page indicating that the server has encountered an internal error. |

### `/errorhandler/429`

**Description:** _This endpoint is triggered when the user attempts to access a resource too many times. It returns an error page with a status code of 429._

| Method | Path           | Description                                              |
|--------|----------------|----------------------------------------------------------|
| GET    | /errorhandler/429 | Returns an error page indicating that the user has attempted to access a resource too many times. |


### Settings Endpoints

### `/api/update_settings`

**Description:** _This endpoint allows the user to update a setting value in the database._

##### Request Body

| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| setting   | string | Yes      | The name of the setting to be updated.   |
| value     | string | Yes      | The new value for the setting to be set. |

##### Response Body

| Parameter | Type   | Description                               |
|-----------|--------|-------------------------------------------|
| message   | string | A message indicating the status of the update. |
| status    | int    | The status code for the update.           |


### `/api/settings`

**Description:** _This endpoint allows the user to retrieve all settings from the database._

### Response

| Parameter | Type   | Description                               |
|-----------|--------|-------------------------------------------|
| settings  | object | An object containing all settings and their current values. |


# DB API Documentation


### `/db/rssfeeds`

**Description:** _Returns a list of RSS feeds that have been added to the database._

| Field Name | Data Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier for the RSS feed. |
| url | String | URL of the RSS feed. |
| title | String | Title of the RSS feed. |
| description | String | Description of the RSS feed. |
| date_added | Date | Date the RSS feed was added to the database. |


### `/db/newsarticles`

**Description:** _Returns a list of news articles that have been added to the database._

| Field Name | Data Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier for the news article. |
| url | String | URL of the news article. |
| title | String | Title of the news article. |
| description | String | Description of the news article. |
| image_url | String | URL of the image associated with the news article. |
| source_name | String | Name of the news source. |
| source_url | String | URL of the news source. |
| published_date | Date | Date the news article was published. |
| date_added | Date | Date the news article was added to the database. |
| genre | String | Genre of the news article. |


### `/db/visitors`

**Description:** _Returns a list of visitors that have visited the website._

| Field Name | Data Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier for the visitor. |
| ip_address | String | IP address of the visitor. |
| user_agent | String | User agent of the visitor. |
| date_visited | Date | Date the visitor visited the website. |


### `/db/users`

**Description:** _Returns a list of users that have registered on the website._

| Field Name | Data Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier for the user. |
| username | String | Username of the user. |
| email | String | Email of the user. |
| password | String | Password of the user. |
| date_registered | Date | Date the user registered on the website. |


### `/db/cookies`

**Description:** _Returns a list of cookies that have been stored on the website._

| Field Name | Data Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier for the cookie. |
| name | String | Name of the cookie. |
| value | String | Value of the cookie. |
| date_created | Date | Date the cookie was created. |
| date_expired | Date | Date the cookie will expire. |
| user_id | Integer | ID of the user the cookie belongs to. |


### `/db/hasclicked`

**Description:** _Returns a list of articles that have been clicked by users._

| Field Name | Data Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier for the clicked article. |
| article_id | Integer | ID of the article that was clicked. |
| user_id | Integer | ID of the user who clicked the article. |
| date_clicked | Date | Date the article was clicked. |


### `/db/favored`

**Description:** _Returns a list of articles that have been favored by users._

| Field Name | Data Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier for the favored article. |
| article_id | Integer | ID of the article that was favored. |
| user_id | Integer | ID of the user who favored the article. |
| date_favored | Date | Date the article was favored. |


### `/db/settings`

**Description:** _Returns the current website settings._

| FieldName | Data Type | Description|
|-----------| --- | ---|
| id        | Integer | Unique identifier for the setting.|
| name      | String | Name of the setting.|
| value     | String | Current value of the setting.|


### `/db/backup`

**Description:** _Returns a backup of the entire database._

| Field Name | Data Type | Description |
| --- | --- | --- |
| backup_file | Binary | A binary file containing the entire database backup. |


### `/db/topics`

**Description:** _Returns a list of topics that have been added to the database._

| Field Name | Data Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier for the topic. |
| name | String | Name of the topic. |
| date_added | Date | Date the topic was added to the database. |


### `/db/articlesgenres`

Returns a dictionary of articles grouped by genre.

| Field Name | Data Type | Description |
| --- | --- | --- |
| genre | String | The name of the genre. |
| articles | List | A list of news articles belonging to the genre. Each news article is represented as a dictionary with the same field names as in `/db/newsarticles`. |
