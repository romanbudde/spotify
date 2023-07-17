# #!/bin/bash
# set -e

# psql -v ON_ERROR_STOP=1 --username postgres <<-EOSQL
# 	CREATE USER docker;
# 	CREATE DATABASE db_cuidadores;
# 	GRANT ALL PRIVILEGES ON DATABASE db_cuidadores TO postgres;
# EOSQL