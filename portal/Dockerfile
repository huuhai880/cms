# FROM node:12.2.0

# WORKDIR /

# COPY package.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# EXPOSE 9000

# ENV REACT_APP_API_URL_ROOT=http://localhost:3001/api/
# ENV REACT_APP_CDN=http://localhost:3001


# # what should be executed when the Docker image is launching
# CMD npm run start:prod

FROM nginx:1.16.0-alpine
# COPY --from=builder /app/build /usr/share/nginx/html
# COPY ./build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./default.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]  
