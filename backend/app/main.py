from database.database_operations import DB_Operation
from .app_utils import get_response_object, get_mock_ecolytiqs_response_object, STATUS_CODE_INTERNAL_SERVER_ERROR, STATUS_CODE_OK, STATUS_CODE_NOT_FOUND

import requests

from flask import Flask, request, jsonify

from flask_cors import CORS

from .utilities import system_message, craftChatQuery
from dotenv import dotenv_values
from openai import OpenAI

from requests.auth import HTTPBasicAuth

import sys
import pandas as pd
sys.path.append("..")

secrets = dotenv_values("../../.env")
OPENAI_API_KEY = secrets['OPENAI_API_KEY']
client = OpenAI(api_key=OPENAI_API_KEY)

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
    }), 200


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


@app.route('/api/get_footprints', methods=['GET'])
def get_footprints():
    # secrets = dotenv_values("../../.env")
    # access_token = secrets['ACCESS_TOKEN']

    # account_id = request.args.get('account_id')
    # data = request.args.get('data')

    data, error_response, status_code = get_response_object(
        ['account_id', 'data'])

    if error_response:
        return error_response, status_code

    mock_data, mock_error_response, status_code = get_mock_ecolytiqs_response_object(
        account_id=data["account_id"],
        transaction_parameters=data["data"])

    if status_code == STATUS_CODE_OK:
        return mock_data, STATUS_CODE_OK
    else:
        return mock_error_response, STATUS_CODE_NOT_FOUND


def process_monthly_spend_by_category_data(monthly_spend_category):
    df = pd.DataFrame(monthly_spend_category, columns=['month', 're_category', 'total'])
    df['total'] = pd.to_numeric(df['total'], errors='coerce')
    df = df.dropna(subset=['total'])

    df_pivot = df.pivot(index='month', columns='re_category', values='total').fillna(0)
    total_spend_by_month = df_pivot.sum(axis=1)

    total_spend_by_category = df_pivot.reset_index().to_dict(orient='records')
    
    if total_spend_by_month.eq(0).any():
        return None, None, 'Cannot calculate percentages when total spend is zero for any month'
    
    monthly_spend_by_category_percent = df_pivot.divide(total_spend_by_month, axis=0) * 100
    highest_spent_category = df_pivot.idxmax(axis=1)
    highest_spent_categories = [
        {'month': month, 're_category': category, 'amount': df_pivot.loc[month, category]}
        for month, category in highest_spent_category.items()
    ]

    return total_spend_by_category, monthly_spend_by_category_percent, highest_spent_categories, None

@app.route('/api/monthly_spend_by_category', methods=['POST'])
def monthly_spend_by_category():
    data, error_response, status_code = get_json_or_error(['account_id'])
    if error_response:
        return error_response, status_code

    try:
        monthly_spend_category = db_op.getMonthlySpendByCategory(data['account_id']) 
        
        if monthly_spend_category:
            total_spend_by_category, monthly_spend_by_category_percent, highest_spent_categories, error_message = process_monthly_spend_by_category_data(monthly_spend_category)
            if error_message:
                return jsonify({
                    'success': False,
                    'message': error_message
                }), 400

            return jsonify({
                'success': True,
                'monthly_spend_by_category_percent': monthly_spend_by_category_percent.reset_index().to_dict(orient='records'),
                'highest_spent_category': highest_spent_categories,
                'total_spend_by_category': total_spend_by_category,
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'No data found for the account'
            }), 404

    except Exception as ex:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {ex}'
        }), 500

@app.route('/api/learn_more', methods=['POST'])
def learn_more():
    """
    Calling this endpoint asks chat gpt for a fact given data from the user such as 
    their persona, top purchases during a time frame and carbon footprint metrics.
    The out come should be something informative that can be read in 2 minutes
    """

    data = request.get_json()

    persona = data.get("persona", "persona is not specifed")
    purchases = data.get("purchases", None)
    time_frame = data.get("timeFrame", None)
    carbon_foot_print_metric = data.get("footPrintMetric", None)
    extra_context = data.get("context", "")
    transportation_details = data.get("transportationDetails", None)
    household_size = data.get("householdSize", None)

    if not purchases or not time_frame or not carbon_foot_print_metric or not transportation_details or not household_size:
        missing_fields = []

        if not purchases:
            missing_fields.append("purchases is missing")
        if not time_frame:
            missing_fields.append("timeFrame is missing")
        if not carbon_foot_print_metric:
            missing_fields.append("footPrintMetric is missing")
        if not transportation_details:
            missing_fields.append("transportationDetails is missing")
        if not household_size:
            missing_fields.append("householdSize is missing")

        debug_message = "; ".join(missing_fields)

        return jsonify({
            'success': False,
            'message': 'purchases, timeFrame, footprintMetric, transportationDetails, and householdSize need to be provided in order to give a useful suggestion',
            'debugMessage': debug_message + " please note the spellings of each feild"
        }), 404

    user_input = craftChatQuery(persona=persona,
                                purchases=purchases,
                                timeframe=time_frame,
                                carbon_footPrint=carbon_foot_print_metric,
                                context=extra_context,
                                transportationDetails=transportation_details,
                                householdSize=household_size
                                )

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_input},
            # {'role': "system", "content": aggregated_info}
        ],
    )

    message = response.choices[0].message.content

    return jsonify({
        'success': True,
        'message': message}
    ), 200
    
if __name__ == '__main__':
    app.run(debug=True)
