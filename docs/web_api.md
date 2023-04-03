# frontend: webflow en info



## Begin: Loginscherm

**API calls:** 
 - Moet authenticatie in orde brengen voor de rest van de sessie. Deze moet opgeslaan worden in een soort store.

**Flow:** Duw op inloggen om in te loggen na email en wachtwoord ingegeven te hebben. Hierna ga je naar de juiste pagina afhankelijk van hoe je geauthenticeerd bent, momenteel is dit [het planningscherm van de studenten](#planning-studenten).
- **Pagina's per rol**
	 - Studenten
		 - [Planning](#planning-studenten)
	 - Superstudenten/admin
		 - [Planning](#planning-studenten)
		 - [Opvolging](#opvolging-rondes)
		 - [Gebouwen](#gebouwpagina-superstudent)
		 - Dashboard
			 - [Gebruikers](#gebruikers)
			 - [Gebouwen](#gebouwen)
			 - [Rondes](#rondes)
	- Syndicus
		- [Gebouwen](#gebouwpagina-syndicus)

## Account

### Accountpagina
**API call:** Gegeven de id van een account
- telefoonnummer, email, adres, rollen
- mogelijkheid om te bewerken & op te slaan

### Account aanmaken
**API call**
 - Opslaan van ingegeven velden
	 - voornaam, telefoonnummer
	 - adress
	 - wachtwoord
	 - rollen

## Gebouw

### Gebouwpagina studenten
**API calls:** Alles gebeurt wetende dat we het id van het gebouw al reeds bezitten
- Naam en beschrijving wordt opgevraagd.
- (Telefoonnummer contactpersoon en link naar handleiding)?
 - Het afval voor de huidge week wordt opgevraagd.
 - Foto's en opmerkingen van dit gebouw worden opgevraagd.

**Flow:** Doorklikken kan naar de toevoegknop om een opmerking of foto toe te voegen, deze is momenteel nog niet volledig uitgewerkt aangezien cashing hier ook nog een grote rol speelt. Een huidige versie is te vinden in *'src/components/images/AddImage'*

### Gebouwpagina superstudent
Staat momenteel nog in PR.

### Gebouwpagina syndicus
Staat momenteel nog in PR.

### Gebouw aanmaken
**API call:**
 - Ingegeven velden opslaan
	 - adress
	 - ivago_id etc.
- Foto's opslaan die worden meegegeven


## Ronde

### Opvolging rondes
**API calls:**
- Alle rondes onder een superstudent opvragen
- Extra info van deze rondes opvragen, alsook hierop kunnen filteren
	- klaar, bezig, niet begonnen
	- commentaar beschikbaar of niet
	- student die deze uitgevoerd heeft
	- aantal gebouwen

**Flow:** Doorklikken op een kaartje geeft je de [de detailpagina](#detailpagina).  

### Detailpagina
**API calls:** Alles gebeurt wetende dat we de ronde id bezitten.
- Opvragen wie deze ronde gedaan heeft, als de geauthenticeerde gebruiker het zelfs niet is (admin, superstudent die opvolgt bv). Dit kan waarschijnlijk doorgegeven worden met props van [opvolging](#opvolging-rondes)
 - Gebouwen uit de ronde opvragen
 - Status van elk van deze gebouwen opvragen (klaar, bezig, nog niet bezocht)
	 - Opvragen of er foto's en/of opmerkingen zijn voor een gebouw
	 - Start- en eindtijd voor een gebouw dat al reeds klaar is. Starttijd voor een waar er nog iemand mee bezig is.

**Flow:** Vanaf hier kan je doorklikken naar [de gebouwenpagina](#gebouwpagina-studenten), of naar [het profiel](#profiel) van degene die de ronde uitgevoerd heeft.

### Ronde plannen
**API calls:**
- studenten die onder de superstudent vallen kunnen opsommen
- rondes zelf kunnen opsommen
- checken of een gebouw in een ronde die je wil aanmaken al reeds in een bestaande ronde zit voor die dag
- de geplande ronde(s) opslaan

### Ronde maken
**API calls:**
- Lijst geven van alle gebouwen
- Ronde die gemaakt wordt opslaan samen met zijn naam

## Studenten
### Planning studenten
**API calls:** 
 - De rondes opvragen voor de geauthenticeerde student vanaf vandaag tot een onbepaalde tijd in de toekomst.
 - De status opvragen van rondes die opgevraagd zijn (klaar, bezig of nog niet gestart).
 - Wanneer de student een ronde op deze pagina, moet er in de backend geupdate worden dat deze gestart is.

**Flow:** Je kan het rapport opvragen van een ronde die je vandaag gedaan hebt. Dit doe je door door te klikken naar [de detailpagina](#detailpagina).
 Ook kan je een ronde starten waardoor je ook doorverwezen wordt naar [de detailpagina](#detailpagina) van de huidige ronde, hetzelfde gebeurt als je bezig bent met een ronde en op de card van de huidige ronde klikt.



## Dashboard

### Gebruikers
**API calls:**
 - Alle studenten opvragen
 
 **Flow:** Doorklikken op een student geeft je de [de accountpagina](#accountpagina).  Klikken op een nieuwe gebruiker aanmaken, brengt je naar [het aanmaakscherm](#account-aanmaken) voor gebruikers.

### Gebouwen
**API calls:**
 - Alle gebouwen opvragen
 
 **Flow:** Doorklikken op een gebouw geeft je de [de gebouwpagina](#gebouwpagina-superstudent).  Klikken op een nieuw gebouw aanmaken, brengt je naar [het aanmaakscherm](#gebouw-aanmaken) voor gebruikers.

### Rondes
**API calls:**
 - Alle rondes opvragen, met extra info
	 - student die het uitgevoerd heeft
	 - rondenaam
	 - datum
	 - status van deze ronde
 
 **Flow:** Doorklikken op eender welk veld in de tabel geeft je respectievelijk de juiste pagina. 
 Klikken op niewe ronde plannen, geeft je de [ronde planner pagina](#ronde-plannen).
 Klikken op de nieuwe ronde maken, geeft je de [ronde maker pagina](#ronde-maken).
