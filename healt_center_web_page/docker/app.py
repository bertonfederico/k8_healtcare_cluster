from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

eeg_data = {
    "Federico\r\nBerton": {"eegData": [12,24,3,47,5,69,7,8,1,1,1,1,1,1,1,1,1,1,112,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,8], "probability": 0.4, "datetime" : '2020-07-30T18:00:00.000Z'}
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/update', methods=['POST'])
def update():
    data = request.json
    name = data['name']
    eeg_data[name] = {
        'eegData': data['eegData'],
        'probability': data['probability'],
        'datetime': data['datetime'],
    }
    return jsonify(success=True)

@app.route('/data', methods=['GET'])
def get_data():
    return jsonify([{'name': name, 'eegData': data['eegData'], 'probability': data['probability'], 'datetime': data['datetime']}
                    for name, data in eeg_data.items()])

if __name__ == '__main__':
    app.run(debug=True)
