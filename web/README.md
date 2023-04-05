# Web

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
