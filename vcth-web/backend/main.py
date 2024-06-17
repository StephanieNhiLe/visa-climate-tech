from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins='*', allow_headers=[
    "Content-Type", "Authorization  ", "Access-Control-Allow-Credentials"], supports_credentials=True)     # CORS
@app.route("/api/messages", methods=["GET"])  
def get_message():
    return jsonify(
        {
            "message": "successful!"
        }
    )

if __name__ == "__main__":
    app.run(debug=True,port=8080)