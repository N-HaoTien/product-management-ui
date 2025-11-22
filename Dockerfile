FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source
COPY . .

# Create environment files if they don't exist
RUN mkdir -p src/environments
RUN [ -f src/environments/environment.ts ] || printf "export const environment = { production: false, apiBaseUrl: 'http://localhost:8080/' };\n" > src/environments/environment.ts
RUN [ -f src/environments/environment.prod.ts ] || printf "export const environment = { production: true, apiBaseUrl: 'http://localhost:8080/' };\n" > src/environments/environment.prod.ts

RUN npx ng build frontend --configuration production --output-path=dist/frontend

FROM nginx:stable-alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]