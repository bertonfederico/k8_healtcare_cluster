EXTERNAL_IP=$(kubectl get svc flask-app-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl -X POST $EXTERNAL_IP/message -H "Content-Type: application/json" -d '{"message": "Hello, Kubernetes!"}'
