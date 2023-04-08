# Material theme guidelines

Voor dit project gebruiken we het material theme. Op [deze](https://m3.material.io/) website kan u een mooi overzicht vinden over het material theme.

**Disclaimer: Deze style guide is nog in ontwerp.**

## Icons
In dit project gebruiken we [Vuetify](https://vuetifyjs.com/en/), vaak zullen we dus ook gebruik maken van de alreeds aanwezige material theme implementatie van Vuetify. Voor de icoontjes is dit niet anders.
Vuetify gebruikt [deze](https://pictogrammers.com/library/mdi/) material design icoontjes van Pictogrammers. Deze kunnen wij rechstreeks aanspreken d.m.v. Vuetify.

```html
<v-icon icon="mdi-vuetify"/>
```
Hierbij kan je `vuetify` vervangen door gelijk welke icoon naam uit de pictogrammers databank.
Veel Vuetify componenten laten echter toe om icoontjes rechstreeds in de component te plaatsen. Dit doen we dan ook steeds.
```html
<v-text-field prepend-inner-icon="mdi-vuetify"/>
```

## Color palette

Een [kleuren palet](https://m3.material.io/styles/color/overview) is een essentie binnenin het material design theme. Vuetify biedt ons reeds enkele [kleuren paletten](https://vuetifyjs.com/en/styles/colors/) aan. Hieruit hebben we verschillend kleuren gekozen om ons light theme te maken

```ts
const drTrottoirLight: ThemeDefinition = {
  dark: false,
  colors: {
    "background": "#F5F5F5", // grey-lighten-4
    "on-background": "#000000", // black

    "surface": "#FFFFFF", // white
    "on-surface": "#000000", // black

    "border": "#BDBDBD", // grey-lighten-1

    "primary": "#1867C0", // blue
    "on-primary": "#FFFFFF", // white

    "secondary": "#009688", // teal
    "on-secondary": "#FFFFFF", // white

    "warning": "#FF9800", // orange
    "on-warning": "#FFFFFF", // white

    "error": "#B00020", // red
    "on-error": "#FFFFFF", // white

    "success": "#4CAF50", // green
    "on-success": "#FFFFFF", // white
  },
};
```
Dit lijkt sterk op het normale vuetify thema. De belangerijkste aanpassingen zijn.
- `background`: De achtergrond is licht grijs.
- `surface`: De oppervlakte van componenten (cards, divs, etc.) is wit voor contrast met de `background`.
- `border`: De rand is donkerder grijs om het verschil tussen de `background` en `surface` meer de accentueren.

Probeer op intiütieve plaatsen de andere kleuren te gebruiken. Bijvoorbeeld 
- Bevestingen: color `success`
- Annuleren: color `error`

## Compositie
Vuetify [v-card](https://vuetifyjs.com/en/components/cards/) biedt slots aan om titels, subtitels, icoontjes, etc. eenvoudig toe te voegen op een intiütieve plaats.

## Input velden
Doorheen de applicatie maken we overal gebruik van dezelfde input velden.

TODO: beslissing zie issue #175
 -> (voorstel brent: vuetify outlined)

```html
<v-text-field variant="outlined"/>
```
Dit slaat niet enkel op [text velden](https://vuetifyjs.com/en/components/text-fields/), maar ook op [selects](https://vuetifyjs.com/en/components/selects/), [autocompletes](https://vuetifyjs.com/en/components/autocompletes/), etc.