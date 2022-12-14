FROM node:10.13.0-alpine

COPY src /home/$user/
WORKDIR /home/$user

RUN npm install --production

CMD [ "npm", "start" ]