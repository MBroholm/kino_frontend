# Use a lightweight Nginx image
FROM nginx:alpine

# Set working directory inside the container
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy project into the Nginx web root
COPY . .

# Expose port 80 for the container
EXPOSE 80

# Nginx runs automatically via the base image's CMD