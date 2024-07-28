# Updating docker images
sh _update_docker_images.sh

# Running deployment and service .yaml files
sh _run_deployments_services.sh

# Creating external ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f multi-ingress.yaml