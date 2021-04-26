FROM node:lts-alpine

WORKDIR /app

COPY . .

### Run Npm install.
RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
