# Manual

Deze map bevat alles omtrent de handleiding.

## Structuur handleiding
De handleiding heeft een [hoofdpagina](./manual_home.md).
Hieruit kan men doorlinken naar de gebruikerspagina's: `docs/manual/users`.
Deze pagina's bevatten nuttige beschrijvingen voor de verschillende gebruikers en
linken op hun beurt door naar de handleidingen voor elke pagina van de applicatie: `docs/manual/pages`.

## Afbeeldingen
### Weergeven
De handleiding bevat afbeeldingen om de gebruiker door middel van illustraties op weg te helpen.
Deze afbeeldingen zijn in `docs/manual/assets` terug te vinden. Gebruik voor het toevoegen
van een afbeelding in de handleiding de volgende template:

```markdown
|          Titel afbeelding           |
|:-----------------------------------:|
| ![](relatief/path/naar/afbeelding.) |
```
Voor kleine afbeeldingen kunnen er indien gewenst 2 naast elkaar geplaatst worden
door de markdown tabel uit te breiden in de breedte.

### Maken
Soms kan het nuttig zijn om annotaties aan een afbeelding toe te voegen. Bijvoorbeeld nummers
toevoegen aan knoppen om zo een stappenplan te verduidelijken voor een actie. In de tekst horende
bij de afbeelding kan men dan verwijzen naar deze nummers.

- Op Linux gebruiken we [Annotator](https://github.com/phase1geo/Annotator) omdat het eenvoudig
en snel werkt.
- Op Windows is hierover nog geen beslissing gemaakt. Vul deze README dan zeker aan.
