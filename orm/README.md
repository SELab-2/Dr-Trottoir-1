# Database

## ORM

De database wordt beheerd aan de hand van PrismaORM. We definiëren het schema in `./prisma/schema.prisma`. De database wordt geïnitialiseerd met het volgende commando.

```shell
npx prisma db push
```

## Artifacts

Prisma genereert types en klassen om *type safe* queries uit te voeren. Hieruit volgt dat iedere module die hier gebruik van wenst te maken dient te beschikken over de corresponderende TypeScript bestanden. We publiceren deze als `@selab-2/groep-1-orm` in de GitHub NPM package registry. Maak je wijzigingen in `schema.prisma`, dan dien je dus een nieuwe package te publiceren.

```shell
# Verhoog de huidige PATCH versie
$EDITOR package.json

# Genereer de nieuwe Prisma artifacts
npx prisma generate

# Publiceer naar de package registry
npm publish
```

De nieuwste versie kan je eender waar downloaden met

```shell
npm install @selab-2/groep-1-orm@MAJOR.MINOR.PATCH
```

## Design

De relaties tussen de verschillende enteiten wordt hieronder gegeven. Merk echter op dat deze niet noodzakelijk finaal zijn. Voor meer informatie, zie `./prisma/schema.prisma`

![](../orm/Logisch_ontwerp.png)
