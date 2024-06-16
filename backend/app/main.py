from flask import Flask

from dotenv import dotenv_values


secrets = dotenv_values("../../.env")

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, Visa Hack Team!</p>"
