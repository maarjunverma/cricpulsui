###############################################################
# Stage 1 – build the Vite / React app
###############################################################
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .

# Production build — outputs to /app/dist
RUN npm run build

###############################################################
# Stage 2 – serve with nginx
###############################################################
FROM nginx:1.27-alpine AS runner

# Install envsubst (provided by gettext package)
RUN apk add --no-cache gettext

# Copy nginx config template (upstream URLs injected at runtime via envsubst)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

# Default fallback values — override in Coolify environment tab
ENV PROXY_UPSTREAM=http://localhost:5000
ENV STRAPI_UPSTREAM=http://localhost:1337

# At startup: substitute env vars into template → write final nginx config → start nginx
CMD ["/bin/sh", "-c", "envsubst '${PROXY_UPSTREAM} ${STRAPI_UPSTREAM}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
