FROM node:14-alpine
WORKDIR /app
ADD package.json package.json
RUN npm install
ADD . .
RUN npm run build
VOLUME ["/app/uploads"]
CMD ["npm", "run", "prod"]
EXPOSE 5000