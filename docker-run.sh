docker run --name twitter -d twitter-service:latest
docker run --name polisen -p 8080:8080 -d polisen-service:latest
docker run --name news-service -p 3030:3030 -d news-service:latest
docker run --name middleware -p 3000:3000 -d middleware:latest
docker run --name nginx-node -p 80:8080 -e "NODE_PORT=5000" -d nginx-node:latest