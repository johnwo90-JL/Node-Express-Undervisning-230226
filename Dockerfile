FROM node:24-alpine
WORKDIR /app
COPY . .
RUN npm install --omit=dev
RUN npm run db:seed
CMD ["npm", "start"]
ENV NODE_ENV="production"
EXPOSE 8000