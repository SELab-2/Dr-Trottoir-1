# Material theme guidelines

Voor dit project gebruiken we het material theme. Op [deze](https://m3.material.io/) website kan u een mooi overzicht vinden over het material theme.

**Disclaimer: Deze style guide is nog in ontwerp, en de beslissingen zijn voorlopig nog maar voorstellen.**

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

Een [kleuren palet](https://m3.material.io/styles/color/overview) is een essentie binnenin het material design theme. Vuetify biedt ons reeds enkele [kleuren paletten](https://vuetifyjs.com/en/styles/colors/) aan.

TODO: beslis welk kleuren palet we gebruiken.
 -> (voorstel brent: blue)

De vue componenten kunnen deze kleuren gebruiken zonder de kleur code te moeten opzoeken.
```html
<v-card color="blue-darken-4" />
```

## Input velden
Doorheen de applicatie maken we overal gebruik van dezelfde input velden.

TODO: beslissing zie issue #175
 -> (voorstel brent: vuetify outlined)

```html
<v-text-field variant="outlined"/>
```
Dit slaat niet enkel op [text velden](https://vuetifyjs.com/en/components/text-fields/), maar ook op [selects](https://vuetifyjs.com/en/components/selects/), [autocompletes](https://vuetifyjs.com/en/components/autocompletes/), etc.