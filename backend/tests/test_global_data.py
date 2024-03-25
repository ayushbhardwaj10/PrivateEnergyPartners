import unittest
import json
from application import application  # Make sure this correctly imports your Flask app
import base64
import hashlib

class EnergyDateWiseGraphTest(unittest.TestCase):
    def setUp(self):
        self.application = application.test_client()
        self.application.testing = True

    def base64Encode(self, userName, passwordHash):
        return base64.b64encode(f"{userName}:{passwordHash}".encode()).decode()

    def sh256Encode(self,msg):
        return hashlib.sha256(msg.encode()).hexdigest()

    def login_and_get_token(self):
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
        data = json.loads(response.data.decode())
        return data['token']

    def test_globalEnergyData_structure(self):
        token = self.login_and_get_token()
        self.assertIsNotNone(token, "Failed to obtain token.")

        headers = {'Authorization': f'Bearer {token}'}
        response = self.application.get('/GlobalEnergyData', headers=headers)
        self.assertEqual(response.status_code, 200, "Expected status code 200.")

        data = json.loads(response.data.decode())
        self.assertIn('consumption', data, "Response does not have 'consumption' key.")
        self.assertIn('production', data, "Response does not have 'production' key.")

        for key in ['hydro', 'solar', 'wind']:
            with self.subTest(section='consumption', key=key):
                self.assertIn(key, data['consumption'], f"'consumption' does not have '{key}' key.")
            with self.subTest(section='production', key=key):
                self.assertIn(key, data['production'], f"'production' does not have '{key}' key.")

    def test_globalEnergy_with_invalid_token(self):
        # This uses an intentionally invalid token
        token = "invalidtoken"

        headers = {
            'Authorization': f'Bearer {token}',
        }
        response = self.application.get('/GlobalEnergyData', headers=headers)

        self.assertEqual(response.status_code, 403)  # Expecting a 401 Unauthorized status

if __name__ == '__main__':
    unittest.main()
