import numpy as np
from datetime import datetime, timedelta
from utils.dbConnection import db_config
import pymysql.cursors
from flask import jsonify

# Use :  generate_solar_data_last7daysHourly(1,5000,7000)
def generate_solar_data_last7daysHourly(user_id, minPeak, maxPeak) :
    # Define the start time as 8am, 7 days back from today
    start_time = datetime.now() - timedelta(days=7)
    start_time = start_time.replace(hour=8, minute=0, second=0, microsecond=0)

    data = []
    peak_energy_randomness = np.random.uniform(minPeak, maxPeak, size=7)  # eg: [5000,7000] Generate peak for each date from uniform distribution. Each peak has equal probability of occuring.

    for day in range(7):
        for hour in range(24):
            recorded_at = start_time + timedelta(days=day, hours=hour)
            if 5 <= recorded_at.hour < 19:  # Energy production between 5am and 7pm
                if recorded_at.hour < 14:  # Increasing phase from 5am to 2pm
                    energy_kw = ((recorded_at.hour - 5) / (14 - 5)) * peak_energy_randomness[day]
                else:  # Decreasing phase from 2pm to 7pm
                    energy_kw = ((19 - recorded_at.hour) / (19 - 14)) * peak_energy_randomness[day]
            else:
                energy_kw = 0  # No production from 7pm to 5am
            data.append({"recorded_at": recorded_at.strftime('%Y-%m-%d %H:%M:%S'), "energy_kw": np.round(energy_kw, 2)})
            

    # Assuming db_config and data are defined
    try:
        # Establish the connection outside of the loop
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            sql = "INSERT INTO production (user_id, recorded_at, energy_type, energy_kW) VALUES (%s, %s, %s, %s)"
            
            # Loop over the data outside of the try-except block
            for currData in data:
                recorded_at = currData['recorded_at']    # Use string keys to access dictionary values
                energy_kW = currData['energy_kw']

                # Execute the query for each item in data
                cursor.execute(sql, (user_id, recorded_at, 'solar', energy_kW))
                
            # Commit the transaction after all insertions are done
            connection.commit()
            print("Successfully inserted all data.")

    except Exception as e:
        print(f"Failed to insert data: {e}")

    finally:
        # Close the connection after the loop
        if connection:
            connection.close()

def generate_Any_energy_last7DaysHourly(table_name,user_id, energyType, minRange, maxRange) :

    start_time = datetime.now() - timedelta(days=7)
    start_time = start_time.replace(hour=8, minute=0, second=0, microsecond=0)

    data_random = []

    for day in range(7):
        for hour in range(24):
            recorded_at = start_time + timedelta(days=day, hours=hour)
            # Generate a random energy_kW value between 1 and 2000
            energy_kw = np.random.uniform(minRange, maxRange)          # eg range[50,2000]
            data_random.append({"recorded_at": recorded_at.strftime('%Y-%m-%d %H:%M:%S'), "energy_kw": np.round(energy_kw, 2)})

    # Display the first few entries to verify
    data_random

    try:
        # Establish the connection outside of the loop
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            sql = f"INSERT INTO {table_name} (user_id, recorded_at, energy_type, energy_kW) VALUES (%s, %s, %s, %s)"
            
            # Loop over the data outside of the try-except block
            for currData in data_random:
                recorded_at = currData['recorded_at']    # Use string keys to access dictionary values
                energy_kW = currData['energy_kw']

                # Execute the query for each item in data
                cursor.execute(sql, (user_id, recorded_at, energyType, energy_kW))
                
            # Commit the transaction after all insertions are done
            connection.commit()
            print("Successfully inserted all data.")

    except Exception as e:
        print(f"Failed to insert data: {e}")

    finally:
        # Close the connection after the loop
        if connection:
            connection.close()

def get_date_range(duration):
    # End date is fixed as 21st March 2024
    end_date = datetime(2024, 3, 21)
    # Calculate the start date based on the duration
    start_date = end_date - timedelta(days=duration - 1)
    return start_date, end_date

def get_percentage(user_id, energy_type, table_name, duration):
    start_date, end_date = get_date_range(duration)
    try:
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            # Sum of energy_kW for all matching the energy_type within the date range
            total_energy_query = f"""
                SELECT COALESCE(SUM(energy_kW), 0) AS total_energy
                FROM {table_name} 
                WHERE energy_type = %s 
                AND DATE(recorded_at) BETWEEN %s AND %s
            """
            cursor.execute(total_energy_query, (energy_type, start_date, end_date))
            total_energy = cursor.fetchone()['total_energy']
            
            # Sum of energy_kW for user_id matching both user_id and energy_type within the date range
            user_energy_query = f"""
                SELECT COALESCE(SUM(energy_kW), 0) AS user_energy
                FROM {table_name} 
                WHERE user_id = %s 
                AND energy_type = %s 
                AND DATE(recorded_at) BETWEEN %s AND %s
            """
            cursor.execute(user_energy_query, (user_id, energy_type, start_date, end_date))
            user_energy = cursor.fetchone()['user_energy']
            
            # Calculate percentages
            if total_energy > 0:
                user_percentage = (user_energy / total_energy) * 100
                other_percentage = 100 - user_percentage
            else:
                user_percentage = 0
                other_percentage = 0

    except Exception as e:
        print(f"Database query failed: {e}")
        user_percentage = 0
        other_percentage = 0
    finally:
        if connection:
            connection.close()

    return {'Yours': user_percentage, 'Others': other_percentage}

def get_energy_data(user_id, energy_type, table_name):
    # Dates range
    start_date = datetime(2024, 3, 14)
    end_date = datetime(2024, 3, 21)
    
    energy_data = []

    try:
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            for single_date in (start_date + timedelta(days=n) for n in range((end_date - start_date).days + 1)):
                sql = f"""
                SELECT COALESCE(SUM(energy_kW),0) AS total_energy
                FROM {table_name}
                WHERE user_id = %s
                AND energy_type = %s
                AND DATE(recorded_at) = %s
                """
                cursor.execute(sql, (user_id, energy_type, single_date.strftime('%Y-%m-%d')))
                result = cursor.fetchone()
                energy_data.append(round(result['total_energy'], 2))
    except Exception as e:
        print(f"Failed to query energy data: {e}")
    finally:
        if connection:
            connection.close()

    return energy_data
