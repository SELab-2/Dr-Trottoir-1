# Git Best Practices

Aangezien we met heel wat mensen samen werken in deze monorepository lijsten we enkele afspraken op om vlot gebruik te maken van Git en GitHub. Deze zijn geen harde vereisten, maar maken het voor ons allemaal wat eenvoudiger.

## Algemeen

- Of je nu problemen met je OS, TypeScript, een framework, jouw IDE of Git hebt, vraag gerust hulp

### Projects/Issues

- Lees alle issues en probeer feedback/inzichten te geven, ook al ben je niet onmiddelijk betroken bij het onderdeel
- Wees concreet, maak liever meerdere issues aan in plaats van een algemene issue `create UI`
- Gebruik assignments om de takenverdeling duidelijk te maken
- Gebruik labels om aan te tonen waar je mee bezig bent en in welke fase je zit
- Bespreek grondig voor je begint met implementeren

### Codestijl

- *Explicit is better than implicit*
- Schrijf voldoende commentaar waar nodig
- Ga niet overoptimaliseren
- Negeer geen compiler/linter errors
- Gebruik duidelijke variabelenamen, maar wees niet té verbose (dus liever geen `secondToLastElementOrNullIfOnlyOneElement`)
- Per onderdeel spreken we af welke linters, formatters, etc. we gebruiken
- Gebruik Unix newlines (`\n`)

## Git

 - We maken gebruik van de [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) conventie

### Branches

Gebruik gestructureerde branchnamen, bijvoorbeeld `web/feature/responsive-design` of `api/hotfix/issue-52`.

```
branch:   [category]/[type]/[id]
category: web | api | server | database | ...
type:     hotfix | feature | refactor | bug | docs | ...
id:       issue-[nr] | [korte beschrijving]
```

### Commits

- Gebruik [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) messages
- Voor niet-triviale commits, geef duidelijk aan wat er gewijzigd is in de body van je commit message
- Hou commits zo klein mogelijk
- *Commit early, commit often*
- Commit niet rechtstreeks naar `main`
- Voeg geen irrelevante files zoals `.DS_Store`, `.idea`, `node_modules`, etc. toe aan de repository

### Pull Requests

- Hou pull requests gefocust; beperk je tot één concept
- Gebruik *draft* pull requests om aan te duiden waar je aan werkt
- Iedere pull request dient goedgekeurd te worden door minimaal één andere persoon
- Vraag gerust vroegtijdig reviews aan, ook al zit je nog in *draft* modus, zo sturen we elkaar continu bij waar nodig
