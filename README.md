# :stethoscope: Kubernetes cluster for healt care services
![imgonline-com-ua-twotoone-GCy7wO0KEq3PU61A](https://github.com/user-attachments/assets/ea9be852-60f6-4754-aec2-551076799b25)

## 🔍 Introduction
As the capabilities of digital medical devices advance, it becomes essential to have tools for real-time collection and analysis of data generated by these devices. This project aims to develop an advanced Kubernetes-based infrastructure designed to ensure efficient and scalable management of clinical data. Kubernetes, renowned for its ability to orchestrate containers dynamically and resiliently, serves as the hub for receiving, processing and securely storing information, ensuring its integrity and constant availability. Processed data is made accessible through user-friendly interfaces, enabling health care providers to continuously monitor patients' health status in detail. This approach not only enhances the speed and accuracy of clinical decisions, but also enables predictive analytics, identifying potential risks early and optimizing treatment strategies.

In this project, two primary services are implemented: one concerning the recording of heart rate and another related to cerebral electrical activity.

<br><br><br>

## 🛠️ Infrastructure design and automation
First of all, it is critical to carefully examine the design architecture, which is designed, once the Kubernetes cluster is up and running, to ensure advanced automation of the testing and deployment processes in response to each source code change. This automation mechanism relies on the use of GitHub Actions, a framework that enables continuous integration and continuous delivery (CI/CD) in a smooth and efficient manner. For each service, GitHub Actions orchestrate the creation of Docker images, run a full suite of automated tests, and then manage the deployment of the final version to the Kubernetes cluster. 

Let us now delve into the detailed process for achieving this setup: first, it is essential to determine the physical or virtual machines that will be used. Following this, we need to define the configuration for Kubernetes, including the number of nodes and other specifications, and proceed with its installation. Once Kubernetes is set up, we can manage integration with GitHub Actions and Docker Hub to automate workflows and deploy the desired services efficiently.

![image](https://github.com/user-attachments/assets/f20dcfbd-19c8-4df6-9acf-37866c7ac2a9)

### Server simulation and Kubernetes cluster creation
A Kubernetes cluster can be deployed using virtual machines on a standard laptop. Specifically, two Linux VMs can be created: one as the Master node and the other as the Worker node. The Master node oversees the entire cluster, coordinating the various services. Its key functions include:
- API Server: it handles incoming requests (via REST API) and serves as the primary interface for interacting with the cluster.
- etcd: it stores cluster configuration data in a distributed and consistent manner. 
- Controller Manager: it runs controllers that monitor the cluster's state and ensure it matches the desired state.
- Scheduler: it determines which node should run a new Pod, considering factors like available resources, affinity, and more.

The Worker node is responsible for actually running the applications in the form of containers. Its main functions include:
- Kubelet: the node agent responsible for managing pods. It ensures containers are running as specified and communicates with the master’s API server.
- Kube-proxy: it manages network rules on the nodes, enabling communication between different services within the cluster.
- Container Runtime: the component that actually runs the containers (e.g., Docker).

The virtual machines can be configured in different network modes based on the requirements:
- If communication is needed only between the Master and Worker nodes and not with external devices, configuring the VMs with a NAT network is sufficient. This setup isolates the cluster from external networks while allowing internal communication between the nodes.
- To enable communication between the Kubernetes cluster and external devices (such as the host laptop containing the VMs or other devices on the same Wi-Fi network), the VMs should be configured with a Bridge adapter network setting. This configuration allows the cluster to interact with both the host system and other devices on the network.

Once the VMs are created, they must be configured for IP address and hostname [1]:
- Modify the netplan configuration file to set the static IP address. The file is usually located in /etc/netplan/, and it might be named something like 01-netcfg.yaml or 01-network-manager-all.yaml.
- To ensure proper hostname resolution within the cluster, edit /etc/hosts and /etc/hostname in both the Master and Worker.
At this stage, the installation of Kubernetes can proceed. A straightforward method for this process is to use Kubespray [1], which simplifies the deployment by automating the setup and configuration of Kubernetes clusters across multiple nodes.

### Ngrok tunnel [4]
Ngrok was employed to expose the Kubernetes master node within a virtual machine to facilitate integration with GitHub Actions. Despite the use of a bridge adapter in the VM configuration, the connection to the external network is confined to the subnet of the Wi-Fi in use. Ngrok enabled the creation of a secure tunnel by providing a public URL for the Kubernetes master node. After creating your own token in the Ngrok account, you can create a tunnel connection with the Master node via a TCP link:

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

### Docker and Docker Hub
Docker was employed as the orchestration platform for building, managing, and distributing services developed in Python using the Flask framework. The following is the information needed to create the image:
```Dockerfile
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

The file requirements.txt contains the dependencies that such a service needs. Finally, to deploy the image we need to build and upload local Docker images to remote registries:
```sh
docker build -t fberton98/new_eeg_data_endpoint:latest .
docker push fberton98/new_eeg_data_endpoint:latest
```

The resulting Docker images were then published on DockerHub, making them accessible for distribution across various platforms and environments. This approach not only ensures that the services are encapsulated in an isolated and reproducible environment but also streamlines the development, integration, and continuous deployment cycle, fostering a reliable and scalable release pipeline.


### GitHub Actions
GitHub Actions is used to automate the entire lifecycle of the development, testing, and deployment processes for the services. Its integration allowed predefined workflows, written in YAML files, to be automatically triggered with every commit or push to the repository. These workflows included building Docker images, running unit tests, creating temporary test environments, and finally updating production deployments if all tests were successful. The use of GitHub Actions ensured a continuous, fast, and reliable process, minimizing manual intervention and enhancing the efficiency of the release pipeline.



<br><br><br>
## 💻 Project deployment
The project is structured to ensure efficient and secure management of clinical data through a services-based architecture. The core component of the system is a persistent database designed to securely store all incoming data. This database serves as the central repository, allowing for continuous storage and access to clinical data.

![image](https://github.com/user-attachments/assets/e3dc27ea-2cfe-4f7a-9e99-fa8ccea1b987)


### Services
The system is divided into several services, each with a specific function:
- Electroencephalographic (EEG) data acquisition: this service is responsible for listening to and receiving electroencephalographic data from connected subjects. 
- Heart rate monitoring: this service handles the acquisition of heart rate data from connected subjects, receiving real-time data through compatible wearable devices.
- Predictive EEG processing: utilizing a neural network-based predictive algorithm, this service processes EEG data to determine the presence of epileptic episodes. The algorithm has been trained on a comprehensive dataset to ensure high accuracy and reliability.
- Database query: this service facilitates querying the persistent database, allowing for the insertion of new data and retrieval of previously recorded data. It provides API interfaces to enable interaction with other system components.
- Real-time data visualization: designed to expose recorded data in real-time, this service provides a web page accessible to healthcare personnel. The web page is continuously updated to reflect the most recent data.


### Test mobile apps
To support system development and validation, a test application has been created to simulate the transmission of electroencephalographic data. This application uses previously saved EEG data to emulate real-world scenarios of data acquisition and transmission.

Additionally, an existing iPhone application has been integrated to extract heart rate data recorded by the Apple Watch and transmit it in real-time to a dedicated REST API. This integration allows the use of widely available and reliable devices for heart rate data collection.
<br><br><br>

## 🖧 Kubernetes services developement
This section delves into the orchestration process of the application layer within the Kubernetes cluster, starting with the procedure for containerizing each service using Docker. Following that, the execution of unit tests to validate the behavior of the individual service will be outlined. If successful, the implementation of tests that verify the proper functioning of basic functionality of a service in the cluster itself will be addressed. Finally, the definitive deployment will be carried out, ensuring the service's integration into the production system.

### Kubernetes deployments and services
After building a Docker service image, it is possible to deploy it in the Kubernetes cluster. To accomplish this efficiently, create a deployment_service.yaml file that includes both the deployment and relative service configurations. 

A Deployment manages the creation and updating of pods (operating units), whereas a Service, exposes a group of pods, allowing them to be accessed permanently by other services or users, regardless of the individual pods that may be created or destroyed. For the deployment, the following key parameters are specified: 

```yaml
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
        image: fberton98/new_eeg_data_endpoint:latest 
        ports:
        - containerPort: 5000
        resources:
          limits:
            cpu: 400m
          requests:
            cpu: 200m
```
Regarding Service, the following parameters are established:
```yaml
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
      port: 80
      targetPort: 5000
  type: LoadBalancer
```

In relation to deployments, an HorizontalPodAutoscaler (HPA) can be configured to dynamically adjust the number of pod replicas based on resource utilization. The HPA in Kubernetes needs a metrics server to function properly. It collects and provides the HPA with data on pod resource utilization, such as CPU and memory. Without these metrics, the HPA would not be able to determine when to scale the number of pods based on the workload
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
Together, these elements enable effective management and exposure of applications within the cluster, optimizing scalability, resilience, and accessibility.

### MetalLB
To provide load balancing for Kubernetes services in environments such as virtual machines, which lack the native load balancer support offered by public cloud providers, MetalLB can be configured to handle this task [3]. MetalLB offers the following functionalities:
- Exposing services with external IPs: MetalLB assigns external IP addresses to Kubernetes services, making these services accessible outside the cluster. This allows users and external applications within the same subnet to connect to Kubernetes services through designated IP addresses.
- Traffic management: by utilizing ARP (Address Resolution Protocol), MetalLB manages network traffic by assigning external IP addresses and directing it to the appropriate pods within the cluster. This emulates the behavior of a traditional load balancer by ensuring efficient traffic distribution.

To achieve this, we need to [1]:
- Install MetalLB in cluster.
- Configure the IP address pool, creating an IPAddressPool object that defines the range of IP addresses available to MetalLB.


### Database
In the Kubernetes cluster, a persistent MySQL database has been configured to securely store and manage health-related data. This setup involves several key components:
- PersistentVolume: Storage resource in the Kubernetes cluster that provides persistent storage space
- PersistentVolumeClaim: It specifies the amount of storage needed and the access mode. When the PVC is satisfied by a PV, the MySQL pod can mount this storage and use it to save database data
- Secret: Contains the credentials needed to access the database
- Deployment: A Kubernetes resource that automates the creation, updating, and management of MySQL pod

This comprehensive configuration ensures that the MySQL database is capable of maintaining continuous availability and integrity of health-related data within the Kubernetes environment

### Ingress
To manage external access to services within a Kubernetes cluster, Ingress efficiently routes HTTP/S traffic to the appropriate services according to predefined rules. It provides a centralized point for managing incoming traffic, avoiding the need to configure individual services to manage routing. To configure it, it is necessary to:
1. Apply the default configuration (from the official Kubernetes Ingress NGINX repository) for the NGINX Ingress controller, which will manage the routing rules for HTTP/S traffic.
2. Create a new Ingress Class that uses the NGINX controller.

```yaml
# ingress-class.yaml
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: nginx
spec:
  controller: k8s.io/ingress-nginx
```
3. Create an Ingress resource that manages the routing of HTTP/S traffic based on defined rules. It directs traffic to specific services within the cluster depending on the requested hostname and URL path, thereby allowing external access to the services [1]. 
```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress
  namespace: default
spec:
  ingressClassName: nginx
  rules:
  - host: healtcare-cluster.com                           # host for the selected service
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
4.	Edit the /etc/hosts file of your operating system to associate the domain with a specific IP address of Ingress Controller.
![image](https://github.com/user-attachments/assets/4496fbd0-e938-4b59-a0b3-d5e3cc982520)

## 🚀 DevOps automation
Through the implementation of an automated pipeline based on GitHub Actions, a structured process for the continuous lifecycle management of software services has been implemented. This automated mechanism is triggered by commits or pushes made to the repository, ensuring a series of sequential operations that are critical to maintaining software quality. In detail, the automated process encompasses updating Docker images, running unit tests in locally, creating temporary test Deployments and Services, and finally updating the Deployments and Services in production. This continuous integration and deployment (CI/CD) mode not only optimizes workflow, but also ensures a safe and reliable software release cycle, minimizing the risk of introducing errors into production versions.

Let's analyze an example of CI/CD Pipeline, that is, how the automation proceeds after commit and push regarding the db_connection service.

### Initialize CI/CD environment
First and foremost, within the `.github/workflows` directory of the repository, a dedicated YAML file must be created for each service for which an automated workflow is to be developed, intended to be executed following every commit or push.
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
Subsequently, the process for updating the Docker image of the service must be defined. At this stage, the image will be generated with a test tag, as it will initially be employed for testing purposes.
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
In the context of these tests, Mocks are employed to isolate and focus the analysis exclusively on the service under examination. The use of Mocks is vital for replicating external interactions (originating from other services) without relying on actual production resources or environments, thus enabling an isolated evaluation of the newly implemented features or fixes.

The portion of the YAML file about that test is shown below:

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

The Python code segment invoked by the Pipeline for executing the Unit Test is shown below. In this context, the role of Mock is to emulate the execution of the query directed toward the persistent database within the cluster:
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
If the unit tests are successful, the next step involves creating a temporary Deployment and Service within the cluster. This phase allows for more thorough testing, ensuring an accurate validation of the service's behavior in an environment with real operational conditions and interacting with other actual services. It is therefore essential to establish an SSH connection to the Master node server, initiate the creation of the new test Deployments and Services, and await their activation before proceeding with the testing phase. Regardless of the result of this test, such items will be removed from the cluster.

The Deployment/Service test portion of the YAML file is shown below; it utilizes the "Secrets" stored on GitHub, including the hostname and port generated by Ngrok, to establish a connection with the virtual machine hosting the Master node:

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
            ...
        EOF
```
The following section presents the Bash script corresponding to the previously shown code. This portion ensures that the test pod is fully ready before proceeding with the official test, which is conducted by the subsequent Python code. 

![image](https://github.com/user-attachments/assets/33914dca-f64b-4584-84f5-bb4e077cf1dd)
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
f all tests have been successful, we can now proceed with upgrading services in production. As a first step, it is necessary to update the pointing of the latest Docker image to the test one:
```yaml
  image-update:
    runs-on: ubuntu-latest
    needs: cluster-test
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
    - name: Tag and push image if tests pass
      run: |
        docker tag fberton98/db_connection:test fberton98/db_connection:latest
        docker push fberton98/db_connection:latest
```

Next, restarting the corresponding deployment will allow you to build it with the updated image:
```yaml
deploy:
    runs-on: ubuntu-latest
    needs: image-update
    steps:
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

At this stage, the Kubernetes cluster is fully updated, with its functionality assured by the successful completion of all tests.
<br><br><br>

## ✔️ Mobile Apps for healt data
### Real-time EEG data simulation
In recent years, advanced technologies have been developed for managing electroencephalographic data, involving the implantation of persistent electrodes in the human skull. These electrodes, powered by electrical energy, record brain data and transmit it in real-time to smartphones or directly to cloud platforms. This system enables continuous and immediate monitoring of potential epileptic issues, significantly improving the diagnosis and management of neurological disorders.
To test the developed cluster, an app was created using React Native. This app allows the transmission of previously recorded electroencephalographic data (obtained from diagnostic EEG exams) to the cluster's endpoint service. To verify the correct reception and processing of data, we can analyze the real-time data visualization service in the browser.

<img src="https://github.com/user-attachments/assets/7ad9eda1-e50d-4d80-8cfe-335c701d22db" alt="Image 1" height="400" style="float: left; margin-right: 10px;">
<img src="https://github.com/user-attachments/assets/e2ba7f11-ddb8-49e8-aa45-9682f341f86f" alt="Image 2" height="400">

### Heartbeat registration
For tests concerning the recording, sharing, and processing of heart rate data, an iOS application available on iPhones was used. This application allows real-time retrieval of data recorded by the Apple Watch and sends it via REST API to the developed cluster's endpoint service. This enables healthcare personnel to monitor and identify potential cardiac issues. Just as with the EEG data, to verify the accuracy of this recording, we can monitor the trends through the web page service of the cluster.

![image](https://github.com/user-attachments/assets/49b8d7de-7fe8-404e-9b9a-42a3b5e6baaa)

<br><br><br>

## Conclusion remarks
The project developed is a prototype of a Kubernetes cluster designed to manage real-time health information. This system is built to receive, process, and analyze critical health data immediately, allowing healthcare providers to stay continuously informed about patients' current conditions and any potential health issues detected.
The importance of such a system lies in its ability to provide continuous and accurate monitoring, thereby improving the quality and timeliness of medical care. In a healthcare environment where every second counts, the ability to respond quickly in an emergency can make the difference. Moreover, the capability to analyze data in real time allows for the anticipation of potential complications, optimizing the therapeutic path for each patient.

The choice of Kubernetes as the platform for this project is crucial. Kubernetes not only guarantees the scalability necessary to handle large volumes of data but also the reliability and resilience essential in a critical environment like healthcare. With Kubernetes, it's possible to automate the deployment, management, and monitoring of applications, ensuring that the system remains operational and performant even under high usage or hardware failures. Kubernetes' flexibility and self-healing capabilities provide the confidence needed to effectively manage the complexity of a distributed and highly dynamic system like the one proposed.

In summary, the prototype developed represents a significant step towards integrating advanced technologies in the healthcare sector, aiming to enhance patient monitoring and, consequently, the quality of care provided. The combination of a robust infrastructure like Kubernetes with the critical needs of health monitoring can pave the way for new opportunities for future innovations, promoting more responsive, predictive, and personalized healthcare.

<br><br><br>

## References
[1]	Reali, Gianluca. Virtual Network & Cloud Computing, University of Perugia.\
[2]	Kubernetes Documentation. Kubernetes.io. Available: https://kubernetes.io/docs \
[3]	MetalLB project, "MetalLB: A Load-Balancer for Kubernetes on Bare Metal,".  Available: https://metallb.universe.tf \
[4]	Ngrok: Secure introspectable tunnels to localhost. Available: https://ngrok.com 

