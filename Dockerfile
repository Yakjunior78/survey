FROM node:lts-alpine

### Working Directory.
WORKDIR /app

### Copy Everything Package.json
COPY . .

### Run Npm install.
RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
