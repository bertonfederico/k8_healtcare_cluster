import unittest
import json
from app import app

class TestEpilepsyPrediction(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_predict(self):
        eeg_data = [12,24,3,47,5,69,7,8,1,1,1,1,1,1,1,1,1,1,112,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,8]
        response = self.app.post('/predict', data=json.dumps({'eeg_data': eeg_data}), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        
        try:
            response_json = response.json
            self.assertIn('response', response_json)
        except (ValueError, AttributeError) as e:
            self.fail(f"Failed to parse JSON response: {e}")


if __name__ == '__main__':
    unittest.main()
