docker login
docker volume create mongodbdata
docker run -d -p 27017:27017 -v mongodbdata:/data/db --name mongodb mongo
docker ps -a