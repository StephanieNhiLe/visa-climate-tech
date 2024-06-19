from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy(app) # Database
api = Api(app)  # API

cors = CORS(app, origins='*', allow_headers=[
    "Content-Type", "Authorization  ", "Access-Control-Allow-Credentials"], supports_credentials=True)     # CORS
@app.route("/api/messages", methods=["GET"])  
def get_message():
    return jsonify(
        {
            "message": "successful!"
        }
    )

if __name__ == '__main__':
    app.run(debug=True,port=5000)