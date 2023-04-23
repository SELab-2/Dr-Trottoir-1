# Uitvoering van de testen

Om testen uit te voeren is het vereist dat men een databank voorbereid heeft. Wij voorzien een developer docker compose bestand en een script om de databank op te zetten en te vullen met de verwachtte testdata.

```bash
cd ../server
docker compose --file=developer-compose.yml build postgres
docker compose --file=developer-compose.yml up postgres -d
./generate_data.sh
```

Bovenstaande commandos leggen alles klaar om de API testen uit te kunnen voeren.
Het laatste wat je nog moet doen is het `api/.env` bestand aanpassen. Als je `.env` bestanden niet kent / nog nooit ermee gewerkt hebt, [lees hier](https://www.codementor.io/@parthibakumarmurugesan/what-is-env-how-to-set-up-and-run-a-env-file-in-node-1pnyxw9yxj).
Enige sleutel dat een aanpassing vereist is `DATABASE_URL`:

```
DATABASE_URL = "postgresql://postgres:postgres@10.0.0.3:5432/main"
```

Testen voer je eenvoudig uit door `npm test` in je terminal, vanuit de `api` directory.

# Testrunner

Voor de implementatie van de testen gebruiken wij de klasse `Testrunner`. De meest voorkomende zaken rondom onze API worden daar getest: correcte / verwachtte status code bij een respons, nakijken van teruggegeven velden...
Alle methodes in de `Testrunner` klasse geven ook het `Response` object terug om meer gespecialiseerde testen uit te kunnen voeren.
Testrunner bevat methodes voor elke HTTP methode die wij ondersteunen. Daarnaast is er methode `authLevel` voorzien die de authenticatieniveau van de Testrunner instelt:
niet geauthoriseerd, student, super-student, syndicus en administrator.

Er is een `example.test.ts` test suite voorzien om als voorbeeld te dienen bij het schrijven van test suites.
Het toont de meest eenvoudige tests voor elke methode en bevat commentaar om te helpen bij schrijven van eigen test suites.
