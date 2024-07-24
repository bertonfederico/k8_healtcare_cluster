from flask import Flask, request, jsonify
import mysql.connector
import os

app = Flask(__name__)

db_config = {
    'user': 'root',
    'password': os.getenv('MYSQL_PASSWORD'),
    'host': 'mysql',
    'database': 'clusterdb'
}

@app.route('/add_user', methods=['POST'])
def add_data():
    data = request.json
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "INSERT INTO users (name, email) VALUES (%s, %s)"
    cursor.execute(query, (data['name'], data['email']))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({'status': 'success'}), 201

@app.route('/query_users', methods=['GET'])
def query_data():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
