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


## 🛠️ Infrastructure design and automation
![Mater node (11)](https://github.com/user-attachments/assets/f45197a2-46ac-4dec-83e8-582bef6ae5a4)

### GitHub Actions
GitHub Actions was utilized to automate the entire lifecycle of the development, testing, and deployment processes for the services. Its integration allowed predefined workflows, written in YAML files, to be automatically triggered with every commit or push to the repository.
These workflows included building Docker images, running unit tests, creating temporary test environments, and finally updating production deployments if all tests were successful. The use of GitHub Actions ensured a continuous, fast, and reliable process, minimizing manual intervention and enhancing the efficiency of the release pipeline.

### Docker Hub
Docker was employed as the orchestration platform for building, managing, and distributing services developed in Python using the Flask framework.
The resulting Docker images were then published on DockerHub, making them accessible for distribution across various platforms and environments. This approach not only ensures that the services are encapsulated in an isolated and reproducible environment but also streamlines the development, integration, and continuous deployment cycle, fostering a reliable and scalable release pipeline.

### Server simulation
A Kubernetes cluster can be deployed using virtual machines on a standard laptop. Specifically, two Linux VMs can be created: one as the Master node and the other as the Worker node.
The Master node oversees the entire cluster, coordinating the various services. Its key functions include:
- **API Server**: Handles incoming requests (via REST API) and serves as the primary interface for interacting with the cluster.
- **etcd**: Stores cluster configuration data in a distributed and consistent manner. It acts as Kubernetes' "database."
- **Controller Manager**: Runs controllers that monitor the cluster's state and ensure it matches the desired state (for example, it manages pod replication).
- **Scheduler**: Determines which node should run a new Pod, considering factors like available resources, affinity, and more.
The Worker node is responsible for actually running the applications in the form of containers. Its main functions include:
- **Kubelet**: The node agent responsible for managing pods. It ensures containers are running as specified and communicates with the master’s API server.
- **Kube-proxy**: Manages network rules on the nodes, enabling communication between different services within the cluster.
- **Container Runtime**: The component that actually runs the containers (e.g., Docker, containerd).

The virtual machines can be configured in different network modes based on the requirements:
- If communication is needed only between the Master and Worker nodes and not with external devices, configuring the VMs with a "NAT network" is sufficient. This setup isolates the cluster from external networks while allowing internal communication between the nodes.
- To enable communication between the Kubernetes cluster and external devices (such as the host laptop containing the VMs or other devices on the same Wi-Fi network), the VMs should be configured with a "Bridge adapter" network setting. This configuration allows the cluster to interact with both the host system and other devices on the network.

Once the VMs are created, they mmust be configured:
- Modify the netplan configuration file to set the static IP address. The file is usually located in ***/etc/netplan/***, and it might be named something like ***01-netcfg.yaml*** or ***01-network-manager-all.yaml***.
- To ensure proper hostname resolution within the cluster, edit ***/etc/hosts*** and ***/etc/hostname*** in both the Master and Worker.
- Install Kubernetes

### Ngrok tunnel
Ngrok was employed to expose the Kubernetes master node within a virtual machine (VM) to facilitate integration with GitHub Actions. Despite the use of a bridge adapter in the VM configuration, the connection to the external network is confined to the subnet of the Wi-Fi in use. Ngrok enabled the creation of a secure tunnel by providing a public URL for the Kubernetes master node. This approach allowed communication between the Kubernetes server and GitHub Actions, overcoming the limitations imposed by the VM's network configuration and facilitating automation and continuous integration without the need for changes to the physical network configuration.
After creating your own token in the Ngrok account, you can crare the tunnel connection with the Master node via a TCP link:
```sh
# Installing Ngrok
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
    && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list \
    && sudo apt update && sudo apt install ngrok

# Connecting to your account with authtoken
ngrok config add-authtoken <AUTHTOKEN>

# Starting TCP tunnel
ngrok tcp 22
```

## 🖧 Kubernetes cluster developement
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

## 🚀 DevOps automation
Through the implementation of an automated pipeline based on GitHub Actions, a structured process for the continuous lifecycle management of software services has been implemented. This automated mechanism is triggered by commits or pushes made to the repository, ensuring a series of sequential operations that are critical to maintaining software quality.

In detail, the automated process encompasses updating Docker images, running unit tests in locally, creating temporary test deployments and services, and finally updating the deployments and services in production. This continuous integration and deployment (CI/CD) mode not only optimizes workflow, but also ensures a safe and reliable software release cycle, minimizing the risk of introducing errors into production versions.

### Initialize CI/CD environment
First and foremost, within the `.github/workflows` directory of the repository, a dedicated `.yaml` file must be created for each service for which an automated workflow is to be developed, intended to be executed following every commit or push.
```yaml
name: CI/CD Pipeline DB Connection
on:
  push:
    branches:
      - main
    paths:
      - '_2_services/db_connection/docker/**'
```

### Updating Docker images
Subsequently, the process for updating the Docker image of the service must be meticulously defined. At this stage, the image will be generated with a `test` tag, as it will initially be employed for testing purposes.
```yaml
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    - name: Build and push Docker images
      run: |
        cd _2_services/db_connection/docker
        docker build -t fberton98/db_connection:test .
        docker push fberton98/db_connection:test
```

### Running Unittest
After the release of the new version's image, it is essential to conduct a thorough verification of the service's functionality in a local environment. This preliminary testing phase is crucial to ensure that the changes introduced have not caused regressions or critical defects.

In the context of these tests, Mocks are employed—tools that simulate the behavior of dependent components—to isolate and focus the analysis exclusively on the service under examination. The use of Mocks is vital for replicating external interactions (originating from other microservices) without relying on actual production resources or environments, thus enabling an accurate and controlled evaluation of the newly implemented features or fixes.
```yaml
    runs-on: ubuntu-latest
    needs: build
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    - name: Run Unit Tests
      run: |
        docker run --rm fberton98/db_connection:test python -m unittest discover -s /app || { echo 'Unit tests failed'; exit 1; }    
```
```python
    @patch('app.mysql.connector.connect')
    def test_add_eeg_data_prediction_chunk(self, mock_connect):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        data = { ... }        }

        response = self.app.post('/eeg_chunks/add', data=json.dumps(data), content_type='application/json')

        mock_cursor.execute.assert_called_once_with(
            "INSERT INTO eeg_data_table (...) VALUES (...)",
            (...)
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json, {'status': 'success'})
```

### Creation of temporary Test Deployments/Services
If the unit tests are successful, the next step involves creating a temporary deployment and service within the cluster. This phase allows for more thorough testing, ensuring an accurate validation of the service's behavior in an environment that simulates real operational conditions and interacts with other actual microservices.
It is therefore essential to establish an SSH connection to the Master node server, initiate the creation of the new test deployments and services, and await their activation before proceeding with the testing phase. Regardless of the result of this test, such items will be removed from the cluster.
```yaml
  cluster-test:
    runs-on: ubuntu-latest
    needs: unit-test
    steps:
    - name: Install sshpass
      run: sudo apt-get install -y sshpass
    - name: Test Deployment
      env:
        SSH_USER: ${{ secrets.SSH_USER }}
        SSH_PASSWORD: ${{ secrets.SSH_PASSWORD }}
        SSH_HOST: ${{ secrets.SSH_HOST }}
        SSH_PORT: ${{ secrets.SSH_PORT }}
      run: |
        sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_HOST <<EOF
          set -e
          cd k8_healtcare_cluster/_2_services/db_connection/test
          kubectl apply -f deployment_service_test.yaml
          trap 'kubectl delete -f deployment_service_test.yaml' EXIT
          kubectl wait --for=condition=available --timeout=600s deployment/db-connection-deployment-test
          POD_NAME=\$(kubectl get pods --selector component=db-connection-test -o jsonpath='{.items[0].metadata.name}')
          kubectl wait --for=condition=ready pod/\$POD_NAME --timeout=600s
          echo "Running smoke test..."
          kubectl exec -i \$POD_NAME -- python3 /app/smoke_test.py
          kubectl delete -f deployment_service_test.yam
        EOF
```
```python
   def smoke_test():
       data = { ... }
       response = requests.post('http://db-connection-service-test/eeg_chunks/add', json=data)
       if response.status_code == 201:
           print("Data inserted successfully.")
       else:
           print(f"Failed to insert data: {response.text}")
           return
```

### Updating Deployments/Services in Production
Once the tests are successfully completed, it is essential to update the "latest" tag to point to the image previously labeled as "test." Following this, the deployment should be restarted to propagate the updated image to the production environment within the cluster.
```yaml
  deploy:
    runs-on: ubuntu-latest
    needs: luster-test
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    - name: Install sshpass
      run: sudo apt-get install -y sshpass
    - name: Restart Kubernetes deployment
      env:
        SSH_USER: ${{ secrets.SSH_USER }}
        SSH_PASSWORD: ${{ secrets.SSH_PASSWORD }}
        SSH_HOST: ${{ secrets.SSH_HOST }}
        SSH_PORT: ${{ secrets.SSH_PORT }}
      run: |
        sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_HOST <<EOF
          kubectl rollout restart deployment db-connection-deployment
        EOF
```

## ✔️ Mobile Apps for healt data
### EEG data simulation
In recent years, advanced technologies have been developed for managing electroencephalographic data, involving the implantation of electrodes in the human skull. These electrodes, powered by electrical energy, record brain data and transmit it in real-time to smartphones or directly to cloud platforms. This system enables continuous and immediate monitoring of potential epileptic issues, significantly improving the diagnosis and management of neurological disorders.
To test the developed cluster, an app was created using React Native. This app allows the transmission of previously recorded electroencephalographic data, obtained from diagnostic EEG exams, to the cluster's endpoint service.
To verify the correct reception and processing of data, we can analyze the **Real-Time Data Visualization Microservice** in the browser.
<img src="https://github.com/user-attachments/assets/7ad9eda1-e50d-4d80-8cfe-335c701d22db" alt="Image 1" height="300" style="float: left; margin-right: 10px;">
<img src="https://github.com/user-attachments/assets/e2ba7f11-ddb8-49e8-aa45-9682f341f86f" alt="Image 2" height="300">


### Heartbeat registration
For tests concerning the recording, sharing, and processing of heart rate data, an iOS application available on iPhones was used. This application allows real-time retrieval of data recorded by the Apple Watch and sends it via REST API to the developed cluster's endpoint service. This enables healthcare personnel to monitor and identify potential cardiac issues.
Just as with the EEG data, to verify the accuracy of this recording, you can monitor the trends through the web page service:

![image](https://github.com/user-attachments/assets/49b8d7de-7fe8-404e-9b9a-42a3b5e6baaa)
