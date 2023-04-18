# Web

Deze webapplicatie is geschreven in Vue/TypeScript.
## Environments

### Development

#### API

Deze webapplicatie maakt gebruik van de RESTful API gedefinieerd in `api`. Tijdens het ontwikkelen dien jezelf te voorzien van een eigen instantie, alsook een bijhorende databank.

De locatie van de API geef je aan met behulp van de volgende _environment variable_.

```
VUE_APP_API_SERVER_ADDRESS=[url]
```

#### Formatting

De *continuous integration* testen gaan na of je code conform de Prettier-stijl is, en of ESLint waarschuwingen genereert. Indien deze niet slagen, dan kan jouw code niet in `develop` gebracht worden.

Je code formatteren en eventuele fouten opsporen doe je aan de hand van

```
npm run lint
```

#### Development Server

Vite voorziet een HMR server.

```shell
npm run dev
```

#### Preview Server

Je kan de applicatie transpileren en lokaal "hosten" om een *deployment* te simuleren.

```shell
npm run preview
```

### Deployment

#### Genereren artifacts

Om de applicatie te transpileren naar een JavaScript binary maak je gebruik van

```
npm run build
```

Om deze in te zetten kan je gebruik te maken van eender welke webserver zoals nginx, apache, of serve.


## Technologieën

### Sass

We maken gebruik van [Sass](https://sass-lang.com/) als CSS preprocessor.

### Vuetify

[Vuetify](https://vuetifyjs.com/en/) is een componentenbibliotheek gebaseerd op de *Material Design guidelines*.

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

Nieuwe pagina's worden teogevoegd in `/web/src/router/index.ts`. Hierbij zijn er enkele aandachtspunten.

1. Als een pagina gebruik wilt maken van de algemene layout moet het als kind worden toegevoegd aan de `MainLayout`.
2. Bij het gebruik van de algemene layout, dient er een titel opgegeven te worden in het `meta.title` veld.
   Deze titel wordt dan in de topbar van de algemene layout gerenderd.
3. In de `meta` sectie wordt ook `meta.auth` toegevoegd. Dit zorgt ervoor dat een pagina enkel 
beschikbaar is voor bepaalde rollen.

```ts
const routes = [
  {
    path: "/",
    component: LoginScreen,
    name: "login",
    meta: {
      auth: ( 
        student: boolean,
        superstudent: boolean,
        syndicus: boolean,
        admin: boolean,
      ) => true,
    },
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
          title: "Opvolging rondes", // TITEL VOOR TOPBAR
          auth: (
            student: boolean,
            superstudent: boolean,
            syndicus: boolean,
            admin: boolean,
          ) => superstudent || admin, // ROLLEN MET RECHTEN
        },
      },
    ],
  },
];
```

Verder wordt dit generiek afgehandeld voor elke route. Dit gebeurt `router.beforeEach((to, from, next) => {...}` functie. Hier kijken we via de useAuthStore() (zie sectie [authenticatie](#authenticatie)) welke rechten de gebruiker heeft en handelen we deze af.

```Typescript
if (!auth) {
  const checked: boolean = checkAuth(false, false, false, false);
  if (!checked) {
    next("/");
  } else {
    next();
  }
} else {
  const checked: boolean = checkAuth(
    isStudent,
    isSuperStudent,
    isSyndicus,
    isAdmin,
  );
  if (!checked) {
    next("/");
  } else {
    next();
  }
}
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

Er kan vanuit de frontend eenvoudig geïntrageerd worden met de API door middel van de [query builder](https://github.com/SELab-2/Dr-Trottoir-1/tree/develop/api_query).


### Error Handling

Momenteel worden onze errors opgevangen en via `console.log` en een HTML alert aan de ontwikkelaar weergegeven in afwachting van een uitbreiding van de user interface.

Heb je (*non blocking*) code die een error kan opgooien, maak dan gebruik van de generieke hogere-orde functies `tryOrAlert` en `tryOrAlertAsync` functies aangeboden in `web/src/try.ts`.

```typescript
const x = random();
const y = random();

// Will show alert if y is zero and return undefined.
const result: number | undefined = tryOrAlert<number>(() => {
  return x / y;
});
```

```typescript
const x = await randomAsync();
const y = await randomAsync();

// Will show alert if y is zero and return undefined.
const result: number | undefined = await tryOrAlertAsync<number>(async () => {
    return x / y;
});
```


### Stores (Pinia)

We maken gebruik van [Pinia](https://pinia.vuejs.org) om stores te voorzien, gezien dit de *de facto* standaard is voor Vue en zeer intuïtieve API aanbiedt. Hiervoor wordt een nieuwe directory `web/src/stores` voorzien.

#### `useAuthStore`

In `web/src/stores/auth.ts` wordt de `useAuthStore` aangeboden. Deze voorziet de *reactive* variabele `auth`, die een `User` object kan bevatten, of simpelweg `null`.
`APIErrors` worden vooraf al afgehandeld door de `getAuth()` functie.

Om een gebruiker aan te melden kunnen we gebruik maken van de `useAuthStore::logIn` functie. De browser zal zelf de sessie/cookies onderhouden, aangezien we gebruik maken van de `fetch` functionaliteit. 

```typescript
export const useAuthStore = defineStore("auth", () => {
  const auth: Ref<User | null> = ref(null);

  async function logIn(username: string, password: string): Promise<void>;

  async function logOut(): Promise<void>;

  return { auth, logIn, logOut };
});
```
#### Authenticatie uitschakelen
Om de authenticatie uit te schakelen kan men de volgende _environment variable_ instellen.
```env
VUE_APP_DISABLE_AUTHENTICATION=<true|false>
```

#### Debugging pagina
Op de pagina `/dev/auth` kunnen we eenvoudig het aanmelden simuleren. Het resultaat wordt automatisch geupdatet met behulp van de `useAuthStore`. 


### Authenticatie

[De authStore](#useauthstore) abstractie maakt de authenticatie zeer eenvoudig. Alle velden kunnen alsvolgd opgevraagd worden. Hierbij kan je `student` vervangen door eender welk veld van de `User` klasse.
```ts
const isStudent: Boolean = useAuthStore().auth!.student;
```
