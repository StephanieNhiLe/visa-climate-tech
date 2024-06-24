from database.database_operations import DB_Operation

from flask import Flask, request, jsonify
from flask_cors import CORS

from .utilities import system_message, craftChatQuery
from dotenv import dotenv_values
from openai import OpenAI

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


@app.route('/api/messages', methods=['GET'])
def get_data():
    return jsonify({
        'message': "successful!"
    }), 200


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

    if not purchases or not time_frame or not carbon_foot_print_metric:
        missing_fields = []

        if not purchases:
            missing_fields.append("purchases is missing")
        if not time_frame:
            missing_fields.append("timeFrame is missing")
        if not carbon_foot_print_metric:
            missing_fields.append("footPrintMetric is missing")

        debug_message = "; ".join(missing_fields)

        return jsonify({
            'success': False,
            'message': 'purchases, timeFrame and footprintMetric need to be provided in order to give a useful suggestion',
            'debugMessage': debug_message + " please note the spellings of each feild"
        }), 404

    user_input = craftChatQuery(persona=persona,
                                purchases=purchases,
                                timeframe=time_frame,
                                carbon_footPrint=carbon_foot_print_metric,
                                context=extra_context)

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
