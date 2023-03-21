# Admin Functionality Documentation

This document provides an overview of the Admin functionality in the application, covering various components such as Users, Articles, Dashboard, Rss, and Settings. Each component is documented with details about its features, state, functions, and render.

## Table of Contents

- [Users Component](#users-component)
- [Articles Component](#articles-component)
- [Dashboard Component](#dashboard-component)
- [Rss Component](#rss-component)
- [Settings Component](#settings-component)

## Users Component

The Users component is a React.js User Management component that allows you to view, add, edit, promote/demote, and delete users. The component includes features like searching for users, filtering users by permission type, and pagination.

### Features

1. **View Users**: Displays a list of users with their username, email, and permission type (Admin/User).
2. **Search Users**: Allows you to search for users by username or email.
3. **Filter Users**: Filters the displayed users by permission type (All/Admin).
4. **Add Users**: A modal dialog allows you to input a new user's username, email, password, and permission type.
5. **Edit Users**: Edit an existing user's username, email, and permission type.
6. **Promote/Demote Users**: Change a user's permission type between Admin and User.
7. **Delete Users**: Remove a user from the list after confirming the action through a modal dialog.
8. **Pagination**: Displays a limited number of users per page, with pagination controls for navigation.

### Dependencies

- React.js
- Bootstrap
- react-bootstrap
- react-toastify

### API Endpoints

- `GET http://127.0.0.1:4444/api/getUsers`: Fetches a list of all users.
- `POST http://127.0.0.1:4444/api/addUser`: Adds a new user.
- `PUT http://127.0.0.1:4444/api/updateUser/:id`: Updates an existing user.
- `DELETE http://127.0.0.1:4444/api/deleteUser/:id`: Deletes a user.

### Usage

To use this User Management component, include it in your desired React.js application and ensure all dependencies are installed.

## Articles Component

The `Articles` component is a React component that displays a list of articles. It allows the user to filter the articles by title or description, add a new article, and edit an existing article. The component uses the useState and useEffect hooks from React to manage the state of the component.

### State

- `articles`: an array of objects that represent the articles. Each article object has the following properties:
    - `id`: a unique identifier for the article.
    - `title`: the title of the article.
    - `description`: a brief description of the article.
    - `image`: the URL of the image associated with the article.
- `showForm`: a boolean that indicates whether the form for adding a new article is visible or not.
- `newArticle`: an object that represents the new article being added. It has the following properties:
    - `title`: the title of the article.
    - `description`: a brief description of the article.
    - `image`: the URL of the image associated with the article.
- `filterText`: a string that represents the text used to filter the articles.

### Functions

- `handleFormChange`: a function that handles changes in the input fields of the form for adding a new article. It updates the `newArticle` state object with the new values entered by the user.
- `handleFormSubmit`: a function that handles the submission of the form for adding a new article. It adds the new article to the `articles` array and resets the `newArticle` state object to its default values.
- `handleEdit`: a function that handles the editing of an existing article. It is a placeholder function that logs a message to the console with the ID of the article being edited.
- `handleFilterChange`: a function that handles changes in the input field used for filtering the articles. It updates the `filterText` state object with the new value entered by the user.

### Render

The `Articles` component renders a container div that holds the following elements:

- A form group that contains an input field for filtering the articles by title or description.
- A button for adding a new article. Clicking this button shows a form that allows the user to enter the details of the new article.
- A div that contains the filtered articles as a list of cards. Each card displays the image, title, and description of an article. Clicking the "Read More" button opens the article in a new page. Clicking the "Edit" button logs a message to the console with the ID of the article being edited.

## Dashboard Component

The `Dashboard` component is a React component that displays a simple dashboard. It renders a container div with a single row that contains a single column. The column displays a heading with the text "Dashboard".

### State

None.

### Functions

None.

### Render

The `Dashboard` component renders a container div that holds a single row with a single column that displays the heading "Dashboard". The component uses the Bootstrap CSS framework for styling.

## Rss Component

The `Rss` component is a React component that allows users to manage RSS feeds. It provides a form for adding new feeds and a table for listing existing feeds. Each row of the table displays the feed URL and three buttons: "Edit", "Delete", and "Refresh". The component also uses the `react-toastify` library to display success and error messages when adding, editing, deleting, or refreshing feeds.

### State

- `feeds`: an array of strings representing the list of RSS feeds.
- `newFeed`: a string representing the value of the input field in the form for adding new feeds.
- `feedStatus`: an object with the same keys as `feeds` and values that represent the status of each feed (e.g., `{http://example.com/rss.xml: {loading: true, status: "loading"}}`)

### Functions

- `handleAddFeed`: a function that handles the submission of the form for adding new feeds. It adds the new feed to the `feeds` array and sets its initial status in the `feedStatus` object.
- `handleDeleteFeed`: a function that handles the deletion of a feed. It removes the feed from the `feeds` array and its status from the `feedStatus` object.
- `handleEditFeed`: a function that handles the editing of a feed. It prompts the user to enter a new URL for the feed and updates the `feeds` array and the `feedStatus` object accordingly.
- `handleRefreshFeed`: a function that handles the refreshing of a feed. It sends an HTTP request to the feed URL and updates the status of the feed in the `feedStatus` object based on the response.

### Render

The `Rss` component renders a container div that holds a form for adding new feeds and a table for displaying the existing feeds. The form includes an input field for entering the URL of the new feed and a button for submitting the form. The table includes two columns: one for the feed URL and one for the buttons. The buttons include "Edit", "Delete", and "Refresh". The component also includes a `ToastContainer` component from the `react-toastify` library for displaying success and error messages.

