---
sidebar_position: 2
title: Docker Compose File Structure
description: Detailed breakdown of what you will see in a docker-compose.yml file.
---

This document provides an overview of the structure of a `docker-compose.yml` file but analyzing the following file.

The recommended way to utilize this document is to find an instance of what you want to understand in the example file, then navigate to the corresponding section to see how it is implemented. The example file aims to cover to main service types you will encounter in Science Island, namely web services, apis, databases, keycloak, and caddy.

---

## Example File

```yml
version: '3.2'

services:
  web:
    image: ghcr.io/educationnetworkgroup/si-website:main
    container_name: example_web
    expose:
      - "80"
    networks:
      - frontend
    depends_on:
      - api
      - keycloak
      - caddy

  api:
    build: ./api
    container_name: example_api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://user:password@db:5432/example
      KEYCLOAK_URL: "http://keycloak:8080"
      KEYCLOAK_REALM: "example-realm"
      KEYCLOAK_CLIENT_ID: "example-client"
      KEYCLOAK_CLIENT_SECRET: ${KEYCLOAK_CLIENT_SECRET:-secret}
    volumes:
      - ./api:/app
    networks:
      - frontend
      - backend
    depends_on:
      - db
      - keycloak

  db:
    image: postgres:15-alpine
    container_name: example_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: example
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - backend

  keycloak:
    image: jboss/keycloak:latest
    container_name: keycloak
    restart: unless-stopped
    command: start-dev
    environment:
      KEYCLOAK_USER: ${KEYCLOAK_USER:-admin}
      KEYCLOAK_PASSWORD: ${KEYCLOAK_PASSWORD:-admin}
      KEYCLOAK_REALM: ${KEYCLOAK_REALM:-example-realm}
      KEYCLOAK_IMPORT: /opt/keycloak/realm-config/realm-export.json
    ports:
      - "8081:8080"
    volumes:
      - ./keycloak/realm-config:/opt/keycloak/realm-config
    networks:
      - frontend
      - backend

  caddy:
    image: caddy:latest
    container_name: example_caddy
    restart: unless-stopped
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    ports:
      - "80:80"
      - "443:443"
    networks:
      - frontend
    depends_on:
      - web

volumes:
  db_data:
  web_data:
  keycloak_data:
  caddy_data:
  caddy_config:

networks:
  frontend:
    external: true
  backend:
```

---

## Version

```yml
version: '3.2'
```

`version` defines the file format of the compose file. Each version has slightly different features available, and could have changes in syntax and how things are interpreted.

