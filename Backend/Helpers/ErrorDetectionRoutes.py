
def validate_user(username, email, password, users):
    forbidden = ['"', "'", ';', ':', ',', '\\', '/', '[', ']', '{', '}', '|', '<', '>', '?', '`', '~']

    for user in users:
        # check if the email or username already exists
        if user['Email'] == email:
            return "Email exists already", 401
        if user['Username'] == username:
            return "Username exists already", 401

        # check for password strength
        if len(password) < 8:
            return "Password must be at least 8 characters", 401
        elif not any(char.isdigit() for char in password):
            return "Password must contain at least one number", 401
        elif not any(char.isupper() for char in password):
            return "Password must contain at least one uppercase letter", 401
        elif not any(char.islower() for char in password):
            return "Password must contain at least one lowercase letter", 401
        elif not any(char in ['!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '='] for char in password):
            return "Password must contain at least one special character", 401

        for char in password:
            if char in forbidden:
                return f"Password must not contain any of the following characters: {forbidden}", 401
    return "User Added Successfully", 200