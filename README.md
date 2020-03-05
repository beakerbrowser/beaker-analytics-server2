# Beaker Analytics Server 2

A simple service for accepting Beaker user pings. Collects the following data:

 - A random user ID generated by Beaker and stored internally
 - The Beaker version
 - The OS

## Dev environment

Requires Postgres 11.

## Env vars

General service settings:

```
NODE_ENV="development" | "production"
SERVICE_TITLE="Beaker Analytics Server"
SERVICE_ORIGIN="http://localhost:3000"
```

Database (when NODE_ENV == production):

```
RDS_HOSTNAME={...}
RDS_USERNAME={...}
RDS_PASSWORD={...}
RDS_PORT={...}
RDS_DB_NAME={...}
```

Database (when NODE_ENV == development):

```
PGHOST=localhost
PGUSER={...}
PGPASSWORD={...}
PGPORT=5432
PGDATABASE=beaker_analytics_db
```