
def validate_user(username, email, password):
    forbidden = ['"', "'", ';', ':', ',', '\\', '/', '[', ']', '{', '}', '|', '<', '>', '?', '`', '~']

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