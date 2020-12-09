# Express app configuration
export APP_PORT="4000"
export JWT_SECRET="R4nLO7gmmmGt1kTEWtrw"

# PostgreSQL database configuration
export DB_USERNAME="admin"
export DB_PASSWORD="secret"
export DB_PORT="35432"
export DB_NAME="realworld-backend-app"

# Pgadmin4 db admin configuration
export PGADMIN_EMAIL="myemail@domain.com"
export PGADMIN_PASSWORD="supersecret"
export PGADMIN_PORT="8080"

docker-compose build
docker-compose up