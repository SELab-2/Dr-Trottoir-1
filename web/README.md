# Web

## Frameworks en bibliotheken

De client side van dit project is een applicatie geschreven in het [Vue](https://vuejs.org/) framework. We hebben ervoor gekozen om [Typescript](https://www.typescriptlang.org/) te gebruiken zodat onze code getypeerd is. Hiernaast maken we gebruik van [Vuetify](https://vuetifyjs.com/en/) zodat de UI uniform is. Tot slot gebruiken we het CSS framework [Sass](https://sass-lang.com/) voor de grafische vormgeving waar vuetify niet in staat tot zou zijn.

# Uitvoeren

We maken gebruik van [npm](https://www.npmjs.com/) gebruikt voor het compileren en uitvoeren van de code.

## Node modules

Npm kan niks doen zolang het niet over de nodige module's beschikt. In het bestand `/web/package.json` staan de namen en versies van alle nodige modules.
Men kan de modules als volgt installeren.

```bash
npm install
```

Dit zal de node modules downloaden in de nieuwe map `/web/node_modules`.
Deze map staat bewust in de `.gitignore`, laat hem daar ook staan.
Merk op dat `npm install` enkel zal werken indien [Nodejs](https://nodejs.org/en/) geïnstalleerd is op het huidige apparaat.
Men kan Nodejs [hier](https://nodejs.org/en/download/) downloaden.

## Compileren en uitvoeren voor development

Eenmaal de node modules geïnstalleerd zijn kan men de applicatie compileren en uitvoeren voor development.
Dit start normaal een [Vite](https://vitejs.dev/) server op het lokaal address [http://localhost:3000/](http://localhost:3000/).
De vite server zorgt ervoor dat de applicatie uitgevoerd wordt.

## Linting

Tot slot kan het ook handig zijn om te kijken of, en waar er errors aanwezig zijn in de code. Dit kan men onder andere als volgt doen.

```bash
npm run lint
```

## Verdere documentatie

Verdere documentatie over het gebruik van vite met npm kan men [hier](https://vitejs.dev/config/) vinden.

# Code

Alle code voor de client applicatie is terug te vinden in de `/web` map. De code die de pagina's en routing van de applicatie definiëren zijn beschikbaar in de `/web/src` map. De belangrijkste mappen hierin zijn.

- `/web/src/components`: Bevat losse herbruikbare vue componenten.
- `/web/src/views`: Bevat alle pagina's.
- `/web/src/layouts`: Bevat algemene layouts die terugkomen in bijna elk scherm.
- `/web/src/router`: Bevat de nodige code om de router correct te doen werken.

## Router

Nieuwe pagina's kan men in `/web/src/router/index.ts` toevoegen. Hierbij moet men op 2 zaken letten.

1. Als een pagina gebruik wilt maken van de algemene layout moet het als kind toegevoegd worden aan de `MainLayout`.
2. Indien men de main layout gebruikt, kan men de titel van de pagina kiezen door deze bij het `name` veld van de nieuwe route te plaatsen.

```ts
const routes = [
  {
    path: "/",
    component: LoginScreen,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: MainLayout,
    children: [
      {
        path: "example", // ROUTE WAAR JE PAGINA KOMT
        name: "exampleTitle", // NAAM VAN DE TITEL VAN JE PAGINA
        component: MainLayout, // LINK NAAR JE VUE FILE
      },
    ],
  },
];
```