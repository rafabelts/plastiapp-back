#!/usr/bin/env bash

# This is script generates a postgress container for a local database

# TO RUN ON WINDOWS:
# 1. Install WSL (Windows Subsystem for Linux) - https://learn.microsoft.com/en-us/windows/wsl/install
# 2. Install Docker Desktop for Windows - https://docs.docker.com/docker-for-windows/install/
# 3. Open WSL - `wsl`
# 4. Run this script - `./start-database.sh`

# On Linux and macOS you can run this script directly - `./start-database.sh`

DB_CONTAINER_NAME="plastiapp-postgres"
DB_NAME="plastiapp"

if ! [ -x "$(command -v docker)" ]; then
  echo "Docker is not installed. Install Docker first."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker daemon is not running. Start Docker first."
  exit 1
fi

# If running, exit
if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  echo "Database container '$DB_CONTAINER_NAME' already running"
  LOADED=true
else
  # If container exists but stopped → start it
  if [ "$(docker ps -aq -f name=$DB_CONTAINER_NAME)" ]; then
    docker start "$DB_CONTAINER_NAME"
    echo "Existing container '$DB_CONTAINER_NAME' started"
    LOADED=true
  else
    # Create random password
    DB_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_')
    DB_PORT=5432

    echo "Creating new PostgreSQL container..."

    docker run -d \
      --name $DB_CONTAINER_NAME \
      -e POSTGRES_USER="postgres" \
      -e POSTGRES_PASSWORD="$DB_PASSWORD" \
      -e POSTGRES_DB="postgres" \
      -p "$DB_PORT":5432 \
      postgres

    echo "Container created."
    echo "PostgreSQL password: $DB_PASSWORD"

    LOADED=false
  fi
fi

echo "Waiting for PostgreSQL to be ready..."
until docker exec "$DB_CONTAINER_NAME" pg_isready -U postgres >/dev/null 2>&1; do
  sleep 2
done
echo "PostgreSQL is ready."

# Create the database if not exists
echo "Ensuring database '$DB_NAME' exists..."
docker exec "$DB_CONTAINER_NAME" psql -U postgres -tc \
  "SELECT 1 FROM pg_database WHERE datname='$DB_NAME';" | grep -q 1 ||
  docker exec "$DB_CONTAINER_NAME" psql -U postgres -c "CREATE DATABASE $DB_NAME;"

echo "Database '$DB_NAME' ready."

# Load schema ONLY if container was just created
if [ "$LOADED" = false ]; then
  echo "Loading schema.sql into database '$DB_NAME'..."

  docker cp schema.sql "$DB_CONTAINER_NAME":/schema.sql

  docker exec -i "$DB_CONTAINER_NAME" psql -U postgres -d "$DB_NAME" -f /schema.sql

  if [ $? -ne 0 ]; then
    echo "Error: Schema failed to load."
    exit 1
  fi

  echo "Inserting default user_type rows..."
  docker exec "$DB_CONTAINER_NAME" psql -U postgres -d "$DB_NAME" -c \
    "INSERT INTO user_type (name)
     VALUES
       ('admin'),
       ('weighing'),
       ('exchange');"

  echo "Schema loaded successfully."
fi

# Show tables
echo "Tables in database '$DB_NAME':"

docker exec "$DB_CONTAINER_NAME" psql -U postgres -d "$DB_NAME" -c "\dt"

echo "Done."
