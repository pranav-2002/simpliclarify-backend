FROM node:14.17.0-alpine3.12
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN apk add tzdata
RUN cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime
RUN echo "Asia/Kolkata" >  /etc/timezone
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 8080

CMD ["npm", "run", "start"]