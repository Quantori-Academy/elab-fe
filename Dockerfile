FROM node:20-alpine AS build_development

# Set working directory inside the container
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Copy the application code
COPY . .

RUN npm install -g @angular/cli

# Build the application
RUN npm run build -- --configuration development

##################################
FROM georgjung/nginx-brotli:latest AS development

COPY .github/workflows/nginx.conf /etc/nginx/nginx.conf
COPY --from=build_development /usr/src/app/dist/elab-fe/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
#############

FROM node:20-alpine AS build_production

# Set working directory inside the container
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Copy the application code
COPY . .

RUN npm install -g @angular/cli

# Build the application
RUN npm run build

##################################
FROM georgjung/nginx-brotli:latest AS fe

COPY .github/workflows/nginx.conf /etc/nginx/nginx.conf
COPY --from=build_production /usr/src/app/dist/elab-fe/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]