minikube start
eval $(minikube docker-env)

kubectl apply -f microservices/nginx-node.yaml
kubectl apply -f microservices/middleware.yaml
kubectl apply -f microservices/news-service.yaml
kubectl apply -f microservices/polisen.yaml
kubectl apply -f microservices/twitter.yaml
kubectl apply -f microservices/mongodb-service.yaml

kubectl get services

sleep 10

chmod +x microservices/configure_repset_auth.sh
./microservices/configure_repset_auth.sh

kubectl port-forward svc/nginx-node-svc 80:80 &
kubectl port-forward svc/middleware-svc 8091:8091 &
