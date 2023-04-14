#!/usr/bin/env bash

# removes all docker artifacts
docker system prune -af
docker network prune -f
docker volume prune -f
docker container prune -f
docker image prune -af
