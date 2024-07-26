from flask import Flask, request, jsonify
import json
import mysql.connector
import os
from datetime import datetime

app = Flask(__name__)

db_config = {
    'user': 'root',
    'password': os.getenv('MYSQL_PASSWORD'),
    'host': 'mysql',
    'database': 'clusterdb'
}

@app.route('/users/add', methods=['POST'])
def add_user():
    data = request.json
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "INSERT INTO users (name, email) VALUES (%s, %s)"
    cursor.execute(query, (data['name'], data['email']))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({'status': 'success'}), 201

@app.route('/users/get_list', methods=['GET'])
def get_users_list():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(results)

@app.route('/eeg_chunks/add', methods=['POST'])
def add_egg_data_prediction_chunk():
    data = request.json
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "INSERT INTO eeg_data_table (fk_user, eeg_data, epilepsy_prediction_probability, register_timestamp) \
                VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (data['fk_user'], data['eeg_data'], data['epilepsy_prediction_probability'], datetime.now()))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({'status': 'success'}), 201

@app.route('/eeg_chunks/get_user_list', methods=['GET'])
def get_egg_data_prediction_chunks():
    fk_user = request.args.get('fk_user')
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM eeg_data_table WHERE fk_user = %s", (fk_user))
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(results)

@app.route('/eeg_chunks/get_list', methods=['GET'])
def get_egg_data_prediction_chunks():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM eeg_data_table")
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(results)

@app.route('/eeg_chunks/get_last_chunks_list', methods=['GET'])
def get_egg_data_prediction_chunks():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT ed.fk_user, ed.eeg_data, ed.epilepsy_prediction_probability, ed.register_timestamp FROM eeg_data_table ed INNER JOIN (SELECT fk_user, MAX(register_timestamp) AS max_timestamp FROM eeg_data_table GROUP BY fk_user) sub ON ed.fk_user = sub.fk_user AND ed.register_timestamp = sub.max_timestamp;")
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
