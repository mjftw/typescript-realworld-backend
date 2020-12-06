# Express app configuration
export APP_PORT="4000"
export HOSTNAME="localhost"

# PostgreSQL database configuration
export POSTGRES_USER="postgres"
export POSTGRES_PASSWORD="postgres"
export POSTGRES_PORT="5432"
export POSTGRES_DB_NAME="realworld-backend-app"

# Pgadmin4 db admin configuration
export PGADMIN_EMAIL="myemail@domain.com"
export PGADMIN_PASSWORD="supersecret"
export PGADMIN_PORT="8080"

docker-compose build
docker-compose up