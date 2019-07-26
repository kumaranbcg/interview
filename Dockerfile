FROM jrottenberg/ffmpeg:3.3-alpine
FROM justadudewhohacks/opencv-nodejs:node9-opencv3.4.1-contrib
COPY --from=0 / /
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm config set registry https://registry.npmjs.org/
RUN npm install -g nodemon && npm install

COPY ./src /app/src

CMD ["nodemon", "-L", "./src/index.js"]