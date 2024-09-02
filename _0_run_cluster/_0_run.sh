################################################################
########## Initializing cluster and related services ###########
################################################################


# Creating MetalLB
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.3/config/manifests/metallb-native.yaml
kubectl apply -f ipaddresspool.yaml
kubectl apply -f l2advertisement.yaml 



# Updating docker images
cd ..
cd _2_services/epilepsy_prediction/docker/
sh docker_builder.sh
cd ../..

cd _2_services/healt_center_web_page/docker/
sh docker_builder.sh
cd ../..

cd _2_services/new_eeg_data_endpoint/docker/
sh docker_builder.sh
cd ../..

cd _2_services/new_heartbeat_data_endpoint/docker/
sh docker_builder.sh
cd ../..

cd _2_services/db_connection/docker/
sh docker_builder.sh
cd ../../..



# Running deployment and service .yaml files
cd _2_services/database
kubectl apply -f run_service.yaml
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
cd ../..



# Creating Ingress
cd _0_run_cluster
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f ingress-class.yaml
kubectl apply -f ingress.yaml
