# Use the official Node.js image as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /user/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build the app
RUN npm run build

ENV HOSTNAME "0.0.0.0"

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]
