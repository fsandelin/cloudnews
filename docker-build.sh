docker build -t nginx-node:latest ./backend/
docker build -t news-service:latest ./backend/news-service/
docker build -t middleware:latest ./backend/middleware/
docker build -t polisen-service:latest ./polisen/
docker build -t twitter-service:latest ./twitter/