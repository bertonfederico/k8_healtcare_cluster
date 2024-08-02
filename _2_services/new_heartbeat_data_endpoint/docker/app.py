from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

saving_url = 'http://db-connection-service/heartbeat_chunks/add'

@app.route('/', methods=['POST'])
def new_heartbeat_endpoint():
    json_data = request.get_json()['data']
    heartbeat_data = json_data['metrics'][0]['data']

    # POST request for saving data in database
    saving_payload = {
        'heartbeat_data': heartbeat_data
    }
    saving_response = requests.post(saving_url, json=saving_payload)
    if saving_response.status_code != 201:
        return jsonify({'status': 'error', 'message': 'Failed to save heartbeat status'}), saving_response.status_code
    
    return jsonify({'status': 'success', "message": "Completed"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
