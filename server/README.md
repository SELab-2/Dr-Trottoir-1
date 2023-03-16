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
