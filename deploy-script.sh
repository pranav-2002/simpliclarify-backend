git pull origin staging
docker build -t singhiharsh/simpliclarify-staging .
docker images
docker ps -q --filter ancestor=singhiharsh/simpliclarify-staging | xargs -r docker stop
docker rm -f simpliclarify-staging
docker run --name simpliclarify-staging -p 8080:8080 --restart always -v /home/ubuntu/.aws/credentials:/home/node/.aws/credentials -d singhiharsh/simpliclarify-staging
docker system prune -f