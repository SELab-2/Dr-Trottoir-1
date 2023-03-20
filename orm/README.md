# Database

## ORM

De database wordt beheerd aan de hand van PrismaORM. We definiëren het schema in `./prisma/schema.prisma`. De database wordt geïnitialiseerd met het volgende commando.

```shell
npx prisma db push
```

## Mock data

We voorzien een script om tijdens het ontwikkelen de database in te vullen met willekeurige data.

```shell
# Installeer dependencies
npm install

# Geneer de PrismaORM types
npx prisma generate

# Voer een iteratie van toevoegingen uit
npm run start
```

## Design

De relaties tussen de verschillende entteiten wordt hieronder gegeven. Merk echter op dat deze niet noodzakelijk finaal zijn. Voor meer informatie, zie `./prisma/schema.prisma`

![](../orm/Logisch_ontwerp.png)

## Deployment

We voorzien een PostgreSQL database in de `server/docker-compose.yml` stack. Zie `server/README.md` voor meer informatie.
