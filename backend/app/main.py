from database.database_operations import DB_Operation
from flask_cors import CORS
from flask import Flask, request, jsonify
import pandas as pd

import sys
sys.path.append("..")

db_op = DB_Operation()

app = Flask(__name__)
CORS(app, origins='*', allow_headers=[
    "Content-Type", "Authorization",
    "Access-Control-Allow-Credentials"],
    supports_credentials=True)

#mock businesses return endpoint
@app.route('/api/businesses', methods=['POST'])
def get_businesses():  
    data = request.get_json()
    if not data:
        return jsonify({
            'success': False,
            'message': 'Category is required'
        }), 400
    
    category = data.get('category', None)
    if not category:
        return jsonify({
            'success': False,
            'message': 'Category is required'
        }), 400
    try: 
        business_data = db_op.getBusinessDetails(category)
        if business_data:
            return jsonify({
                'success': True,
                'businesses': business_data
            }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {e}'
        }), 500 


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


if __name__ == '__main__':
    app.run(debug=True)
