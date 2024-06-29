from database.database_operations import DB_Operation

def test_get_avg_spend_per_month(account_id):
    db_op = DB_Operation()
    try:
        avg_spend_per_month = db_op.getAvgSpendPerMonth(account_id)
        if avg_spend_per_month:
            for item in avg_spend_per_month:
                print(f"Month: {item.month}, Category: {item.re_category}, Avg Spend: {item.avg_spend}, Rank: {item.rank}")
        else:
            print("No data found.")
    except Exception as ex:
        print(f"An error occurred: {ex}")

if __name__ == "__main__":
    test_account_id = '94177e7a3daa4ef18746b355980ebd5f'
    test_get_avg_spend_per_month(test_account_id)
