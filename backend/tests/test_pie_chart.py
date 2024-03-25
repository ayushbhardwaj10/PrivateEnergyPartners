import unittest
import json
from application import application  # Make sure this correctly imports your Flask app
import base64
import hashlib

class PieChartTestCase(unittest.TestCase):
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

    def test_pieChart_with_valid_token(self):
        token = self.login_and_get_token()

        linegraph_data = {
            "userid": 1,  # Assuming a valid user ID
            "energy_type": 'solar',
            "duration": 4
        }
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        response = self.application.post('/pieChartData', data=json.dumps(linegraph_data), headers=headers)

        self.assertEqual(response.status_code, 200)

    def test_pieChart_with_invalid_token(self):
        # This uses an intentionally invalid token
        token = "invalidtoken"

        linegraph_data = {
            "userid": 1,  # Assuming a valid user ID
            "energy_type": 'solar',
            "duration": 4
        }
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        response = self.application.post('/pieChartData', data=json.dumps(linegraph_data), headers=headers)

        self.assertEqual(response.status_code, 403)  # Expecting a 401 Unauthorized status

if __name__ == '__main__':
    unittest.main()
