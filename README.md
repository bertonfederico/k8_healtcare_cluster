# :stethoscope: Kubernetes cluster for healt care services
![imgonline-com-ua-twotoone-GCy7wO0KEq3PU61A](https://github.com/user-attachments/assets/ea9be852-60f6-4754-aec2-551076799b25)

## 🔍 Introduction
In the digital age, healthcare is undergoing a monumental transformation driven by advanced technologies. My project leverages the power of Kubernetes to significantly improve access to and quality of healthcare for populations. By using cutting-edge medical devices to collect clinical data, this innovative system enables the accurate and continuous recording of vital signs and other essential health information.

Connected medical devices gather crucial real-time health data, that are securely transmitted to the Kubernetes cluster. Kubernetes, known for its ability to orchestrate containers in a scalable and efficient manner, receives, processes, and stores the data, ensuring their integrity and continuous availability. Once processed, the data are presented through intuitive interfaces accessible to healthcare professionals, allowing for continuous and detailed monitoring of patients' health status. This system not only enhances the speed and accuracy of medical care but also enables predictive analysis, identifying potential risks and optimizing therapeutic responses.

In this project, two primary services are implemented: one concerning the recording of heart rate and another related to cerebral electrical activity.

## 💻 Project Structure

The project is structured to ensure efficient and secure management of clinical data through a microservices-based architecture. The core component of the system is a persistent database designed to securely store all incoming data. This database serves as the central repository, allowing for continuous storage and access to clinical data.

### Microservices

The system is divided into several microservices, each with a specific function:

1. **Electroencephalographic (EEG) Data Acquisition Microservice:**
   This service is responsible for listening to and receiving electroencephalographic (EEG) data from connected subjects. It utilizes secure communication protocols to ensure data integrity during transmission.

2. **Heart Rate Monitoring Microservice:**
   This service handles the acquisition of heart rate data from connected subjects, receiving real-time data through compatible wearable devices.

3. **Predictive EEG Processing Microservice:**
   Utilizing a neural network-based predictive algorithm, this microservice processes EEG data to determine the presence of epileptic episodes. The algorithm has been trained on a comprehensive dataset to ensure high accuracy and reliability.

4. **Database Query Microservice:**
   This service facilitates querying the persistent database, allowing for the insertion of new data and retrieval of previously recorded data. It provides API interfaces to enable interaction with other system components.

5. **Real-Time Data Visualization Microservice:**
   Designed to expose recorded data in real-time, this microservice provides a web page accessible to healthcare personnel. The web page is continuously updated to reflect the most recent data, offering a comprehensive view of patient health status.

### Test Applications and Integration

To support system development and validation, a test application has been created to simulate the transmission of electroencephalographic data. This application uses previously saved EEG data to emulate real-world scenarios of data acquisition and transmission.

Additionally, an existing iPhone application has been integrated to extract heart rate data recorded by the Apple Watch and transmit it in real-time to a dedicated REST API. This integration allows the use of widely available and reliable devices for heart rate data collection.

