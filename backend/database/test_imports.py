try:
    import pyodbc
    print("pyodbc imported successfully")
except ImportError as e:
    print(f"Error importing pyodbc: {e}")

try:
    from dotenv import load_dotenv
    print("dotenv imported successfully")
except ImportError as e:
    print(f"Error importing dotenv: {e}")
