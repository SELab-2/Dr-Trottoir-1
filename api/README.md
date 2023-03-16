# API

## Abstract

We bieden een REST API aan op basis van JSON documenten geschreven in TypeScript. We maken hier gebruik van de Express.js bibliotheek inclusief middleware van derden. De interactie met de database wordt voorzien in door PrismaORM, een TypeScript-native ORM voor onder andere PostgreSQL. Authenticatie wordt voorzien door Node.js's crypto bibliotheek en Passport.js. We definiëren autorisatieregels oftewel door gebruik van een TypeScript decorator, of binnenin een endpoint zelf.

## Environments

We maken gebruik van een _environment file_, namelijk `.env`. Hier vul je enkele variabelen in zoals de URL van de database. Een template wordt gegeven door `example.env`. `.env` zit bewust in je `.gitignore`, ga deze dus niet committen naar GitHub!

Doorgaans heb je geen VPN verbinding nodig om met de database op `sel2-1.ugent.be` op poort `2002` te verbinden, maar probeer echter toch via het UGent netwerk te verbinden indien je problemen ondervindt. De database kan mogelijks niet online zijn, dus aarzel niet om de systeembeheerder te contacteren.

### Production

Wens je de applicatie in te zetten op een eigen server, dan kan je gebruik maken van de documentatie die te vinden is in `/database/README.md`. We focussen ons hier voornamelijk op ontwikkelingsomgeving.

### Development

#### Initialisatie

We gaan er hier van uit dat je reeds een (lokale) PostgreSQL database hebt voorzien.

```shell
# Verkrijg de broncode indien je deze nog niet hebt.
git clone git@github.com:SELab-2/Dr-Trottoir-1.git dr-trottoir
cd dr-trottoir/api

# Stel de environment variables in.
cp example.env .env
$EDITOR .env

# Download node modules
npm install

# Genereer PrismaORM types en functies
npx prisma generate
```

#### Hot-reload en TypeScript compilatie

Om de API te testen tijdens het ontwikkelen maak je gebruik van het `npm start serve` commando. Deze zal automatisch TypeScript files compileren naar `/api/dist`, alsook de webserver starten en herstarten wanneer de broncode gewijzigd wordt. Dat laatste kan wel een seconde of twee in beslag nemen, waarbij je een `Connection refused` foutmelding kan ontvangen bij je client.

## Authenticatie, autorisatie

We maken gebruik van `passport.js` voor authenticatie in combinatie met het manueel bijhouden van hashes en salts in onze database.

### Authorization

In `/api/auth` vind je de _decorator_ `Auth.authorization` waarmee je heel eenvoudig een route kan beveiligen. Merk echter op dat deze geen nuance toelaat; je kan alleen toegang geven tot alle studenten, alle superstudenten, enzvoort, en niet bijvoorbeeld degene met specifieke *identifiers*. Wil je dus een regel toevoegen als "indien de ID van de resource overeenkomt met de huidige gebruiker", dan dien je dit nog steeds manueel te implementeren. Geen decorator gebruiken komt in essentie overeen met geen autorisatie. Administratoren hebben rechten voor alle routes.

```typescript
export class BuildingRouting extends Routing {
    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        // Alleen studenten mogen deze route bezoeken
    }
}
```

Het `express.Request` object bevat het extra veld `user` dat oftewel de huidig aangemelde gebruiker is in de vorm van een Prisma `User` object, of `null` indien er geen gebruiker aangemeld is. Zie `/api/types/index.d.ts`. Dit veld wordt ingevuld door Passport.js.

### Gebruik

Om je aan te melden stuur je een POST request naar `http://localhost:8080/auth/login` met JSON bestand zoals

```json
{
    "username": "john.smith@example.com",
    "password": "verysecretpassword"
}
```

Je verkrijgt een HTTP Cookie waarmee je je requests kan _authenticaten_. Indien je software gebruikt met ondersteuning voor sessions (zie hieronder) hoef je deze cookie niet manueel te verwerken en te versturen.

### Session voorbeeld

