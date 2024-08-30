# Use the base image of Python
FROM python:3.9-slim

# Install Java
RUN apt-get update && apt-get install -y openjdk-17-jre-headless && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the requirements file first
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code and tests
COPY . /app

# Expose the port
EXPOSE 5000

# Default command to start the Flask app
CMD ["python", "app.py"]
