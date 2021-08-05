

# # what should be executed when the Docker image is launching
# CMD sh script/genEnv_start.sh ${NODE_ENV} ${APP_WELCOME} ${APP_URL} ${HASH_SECRET_KEY} ${DB_NAME} ${DB_USER} ${DB_PASS} ${DB_HOST} ${DB_PORT}} ${RUN_LOCAL} ${DOMAIN_CDN}
FROM node:12

ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV PORT 3000

# Create app directory
WORKDIR /usr/src/api

COPY . /usr/src/api

# Installing dependencies
RUN npm install
# RUN npm install -g node-gyp
# RUN npm install bcrypt

EXPOSE ${PORT}

# RUN cat api.js
CMD ["node", "index.js"]  
