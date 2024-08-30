import requests
import sys

def smoke_test():
    url = "http://epilepsy-prediction-service-test/predict"
    test_data = {
        "eeg_data": [12,24,3,47,5,69,7,8,1,1,1,1,1,1,1,1,1,1,112,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,8]
        }
    
    try:
        response = requests.post(url, json=test_data)
        if response.status_code == 200 and 'response' in response.json():
            print("Smoke test passed.")
            return 0
        else:
            print("Smoke test failed: Unexpected response")
            return 1
    except Exception as e:
        print(f"Smoke test failed: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(smoke_test())
