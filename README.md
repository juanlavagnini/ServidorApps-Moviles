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

### Create .ENV file at root with the following information

`DATABASE_URL="file:./dev.db"`

`SECRET_KEY = '73f5fc5836dbd85e6e3940c9faa05e5e1c4af6b2d751df7517ee0e30c12f8741edb1ec10c0e556dbd020fb46948818797be56770419ba259fa928693988c0e5c'`

To run the server

`npm run dev`