Je kan gebruik maken van GUI programma's zoals Postman en dergelijke, of simpelweg van een Python script of interactieve shell.

```python
import requests
import json

# Maak een nieuwe sessie
s = requests.session()

# Login
r = s.post("http://localhost:8080/auth/login", json = {
    'username': 'jens.pots@ugent.be',
    'password': 'password'
})

# Toon huidige gebruiker
print(json.dumps(json.loads(r.content), indent=2))

# Maak een HTTP request
r = s.get("http://localhost:8080/user")

# Print het resultaat
print(json.dumps(json.loads(r.content), indent=2))
```

## Foutmeldingen

Je kan eender waar in een route een fout opgooien en deze zal doorgepropageerd worden naar de error handler in `/api/errors/error_handler`.

Wil je een generieke HTTP error opgooien, bijvoorbeeld `404: Not Found`, dan doe je dat als volgt.

```typescript
new APIError(APIErrorCode.NOT_FOUND);
```

Ook Prisma errors worden opgevangen. Hoe deze vertaald worden naar een HTTP error vind je in `/api/errors/prisma_error.ts`. De vertaling gebeurt op basis van de Prisma error code. Merk op dat je mogelijks een error genereert die nog niet toegevoegd is aan deze file, en dat je deze gerust zelf kan toevoegen.

```typescript
switch (err.code) {
  case "P2002":
    return {
      code: APIErrorCode.CONFLICT,
      detail: "Unique constraint failed",
    };
  ...
}
```

## Query and URL parameters

### Parser

Stel dat je alle gebruikers wilt opvragen die aangemaakt zijn na een bepaalde datum. Dergelijke query wordt bijvoorbeeld voorgesteld door `/user?after=2020-01-01`. Je krijgt van Express.js echter geen `Date` object, maar een `string`. Je kan deze echter omzetten naar een `Date` met `Parser.date` in `/api/parser.ts`.

```typescript
export class Parser {
    static date(
        input: string | undefined,
        otherwise: Date | undefined = undefined,
    ): Date | undefined {
        if (!input) {
            return otherwise;
        }

        const result = new Date(input);

        if (result.toString() === "Invalid Date") {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        return result;
    }
}
```

Deze functie neemt twee parameters aan, namelijk `input`, wat altijd de `string` is zoals letterlijk gegeven in de HTTP request, of `undefined`. We geven ook een parameter `otherwise` mee die oftewel een `Date` is of `undefined`. Er kunnen nu drie scenario's voorvallen:

-   `input` kan omgezet worden in een geldige `Date`, geef deze resulterende `Date` terug.
-   `input` is undefined, geef `otherwise` terug.
-   `input` is gegeven, maar kan niet omgezet worden naar een `Date` object. Gooi een `HTTP: Bad request` error op.

Het is nu bijzonder eenvoudig om parameters uit de HTTP request onmiddelijk door de parser te jagen en ze in de PrismaORM query te voegen. Bevat je PrismaORM query namelijk `undefined` als waarde, dan wordt dat deel van de query in essentie niet in beschouwing genomen.

```typescript
const result = await prisma.user.findMany({
  where: {
      date_added: {
          gte: Parser.date(req.query["added_before"]),
          lte: Parser.date(req.query["added_after"]),
      },
  }
};
```

Wordt in het bovenstaande voorbeeld `added_before` opgegeven in de URL van de HTTP request, dan zal de deze waarde oftewel correct omgezet worden naar een `Date` object door de Parser, of zal een `Bad Request` error opgegooid worden indien de datum niet geldig is. Indien `added_before` helemaal niet opgegeven is (en dus `undefined` is), dan geeft de parser opnieuw `undefined` 

## Slot

We bespraken de meest prominente onderdelen van onze API. Merk echter op doorheen de broncode zelf ook nog uitleg gegeven is, en we hier slechts een *high-level overview* gegeven hebben. De werkelijke definities van de verschillende endpoints kunnen nog wijzigen. Zo zullen wij eventueel routes, parameters, en queries toevoegen indien vereist.
