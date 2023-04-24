FROM node:16.18-bullseye
WORKDIR /app/

ENV TZ=America/Monterrey
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY package-lock.json /app/
COPY package.json /app/
RUN npm install --production
COPY . /app/

CMD ["node", "start.js"]
