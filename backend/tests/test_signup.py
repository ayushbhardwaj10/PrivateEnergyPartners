import unittest
import json
from application import application
import base64
import hashlib

class SignupTestCase(unittest.TestCase):
    def setUp(self):
        # Setup the Flask test client
        self.app = application.test_client()
        # This is where we'll send requests to and receive responses from
        self.app.testing = True

    def test_successful_signup(self):
        signup_data = {
            "fullName": "Test User 6",
            "userName": "testuser6@example.com",
            "password": "TestPassword123!"
        }

        password_hash = hashlib.sha256(signup_data['password'].encode()).hexdigest()

        signup_data['password'] = password_hash

        response = self.app.post('/signup', data=json.dumps(signup_data),
                                 content_type='application/json')

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data.decode())
        self.assertTrue(response_data['success'])

    def test_signup_with_existing_username(self):
        # Test data with a username that already exists in the database
        signup_data = {
            "fullName": "Ayush Bhardwaj",
            "userName": "ayush@gmail.com",
            "password": "Password@123"
        }

        # Hash the password
        password_hash = hashlib.sha256(signup_data['password'].encode()).hexdigest()

        # Update the password in the signup data with the hashed version
        signup_data['password'] = password_hash

        # Attempt to sign up with the existing username
        response = self.app.post('/signup', data=json.dumps(signup_data),
                                 content_type='application/json')

        # Check if the response indicates that the username already exists (HTTP 401 Unauthorized)
        self.assertEqual(response.status_code, 401)

if __name__ == '__main__':
    unittest.main()