**Version has recently been deprecated in docker compose, and can be omitted from the file.** [Read here](https://forums.docker.com/t/docker-compose-yml-version-is-obsolete/141313).

---

## Services

Services are the individual containers that compose is running. The following breaks down how each service is defined within the example file.

### web

```yml
web:
  image: ghcr.io/educationnetworkgroup/si-website:main
  container_name: example_web
  expose:
    - "80"
  networks:
    - frontend
  depends_on:
    - api
    - keycloak
    - caddy
```

| Key               | Description |
| ----------------- | ----------- |
| `web`             | Is the name of the service within the file. It is that name that other services will use to refer to the service **within the file** (E.g., within the depends_on key). The name has no impact outside of the file once the services are running. |
| `image`           | Where image is defined, the service uses a pre-built Docker image. In this case, ghcr.io/educationnetworkgroup/si-website:main is a package which contains the Science Island website. |
| `container_name`  | Is the name assigned to the Docker container once it is running. |
| `expose`          | Specifies which ports inside the container are accessible to other containers on the same network. Here, port 80 is exposed. |
| `networks`        | By default, all services within a compose file can communicate with each other on the same network. The *networks* key helps to both isolate different containers within a compose file, and allow containers to communicate with containers run outside of this compose file if they are on the same network. [Docker Networks](https://docs.docker.com/reference/cli/docker/network/) |
| `depends_on`      | Defines the startup order of the service. In this case, web won't until api, keycloak and caddy are up and running. This ensures the web application is ready to interact with the backend API, Keycloak for authentication, and Caddy as the reverse proxy. |

### api

```yml
api:
  build: ./api
  container_name: example_api
  ports:
    - "3000:3000"
  environment:
    DATABASE_URL: postgres://user:password@db:5432/example
    KEYCLOAK_URL: "http://keycloak:8080"
    KEYCLOAK_REALM: "example-realm"
    KEYCLOAK_CLIENT_ID: "example-client"
    KEYCLOAK_CLIENT_SECRET: ${KEYCLOAK_CLIENT_SECRET:-secret}
  volumes:
    - ./api:/app
  networks:
    - frontend
    - backend
  depends_on:
    - db
    - keycloak
```

| Key               | Description |
|------------------ | ----------- |
| `api`             | The name of the service within the file. This name is used for internal reference within the Docker Compose file. |
| `build`           | Specifies the build context for the service. In this case, it builds the image from the Dockerfile located in the `./api` directory. |
| `container_name`  | Defines the name of the container once it's running. Here, it's set to `example_api`.                      |
| `ports`           | Maps the container's port to the host machine. `3000:3000` means that port 3000 (left) on the host is mapped to port 3000 (right) inside the container, allowing access to the API. |
| `environment`     | Defines environment variables that will be passed into the container. These are explained below this table. |
| `volumes`         | Specifies volumes to mount from the host machine to the container. In this case, it mounts the local `./api` directory to `/app` inside the container, ensuring that any local code changes are reflected inside the container. |
| `networks`        | Specifies the networks that the service will connect to. The `api` service is connected to both the `frontend` and `backend` networks, enabling it to communicate with the `web` and `db` services. |
| `depends_on`      | Defines the service dependencies and the startup order. The `api` service will wait for `db` and `keycloak` to be up and running before it starts. This ensures the API can connect with all of the services in this compose file. |

#### Environment

At this point, you might be wondering what those environment variables actually mean. For instance, where did we pull `DATABASE_URL: postgres://user:password@db:5432/example` from? The following table breaks them down.

| Variable          | Description |
|------------------ | ----------- |
| `DATABASE_URL`    | Defines the connection string used by the api service to connect to the database. `postgres://user:password@db:5432/example` means the following: |
| *postgres://*     | Specifies the database protocol being used, in this case PostgreSQL. |
| *user:password*   | Is the username and password used to connect to the database. Here, they are hardcoded to match the values defined in the db service. |
| *@db*             | Refers to the hostname where the PostgreSQL database is running. In this case, db is the name of the database service defined in the Compose file. Docker will automatically resolve this name to the appropriate container's IP address in the same network. |
| *:5432*           | Specifies the port on which the PostgreSQL database is listening. Here, 5432 is the default port for PostgreSQL. |
| */example*        | Is the name of the database to connect to. Here, it is hardcoded to match the value defined in the db service. |
| `KEYCLOAK_URL`    | Defines the URL of the keycloak server. In this case, it points to the keycloak service defined in the compose file, which is expected to run on port 8080. |
| `KEYCLOAK_REALM`  | Specifies the Keycloak realm the api service will interact with for user authentication. |
| `KEYCLOAK_CLIENT_ID`       | The client ID used by the api service to identify itself to the Keycloak server during authentication flows. |
| `KEYCLOAK_CLIENT_SERVICE`  | The secret key associated with the Keycloak client ID. Here, it will first attempt to read the environment variable KEYCLOAK_CLIENT_SECRET. If it cannot find this variable in the environment, it will default to 'secret'. |

### db

```yml
db:
  image: postgres:15-alpine
  container_name: example_db
  restart: unless-stopped
  environment:
    POSTGRES_DB: example
    POSTGRES_USER: user
    POSTGRES_PASSWORD: password
  volumes:
    - db_data:/var/lib/postgresql/data
  networks:
    - backend
```

| Key               | Description |
|------------------ | ----------- |
| `db`              | The name of the service within the file. This name is used for internal reference within the Docker Compose file. |
| `image`           | Specifies the Docker image to be used for the service. In this case, postgres:15-alpine is a PostgreSQL image based on Alpine Linux. |
| `container_name`  | Defines the name of the container once it's running. Here, it's set to example_db. |
| `restart`         | Specifies the restart policy for the container. unless-stopped means that the container will automatically restart after a crash or reboot, unless it is manually stopped. |
| `environment`     | Defines environment variables that will be passed into the container. Here, it is used to set up the PostgreSQL database. |
| `volumes`         | Specifies volumes to mount from the host machine to the container. Here, it mounts a persistent volume (db_data) to /var/lib/postgresql/data inside the container, ensuring that the database data persists across container restarts. |
| `networks`        | Specifies the networks that the service will connect to. The db service is connected to the backend network, allowing it to communicate with other services on the same network. |

### keycloak

```yml
keycloak:
  image: quay.io/keycloak/keycloak
    container_name: keycloak
    restart: unless-stopped
    command: start-dev
    environment:
      KEYCLOAK_USER: ${KEYCLOAK_USER:-admin}
      KEYCLOAK_PASSWORD: ${KEYCLOAK_PASSWORD:-admin}
      KEYCLOAK_REALM: ${KEYCLOAK_REALM:-example-realm}
      KEYCLOAK_IMPORT: /opt/keycloak/realm-config/realm-export.json
    ports:
      - "8081:8080"
    volumes:
      - ./keycloak/realm-config:/opt/keycloak/realm-config
    networks:
      - frontend
      - backend
```

| Key               | Description |
|------------------ | ----------- |
| `keycloak`        | The name of the service within the file. This name is used for internal reference within the Docker Compose file. |
| `image`           | Specifies the container image to use. In this case, it pulls Keycloak from quay.io/keycloak/keycloak. |
| `container_name`  | Defines the name of the running container. Here, it's set to keycloak. |
| `restart`         | Specifies the restart policy for the container. unless-stopped means that the container will automatically restart after a crash or reboot, unless it is manually stopped. |
| `command`         | Gives the commands to run within the container when setting it up. Here, it tells the container to start Keycloak in developer mode (start-dev).  |
| `environment`     | Sets environment variables passed to the container at runtime. These are explained below this table. |
| `ports`           | Defined as '8081:8080'. This maps host port 8081 (left) to the containers port 8080 (right), making Keycloak accessible at http://localhost:8081. The host port does not need to match the container port, and often remapping ports can be useful to avoid conflicts where multiple services compete for the same default port. |
| `volumes`         | Mounts the local ./keycloak/realm-config directory to /opt/keycloak/realm-config inside the container. |
| `networks`        | Connects the container to both the frontend and backend Docker networks. |

#### Environment

| Variable           | Description |
|------------------- | ----------- |
| `KEYCLOAK_USER`    | Sets the admin username for Keycloak. Here, if it's not set in the host’s environment, defaults to admin. |
| `KEYCLOAK_PASSWORD`| Sets the admin password for Keycloak. Here, if it's not set in the host’s environment, defaults to admin. |
| `KEYCLOAK_REALM`   | Used to pass the name of the realm to import. Here, if it's not set in the host’s environment, defaults to example-realm. |
| `KEYCLOAK_IMPORT`  | Path to the realm export JSON file that will be imported on container startup. This must exist in the mounted volume. |

### caddy

```yml
caddy:
  image: caddy:latest
  container_name: example_caddy
  restart: unless-stopped
  volumes:
    - ./Caddyfile:/etc/caddy/Caddyfile
    - caddy_data:/data
    - caddy_config:/config
  ports:
    - "80:80"
    - "443:443"
  networks:
    - frontend
  depends_on:
    - web
```

| Key               | Description |
|------------------ | ----------- |
| `caddy`           | The name of the service within the file. This name is used for internal reference within the Docker Compose file. |
| `image`           | Specifies the container image to use. In this case, it pulls the official caddy image from [Docker Hub](https://hub.docker.com/). |
| `container_name`  | Defines the name of the running container. Here, it's set to example_caddy. |
| `restart`         | Specifies the restart policy for the container. unless-stopped means that the container will automatically restart after a crash or reboot, unless it is manually stopped. |
| `volumes`         | Mounts host paths or into the container. |
| `ports`           | Maps ports from the host to the container. Port 80 (HTTP) and 443 (HTTPS) are exposed here. The host port is to the left of the `:`, and the container port to the right ( host:container ). |
| `networks`        | Connects Caddy to the frontend Docker network |
| `depends_on`      | Ensures Caddy starts only after the web service is up and running, avoiding misrouting before the site is ready. |

---

## Volumes

```yml
volumes:
  db_data:
  web_data:
  keycloak_data:
  caddy_data:
  caddy_config:
```

The `volumes` section in Docker Compose defines persistent storage that exists independently of a container’s internal filesystem.

Take the db_data volume as an example, defined in the db service:

```yml
volumes:
  - db_data:/var/lib/postgresql/data
```

This line tells Docker to mount the named volume `db_data` to the path `/var/lib/postgresql/data` inside the container. Since this is where PostgreSQL stores its data files, it ensures that your database contents are preserved even if the container is stopped, deleted, or recreated.

By defining db_data in the top-level `volumes` section of the Compose file, Docker handles creating and managing the volume automatically.

---

## Networks

```yml
networks:
  frontend:
    external: true
  backend:
```

The `networks` section in Docker Comport defines the virtual networks that the services can join and communicate over. Here, the file declares two named networks: `frontend` and `backend`. Once declared, services can be explicitly assigned to one or more of these networks using the networks key under each service.

Networks serve two functions:

- To isolate services within a single compose file so they can't communicate.
- To connect services across multiple compose files so that they can communicate by being on the same virtual network. This requires creating an [External Network](#external-networks)

> If no networks are defined, then Docker Compose will assign all services in the file to the same virtual network. Therefore, **defining networks is optional**.

### External Networks

External networks are pre-existing networks which can be used to allow communicate between services in multiple compose files.

To declare a network as external, include the following key.

```yml
networks:
  frontend:
    external: true
```

The network will need to be created in your environment by running the following command.

```bash
docker network create <network-name>
```

> Note that this command only needs to be run once for each external network. The network will persist until you delete it with the `docker network rm <network_name>` command. You can check your current networks with the `docker network ls` command.