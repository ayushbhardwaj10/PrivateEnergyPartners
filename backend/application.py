from flask import Flask,jsonify, request, send_from_directory, make_response
from flask_cors import CORS
from utils.dbConnection import db_config
from utils.constants import JWT_SECRET_KEY;
import pymysql.cursors
import hashlib
import jwt
from jwt import ExpiredSignatureError
import datetime
from datetime import timedelta
from functools import wraps
from utils.helperFunctions import get_percentage, get_energy_data

#for local and Docker
application = Flask(__name__, static_folder='../frontend/energyapplication/build', static_url_path='')
application.config['SECRET_KEY'] = JWT_SECRET_KEY

#for AWS
# application = Flask(__name__, static_folder='./build', static_url_path='')
# application.config['SECRET_KEY'] = JWT_SECRET_KEY

# Enable CORS for all domains on all routes
CORS(application, supports_credentials=True, resources={r"*": {"origins": "*", "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"], "expose_headers": ["Access-Control-Allow-Origin"], "supports_credentials": True}})


#Utility Function to Verify Tokens
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Extract token from the Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Token is missing!'}), 403
        
        try:
            # Typically, the Authorization header is in the format "Bearer <token>"
            token = auth_header.split(" ")[1]  # Assuming the format is "Bearer token"
            jwt.decode(token, application.config['SECRET_KEY'], algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401  # Specific message for expired token
        except:
            return jsonify({'message': 'Token is invalid!'}), 403
        
        return f(*args, **kwargs)
    return decorated

@application.route('/')
def serve():
    return send_from_directory(application.static_folder, 'index.html')

@application.route('/signup', methods=['POST'])
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
        print(f"Failed to insert user: {e}")  # Adjust logging as applicationropriate for your applicationlication
        return jsonify({"error": "An error occurred during signup"}), 500
    finally:
        # Ensure the database connection is closed
        if connection:
            connection.close()

@application.route('/login', methods=['POST'])
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    
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
            sql = "SELECT salt, password_hash, fullname, user_id FROM users WHERE userName = %s"
            cursor.execute(sql, (username,))
            result = cursor.fetchone()

            # print(result)
            
            if not result:
                return jsonify({"error": "Username does not exist"}), 404
            
            salt, stored_password_hash, fullName,user_id = result['salt'], result['password_hash'], result['fullname'],result['user_id']
  

            # # Generate the hash of the provided password with the fetched salt
            password_salt_combo = password + salt

            password_hash = hashlib.sha256(password_salt_combo.encode()).hexdigest() 
            print(password_hash)
            
            # # Check if the generated hash matches the stored hash
            if password_hash == stored_password_hash:
                token = jwt.encode({'user': username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=10)}, application.config['SECRET_KEY'], algorithm="HS256")      
                # Generate refresh token
                refresh_token = jwt.encode(
                    {'user': username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)},
                    application.config['SECRET_KEY'], algorithm="HS256"
                )

                return jsonify({"message": "Successful login", "fullName": fullName, "token": token, "userid": user_id, "refresh_token": refresh_token}), 200
            else:
                # return jsonify({"error": "Login failed"}), 401
                 return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
                
    except Exception as e:
        print("Error in login ::")
        print(e)
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@application.route('/tokenValid', methods=['GET']) 
def validate_token():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({'message': 'Token is missing!'}), 400
    
    try:
        # Decode the token
        data = jwt.decode(token, application.config['SECRET_KEY'], algorithms=["HS256"])
        # Token is valid, you can also add additional checks here (e.g., user roles)
        return jsonify({'message': 'Token is valid!', 'data': data}), 200
    except ExpiredSignatureError:
        return jsonify({'message': 'Token has expired!'}), 402
    except Exception as e:
        return jsonify({'message': 'Token is invalid!'}), 401

@application.route('/refresh_token', methods=['POST'])
def refresh_access_token():

    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        refresh_token = auth_header.split(" ")[1]
    else:
        return jsonify({'message': 'Token is missing!'}), 400
    
    try:
        # Attempt to decode the refresh token
        payload = jwt.decode(refresh_token, application.config['SECRET_KEY'], algorithms=["HS256"])
        # Extract user info from token payload if needed
        username = payload['user']
        
        # Generate a new access token
        new_access_token = jwt.encode({
            'user': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
        }, application.config['SECRET_KEY'], algorithm="HS256")
        
        # Send new access token to the client
        return jsonify({'token': new_access_token})
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Refresh token expired'}), 401  # Specific message for expired token
    except:
        return jsonify({'message': 'Invalid refresh token'}), 400

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
        return False  # Consider how you want to handle errors; False is a simple applicationroach
    finally:
        if connection:
            connection.close()

