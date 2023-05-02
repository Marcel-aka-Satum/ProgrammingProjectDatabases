import os


def is_connected(func):
    """
    @brief: checks if the connection to the database exists.
    """

    def wrapper_func(self, *args) -> tuple:
        if self.connection is None:
            print("Database is not connected")
            print("Trying to connect ...")
            try:
                self.connect()
                if self.connection is None:
                    raise Exception("Database is not connected")
            except Exception as e:
                print(f"Cannot connect to database: {e}")
                return False, f"{e}"
            print("Database connected successfully")
        try:
            result = func(self, *args)
        except Exception as e:
            return False, f"{e}"
        return True, result

    return wrapper_func


def getCWD(func):
    """
    @brief: gives the absolute address to the root directory.
    """

    def wrapper_func(self, *args):
        seperator = os.path.sep
        cwd = os.getcwd().split(seperator)
        while cwd[-1] != "ProgrammingProjectDatabases":
            cwd.pop(-1)
        if not cwd:
            raise Exception("No valid address found")
        return func(self, seperator.join(cwd), *args)

    return wrapper_func
