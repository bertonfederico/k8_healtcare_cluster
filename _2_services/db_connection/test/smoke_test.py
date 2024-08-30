import requests
import mysql.connector
import os
from datetime import datetime

# Configurazione del database
db_config = {
    'user': 'root',
    'password': os.getenv('MYSQL_PASSWORD'),
    'host': 'mysql',
    'database': 'clusterdb'
}

def test_add_and_cleanup():
    data = {
        'fk_user': 1,
        'eeg_data': [0.1, 0.2, 0.3],
        'epilepsy_prediction_probability': 0.75,
        'register_timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    response = requests.post('http://db-connection-service-test/eeg_chunks/add', json=data)
    
    if response.status_code == 201:
        print("Data inserted successfully.")
    else:
        print(f"Failed to insert data: {response.text}")
        return
    
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM eeg_data_table WHERE fk_user = %s AND register_timestamp = %s", 
                   (data['fk_user'], data['register_timestamp']))
    inserted_data = cursor.fetchall()
    cursor.close()
    connection.close()

    if inserted_data:
        print("Data exists in the database.")
        
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("DELETE FROM eeg_data_table WHERE fk_user = %s AND register_timestamp = %s",
                       (data['fk_user'], data['register_timestamp']))
        connection.commit()
        cursor.close()
        connection.close()
        
        print("Data cleaned up from the database.")
    else:
        print("Data not found in the database.")

if __name__ == '__main__':
    test_add_and_cleanup()
