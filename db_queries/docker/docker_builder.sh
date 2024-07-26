docker build -t fberton98/db_queries:latest .
docker push fberton98/db_queries:latest
#docker run -p 5000:5000 fberton98/db_queries:latest
#curl http://127.0.0.1:5000/app/eeg_chunks/get_list