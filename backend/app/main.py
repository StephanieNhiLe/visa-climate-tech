from flask import Flask 
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/data')
def get_data(): 
    return {"message": "Hello, Visa Hack Team!"}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0') 