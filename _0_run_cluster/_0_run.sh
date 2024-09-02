###########################################
########## Initializing cluster ###########
###########################################


# Creating MetalLB
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.3/config/manifests/metallb-native.yaml
kubectl apply -f ipaddresspool.yaml
kubectl apply -f l2advertisement.yaml 



# Updating docker images
cd epilepsy_prediction/docker/
sh docker_builder.sh
cd ../..

cd healt_center_web_page/docker/
sh docker_builder.sh
cd ../..

cd new_eeg_data_endpoint/docker/
sh docker_builder.sh
cd ../..

cd new_heartbeat_data_endpoint/docker/
sh docker_builder.sh
cd ../..

cd db_connection/docker/
sh docker_builder.sh
cd ../..



# Running deployment and service .yaml files
cd dashboard
kubectl apply -f deployment_service.yaml
cd ..

cd database
kubectl apply -f deployment_service.yaml
cd ..

cd db_connection
kubectl apply -f deployment_service.yaml
cd ..

cd epilepsy_prediction
kubectl apply -f deployment_service.yaml
cd ..

cd healt_center_web_page
kubectl apply -f deployment_service.yaml
cd ..

cd new_eeg_data_endpoint
kubectl apply -f deployment_service.yaml
cd ..

cd new_heartbeat_data_endpoint
kubectl apply -f deployment_service.yaml
cd ..

cd db_connection
kubectl apply -f deployment_service.yaml
cd ..



# Creating Ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f ingress-class.yaml
kubectl apply -f ingress.yaml
