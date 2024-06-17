# A python script to interact with a docker container
from dotenv import dotenv_values
import pyodbc

secrets = dotenv_values(".env")

domain = secrets["DB_DOMAIN"]
port = secrets["DB_PORT"]
database = secrets["DB_NAME"]
username = secrets["DB_USERNAME"]
password = secrets["DB_PASSWORD"]
driver = secrets["DB_DRIVER"]

connectionUrl = (
    f"DRIVER={driver};"
    f"SERVER={domain},{port};"
    f"DATABASE={database};"
    f"UID={username};"
    f"PWD={password};"
    "Encrypt=yes;"
    "TrustServerCertificate=yes;"
)

# Establish a connection
try:
    conn = pyodbc.connect(connectionUrl)
    print("Connected successfully!")
    
    # Now you can use `conn` to execute SQL queries
    cursor = conn.cursor()
    cursor.execute("SELECT @@version;")
    row = cursor.fetchone()
    print(f"SQL Server version: {row[0]}")
    
except pyodbc.Error as e:
    print(f"Error connecting to SQL Server: {e}")