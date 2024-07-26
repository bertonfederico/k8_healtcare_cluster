from flask import Flask, jsonify, request, send_from_directory
from flask_sock import Sock
import json

app = Flask(__name__)
sock = Sock(app)

data = [
    {"id": 1, "value": "A"},
    {"id": 2, "value": "B"},
    {"id": 3, "value": "C"}
]

clients = []

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def add_data():
    new_data = request.json
    data.extend(new_data)
    for client in clients:
        client.send(json.dumps(new_data))
    return jsonify(new_data), 201

@sock.route('/ws')
def websocket(ws):
    clients.append(ws)
    ws.send(json.dumps(data))
    while True:
        message = ws.receive()
        if message is None:
            break
    clients.remove(ws)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
