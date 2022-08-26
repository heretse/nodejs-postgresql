FROM node:14-alpine3.16
WORKDIR /app
COPY ["package.json", "./"]
COPY ["app.js", "./"]
RUN npm run build
RUN adduser -D user && chown -R user /app
USER user
CMD [ "npm", "run", "start" ]
