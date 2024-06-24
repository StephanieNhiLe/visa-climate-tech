import pyodbc

for driver in pyodbc.drivers():
    print(driver)