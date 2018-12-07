docker run --name twitter -d twitter-service:latest
docker run --name polisen -p 4002:4002 -d polisen-service:latest
docker run --name news-service -p 3000:3000 -d news-service:latest
docker run --name middleware -p 3001:3001 -p 5001:5001 -d middleware:latest
docker run --name nginx-node -p 80:8080 -e "NODE_PORT=5000" -d nginx-node:latest
