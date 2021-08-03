# FROM node:12.2.0

# WORKDIR /

# COPY package.json ./
# RUN npm install
# COPY . .

# EXPOSE 3001

# ENV NODE_ENV=develop
# ENV APP_WELCOME="SCC API Dev"
# ENV APP_URL=http://localhost:3000/
# ENV HASH_SECRET_KEY=secret
# ENV DB_NAME=SCC_TEST
# ENV DB_USER=scctest
# ENV DB_PASS=scctest@123
# ENV DB_HOST=27.71.232.204
# ENV DB_PORT=2433
# ENV RUN_LOCAL=yes
# ENV DOMAIN_CDN=http://cdn.rubyfitness.vn


# # what should be executed when the Docker image is launching
# CMD sh script/genEnv_start.sh ${NODE_ENV} ${APP_WELCOME} ${APP_URL} ${HASH_SECRET_KEY} ${DB_NAME} ${DB_USER} ${DB_PASS} ${DB_HOST} ${DB_PORT}} ${RUN_LOCAL} ${DOMAIN_CDN}
FROM node:12

ENV PORT 3001

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
