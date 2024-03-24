export const MODE = 0;
// MODE = 0 - For local testing,
// MODE = 1 - For dockerization
// MODE = 2 - For deployment over AWS

export const SIGNUP_API_URL = [
  "http://127.0.0.1:5000/signup",
  "http://127.0.0.1:5001/signup",
  "http://energy.eba-nq9wrg49.us-east-2.elasticbeanstalk.com/signup",
];
export const SIGNIN_API_URL = [
  "http://127.0.0.1:5000/login",
  "http://127.0.0.1:5001/login",
  "http://energy.eba-nq9wrg49.us-east-2.elasticbeanstalk.com/login",
];
export const TOKENVALID_API_URL = [
  "http://127.0.0.1:5000/tokenValid",
  "http://127.0.0.1:5001/tokenValid",
  "http://energy.eba-nq9wrg49.us-east-2.elasticbeanstalk.com/tokenValid",
];
export const LINEGRAPH_DATA_API_URL = [
  "http://127.0.0.1:5000/linegraph",
  "http://127.0.0.1:5001/linegraph",
  "http://energy.eba-nq9wrg49.us-east-2.elasticbeanstalk.com/linegraph",
];
export const PIECHART_DATA_API_URL = [
  "http://127.0.0.1:5000/pieChartData",
  "http://127.0.0.1:5001/pieChartData",
  "http://energy.eba-nq9wrg49.us-east-2.elasticbeanstalk.com/pieChartData",
];
export const PAIRWISE_BAR_GRAPH_DATA_API_URL = [
  "http://127.0.0.1:5000/getEnergyDateWise",
  "http://127.0.0.1:5001/getEnergyDateWise",
  "http://energy.eba-nq9wrg49.us-east-2.elasticbeanstalk.com/getEnergyDateWise",
];
export const GLOBAL_ENERGY_DATA_API_URL = [
  "http://127.0.0.1:5000/GlobalEnergyData",
  "http://127.0.0.1:5001/GlobalEnergyData",
  "http://energy.eba-nq9wrg49.us-east-2.elasticbeanstalk.com/GlobalEnergyData",
];

export const REFRESH_TOKEN_API_URL = [
  "http://127.0.0.1:5000/refresh_token",
  "http://127.0.0.1:5001/refresh_token",
  "http://energy.eba-nq9wrg49.us-east-2.elasticbeanstalk.com/refresh_token",
];
export const PROTECTED_API_URL = [
  "http://127.0.0.1:5000/protected",
  "http://127.0.0.1:5001/protected",
  "http://energy.eba-nq9wrg49.us-east-2.elasticbeanstalk.com/protected",
];
