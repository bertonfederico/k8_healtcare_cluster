#!/bin/bash

# Prompt for IP addresses for the Master node
read -p "Enter the IP address for the Master node: " MASTER_IP
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
      addresses: [$MASTER_IP/24]
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
$MASTER_IP controller  controller.example.com
$MASTER_IP controller.provaspray.local controller node1
EOF"


##########################
# Step 3: Set the hostname
##########################
echo "controller" | sudo tee /etc/hostname

# Reboot the system to apply the hostname changes
sudo reboot
