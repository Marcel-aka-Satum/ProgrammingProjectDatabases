import bcrypt

def create_hash(password):
    bytesPassword = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(bytesPassword, salt)
    return hashed_password.decode()