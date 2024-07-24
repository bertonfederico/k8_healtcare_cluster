kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
kubectl apply -f service_account.yml
kubectl apply -f cluster_role_binding.yml
kubectl -n kubernetes-dashboard create token admin-user
kubectl proxy