# Usa un'immagine base di Python
FROM python:3.9-slim

# Installa Java
RUN apt-get update && apt-get install -y openjdk-17-jre-headless && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file requirements.txt e il codice dell'app nella directory di lavoro
COPY requirements.txt /app/
COPY . /app

# Installa le dipendenze Python
RUN pip install --no-cache-dir -r requirements.txt

# Espone la porta su cui l'app Flask verrà eseguita
EXPOSE 5000

# Comando per eseguire l'app Flask
CMD ["python", "app.py"]
