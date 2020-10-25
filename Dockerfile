FROM node:12-alpine3.12

RUN npm install -g apib2openapi

CMD [ "apib2openapi" ]
