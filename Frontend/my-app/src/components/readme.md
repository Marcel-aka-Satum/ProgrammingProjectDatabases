## Login Form component
The component handles user login, storing the user token in sessionStorage, and provides a logout functionality.

### State

- `email`: a string representing the user's email address.
- `password`: a string representing the user's password.
- `token`: a string representing the user's authentication token, which is stored in sessionStorage.
- `usersession`: a context object for accessing the user session data and functions.

### Functions

- `handleLogIn`: an async function that handles the login process. It sends a POST request to the API with the user's email and password, and if successful, stores the received token in sessionStorage and reloads the page.
- `handleLogOut`: a function that handles the logout process. It calls the `logout` function from the `usersession` context object.

### Render

The LoginForm component renders a container div that displays the following elements based on the user's login status:

- If the user is logged in:
  - A message indicating that the user is logged in.
  - A logout button that calls the `handleLogOut` function when clicked.
- If the user is not logged in:
  - A login form with input fields for the user's email and password.
  - A login button that calls the `handleLogIn` function when clicked.
  - A message prompting the user to register if they haven't already, with a link to the registration page.

## Registration Form Component

The component handles user registration, storing the user token in sessionStorage, and displays a message if the user is already logged in.

### State

- `email`: a string representing the user's email address.
- `password`: a string representing the user's password.
- `username`: a string representing the user's username.
- `usersession`: a context object for accessing the user session data and functions.

### Functions

- `handleRegister`: an async function that handles the registration process. It sends a POST request to the API with the user's email, password, username, and isAdmin flag. If successful, it stores the received token in sessionStorage and reloads the page.

### Render

The RegisterForm component renders a container div that displays the following elements based on the user's login status:

- If the user is logged in:
  - A message indicating that the user is already logged in and cannot create an account.
- If the user is not logged in:
  - A registration form with input fields for the user's username, email, and password.
  - A confirm password input field (Note: This field is not currently being validated).
  - A register button that calls the `handleRegister` function when clicked.
  - A message prompting the user to log in if they already have an account, with a link to the login page.
