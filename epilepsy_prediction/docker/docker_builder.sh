docker build -t fberton98/epilepsy_prediction:latest .
docker push fberton98/epilepsy_prediction:latest
#docker run -p 5000:5000 fberton98/epilepsy_prediction:latest
#curl -k -X POST http://127.0.0.1:5000/predict -H "Content-Type: application/json" -d '{"eeg_data": [12,24,3,47,5,69,7,8,1,1,1,1,1,1,1,1,1,1,112,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,812,24,3,47,5,69,7,8]}'