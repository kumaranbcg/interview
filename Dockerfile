FROM justadudewhohacks/opencv-nodejs:node9-opencv3.4.1-contrib

WORKDIR /app

COPY ./package.json /app/package.json
RUN npm install -g nodemon --registry=https://registry.npm.taobao.org && npm install --registry=https://registry.npm.taobao.org

COPY ./src /app/src

CMD ["nodemon", "-L", "./index.js"]
CMD ["nodemon", "-L", "./media-server/demo-camera.js"]