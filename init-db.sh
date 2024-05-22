#!/bin/bash

# Check for environment variables
if [ -z "$POSTGRES_DB" ] || [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ]; then
  echo "Error: Missing environment variables. Please set POSTGRES_DB, POSTGRES_USER, and POSTGRES_PASSWORD."
  exit 1
fi


# Create database (if it doesn't exist)
psql -h petition-db -U postgres -c "CREATE DATABASE IF NOT EXISTS $POSTGRES_DB"

# Create user
psql -h localhost -U postgres -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';"
