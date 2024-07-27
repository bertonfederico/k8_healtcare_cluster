from flask import Flask, render_template
import threading
import requests
import time

app = Flask(__name__)

eeg_data_saving = {}

db_url = 'https://db-connection-service/eeg_chunks/get_last_chunks_list'

@app.route('/')
def index():
    return render_template('index.html')

def send_periodic_requests():
    global eeg_data_saving
    while True:
        try:
            response = requests.get(db_url)
            if response.status_code == 200:
                eeg_data_saving = response.json()
        except requests.RequestException as e:
            print(f"Request failed: {e}")
        time.sleep(5)

@app.route('/data', methods=['GET'])
def get_data():
    return eeg_data_saving

if __name__ == '__main__':
    threading.Thread(target=send_periodic_requests, daemon=True).start()
    app.run(host='0.0.0.0', port=5000)
