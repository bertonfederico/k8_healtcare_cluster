from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

prediction_url = 'https://epilepsy-prediction-service/predict'
saving_url = 'https://db-queries-service/eeg_chunks/add' 

@app.route('/', methods=['POST'])
def new_eeg_data_endpoint():
    fk_user = request.get_json()['fk_user']
    eeg_data = request.get_json()['eeg_data']
    register_timestamp = request.get_json()['register_timestamp']

    prediction_payload = {'eeg_data': eeg_data}
    prediction_response = requests.post(prediction_url, json=prediction_payload)
    if prediction_response.status_code != 201:
        return jsonify({'status': 'error', 'message': 'Failed to predict EEG status'}), prediction_response.status_code

    saving_payload = {
        'fk_user': fk_user,
        'eeg_data': eeg_data,
        'epilepsy_prediction_probability': prediction_response.json(),
        'register_timestamp': register_timestamp

    }
    saving_response = requests.post(saving_url, json=saving_payload)
    if saving_response.status_code != 201:
        return jsonify({'status': 'error', 'message': 'Failed to save EEG status'}), prediction_response.status_code
    
    return jsonify({'status': 'success', "message": "Completed", "response": prediction_response.json()}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
