from database.database_operations import DB_Operation
from .app_utils import get_response_object, STATUS_CODE_INTERNAL_SERVER_ERROR, STATUS_CODE_OK, STATUS_CODE_NOT_FOUND

from flask_cors import CORS
from flask import Flask, request, jsonify

import requests
from requests.auth import HTTPBasicAuth

from dotenv import dotenv_values
import sys
sys.path.append("..")

db_op = DB_Operation()

app = Flask(__name__)
CORS(app, origins='*', allow_headers=[
    "Content-Type", "Authorization",
    "Access-Control-Allow-Credentials"],
    supports_credentials=True)


@app.route('/api/businesses', methods=['POST'])
def get_businesses():
    data, error_response, status_code = get_response_object(['category'])

    if error_response:
        return error_response, status_code

    try:
        business_data = db_op.getBusinessDetails(data['category'])
        if business_data:
            return jsonify({
                'success': True,
                'businesses': business_data
            }), STATUS_CODE_OK
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {e}'
        }), STATUS_CODE_INTERNAL_SERVER_ERROR


@app.route('/api/messages', methods=['GET'])
def get_data():
    return jsonify({
        'message': "successful!"
    })


@app.route('/api/account_details', methods=['POST'])
def account_details():
    data, error_response, status_code = get_response_object(
        ['username', 'password'])

    if error_response:
        return error_response, status_code

    try:

        account_info = db_op.getUserAccount(data['username'], data['password'])

        if account_info:
            return jsonify({
                "access": True,
                "account_id": account_info.account_id,
                "first_name": account_info.first_name,
                "last_name": account_info.last_name,
                "persona": account_info.persona
            }), STATUS_CODE_OK
        else:
            return jsonify({
                "access": False,
                "message": "User account does not exist"
            }), STATUS_CODE_NOT_FOUND

    except Exception as ex:
        return jsonify({
            "access": False,
            "message": f"An error occured with exeption {ex}"
        }), STATUS_CODE_INTERNAL_SERVER_ERROR


@app.route('/api/verify_user', methods=['POST'])
def verify_user():
    data, error_response, status_code = get_response_object(
        ['username', 'password'])
    if error_response:
        return error_response, status_code

    try:

        has_account = db_op.checkUserHasAccount(
            data['username'], data['password'])

        if has_account:
            return jsonify({
                'success': True,
                'message': 'User account exists'
            }), STATUS_CODE_OK

        else:
            return jsonify({
                'success': False,
                'message': 'User account does not exist'
            }), STATUS_CODE_NOT_FOUND

    except Exception as ex:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {ex}'
        }), STATUS_CODE_INTERNAL_SERVER_ERROR


@app.route('/api/monthly_spend', methods=['POST'])
def monthly_spend():
    data, error_response, status_code = get_response_object(['account_id'])
    if error_response:
        return error_response, status_code

    try:

        monthly_spend_data = db_op.getMonthlySpendSummary(data['account_id'])

        if monthly_spend_data:
            return jsonify({
                'success': True,
                'monthly_spend': [
                    {
                        'month': item.month,
                        'total': item.total,
                        'average': item.average,
                        'minimum': item.minimum,
                        'maximum': item.maximum
                    } for item in monthly_spend_data
                ]
            }), STATUS_CODE_OK

    except Exception as ex:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {ex}'
        }), STATUS_CODE_INTERNAL_SERVER_ERROR


@app.route('/api/overall_avg_spend', methods=['POST'])
def overall_avg_spend():
    data, error_response, status_code = get_response_object(['account_id'])
    if error_response:
        return error_response, status_code

    try:
        overall_avg_spend_data = db_op.getOverallAvgSpend(data['account_id'])

        if overall_avg_spend_data:
            return jsonify({
                'success': True,
                'overall_avg_spend': overall_avg_spend_data
            }), STATUS_CODE_OK

    except Exception as ex:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {ex}'
        }), STATUS_CODE_INTERNAL_SERVER_ERROR


@app.route('/api/get_access_token', methods=['POST'])
def get_access_token():
    secrets = dotenv_values("../../.env")

    token_url = 'https://api.staging.ecolytiq.arm.ecolytiq.network/oauth/token'
    client_id = secrets['CLIENT_ID']
    client_secret = secrets['CLIENT_SECRET']

    grant_type = 'client_credentials'
    scope = 'all'

    auth = HTTPBasicAuth(client_id, client_secret)
    headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}

    data = {
        'grant_type': grant_type,
        'scope': scope
    }

    response = requests.post(token_url, auth=auth, headers=headers, data=data)

    if response.status_code == STATUS_CODE_OK:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to obtain access token'}), response.status_code


@app.route('/api/avg_spend_per_month', methods=['POST'])
def avg_spend_per_month():
    data, error_response, status_code = get_response_object(['account_id'])

    if error_response:
        return error_response, status_code

    try:
        avg_spend_per_month = db_op.getAvgSpendPerMonth(data['account_id'])
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
            }), STATUS_CODE_OK
        else:
            return jsonify({
                'success': False,
                'message': 'No data found'
            }), STATUS_CODE_NOT_FOUND

    except Exception as ex:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {ex}'
        }), STATUS_CODE_INTERNAL_SERVER_ERROR


if __name__ == '__main__':
    app.run(debug=True)
