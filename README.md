# ServidorApps-Moviles

## Necessary steps to run the server

### Express installation

`npm install express --save`

### Prisma installation

`npm install typescript ts-node @types/node --save-dev`

`npm install prisma --save-dev`

### Database setup

`npx prisma init --datasource-provider sqlite`

### Run a migration to create your database tables with Prisma

`npx prisma migrate dev`

### To manage the server's automatic restart

`npm install nodemon --save-dev`

To run the server

`npm run dev`
