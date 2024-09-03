#!/bin/bash

# Prompt for IP addresses for the Master and Worker nodes
read -p "Enter the IP address for the Master node: " MASTER_IP
read -p "Enter the IP address for the Worker node: " WORKER_IP
read -p "Enter the gateway IP: " GATEWAY_IP
read -p "Enter the DNS servers (comma-separated): " DNS_SERVERS


######################################################
# Step 1: Configure the network interfaces on each VM
######################################################
# On the Master node
sudo bash -c "cat > /etc/netplan/01-network-manager-all.yaml <<EOF
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enp0s3:
      dhcp4: no
      addresses: [$MASTER_IP/24]
      gateway4: $GATEWAY_IP
      nameservers:
        addresses: [$DNS_SERVERS]
EOF"

# On the Worker node
sudo bash -c "cat > /etc/netplan/01-network-manager-all.yaml <<EOF
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enp0s3:
      dhcp4: no
      addresses: [$WORKER_IP/24]
      gateway4: $GATEWAY_IP
      nameservers:
        addresses: [$DNS_SERVERS]
EOF"

# Apply the network configuration on both nodes
sudo netplan apply


#########################################
# Step 2: Update /etc/hosts on both nodes
#########################################
sudo bash -c "cat >> /etc/hosts <<EOF
$MASTER_IP controller  controller.example.com
$WORKER_IP worker-1  worker-1.example.com
$MASTER_IP controller.provaspray.local controller node1
$WORKER_IP worker-1.provaspray.local worker-1  node2
EOF"


######################################
# Step 3: Set the hostname for each VM
######################################
# On the Master node
echo "controller" | sudo tee /etc/hostname

# On the Worker node
echo "worker-1" | sudo tee /etc/hostname

# Reboot the system to apply the hostname changes (on each VM)
sudo reboot


#######################################################################################
# Step 4: Deploy the Kubernetes cluster using Ansible from the controller (Master node)
#######################################################################################
ansible-playbook -i inventory/mycluster/hosts.yaml --become --become-user=root cluster.yml
