import pymysql.cursors

# Database connection parameters
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "mickey123",
    "db": "energy",
    "charset": 'utf8mb4',
    "cursorclass": pymysql.cursors.DictCursor
}




