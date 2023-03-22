# API Documentation

This is a professional documentation for the provided code, which includes authentication, user management, RSS feed management, and news article management routes.

## Table of Contents

- [Imported Libraries](#imported-libraries)
- [Application Initialization](#application-initialization)
- [Database and Scraper Initialization](#database-and-scraper-initialization)
- [Routes](#routes)
  - [Homepage](#homepage)
  - [Authentication Routes](#authentication-routes)
  - [User Routes](#user-routes)
  - [RSS Feed Routes](#rss-feed-routes)
  - [News Article Routes](#news-article-routes)

## Imported Libraries

- Flask: A micro web framework for Python.
- render_template, request, redirect, url_for, jsonify: Functions from Flask for rendering templates, handling requests, redirecting, URL manipulation, and JSON manipulation.
- os, sys, json: Python standard libraries for working with the operating system, system-specific parameters, and JSON.
- bcrypt: A library for working with passwords using the bcrypt hashing algorithm.
- Flask-JWT-Extended: A library for handling JSON Web Tokens in Flask.
- Flask-CORS: A library for handling Cross Origin Resource Sharing in Flask.
- Database, Scraper: Custom modules for database management and web scraping.

## Application Initialization

The Flask application is initialized with the following settings:

- CORS is enabled, allowing requests from `http://localhost:3000`.
- The application is configured with CORS headers for handling `Content-Type`.

## Database and Scraper Initialization

The database connection and scraper are initialized with the following steps:

- A connection to the database is established.
- The database tables are redefined.
- The database is populated with initial data.
- The scraper is run.

## Routes

### Homepage

**Route:** `/`

**Method:** `GET`

**Description:** Renders the index.html template.

### Authentication Routes

#### Register User

**Route:** `/api/register`

**Method:** `POST`

**Description:** Registers a new user with the provided email, password, username, and admin status. If the user already exists, returns an error.

#### Login User

**Route:** `/api/login`

**Method:** `POST`

**Description:** Authenticates a user with the provided email and password. If the user does not exist or the password is incorrect, returns an error.

### User Routes

#### Get Users

**Route:** `/api/users`

**Method:** `GET`

**Description:** Returns a list of all users in the database.

#### Add User

**Route:** `/api/add_user`

**Method:** `POST`

**Description:** Adds a new user with the provided email, password, username, and admin status.

#### Update User

**Route:** `/api/update_user/<id>`

**Method:** `POST`

**Description:** Updates an existing user with the provided email, password, username, and admin status.

#### Delete User

**Route:** `/api/delete_user/<username>`

**Method:** `POST`

**Description:** Deletes a user with the given username.

### RSS Feed Routes

#### Get RSS Feeds

**Route:** `/api/rssfeeds`

**Method:** `GET`

**Description:** Returns a list of all RSS feeds in the database.

#### Add RSS Feed

**Route:** `/api/add_rssfeed`

**Method:** `POST`

**Description:** Adds a new RSS feed with the provided URL, publisher, and topic.

#### Update RSS Feed

**Route:** `/api/update_rssfeed/<url>`

**Method:** `POST`

**Description:** Updates an existing RSS feed with the provided publisher and topic.

#### Delete RSS Feed

**Route:** `/api/delete_rss
