FROM node:20-alpine

WORKDIR /app

ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

ENV HTTP_PROXY=${HTTP_PROXY} \
	HTTPS_PROXY=${HTTPS_PROXY} \
	NO_PROXY=${NO_PROXY} \
	NODE_OPTIONS=--dns-result-order=ipv4first

COPY package*.json ./

# Make install step resilient to transient registry/network issues.
RUN npm config set fetch-retries 5 \
	&& npm config set fetch-retry-mintimeout 20000 \
	&& npm config set fetch-retry-maxtimeout 120000 \
	&& npm config set fetch-timeout 300000 \
	&& npm config set registry https://registry.npmjs.org/ \
	&& (npm ci --no-audit --fund=false || npm ci --no-audit --fund=false)

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
