import unittest
from unittest.mock import patch, MagicMock
from flask import json
from app import app

class DbConnectionSmokeTest(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('app.mysql.connector.connect')
    def test_add_eeg_data_prediction_chunk(self, mock_connect):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        data = {
            'fk_user': 1,
            'eeg_data': [0.1, 0.2, 0.3],
            'epilepsy_prediction_probability': 0.85,
            'register_timestamp': '2024-08-30 12:34:56'
        }

        response = self.app.post('/eeg_chunks/add', data=json.dumps(data), content_type='application/json')

        mock_cursor.execute.assert_called_once_with(
            "INSERT INTO eeg_data_table (fk_user, eeg_data, epilepsy_prediction_probability, register_timestamp) \
            VALUES (%s, %s, %s, %s)",
            (1, json.dumps(data['eeg_data']), data['epilepsy_prediction_probability'], data['register_timestamp'])
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json, {'status': 'success'})

if __name__ == '__main__':
    unittest.main()
