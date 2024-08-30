# Use the base image of Python
FROM python:3.9-slim

# Install Java
RUN apt-get update && apt-get install -y openjdk-17-jre-headless && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the requirements files
COPY requirements.txt /app/
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install the testing dependencies (unittest is included in Python standard library)
RUN pip install --no-cache-dir unittest

# Copy the unit test file
COPY unit_test.py /app/unit_test.py

# Expose the port that Flask will listen on
EXPOSE 5000

# Default command to start the Flask app
CMD ["python", "app.py"]
