---

$config:
  outputPath: './Dockerfile'
  filenameCasing: 'title'

owner: 'My Company'
email: 'name@email.com'

---

FROM node:6-onbuild

MAINTAINER {{owner}} {{{email}}}

WORKDIR /dist
ADD . .

RUN npm install

EXPOSE 8889

CMD ["npm", "run", "start"]