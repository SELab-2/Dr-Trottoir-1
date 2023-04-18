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

We maken gebruik van Sass als CSS preprocessor.

### Vuetify

Vuetify is een componentenbibliotheek gebaseerd op de *Material Design guidelines*.

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


### Paradigma's

#### Authenticatie

```
TODO
```

#### Error Handling

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

#### Generieke tabel

```
TODO
```

#### Stores (Pinia)

```
TODO
```

#### Vue Router

```
TODO
```
