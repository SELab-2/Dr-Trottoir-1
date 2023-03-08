# Swagger mock server

## source
The code for this server was cloned from the following repo: https://github.com/swagger-api/swagger-ui.git.
This repo implements a standalone server for a yaml file (see /dist folder of the repo).
This means that you just need to serve this folder to have a mock-server available. (no building/compiling needed).

## overview of the folder
The **index.html** file is a plain html file containing a simple div with the id "swagger-ui".
Due to the precompiled scripts it attempts to serve the **api.yaml** file as defined in **swagger-initializer.js** inside of this div.
All other files are better left untouched unless you really know what you are doing. 

## running the server
You just need to serve this folder because everything has already been built into plain html and css.
I like to use the following command:

```Bash
serve swagger
```