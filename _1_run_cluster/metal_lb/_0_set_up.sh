#!/bin/bash

#################################################################
# Step 1: Enable kube_proxy_strict_arp in Kubespray configuration
#################################################################
sed -i 's/^# kube_proxy_strict_arp:.*/kube_proxy_strict_arp: true/' inventory/mycluster/group_vars/k8s_cluster/k8s-cluster.yaml


##########################################################################
# Step 2: Apply MetalLB to the existing cluster using Kubernetes manifests
##########################################################################
# Ensure kube-proxy is in IPVS mode with strict ARP enabled
kubectl get configmap kube-proxy -n kube-system -o yaml | \
sed -e "s/strictARP: false/strictARP: true/" | \
kubectl apply -f - -n kube-system

# Install MetalLB using Kubernetes manifests
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.3/config/manifests/metallb-native.yaml


###############################################
# Step 3: Configure IP address pool for MetalLB
###############################################
# Apply the IPAddressPool and L2Advertisement manifests
read -p "Insert IP interval for MetalLB: " MY_IP_RANGE
envsubst < ipaddresspool.yaml | kubectl apply -f -
kubectl apply -f l2advertisement.yaml

