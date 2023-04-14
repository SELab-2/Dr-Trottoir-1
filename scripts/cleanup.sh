#!/usr/bin/env bash

PURGE_RUNNER=false
PURGE_DOCKER=false

while getopts "pd" flag
do
    case "${flag}" in
        p) PURGE_RUNNER=true;;
        d) PURGE_DOCKER=true;;
        *) ;;
    esac
done

if [ "$PURGE_DOCKER" = true ] ; then
    # remove all docker artifacts
    docker system prune -af
    docker network prune -f
    docker volume prune -f
    docker container prune -f
    docker image prune -af
fi

if [ "$PURGE_RUNNER" = true ] ; then
    # Purge all files runner stores
    echo "Purging runner files"
    rm -rf ./*
fi
