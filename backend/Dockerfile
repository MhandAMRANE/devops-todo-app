FROM node:20

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Create directory to store sqlite database and set permissions
RUN mkdir -p /app/data && chown -R node:node /app/data

EXPOSE 5000

# Recommended to run as a non-root user
USER node

CMD ["npm","start"]