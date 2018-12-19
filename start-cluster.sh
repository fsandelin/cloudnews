npm run --prefix frontend build

minikube start
eval $(minikube docker-env)

chmod +x docker-build.sh
./docker-build.sh

kubectl apply -f microservices.yaml
kubectl get services

chmod +x microservices/mongodb_service/generate.sh
./microservices/mongodb_service/generate.sh

chmod +x microservices/mongodb_service/configure_repset_auth.sh
./microservices/mongodb_service/configure_repset_auth.sh

kubectl port-forward svc/nginx-node-svc 80:80 &
kubectl port-forward svc/middleware-svc 8091:8091 &
