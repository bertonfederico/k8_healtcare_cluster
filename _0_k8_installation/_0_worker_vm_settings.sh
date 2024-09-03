#!/bin/bash

# Prompt for IP addresses for the Worker node
read -p "Enter the IP address for the Worker node: " WORKER_IP
read -p "Enter the gateway IP: " GATEWAY_IP
read -p "Enter the DNS servers (comma-separated): " DNS_SERVERS


##########################################
# Step 1: Configure the network interfaces
##########################################
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

# Apply the network configuration
sudo netplan apply


#########################################
# Step 2: Update /etc/hosts on both nodes
#########################################
sudo bash -c "cat >> /etc/hosts <<EOF
$WORKER_IP worker-1  worker-1.example.com
$WORKER_IP worker-1.provaspray.local worker-1  node2
EOF"


##########################
# Step 3: Set the hostname
##########################
echo "worker-1" | sudo tee /etc/hostname

# Reboot the system to apply the hostname changes
sudo reboot
