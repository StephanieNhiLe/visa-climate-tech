from database.database_operations import DB_Operation

from flask import Flask, request, jsonify

from flask_cors import CORS

from .utilities import system_message, craftChatQuery
from dotenv import dotenv_values
from openai import OpenAI

import requests
from requests.auth import HTTPBasicAuth

import sys
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

def get_json_or_error(required_fields):
    data = request.get_json()
    if not data:
        return None, jsonify({'success': False, 'message': 'Data is required'}), 400

    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return None, jsonify({'success': False, 'message': f"{', '.join(missing_fields)} are required"}), 400
    
    return data, None, None

@app.route('/api/businesses', methods=['POST'])
def get_businesses():  
    data, error_response, status_code = get_json_or_error(['category'])
    if error_response:
        return error_response, status_code
    
    try: 
        business_data = db_op.getBusinessDetails(data['category'])
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
    }), 200

@app.route('/api/account_details', methods=['POST'])
def account_details():
    data, error_response, status_code = get_json_or_error(['username', 'password'])
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
    data, error_response, status_code = get_json_or_error(['username', 'password'])
    if error_response:
        return error_response, status_code

    try:

        has_account = db_op.checkUserHasAccount(data['username'], data['password'])

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
    
@app.route('/api/monthly_spend', methods=['POST'])
def monthly_spend():
    data, error_response, status_code = get_json_or_error(['account_id'])
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
            }), 200

    except Exception as ex:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {ex}'
        }), 500
    
@app.route('/api/overall_avg_spend', methods=['POST'])
def overall_avg_spend():
    data, error_response, status_code = get_json_or_error(['account_id'])
    if error_response:
        return error_response, status_code

    try:
        overall_avg_spend_data = db_op.getOverallAvgSpend(data['account_id'])

        if overall_avg_spend_data:
            return jsonify({
                'success': True,
                'overall_avg_spend': overall_avg_spend_data
            }), 200

    except Exception as ex:
        return jsonify({
            'success': False,
            'message': f'An error occurred: {ex}'
        }), 500

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

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to obtain access token'}), response.status_code

@app.route('/api/avg_spend_per_month', methods=['POST'])
def avg_spend_per_month():
    data, error_response, status_code = get_json_or_error(['account_id'])
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
