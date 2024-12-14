# Mobile Apps Server

## Necessary Steps to Run the Server

### 1. Install Express

Run the following command to install Express:

```bash
npm install express --save
```

### 2. Install Prisma

Run the following commands to install Prisma and its dependencies:

```bash
npm install typescript ts-node @types/node --save-dev
npm install prisma --save-dev
```

### 3. Set Up the Database

Initialize Prisma and set the datasource provider to SQLite:

```bash
npx prisma init --datasource-provider sqlite
```

### 4. Run a Migration

Run a migration to create your database tables with Prisma:

```bash
npx prisma migrate dev
```

### 5. Install Nodemon

To enable automatic server restarts, install Nodemon:

```bash
npm install nodemon --save-dev
```

### 6. Create a `.env` File

Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL="file:./dev.db"
SECRET_KEY="73f5fc5836dbd85e6e3940c9faa05e5e1c4af6b2d751df7517ee0e30c12f8741edb1ec10c0e556dbd020fb46948818797be56770419ba259fa928693988c0e5c"
```

### 7. Run the Server

Use the following command to start the server:

```bash
npm run dev
```


