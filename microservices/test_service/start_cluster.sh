minikube start
eval $(minikube docker-env)

cd invoices_svc
npm init
npm install express
npm install request-promise
npm install request
docker build -t invoices_svc:v2 .

cd ../auth_svc
npm init
npm install express
docker build -t auth_svc:v1 .

cd ../expected_date_svc
npm init
npm install express
npm install moment 
docker build -t expected_date_svc:v1 .

cd ../kube
kubectl apply -f ambassador.yaml
kubectl apply -f auth_svc.yaml
kubectl apply -f expected_date_svc.yaml
kubectl apply -f invoices_svc.yaml

kubectl get services
minikube service ambassador --url
