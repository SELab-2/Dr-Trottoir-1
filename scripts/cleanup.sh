#!/usr/bin/env bash

PURGE=false

while getopts "p" flag
do
    case "${flag}" in
        p) PURGE=true;;
        *) ;;
    esac
done

# remove all docker artifacts
docker system prune -af
docker network prune -f
docker volume prune -f
docker container prune -f
docker image prune -af

if [ "$PURGE" = true ] ; then
    echo "Purging runner files"
    rm -rf ./*
fi
