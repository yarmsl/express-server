FROM node:14-alpine
WORKDIR /app
ADD package.json package.json
RUN npm install
ADD . .
CMD ["npm", "run", "start"]
EXPOSE 5000