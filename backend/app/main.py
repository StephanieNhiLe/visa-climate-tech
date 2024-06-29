from database.database_operations import DB_Operation
from flask_cors import CORS
from flask import Flask, request, jsonify
import requests
from requests.auth import HTTPBasicAuth

import sys
sys.path.append("..")

db_op = DB_Operation()

app = Flask(__name__)
CORS(app, origins='*', allow_headers=[
    "Content-Type", "Authorization",
    "Access-Control-Allow-Credentials"],
    supports_credentials=True)


@app.route('/api/messages', methods=['GET'])
def get_data():
    return jsonify({
        'message': "successful!"
    })


@app.route('/api/account_details', methods=['POST'])
def account_details():
    data = request.get_json()

    if not data:
        return jsonify({
            'success': False,
            'message': 'credentials are required'
        }), 400

    username = data.get('username', None)
    password = data.get('password', None)

    if not username or not password:
        return jsonify({
            'access': False,
            'Message': "username and password are required"
        }), 400

    try:

        account_info = db_op.getUserAccount(username, password)

        if account_info:
            return jsonify({
                "access": True,
                "account_id": account_info.account_id,
                "first_name": account_info.first_name,
                "last_name": account_info.last_name,
                "persona": account_info.persona
            }), 200
        else:
            return jsonify({
                "access": False,
                "message": "User account does not exist"
            }), 404

    except Exception as ex:
        return jsonify({
            "access": False,
            "message": f"An error occured with exeption {ex}"
        }), 500


@app.route('/api/verify_user', methods=['POST'])
def verify_user():
    data = request.get_json()

    if not data:
        return jsonify({
            'success': False,
            'message': 'credentials are required'
        }), 400

    username = data.get('username', None)
    password = data.get('password', None)

    if not username or not password:
        return jsonify({
            'success': False,
            'message': 'Username and password are required'
        }), 400

    try:

        has_account = db_op.checkUserHasAccount(username, password)

        if has_account:
            return jsonify({
                'success': True,
                'message': 'User account exists'
            }), 200

        else:
            return jsonify({
                'success': False,
                'message': 'User account does not exist'
            }), 404

    except Exception as ex:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {ex}'
        }), 500

@app.route('/api/get_access_token', methods=['POST'])
def get_access_token():
    token_url = 'https://api.staging.ecolytiq.arm.ecolytiq.network/oauth/token'
    client_id = 'KdgcLkSCgaX0p1SL84r0AU2n4P3G8XaMaH29'
    client_secret = 'cgdfk8buY5u4FHcMvTPRlQJRMFJJuzZtw2iwQih78NMxe0Jr'
    grant_type = 'client_credentials'
    scope = 'all'

    auth = HTTPBasicAuth(client_id, client_secret)
    headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}

    data = {
        'grant_type': grant_type,
        'scope': scope
    }

    response = requests.post(token_url, auth=auth, headers=headers, data=data)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to obtain access token'}), response.status_code

@app.route('/api/avg_spend_per_month', methods=['POST'])
def avg_spend_per_month():
    data = request.get_json()

    if not data:
        return jsonify({
            'success': False,
            'message': 'credentials are required'
        }), 400

    account_id = data.get('account_id', None)

    if not account_id:
        return jsonify({
            'success': False,
            'message': 'Account ID is required'
        }), 400

    try:

        avg_spend_per_month = db_op.getAvgSpendPerMonth(account_id)
        if avg_spend_per_month:
            return jsonify({
                'success': True,
                'data': [
                {
                    'month': item.month,
                    're_category': item.re_category,
                    'avg_spend': float(item.avg_spend),
                    'rank': item.rank
                } for item in avg_spend_per_month
            ]
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'No data found'
            }), 404

    except Exception as ex:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {ex}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
