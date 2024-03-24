# Use an official Node runtime as a base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the client's source code
COPY . .

# Build the app
RUN npm run build

# Install serve to serve the build folder
RUN npm install -g serve

# Command to run the serve
CMD ["serve", "-s", "build", "-l", "3000"]

# Make port 3000 available to the world outside this container
EXPOSE 3000
