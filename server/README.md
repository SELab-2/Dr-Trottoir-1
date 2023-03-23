# Server

## Overview

We maken gebruik van Docker en Docker Compose om onze services in te zetten.

![](./architecture.png)

### Traefik

We maken gebruik van Traefik als reverse proxy. Enkele features waar wij gebruik van maken zijn:

- Path based routing
- Automatische TLS via Let's Encrypt
- Integratie met Docker Compose via labels

Een service kan toegevoegd worden aan het Traefik netwerk met de volgende labels.

```yml
labels:
- "traefik.enable=true"
- "traefik.http.routers.api.rule=Host(`sel2-1.ugent.be`)"
- "traefik.http.routers.api.rule=PathPrefix(`/api/`)"
- "traefik.http.routers.api.entrypoints=websecure"
- "traefik.http.routers.api.tls.certresolver=letsencrypt"
- "traefik.http.services.api.loadbalancer.server.port=8081"
- "traefik.http.middlewares.api.stripprefix.prefixes=/api/"
```

### ImgProxy

ImgProxy is een microservice voor het aanbieden van afbeeldingen overheen het web. Aan de hand van URL parameters geven we de breedte en hoogste in pixels aan, alsook de encodering, kwaliteitsparameters, crop, enzovoort. Hierdoor besparen we kopzorgen in verband met het bijhouden van meerdere versies van dezelfde afbeelding.


### Lokale development
Om gemakkelijk lokaal te kunnen ontwikkelen is `developer-compose.yml` voorzien. Deze bevat identieke diensten als wat op de server staat, maar is voorbereid om de diensten lokaal te draaien.
Je hebt Docker met de Docker Compose plugin nodig om deze te kunnen uitvoeren.

```bash
# start de diensten op
docker compose --file=developer-compose.yml up -d

# vul de databank met mock data
./generate_mock.sh

# stop de diensten
docker compose --file=developer-compose.yml down
```

`./generate_mock.sh` hoef je slechts bij eerste keer diensten opstarten uit te voeren.

In plaats van `sel2-1.ugent.be` browse je nu naar `localhost:3000` om je nieuwe features te bekijken.
