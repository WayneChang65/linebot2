FROM node:14.17.1-alpine3.13

RUN apk add --no-cache --update git && \
    git clone https://github.com/WayneChang65/linebot2.git /usr/src/app/linebot2 && \
    cd /usr/src/app/linebot2 && \
    npm install

WORKDIR /usr/src/app/linebot2

EXPOSE 80

CMD ["npm", "start"]
