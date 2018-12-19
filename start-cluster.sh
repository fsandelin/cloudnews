npm run --prefix frontend build

minikube start
eval $(minikube docker-env)

chmod +x docker-build.sh
./docker-build.sh

kubectl apply -f microservices/nginx-node.yaml
kubectl apply -f microservices/middleware.yaml
kubectl apply -f microservices/news-service.yaml
kubectl apply -f microservices/polisen.yaml
kubectl apply -f microservices/twitter.yaml

chmod +x microservices/mongodb_service/generate.sh
./microservices/mongodb_service/generate.sh

kubectl get services

sleep 10

chmod +x microservices/mongodb_service/configure_repset_auth.sh
./microservices/mongodb_service/configure_repset_auth.sh

kubectl port-forward svc/nginx-node-svc 80:80 &
kubectl port-forward svc/middleware-svc 8091:8091 &
