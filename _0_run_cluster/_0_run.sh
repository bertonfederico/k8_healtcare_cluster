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



# Creating MetalLB
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.3/config/manifests/metallb-native.yaml
kubectl apply -f ipaddresspool.yaml
kubectl apply -f l2advertisement.yaml 



# Creating external ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f ingress-class.yaml
kubectl apply -f ingress.yaml



# Running deployment and service .yaml files
cd dashboard
sh _run_dashboard.sh
cd ..

cd database
sh _run_service.sh
cd ..

cd db_connection
sh _run_service.sh
cd ..

cd epilepsy_prediction
sh _run_service.sh
cd ..

cd healt_center_web_page
sh _run_service.sh
cd ..

cd new_eeg_data_endpoint
sh _run_service.sh
cd ..

cd new_heartbeat_data_endpoint
sh _run_service.sh
cd ..

cd db_connection
sh _run_service.sh
cd ..