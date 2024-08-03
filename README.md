# :stethoscope: Kubernetes cluster for healt care services
![imgonline-com-ua-twotoone-GCy7wO0KEq3PU61A](https://github.com/user-attachments/assets/ea9be852-60f6-4754-aec2-551076799b25)

## 🔍 Introduction
In the digital age, healthcare is undergoing a monumental transformation driven by advanced technologies. My project leverages the power of Kubernetes to significantly improve access to and quality of healthcare for populations. By using cutting-edge medical devices to collect clinical data, this innovative system enables the accurate and continuous recording of vital signs and other essential health information.

Connected medical devices gather crucial real-time health data, that are securely transmitted to the Kubernetes cluster. Kubernetes, known for its ability to orchestrate containers in a scalable and efficient manner, receives, processes, and stores the data, ensuring their integrity and continuous availability. Once processed, the data are presented through intuitive interfaces accessible to healthcare professionals, allowing for continuous and detailed monitoring of patients' health status. This system not only enhances the speed and accuracy of medical care but also enables predictive analysis, identifying potential risks and optimizing therapeutic responses.

In this project, two primary services are implemented: one concerning the recording of heart rate and another related to cerebral electrical activity.

## 💻 Project Structure
![Add a heading (6)](https://github.com/user-attachments/assets/0593b7d1-3da0-4083-869c-8bc89595e69b)

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

## 🖧 Kubernetes: developement phase
### Docker images
Let us now see how to create an image of the service developed in Python.
After developing the app, you need to define the Dokerfile that contains the information needed to create the image:
```dockerfile
# Use the base image of Python
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements files
COPY requirements.txt /app/
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port that Flask will listen on
EXPOSE 5000

# Command to start the Flask app
CMD ["python", "app.py"]
```

The file "requirements.txt" contains the dependencies that such a service needs.
Finally, to deploy the image you need to run the following commands:
```sh
docker build -t fberton98/new_eeg_data_endpoint:latest .
docker push fberton98/new_eeg_data_endpoint:latest
```


### Services
After creating the service image, you need to start the service in the Kubernetes cluster. To do this, it is a good idea to create a ***deployment_service.yaml*** file that contains the DEPLOYMENT and SERVICE parts:
```yaml
###
apiVersion: apps/v1
kind: Deployment
metadata:
  name: new-eeg-data-endpoint-deployment
spec:
  selector:
    matchLabels:
      app: eeg-app
      component: new-eeg-data-endpoint
  template:
    metadata:
      labels:
        app: eeg-app
        component: new-eeg-data-endpoint
    spec:
      containers:
      - name: new-eeg-data-endpoint
        image: fberton98/new_eeg_data_endpoint:latest        # Docker image to use
        ports:
        - containerPort: 5000                                # port setted up in Dockerfile
        resources:
          limits:
            cpu: 400m
          requests:
            cpu: 200m
---
apiVersion: v1
kind: Service
metadata:
  name: new-eeg-data-endpoint-service
  labels:
    app: eeg-app
    component: new-eeg-data-endpoint
spec:
  selector:
    app: eeg-app
    component: new-eeg-data-endpoint
  ports:
    - protocol: TCP
      port: 80                                               # port where to expose this service
      targetPort: 5000                                       # port setted up in Dockerfile
  type: LoadBalancer                                         # distributes incoming traffic across multiple nodes/pods
```
Then such DEPLOYMENT and SERVICE can be started:
```sh
kubectl apply -f deployment_service.yaml
```

### Database
- PersistentVolume creation: provides persistent, shared storage on a node for MySQL database data
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql-pv
spec:
  capacity:
    storage: 2Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  hostPath:
    path: /mnt/data/mysql
```
- PersistentVolumeClaim creation: requests a specific amount of storage from the PersistentVolume for use by MySQL pods
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
```
- ConfigMap creation: configures and provides custom configuration files and parameters for the MySQL server
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-config
data:
  my.cnf: |
    [mysqld]
    skip-host-cache
    skip-name-resolve
    log-error=/var/lib/mysql/error.log
    pid-file=/var/run/mysqld/mysqld.pid
    sql-mode="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION"
```
- Secret creation: stores and manages sensitive information, such as the MySQL root password, securely
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
type: Opaque
data:
  mysql-root-password: ---
```
- DEPLOYMENT creation: manages the creation and updating of MySQL pods, ensuring that the desired number of replicas is always running and applying the necessary configurations and secrets for the database operation
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  selector:
    matchLabels:
      app: mysql
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - image: mysql:5.7
        name: mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: mysql-root-password
        ports:
        - containerPort: 3306
          name: mysql
        volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
        - name: config-volume
          mountPath: /etc/mysql/conf.d
      volumes:
      - name: mysql-persistent-storage
        persistentVolumeClaim:
          claimName: mysql-pvc
      - name: config-volume
        configMap:
          name: mysql-config
```

### HorizontalPodAutoscalers
To dynamically adjust the number of pod replicas in a deployment or replica set, the **Horizontal Pod Autoscaler (HPA)** uses observed CPU utilization or other selected metrics. This capability ensures your application scales efficiently to handle varying workloads, optimizing performance and resource utilization:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: new-eeg-data-endpoint-hpa
  namespace: default
spec:
  minReplicas: 1                    # defining minimum number of replicas
  maxReplicas: 10                   # defining maximum number of replicas
  metrics:
  - resource:
      name: cpu
      target:
        averageUtilization: 50      # target average CPU utilization across all pods
        type: Utilization
    type: Resource
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: new-eeg-data-endpoint-deployment
```
This requires that the following be established in the DEPLOYMENTS:
- the minimum amount of CPU guaranteed to the container
- the maximum amount of CPU that the container can use
```yaml
        resources:
          limits:
            cpu: 400m
          requests:
            cpu: 200m
```

### Ingress
To manage external access to services within a cluster, **Ingress** provides routing rules and load balancing for incoming HTTP or HTTPS traffic.
```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f ingress-class.yaml
kubectl apply -f ingress.yaml
```
```yaml
# ingress-class.yaml
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: nginx
spec:
  controller: k8s.io/ingress-nginx
---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress
  namespace: default
spec:
  ingressClassName: nginx
  rules:
  - host: healtcare-cluster.com                            # host for the selected service
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: healt-center-web-page-service           # selected service
            port:
              number: 80                                  # port where to expose this service
```

### Dashboard
In order to dynamically manage the Kuebrnetes cluster, it is possible to create a dashboard, which is a web-based user interface that provides a graphical interface for managing and displaying cluster resources:
```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
kubectl apply -f service_account.yml
kubectl apply -f cluster_role_binding.yml
kubectl -n kubernetes-dashboard create token admin-user
kubectl proxy
```
```yaml
### service_account.yml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
---
### cluster_role_binding.yml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
```

## ✔️ Kubernetes: test phase
### Server simulation

### EEG data simulation

### Heartbeat registration
