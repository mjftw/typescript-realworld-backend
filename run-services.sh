# Express app configuration
export APP_PORT=4000
export APP_HOST=localhost

# PostgreSQL database configuration
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres
export POSRGRES_PORT=15432

# Pgadmin4 db admin configuration
export PGADMIN_EMAIL=myemail@domain.com
export PGADMIN_PASSWORD=supersecret
export PGADMIN_PORT=8080

docker-compose build
docker-compose up