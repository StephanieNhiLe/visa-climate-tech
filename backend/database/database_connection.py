from dotenv import dotenv_values
import pyodbc


class database_connection:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(database_connection, cls).__new__(
                cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        if not hasattr(self, '_initialized'):

            secrets = dotenv_values("../../.env")

            domain = secrets["DB_DOMAIN"]
            port = secrets["DB_PORT"]
            database = secrets["DB_NAME"]
            username = secrets["DB_USERNAME"]
            password = secrets["DB_PASSWORD"]
            driver = secrets["DB_DRIVER"] 

            self.connection_url = (
                f"DRIVER={driver};"
                f"SERVER={domain},{port};"
                f"DATABASE={database};"
                f"UID={username};"
                f"PWD={password};" 
                "Encrypt=yes;"
                "TrustServerCertificate=yes;"
                "MARS_Connection=Yes;"
            )

            self.connection = self.create_connection()
            self._initialized = True

    def create_connection(self):
        try:
            connection = pyodbc.connect(self.connection_url)
            print("Database connection established.")
            return connection
        except pyodbc.Error as ex:
            print(f"Error connecting to the database: {ex}")
            raise

    def get_connection(self):
        return self.connection


if __name__ == "__main__":

    # # Usage
    db_connection = database_connection()
    connection = db_connection.get_connection()

    # # Now you can use `connection` to execute queries
    cursor = connection.cursor()
    cursor.execute("SELECT @@version;")
    row = cursor.fetchone()
    print(f"SQL Server version: {row[0]}")
