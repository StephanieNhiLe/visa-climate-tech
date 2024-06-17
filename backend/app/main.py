from flask import Flask, jsonify
from flask_cors import CORS

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