@application.route('/linegraph', methods=['POST'])
@token_required
def linegraph():
    data = request.get_json()
    user_id = data['userid']
    duration = int(data['duration'])
    source = data['source']
    
    # Calculate start and end dates based on duration
    end_date = datetime.datetime.strptime('2024-03-21', '%Y-%m-%d')
    start_date = end_date - timedelta(days=duration-1)

    
    # Convert dates to string format for SQL query
    start = start_date.strftime('%Y-%m-%d')
    end = end_date.strftime('%Y-%m-%d')

    print(start)
    print(end)
    
    response_data = {'production': [], 'consumption': []}
    
    try:
        # Connect to the database
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            # Query for production data
            sql_production = f"""
            SELECT energy_kW
            FROM production
            WHERE energy_type = %s AND user_id = %s
            AND DATE(recorded_at) BETWEEN %s AND %s
            ORDER BY recorded_at;
            """
            cursor.execute(sql_production, (source, user_id, start, end))
            response_data['production'] = [row['energy_kW'] for row in cursor.fetchall()]
            
            # Query for consumption data
            sql_consumption = f"""
            SELECT energy_kW
            FROM consumption
            WHERE energy_type = %s AND user_id = %s
            AND DATE(recorded_at) BETWEEN %s AND %s
            ORDER BY recorded_at;
            """
            cursor.execute(sql_consumption, (source, user_id, start, end))
            response_data['consumption'] = [row['energy_kW'] for row in cursor.fetchall()]
    
    except Exception as e:
        print(f"Failed to fetch data: {e}")
        return jsonify({'error': 'An error occurred fetching data'}), 500
    
    finally:
        if connection:
            connection.close()
    
    return jsonify(response_data)

@application.route('/pieChartData', methods=['POST'])
@token_required
def pie_chart_data():
    data = request.json
    user_id = data['userid']
    energy_type = data['energy_type']
    duration = int(data['duration'])  # Assuming duration is provided as an integer

    production_data = get_percentage(user_id, energy_type, 'production', duration)
    consumption_data = get_percentage(user_id, energy_type, 'consumption', duration)

    result = {
        'production': production_data,
        'consumption': consumption_data
    }

    return jsonify(result)

@application.route('/getEnergyDateWise', methods=['POST'])
@token_required
def get_energy_date_wise():
    data = request.json
    user_id = data['user_id']
    energy_type = data['energy_type']

    production_data = get_energy_data(user_id, energy_type, 'production')
    consumption_data = get_energy_data(user_id, energy_type, 'consumption')

    result = {
        "production": production_data,
        "consumption": consumption_data
    }

    return jsonify(result)

@application.route('/GlobalEnergyData', methods=['GET'])
@token_required
def global_energy_data():
    try:
        # Connect to the database
        connection = pymysql.connect(**db_config)
        energy_types = ['solar', 'wind', 'hydro']
        data = {'production': {}, 'consumption': {}}
        
        with connection.cursor() as cursor:
            # Query for production data
            for energy_type in energy_types:
                sql_production = """
                SELECT ROUND(SUM(energy_kW), 2) AS total_energy
                FROM production
                WHERE energy_type = %s;
                """
                cursor.execute(sql_production, (energy_type,))
                result = cursor.fetchone()
                data['production'][energy_type] = result['total_energy'] if result['total_energy'] is not None else 0.0

            # Query for consumption data
            for energy_type in energy_types:
                sql_consumption = """
                SELECT ROUND(SUM(energy_kW), 2) AS total_energy
                FROM consumption
                WHERE energy_type = %s;
                """
                cursor.execute(sql_consumption, (energy_type,))
                result = cursor.fetchone()
                data['consumption'][energy_type] = result['total_energy'] if result['total_energy'] is not None else 0.0

    except Exception as e:
        print(f"Failed to fetch data: {e}")
        return jsonify({'error': 'An error occurred fetching data'}), 500

    finally:
        if connection:
            connection.close()

    return jsonify(data)

if __name__ == '__main__':
    application.run(use_reloader=True, port=5000, threaded=True)