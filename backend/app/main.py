from flask import Flask, request, jsonify
from flask_cors import CORS
from mockData.mock_business import mock_business

mb = mock_business() # create an instance of the mock_business class


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
    
#will send the names of the businesses that match the category in which personas spent the most money 
@app.route('/api/mockData', methods=['GET'])
def get_business():
    #grab top category from frontend
    category = request.args.get('category')
    if not category:
        return jsonify({
            'error': 'category is required'
        }), 400
    
    # return the businesses that match the category
    business_names = mb.get_name(category)
    if not business_names:
        return jsonify({
            'error': 'no businesses found for the category'
        }), 404
    
    return jsonify({
        'businesses': business_names
    })


if __name__ == '__main__':
    app.run(debug=True)
