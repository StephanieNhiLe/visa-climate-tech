from database.database_operations import DB_Operation
from flask_cors import CORS
from flask import Flask, request, jsonify

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
    # return {"message": "Hello, Visa Hack Team!"}
    return jsonify({
        'message': "successful!"
    })


@app.route('/api/verify_user', methods=['POST'])
def check_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

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
