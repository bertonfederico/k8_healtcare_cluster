################################################################
########## Initializing cluster and related services ###########
################################################################

# Creating MetalLB
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.3/config/manifests/metallb-native.yaml
kubectl apply -f ./metal_lb/ipaddresspool.yaml
kubectl apply -f ./metal_lb/l2advertisement.yaml

# Creating persistent database
kubectl apply -f ./database/_run_service.yaml
mysql -u root -p clusterdb < ./database/_db_creation.sql

# Updating docker images
sh ../_2_services/epilepsy_prediction/docker/docker_builder.sh
sh ../_2_services/healt_center_web_page/docker/docker_builder.sh
sh ../_2_services/new_eeg_data_endpoint/docker/docker_builder.sh
sh ../_2_services/new_heartbeat_data_endpoint/docker/docker_builder.sh
sh ../_2_services/db_connection/docker/docker_builder.sh

# Running deployments and services
kubectl apply -f ../_2_services/db_connection/deployment_service.yaml
kubectl apply -f ../_2_services/epilepsy_prediction/deployment_service.yaml
kubectl apply -f ../_2_services/healt_center_web_page/deployment_service.yaml
kubectl apply -f ../_2_services/new_eeg_data_endpoint/deployment_service.yaml
kubectl apply -f ../_2_services/new_heartbeat_data_endpoint/deployment_service.yaml

# Creating Ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f ./ingress/ingress-class.yaml
kubectl apply -f ./ingress/ingress.yaml

# Creating metric saver for HPA
kubectl apply -f ./metric_saver_hpa/metric-saver-components.yaml

# Installing, connecting and starting Ngrok
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
    && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list \
    && sudo apt update && sudo apt install ngrok
ngrok config add-authtoken "AUTHTOKEN"
ngrok tcp 22
