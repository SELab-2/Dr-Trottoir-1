# RESTful API

## Initialisatie

```shell
# Download node modules
npm install

# Initialiseer Prisma
npx prisma init

# Stel databanklocatie in
cp example.env .env
nvim .env

# Verkrijg schema
npx prisma db pull

# Genereer types
npx prisma generate

# Start server
npm start
```
