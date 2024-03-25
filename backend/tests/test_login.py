import unittest
import json
import os
import sys
from application import application
import hashlib
import base64

# Append the directory of application.py to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class LoginTestCase(unittest.TestCase):
    def setUp(self):
        self.application = application.test_client()
        self.application.testing = True

    def base64Encode(self, userName, passwordHash):
        return base64.b64encode(f"{userName}:{passwordHash}".encode()).decode()

    def sh256Encode(self,msg):
        return hashlib.sha256(msg.encode()).hexdigest()

    def test_successful_login(self):
        # Given
        login_data = {
            "userName": "ayush@gmail.com",
            "password": self.sh256Encode("Password@123")
        }
        
        credentials = self.base64Encode(login_data['userName'],login_data['password'])
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f"Basic {credentials}"  
        }

        response = self.application.post('/login', data=json.dumps(login_data), headers=headers)

        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.data.decode('utf-8'))
        self.assertIn('token', response_data)
        self.assertIn('fullName', response_data)
        self.assertIn('userid', response_data)
        self.assertIn('refresh_token', response_data)
        self.assertEqual(response_data['message'], "Successful login")
    
    def test_failure_login(self):
        # Given
        login_data = {
            "userName": "ayush@gmail.com",
            "password": self.sh256Encode("someRandomPassword")
        }
        
        credentials = self.base64Encode(login_data['userName'],login_data['password'])
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f"Basic {credentials}"  
        }

        # When
        response = self.application.post('/login', data=json.dumps(login_data), headers=headers)

        # Then
        self.assertEqual(response.status_code, 401)
       

if __name__ == '__main__':
    unittest.main()