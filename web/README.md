# Web

## Frameworks en bibliotheken

De client side van dit project is een applicatie geschreven in het [Vue](https://vuejs.org/) framework. We hebben ervoor gekozen om [Typescript](https://www.typescriptlang.org/) te gebruiken zodat onze code getypeerd is. Hiernaast maken we gebruik van [Vuetify](https://vuetifyjs.com/en/) zodat de UI uniform is. Tot slot gebruiken we het CSS framework [Sass](https://sass-lang.com/) voor de grafische vormgeving waar vuetify niet in staat tot zou zijn.

## Uitvoeren

We maken gebruik van [npm](https://www.npmjs.com/) voor het compileren en uitvoeren van de code. Door het uitvoeren van...

```bash
npm install
```

...in de `/web` map zal npm de nodige module's en packages installeren.

### Compileren en uitvoeren voor development

We kunnen nu de web applicatie opstarten voor development.

```bash
npm run dev
```

Dit start normaal een [Vite](https://vitejs.dev/) server op het lokaal address [http://localhost:3000/](http://localhost:3000/).
De vite server zorgt ervoor dat de applicatie uitgevoerd wordt.

De applicatie kan ook simpelweg gebuild worden zonder uit te voeren op een Vite server.

```bash
npm run build
```

Om zeker te zijn dat er geen build error's aanwezig zijn gebruik je `npm run build`.

### Linting

De linter toont error's en warnings in de code. Hiernaast wordt de code herschikt naar de stijl standaard van de linter.

```bash
npm run lint
```

### Verdere documentatie

Verdere documentatie over het gebruik van Vite met npm is [hier](https://vitejs.dev/config/) terug te vinden.

## Code

Alle code voor de client applicatie is terug te vinden in de `/web` map. De code die de pagina's en routing van de applicatie definiëren zijn beschikbaar in de `/web/src` map. De belangrijkste mappen hierin zijn.

- `/web/src/components`: Bevat losse herbruikbare vue componenten.
- `/web/src/views`: Bevat alle pagina's.
- `/web/src/layouts`: Bevat algemene layouts die terugkomen in bijna elk scherm.
- `/web/src/router`: Bevat de nodige code om de router correct te doen werken.

## Technologieën

### ImgProxy

#### Over

We maken gretig gebruik van [ImgProxy](https://imgproxy.net): een _self hosted_ CDN voor afbeeldingen. We delegeren hierbij het werk qua herschalen, comprimeren, en andere transformaties van afbeeldingen aan de software. Hoewel het gebruik hiervan sterk geabstraheerd is, dien je als frontendontwikkelaar wel nog steeds te kiezen _hoe_ je de afbeelding wilt weergeven. Denk aan hoogte, breedte, resolutie, _cropping_, etc.

ImgProxy biedt onzettend veel mogelijkheden aan, en teveel om hier op te lijsten. Bekijk dus zeker de [documentatie](https://docs.imgproxy.net).

#### Query builder

We voorzien een _query builder_ in `web/src/imgproxy.ts`. Merk op dat deze slechts een kleine abstractie is overheen de bestaande bibliotheek van GitHub gebruiker [BitPatty](https://github.com/BitPatty/imgproxy-url-builder).

Door een _chainable interface_ stellen we eenvoudig een query op als één statement.

```typescript
ImgProxy.env
  .maxBytes(1024)
  .jpegOptions({ progressive: true })
  .minWidth(500)
  .url(img);
```

Je kan deze zelfs _inline_ gebruiken in een `img` component van je HTML.

```html
<img alt="image.alt" src="ImgProxy.env.maxWidth(50).url(img)" />
```

#### Environment variables

Doorgaans gebruik je slechts één ImgProxy server, dus er wordt een singleton object `ImgProxy.env` voorzien waarbij de locatie gedefinieerd wordt a.d.h.v. _environment variables_ in `web/.env`. Je hoeft de singleton dus niet manueel te initialiseren bij gebruik. Hieronder lijsten we de _environment variabelen_ op.

```
VUE_APP_IMGPROXY_PROTOCOL=<http|https>
VUE_APP_IMGPROXY_LOCATION=<ip|domain>
VUE_APP_IMGPROXY_PORT=<port>
VUE_APP_IMGPROXY_ROOT=<string>
```

#### Uploads

Je hoeft zelf geen beeldverwerking toe te passen bij het uploaden van afbeeldingen, want dit gebeurt als het ware _just in time_ bij het downloaden.

### Router

Nieuwe pagina's worden teogevoegd in `/web/src/router/index.ts`. Hierbij zijn er 2 aandachtspunten.

1. Als een pagina gebruik wilt maken van de algemene layout moet het als kind worden toegevoegd aan de `MainLayout`.
2. Bij het gebruik van de algemene layout, dient er een titel opgegeven te worden in het `meta.title` veld.
   Deze titel wordt dan in de topbar van de algemene layout gerenderd.

```ts
const routes = [
  {
    path: "/",
    component: LoginScreen,
  },
  {
    component: MainLayout,
    path: "/", // Onbereikbaar, zoals ontworpen.
    children: [
      {
        path: "example", // ROUTE WAAR JE PAGINA KOMT
        name: "example", // BESCHRIJVENDE NAAM
        component: MainLayout, // LINK NAAR JE VUE FILE
        meta: {
          title: "Planning student", // NAAM VAN DE TITEL VAN JE PAGINA
        },
      },
    ],
  },
];
```

### Generieke tabel

Dit is een tabel die hergebruikt kan worden met eender welk datatype

#### Implementatie

Eerst en vooral, we dienen te kunnen werken met verschillende types data. Daarom introduceren we de volgende enum.

```typescript
export enum RowType {
  IMAGE,
  TEXT,
  BOOLEAN,
  CHECKBOX,
  ICONBUTTON,
  AVATAR,
}
```

Een `RowType`, samen met heel wat andere informatie wordt in een `Header<T>` object verwerkt. Eén `Header<T>` object komt overeen met hoe één kolom weergegeven dient te worden. De `Header<T>::sort` functie kan opgeroepen worden om de data van type T te sorteren volgens deze kolom. De implementatie van deze functie wordt nog vervangen door API calls.

```typescript
export abstract class Header<T> {
  // A unique integer
  id: number;

  // The shown name of the column
  name: string;

  // A function which retrieves the value for this colunn of a given entry
  get: (element: T) => any;

  // Indicate how to render the value
  type: RowType;

  // Whether the width of the column should fit to the contents
  fit: boolean = false;

  // Whether this column can be sorted
  sortable: boolean = false;

  // Whether the values in the list are sorted using this header.
  order: "asc" | "desc" | null = null;

  // TODO: replace with API call.
  // Sorts an array of T's using this specific field.
  sort(elements: Array<T>) {
    let flip = 1;

    if (this.order == "asc") {
      this.order = "desc";
      flip = -1;
    } else {
      this.order = "asc";
    }

    elements.sort((a: T, b: T) => {
      return (this.get(b) > this.get(a) ? -1 : 1) * flip;
    });
  }
}
```

Tenslotte dient een klasse wiens objecten we wensen weer te geven ook te voldoen aan het protocol `TableEntity<T>`. Dit komt in essentie overeen met een functie die alle vereiste kolommen specificeert, een lijst van `Header<T>` objecten dus.
Een implementatie hiervan is terug te vinden in `/web/src/types/User.ts`.

```typescript
export abstract class TableEntity<T> {
  abstract headers(): Array<Header<T>>;
}
```

Het aanmaken van een tabel voor de verschillende gebruikers vereist nu slechts enkele lijnen. Je geeft via `props` de verschillende `T` objecten mee, en ook de `Header<T>` objecten.

```vue
<template>
  <Table v-bind:entries="User.random()" v-bind:headers="User.headers()"></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { User } from "@/types/User";
</script>
```

### Query builder

Er kan vanuit de frontend eenvoudig geïntrageerd worden met de API doormiddel van de [query builder](http://exaple.com).
TODO: fix link zodra query builder op develop staat.
