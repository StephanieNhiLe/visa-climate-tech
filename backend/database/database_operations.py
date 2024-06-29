from .database_utils import checkAccountExistanceQuery, getAccountDetails, getBusinessDetails
from .database_connection import database_connection
from collections import namedtuple
import pyodbc

UserAccount = namedtuple(
    'UserAccount', ['account_id', 'first_name', 'last_name', 'persona'])


class DB_Operation:
    def __init__(self):
        db_connection = database_connection()
        self._connection = db_connection.get_connection()

    def checkUserHasAccount(self, username: str, password: str) -> bool:
        query = checkAccountExistanceQuery(username, password)

        cursor = self._connection.cursor()
        cursor.execute(query)

        numberOfMatches = cursor.fetchone()[0]

        if numberOfMatches > 1:
            raise Exception(
                "There exists multiple accounts with the same username and password")

        return numberOfMatches == 1

    def getUserAccount(self, username: str, password: str) -> tuple:
        """
        The assumption of this method is that they have verified that
        the user is part of the database however if they are not then they will recieve None for data
        """
        query = getAccountDetails(username, password)

        try:
            cursor = self._connection.cursor()
            cursor.execute(query)

            data = cursor.fetchone()

            if data:
                return UserAccount(*data)
            else:
                return None
        except pyodbc.Error as ex:
            print(f"Error querying the database: {ex}")
            raise

    def getBusinessDetails(self, category: str) -> list:
        query = getBusinessDetails(category)
        try:
            cursor = self._connection.cursor()
            cursor.execute(query)

            data = cursor.fetchall()
            formatted_data = [business[0] for business in data]
            return formatted_data
            # return data
        except pyodbc.Error as ex:
            print(f"Error querying the database: {ex}")
            raise



if __name__ == "__main__":
    # Sample ways this script would work mainly for testing
    db_op = DB_Operation()
    # print(db_op.checkUserHasAccount("bob", "pas121"))
    print(db_op.getUserAccount("mike_j", "securepass"))
