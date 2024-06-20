from database_utils import checkAccountExistanceQuery
from database_connection import database_connection


class database_operations:
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


if __name__ == "__main__":
    # Sample ways this script would work
    db_op = database_operations()
    print(db_op.checkUserHasAccount("bob", "pas121"))
    print(db_op.checkUserHasAccount("mike_j", "securepass"))
