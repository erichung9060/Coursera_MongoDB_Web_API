# use node version 20
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if they exist
COPY package.json .

# Install any dependencies
RUN npm install

# Copy the current directory contents into the container at /usr/src/app
COPY index.js .

# Define the environment variable for PORT
ENV PORT=8080

# Expose the port the app runs on
EXPOSE 8080

# Run index.js when the container launches
CMD ["node", "index.js"]