FROM node:16.5.0

WORKDIR /usr/app

RUN npm set @sap:registry=https://npm.sap.com

COPY ./package*.json ./
RUN npm install

# Copy source code to app folder and build
COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]