# Spiky Waves

Django Chat application

## PostgreSQL configuration

If you use docker-compose, you don't need this configuration.

Enter interactive shell:

```bash
sudo -u postgres psql
```

Create user:

```psql
CREATE USER spiky_admin WITH CREATEDB CREATEROLE PASSWORD '123';
```

Create db:

```psql
CREATE DATABASE spiky_db;
```

Grant privileges to newly created user:

```psql
GRANT ALL PRIVILEGES ON DATABASE spiky_db TO spiky_admin;
```

Or grant owner permission:

```psql
ALTER DATABASE spiky_db OWNER TO spiky_admin;
```

## Environment configuration

Create 2 files along side settings.py, 1 - `.env.dev`, 2 - `.env.db.dev`.

`.env.dev`:

```env
DEBUG=1
SECRET_KEY=change_me
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
DB_ENGINE=django.db.backends.postgresql
DB_NAME=spiky_db
DB_USER=spiky_admin
DB_PASSWORD=123
DB_HOST=db
DB_PORT=5432
CSRF_TRUSTED_ORIGINS=localhost:1337
```

`.env.db.dev`:

```env
POSTGRES_DB=spiky_db
POSTGRES_USER=spiky_admin
POSTGRES_PASSWORD=123
```
