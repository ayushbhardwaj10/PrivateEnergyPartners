from flask import Flask,jsonify, send_from_directory
import pymysql.cursors

# app = Flask(__name__)

app = Flask(__name__, static_folder='../frontend/energyapp/build', static_url_path='')

# Database connection parameters
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "mickey123",
    "db": "energy",
    "charset": 'utf8mb4',
    "cursorclass": pymysql.cursors.DictCursor
}

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/users')
def users():
    connection = pymysql.connect(**db_config)
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM users"
            cursor.execute(sql)
            result = cursor.fetchall()
            return jsonify(result)
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)