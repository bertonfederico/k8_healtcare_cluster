docker build -t fberton98/db_saving:latest .
docker push fberton98/db_saving:latest
docker run -p 5000:5000 db_saving