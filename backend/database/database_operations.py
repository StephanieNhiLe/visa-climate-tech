from .database_utils import checkAccountExistanceQuery, getAccountDetails, getAvgSpendPerMonth, getBusinessDetails, getMonthlySpendSum, getOverallAvgSpend, getMonthlySpendByCategory
from .database_connection import database_connection
from collections import namedtuple
import pyodbc

UserAccount = namedtuple(
    'UserAccount', ['account_id', 'first_name', 'last_name', 'persona'])

AvgSpendPerMonth = namedtuple(
    'AvgSpendPerMonth', ['month', 're_category', 'avg_spend', 'rank'])

MonthlySpend = namedtuple(
    'MonthlySpend', ['month', 'total', 'average', 'minimum', 'maximum'])

MonthlySpendByCategory = namedtuple(
    'MonthlySpendByCategory', ['month', 're_category', 'total'])
    
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

    def getAvgSpendPerMonth(self, account_id: int):
        query = getAvgSpendPerMonth(account_id)

        try:
            cursor = self._connection.cursor()
            cursor.execute(query)
            data = cursor.fetchall()

            formatted_data = [AvgSpendPerMonth(*row) for row in data]
            return formatted_data
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
        except pyodbc.Error as ex:
            print(f"Error querying the database: {ex}")
            raise

    def getMonthlySpendSummary(self, account_id: str) -> list:
        query = getMonthlySpendSum(account_id)
        try:
            cursor = self._connection.cursor()
            # cursor.execute(query)

            data = cursor.execute(query).fetchall()
            formatted_data = [MonthlySpend(*item) for item in data]
            return formatted_data
        except pyodbc.Error as ex:
            print(f"Error querying the database: {ex}")
            raise

    def getOverallAvgSpend(self, account_id: str) -> list:
        query = getOverallAvgSpend(account_id)
        try:
            cursor = self._connection.cursor()
            cursor.execute(query)

            data = cursor.fetchone()[0]
            return data
        except pyodbc.Error as ex:
            print(f"Error querying the database: {ex}")
            raise



    def getMonthlySpendByCategory(self, account_id: str) -> list:
        query = getMonthlySpendByCategory(account_id)
        try:
            cursor = self._connection.cursor()
            cursor.execute(query)

            data = cursor.fetchall()
            formatted_data = [MonthlySpendByCategory(*row) for row in data]
            return formatted_data 
        except pyodbc.Error as ex:
            print(f"Error querying the database: {ex}")
            raise

    def calculate_carbon_footprints(transactions): 
        carbon_footprints = []
        
        for transaction in transactions:
            category = transaction.get('category')
            amount = transaction.get('amount', 0)
            emission_factor = EMISSION_FACTORS.get(category, 0)
            carbon_footprint = amount * emission_factor
            
            carbon_footprints.append({
                'category': category,
                'amount': amount,
                'carbon_footprint': carbon_footprint
            })
        
        return carbon_footprints
 
if __name__ == "__main__":
    # Sample ways this script would work mainly for testing
    db_op = DB_Operation()
    # print(db_op.checkUserHasAccount("bob", "pas121"))
    # print(db_op.getUserAccount("mike_j", "securepass"))
    print(db_op.getAvgSpendPerMonth("94177e7a3daa4ef18746b355980ebd5f"))
