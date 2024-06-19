from flask import Flask, request, jsonify, session
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "secret_key"

@app.route('/login', methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username == "user" and password == "password":
        session["user"] = username
        return jsonify('Login Successful'), 200
    else:
        return jsonify('Login Failed'), 401

@app.route('/logout', methods=["POST"]) 
def logout():
    session.pop("username", None)
    return jsonify('Logged out'), 200

@app.route('/profile', methods=["GET"])
def profile():
    if "username" in session:
        return jsonify('Profile page'), 200
    else:
        return jsonify('Not logged in'), 401

if __name__ == '__main__':
    app.run(debug=True, port=5000)
