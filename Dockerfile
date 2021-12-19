FROM node:lts-alpine3.14
RUN addgroup app
RUN adduser app -G app -S
USER app
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
ENV MONGODB_CONNECTION_STRING=mongodb://mongo:27017/stock-trade
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV LOG_LEVEL=debug
ENV LOG_NAMESPACES=app:*
ENV APP_NAME="Stock Trade"
ENV NO_LOGS=false
ENV TZ=UTC-4
EXPOSE 3000
CMD ["node","./build/index.js"]


