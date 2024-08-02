from flask import Flask, render_template
import threading
import requests
import time

app = Flask(__name__)

eeg_data_saving = {}
heartbeat_data_saving = {}

db_eeg_url = 'http://db-connection-service/eeg_chunks/get_last_chunks_list'
db_heartbeat_url = 'http://db-connection-service/heartbeat_chunks/get_last_chunks_list'

@app.route('/')
def index():
    return render_template('index.html')

def send_periodic_eeg_requests():
    global eeg_data_saving
    while True:
        try:
            response = requests.get(db_eeg_url)
            if response.status_code == 200:
                eeg_data_saving = response.json()
            else:
                raise SystemError("Error in periodic request")
        except requests.RequestException as e:
            raise SystemError("Error in periodic request")
        time.sleep(5)


def send_periodic_heartbeat_requests():
    global heartbeat_data_saving
    while True:
        try:
            response = requests.get(db_heartbeat_url)
            if response.status_code == 200:
                heartbeat_data_saving = response.json()
            else:
                raise SystemError("Error in periodic request")
        except requests.RequestException as e:
            raise SystemError("Error in periodic request")
        time.sleep(5)

@app.route('/eeg_data', methods=['GET'])
def get_data():
    return eeg_data_saving

@app.route('/heartbeat_data', methods=['GET'])
def get_data():
    return heartbeat_data_saving

if __name__ == '__main__':
    threading.Thread(target=send_periodic_eeg_requests, daemon=True).start()
    threading.Thread(target=send_periodic_heartbeat_requests, daemon=True).start()
    app.run(host='0.0.0.0', port=5000)
