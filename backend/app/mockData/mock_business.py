import json
import os

class mock_business:
    def __init__(self):
        #grab the data from the json file mockBusi.json
        try:
            with open('backend/app/mockData/mockBusi.json') as f:
                self.data = json.load(f)
        except FileNotFoundError:
            print("File not found")
            self.data = []
        except json.JSONDecodeError:
            print("Error decoding JSON")
            self.data = []
        
    #get the name from the json data and accepts a category as a parameter
    def get_name(self, category):
        #return a list of business names that match the category
        return [x['name'] for x in self.data if x['category'] == category]