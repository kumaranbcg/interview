FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "node", "src/local.js" ]




# FROM jrottenberg/ffmpeg:3.3-alpine
# FROM justadudewhohacks/opencv-nodejs:node9-opencv3.4.1-contrib
# COPY --from=0 / /
# WORKDIR /app
# COPY ./package.json /app/package.json
# RUN npm config set registry https://registry.npmjs.org/
# RUN npm install -g nodemon && npm install

# COPY ./src /app/src

# CMD ["nodemon", "-L", "./src/index.js"]
