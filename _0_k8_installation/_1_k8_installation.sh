#!/bin/bash

# Prompt for IP addresses for the Master and Worker nodes
read -p "Enter the IP address for the Master node: " MASTER_IP
read -p "Enter the IP address for the Worker node: " WORKER_IP

# Install SSH server on all nodes
sudo apt install -y openssh-server

# Generate SSH key pair for passwordless login (do not set a password)
ssh-keygen -t rsa -N ""

# Copy the public key to all nodes for passwordless SSH
ssh-copy-id "$MASTER_IP"
ssh-copy-id "$WORKER_IP"

# Edit sudoers file to allow passwordless sudo for the root and current users
sudo bash -c 'echo -e "root ALL=(ALL) NOPASSWD: ALL\n$CURRENT_USER ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers'

# Install Python and upgrade pip on all nodes
sudo apt install -y python3-pip
sudo pip3 install --upgrade pip

# Install Git and clone the Kubespray repository on the master node
sudo apt install -y git
git clone https://github.com/kubernetes-sigs/kubespray.git
cd kubespray

# Install required Python packages for Kubespray
sudo pip install -r requirements.txt

# Copy the sample inventory and configure IP addresses for the nodes
cp -rfp inventory/sample inventory/mycluster
declare -a IPS=("$MASTER_IP" "$WORKER_IP")
CONFIG_FILE=inventory/mycluster/hosts.yaml python3 contrib/inventory_builder/inventory.py ${IPS[@]}

# Modify the DNS servers and other cluster parameters in the Ansible inventory files
nano inventory/mycluster/group_vars/all/all.yml  # Set DNS servers (e.g., 8.8.8.8, 8.8.4.4)
nano inventory/mycluster/group_vars/k8s-cluster/k8s-cluster.yml  # Configure Kubernetes network settings

# Deploy the Kubernetes cluster using Ansible
ansible-playbook -i inventory/mycluster/hosts.yaml --become --become-user=root cluster.yml

# Install kubectl for managing the cluster
sudo snap install kubectl --classic

# Configure kubectl for a non-root user
sudo cp /etc/kubernetes/admin.conf "$HOME/config"
mkdir -p ~/.kube
sudo cp -i /etc/kubernetes/admin.conf ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
