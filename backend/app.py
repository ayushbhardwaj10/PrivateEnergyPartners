from flask import Flask,jsonify, request, send_from_directory
from flask_cors import CORS
from utils.dbConnection import db_config
import pymysql.cursors
import hashlib

app = Flask(__name__, static_folder='../frontend/energyapp/build', static_url_path='')

# Enable CORS for all domains on all routes
CORS(app, supports_credentials=True, resources={r"*": {"origins": "*", "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"], "expose_headers": ["Access-Control-Allow-Origin"], "supports_credentials": True}})

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/test')
def test():
   return jsonify({"success": True})

@app.route('/signup', methods=['POST'])
def signup():
    # Extract data from request
    fullName = request.json.get('fullName')
    userName = request.json.get('userName')
    password = request.json.get('password')

    # Validate incoming data
    if not fullName or not userName or not password:
        return jsonify({"error": "Missing fullName, userName, or password"}), 400
    
    if(check_username_exists(userName)==1):
      return jsonify({"error": "UserName already exists"}), 401

    # Generate a salt and hash the password
    salt_source = userName + fullName
    salt = hashlib.sha256(salt_source.encode()).hexdigest()

    password_salt_combo = password + salt
    password_hash = hashlib.sha256(password_salt_combo.encode()).hexdigest()


    # Attempt to insert into the database
    try:
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            sql = "INSERT INTO users (fullname, userName, salt, password_hash) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (fullName, userName, salt, password_hash))
            connection.commit()
            # If commit is successful, return success message
            return jsonify({"success": True})
    except Exception as e:
        # In case of any exception, log the error and return a 500 response
        print(f"Failed to insert user: {e}")  # Adjust logging as appropriate for your application
        return jsonify({"error": "An error occurred during signup"}), 500
    finally:
        # Ensure the database connection is closed
        if connection:
            connection.close()

@app.route('/login', methods=['POST'])
def login():
    # Extract username and password from the request
    username = request.json.get('userName')
    password = request.json.get('password')


    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        # Connect to the database
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            # Fetch the user's salt and password_hash
            sql = "SELECT salt, password_hash FROM users WHERE userName = %s"
            cursor.execute(sql, (username,))
            result = cursor.fetchone()
            
            if not result:
                return jsonify({"error": "Username does not exist"}), 404
            
            salt, stored_password_hash = result['salt'], result['password_hash']

            # Generate the hash of the provided password with the fetched salt
            password_salt_combo = password + salt
            password_hash = hashlib.sha256(password_salt_combo.encode()).hexdigest() 
            
            # Check if the generated hash matches the stored hash
            if password_hash == stored_password_hash:
                return jsonify({"message": "Successful login"}), 200
            else:
                return jsonify({"error": "Login failed"}), 401
                
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

def check_username_exists(username):
    try:
        # Establish a database connection
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            # SQL query to check if the username exists
            sql = "SELECT EXISTS(SELECT 1 FROM users WHERE userName = %s) AS userExists"
            cursor.execute(sql, (username,))
            result = cursor.fetchone()
            # Check the result and return True if the user exists, False otherwise
            return result['userExists']
    except Exception as e:
        return False  # Consider how you want to handle errors; False is a simple approach
    finally:
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)