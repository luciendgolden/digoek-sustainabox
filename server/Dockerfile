# Use an official Node runtime as the base image
FROM node:latest
# Set the working directory in the container to /user/src/app
WORKDIR /user/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install


# Bundle app source inside the docker image
COPY . .

RUN npm run build

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run the app when the container launches
CMD ["npm", "start"]
