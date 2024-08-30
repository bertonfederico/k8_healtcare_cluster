from flask import Flask, jsonify, request
from pypmml import Model
import pandas as pd

app = Flask(__name__)
model = Model.load("NeuralNetwork.pmml")

@app.route('/predict', methods=['POST'])
def predict():
    #com6
    eeg_data = request.get_json()['eeg_data']
    post_data = {}
    i = 0
    while i < len(eeg_data):
        post_data["x" + str(i + 1)] = [eeg_data[i]]
        i += 1
    post_data = pd.DataFrame(post_data)
    result = model.predict(post_data)
    response_data = result.loc[0, 'probability(1)']
    return jsonify({"message": "Received", "response": response_data}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
