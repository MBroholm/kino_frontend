# Use a lightweight Nginx image
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set working directory inside the container
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy only the files needed for the website
COPY index.html ./
COPY css/ ./css/
COPY js/ ./js/

# Expose port 80 for the container
EXPOSE 80

# Nginx runs automatically via the base image's CMD