docker build -t fberton98/db_connection:latest .
docker push fberton98/db_connection:latest
#docker run -p 5000:5000 fberton98/db_connection:latest
#curl http://127.0.0.1:5000/app/eeg_chunks/get_list