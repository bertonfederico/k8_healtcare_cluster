# Usa l'immagine di base di Python
FROM python:3.9-slim

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di requirements
COPY requirements.txt .

# Installa le dipendenze
RUN pip install --no-cache-dir -r requirements.txt

# Copia il resto dell'applicazione
COPY . .

# Espone la porta su cui Flask ascolterà
EXPOSE 5000

# Comando per avviare l'app Flask
CMD ["python", "app.py"]