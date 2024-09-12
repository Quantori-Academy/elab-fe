FROM node:20-alpine AS build

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

FROM nginx:alpine AS production

COPY --from=build /usr/src/app/dist/elab-fe/browser /usr/share/nginx/html

EXPOSE 80
