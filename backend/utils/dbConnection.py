import pymysql.cursors

# Database connection parameters
# db_config = {
#     "host": "localhost",
#     "user": "root",
#     "password": "mickey123",
#     "db": "energy",
#     "charset": 'utf8mb4',
#     "cursorclass": pymysql.cursors.DictCursor
# }

db_config = {
    "host": "db",  # Use the service name defined in docker-compose.yml
    "user": "user",  # The MYSQL_USER you defined in docker-compose.yml
    "password": "password",  # The MYSQL_PASSWORD you defined in docker-compose.yml
    "db": "energy",  # The MYSQL_DATABASE you defined in docker-compose.yml
    "charset": 'utf8mb4',
    "cursorclass": pymysql.cursors.DictCursor
}



