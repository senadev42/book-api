#!/bin/sh

# Configuration paths
SERVERS_JSON_PATH="/pgadmin4/servers.json"
PGPASS_FILE="$HOME/.pgpass"

echo "Configuring pgAdmin4 for postgres ..."

# Create PostgreSQL password file
echo "Setting up secure PostgreSQL connection..."
echo "${POSTGRES_HOST}:*:*:${POSTGRES_USER}:${POSTGRES_PASSWORD}" > "$PGPASS_FILE"
chmod 600 "$PGPASS_FILE"

# create servers configurationn
echo "Configuring database connection..."
cat << EOF > "$SERVERS_JSON_PATH"
{
    "Servers": {
        "1": {
            "Name": "Bookyrent PostgresDB",
            "Group": "Servers",
            "Host": "${POSTGRES_HOST}",
            "Port": ${POSTGRES_PORT},
            "MaintenanceDB": "${POSTGRES_DB}",
            "Username": "${POSTGRES_USER}",
            "PassFile": "$PGPASS_FILE",
            "SSLMode": "disable"
        }
    }
}
EOF

# Start pgAdmin
echo "Launching pgAdmin4..."
exec /entrypoint.sh